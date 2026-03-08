import { AIModelService } from '../AIModelService';
import { pipeline } from '@huggingface/transformers';
import { AVAILABLE_MODELS } from '../../config/models';
import { SYSTEM_RESPONSES } from '../../data/phrases';
import { memoryService } from '../MemoryService';
import { emergencyService } from '../EmergencyService';
import { backendClient } from '../BackendClient';
import { getEnv } from '../../utils/env';
import { CircuitBreakerOpenError } from '../../utils/CircuitBreaker';

// Mock dependencies
jest.mock('@huggingface/transformers', () => ({
  pipeline: jest.fn()
}));

jest.mock('../../utils/env', () => ({
  getEnv: jest.fn()
}));

jest.mock('../MemoryService', () => ({
  memoryService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    addMemory: jest.fn().mockResolvedValue(undefined),
    retrieveRelevantContext: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../EmergencyService', () => ({
  emergencyService: {
    checkCriticalSymptoms: jest.fn()
  }
}));

jest.mock('../BackendClient', () => ({
  backendClient: {
    generateText: jest.fn()
  }
}));

jest.mock('../../utils/sessionManager', () => ({
  getUserProfile: jest.fn().mockReturnValue({ triggerWarnings: [] }),
  getProfileSummary: jest.fn().mockReturnValue('Profile summary')
}));

jest.mock('../../utils/CircuitBreaker', () => {
  class CircuitBreakerOpenError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CircuitBreakerOpenError';
    }
  }
  class CircuitBreaker {
    constructor() {}
    async execute(fn: unknown) {
      if (typeof fn === 'function') {
        return await fn();
      }
    }
  }
  return { CircuitBreakerOpenError, CircuitBreaker };
});

describe('AIModelService coverage tests', () => {
  let service: AIModelService;
  const mockPipeline = pipeline as jest.Mock;
  const mockGetEnv = getEnv as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AIModelService();
  });

  describe('Initialization and Model Management', () => {
    it('returns true immediately if already initialized', async () => {
      // Force initialization state
      (service as unknown as { initialized: boolean }).initialized = true;
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[0].name] = {};
      const result = await service.initializeModel();
      expect(result).toBe(true);
    });

    it('returns true if backend inference token is detected', async () => {
      mockGetEnv.mockReturnValue('fake-token');
      const onProgress = jest.fn();
      const result = await service.initializeModel(onProgress);
      expect(result).toBe(true);
      expect((service as unknown as { initialized: boolean }).initialized).toBe(true);
      expect(onProgress).toHaveBeenCalledWith("Service Status: Backend configured (Simplicity Mode)");
    });

    it('retries model initialization on failure', async () => {
      mockGetEnv.mockReturnValue(null);
      mockPipeline.mockRejectedValueOnce(new Error('First failure')).mockResolvedValueOnce(async () => [{ generated_text: 'Hello' }]);
      const onProgress = jest.fn();

      const result = await service.initializeModel(onProgress);

      expect(result).toBe(true);
      expect(mockPipeline).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Error - First failure. Retrying...'));
    });

    it('returns false after max retries', async () => {
      mockGetEnv.mockReturnValue(null);
      mockPipeline.mockRejectedValue(new Error('Persistent failure'));

      const result = await service.initializeModel();

      expect(result).toBe(false);
      // MAX_RETRIES is 5, but the first try is not a retry. The code retries MAX_RETRIES - 1 times.
      // Total calls = 1 (first try) + 4 (retries) = 5
      expect(mockPipeline).toHaveBeenCalledTimes(5);
    });

    it('skips initialization if Circuit Breaker is open', async () => {
      mockGetEnv.mockReturnValue(null);
      // Mock circuit breaker to simulate open state
      (service as unknown as { circuitBreaker: { execute: jest.Mock } }).circuitBreaker.execute = jest.fn().mockRejectedValue(new CircuitBreakerOpenError('Open'));

      const result = await service.initializeModel();
      expect(result).toBe(false);
    });

    it('handles initializeAdditionalModels failure silently', async () => {
      jest.useFakeTimers();
      mockGetEnv.mockReturnValue(null);
      mockPipeline.mockResolvedValueOnce(async () => [{ generated_text: 'Hello' }]);
      mockPipeline.mockRejectedValueOnce(new Error('Secondary model failed'));

      await service.initializeModel();
      jest.runAllTimers();
      jest.useRealTimers();

      // Should not throw and primary should be initialized
      expect((service as unknown as { initialized: boolean }).initialized).toBe(true);
    });

    it('switches model successfully', () => {
      expect(service.switchModel(1)).toBe(true);
      expect(service.getCurrentModel().name).toBe(AVAILABLE_MODELS[1].name);
    });

    it('returns false when switching to invalid model index', () => {
      expect(service.switchModel(999)).toBe(false);
      expect(service.switchModel(-1)).toBe(false);
    });

    it('gets available models list', () => {
      const models = service.getAvailableModels();
      expect(models.length).toBe(AVAILABLE_MODELS.length);
      expect(models[0]).toHaveProperty('name');
      expect(models[0]).toHaveProperty('displayName');
      expect(models[0]).toHaveProperty('description');
    });
  });

  describe('Context Preparation', () => {
    it('prepares context with memories', async () => {
      (memoryService.retrieveRelevantContext as jest.Mock).mockResolvedValueOnce([
        { content: 'User likes coffee' }
      ]);
      const messages = [{ sender: 'user', content: 'hello', id: '1', timestamp: new Date() }];
      const context = await service.prepareContext(messages as unknown as Parameters<AIModelService['prepareContext']>[0]);
      expect(context).toContain('User likes coffee');
    });

    it('handles memory retrieval failure', async () => {
      (memoryService.retrieveRelevantContext as jest.Mock).mockRejectedValueOnce(new Error('Memory failure'));
      const messages = [{ sender: 'user', content: 'hello', id: '1', timestamp: new Date() }];
      const context = await service.prepareContext(messages as unknown as Parameters<AIModelService['prepareContext']>[0]);
      expect(context).toContain('Human: hello');
    });
  });

  describe('Supportive Responses', () => {
    it('returns suicide response', () => {
      const response = service.getSupportiveResponse('i want to die');
      expect(response).toContain('Crisis Lifeline');
    });

    it('returns self-deprecation response', () => {
      const response = service.getSupportiveResponse('i am so stupid');
      expect(response).toBeTruthy(); // Just checking it returns one of the responses
    });

    it('returns general support response', () => {
      const response = service.getSupportiveResponse('i feel bad');
      expect(response).toBeTruthy();
    });
  });

  describe('Interaction and Unique Responses', () => {
    it('handles saveInteractionToMemory failure gracefully', async () => {
      // Direct call to the private method to ensure it's tested and we hit the catch block
      (memoryService.addMemory as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));
      await (service as unknown as { saveInteractionToMemory: (user: string, assistant: string) => Promise<void> }).saveInteractionToMemory('user input', 'assistant response');
      expect(memoryService.addMemory).toHaveBeenCalled();
    });

    it('cycles through recent responses when max is reached', () => {
      const phrases = ['r1', 'r2', 'r3'];
      // Trigger getUniqueResponse enough times to hit max limit (which is 10)
      for (let i = 0; i < 15; i++) {
        (service as unknown as { getUniqueResponse: (p: string[]) => string }).getUniqueResponse(phrases);
      }
      expect((service as unknown as { recentResponses: Set<string> }).recentResponses.size).toBeLessThanOrEqual(10);
    });
  });

  describe('generateResponse Core Logic', () => {
    it('handles emergency protocol', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: true, message: 'EMERGENCY' });
      const response = await service.generateResponse('help me', []);
      expect(response).toBe('EMERGENCY');
    });

    it('handles repetitive messages', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      const messages = [
        { sender: 'user', content: 'hello there friend long message' },
        { sender: 'assistant', content: 'hi' },
        { sender: 'user', content: 'hello there friend long message' }
      ];
      const response = await service.generateResponse('hello there friend long message', messages as unknown as Parameters<AIModelService['generateResponse']>[1]);
      expect(response).toBeTruthy();
    });

    it('handles greetings properly based on time', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });

      // Mock Date to control timeOfDay
      const mockDate = new Date('2023-01-01T09:00:00Z');
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(date?: unknown) {
          if (date) return new originalDate(date as string | number | Date);
          return new originalDate('2023-01-01T09:00:00Z'); // 9 AM
        }
      } as unknown as typeof Date;

      const response = await service.generateResponse('hello', []);
      expect(response).toBeTruthy();

      global.Date = originalDate;
    });

    it('generates text via backend client successfully', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      (backendClient.generateText as jest.Mock).mockResolvedValue('This is a successful backend response.');

      const response = await service.generateResponse('Testing backend', []);
      expect(response).toBe('This is a successful backend response.');
    });

    it('falls back to local model if backend fails', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      (backendClient.generateText as jest.Mock).mockRejectedValue(new Error('Backend offline'));

      const mockGenerator = jest.fn().mockResolvedValue([{ generated_text: 'System: hi\nHuman: hi\nAssistant: Local model response' }]);
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[0].name] = mockGenerator;

      const response = await service.generateResponse('Testing local', []);
      expect(response).toContain('Local model response');
    });

    it('returns predefined fallback when no models are loaded', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      (backendClient.generateText as jest.Mock).mockResolvedValue(null);

      // Ensure no local models are loaded
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators = {};

      const response = await service.generateResponse('Testing no models', []);
      expect(SYSTEM_RESPONSES.fallback).toContain(response);
    });

    it('handles local model returning empty assistant match', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      (backendClient.generateText as jest.Mock).mockResolvedValue(null);

      const mockGenerator = jest.fn().mockResolvedValue([{ generated_text: 'System: hi\nHuman: hi' }]); // No Assistant match
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[0].name] = mockGenerator;

      const response = await service.generateResponse('Testing local empty', []);
      expect(SYSTEM_RESPONSES.fallback).toContain(response);
    });

    it('handles local model returning short response', async () => {
      (emergencyService.checkCriticalSymptoms as jest.Mock).mockReturnValue({ isCritical: false });
      (backendClient.generateText as jest.Mock).mockResolvedValue(null);

      const mockGenerator = jest.fn().mockResolvedValue([{ generated_text: 'System: hi\nHuman: hi\nAssistant: ok' }]); // Too short
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[0].name] = mockGenerator;

      // To ensure it falls back instead of proceeding down happy path, we need to mock other generators out
      for (const model of AVAILABLE_MODELS) {
        if (model.name !== AVAILABLE_MODELS[0].name) {
          (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[model.name] = null;
        }
      }

      const response = await service.generateResponse('Testing local short', []);
      expect(response).toBeTruthy();
    });
  });

  describe('tryFallbackModels', () => {
    it('tries secondary models and returns valid response', async () => {
      const secondaryGenerator = jest.fn().mockResolvedValue([{
          generated_text: 'System: hi\nHuman: hi\nAssistant: Secondary fallback response here.'
      }]);

      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[1].name] = secondaryGenerator;

      const response = await (service as unknown as { tryFallbackModels: (input: string, messages: unknown[], exclude: string) => Promise<string> }).tryFallbackModels('test', [], AVAILABLE_MODELS[0].name);
      expect(response).toContain('Secondary fallback response here.');
    });

    it('continues to next model if one throws error', async () => {
      const failingGenerator = jest.fn().mockRejectedValue(new Error('Failed'));
      const workingGenerator = jest.fn().mockResolvedValue([{
          generated_text: 'System: hi\nHuman: hi\nAssistant: Working third model response.'
      }]);

      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[1].name] = failingGenerator;
      (service as unknown as { textGenerators: Record<string, unknown> }).textGenerators[AVAILABLE_MODELS[2].name] = workingGenerator;

      const response = await (service as unknown as { tryFallbackModels: (input: string, messages: unknown[], exclude: string) => Promise<string> }).tryFallbackModels('test', [], AVAILABLE_MODELS[0].name);
      expect(response).toContain('Working third model response.');
    });
  });
});
