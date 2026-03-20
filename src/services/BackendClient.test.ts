import { backendClient } from './BackendClient';
import { logger } from './LoggerService';
import { safetyTriageService } from './SafetyTriageService';

// Mock dependencies
jest.mock('./LoggerService', () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('./SafetyTriageService', () => ({
  safetyTriageService: {
    triage: jest.fn()
  }
}));

// Mock fetch
const originalFetch = global.fetch;

describe('BackendClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('generateText', () => {
    it('should halt inference and return safe response if triage says so', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: true,
        tier: 'CRISIS',
        safeResponse: 'Please seek help immediately.'
      });

      const response = await backendClient.generateText('I want to hurt myself');

      expect(safetyTriageService.triage).toHaveBeenCalledWith('I want to hurt myself', []);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Inference halted'));
      expect(response).toBe('Please seek help immediately.');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should use explicit model if provided in options', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue([{ generated_text: 'Test response' }]) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.generateText('Test prompt', { model: 'custom-model' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/custom-model',
        expect.any(Object)
      );
      expect(response).toBe('Test response');
    });

    it('should handle API errors', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockResponse = { ok: false, status: 500, json: jest.fn().mockResolvedValue({ error: 'Internal Server Error' }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.generateText('Test prompt');

      expect(logger.error).toHaveBeenCalled();
      expect(response).toBeNull();
    });

    it('should handle fetch throwing error', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const response = await backendClient.generateText('Test prompt');

      expect(logger.error).toHaveBeenCalled();
      expect(response).toBeNull();
    });

    it('should handle missing generated_text in response', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue([]) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.generateText('Test prompt');

      expect(response).toBeNull();
    });

    it('should warn if API token is not set', async () => {
      // Create a clean instance with no token
      jest.resetModules();
      jest.mock('../utils/env', () => ({
        getEnv: jest.fn().mockReturnValue('')
      }));

      const { backendClient } = await import('./BackendClient');

      const mockTriage = (await import('./SafetyTriageService')).safetyTriageService.triage;
      (mockTriage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockFetch = jest.fn().mockResolvedValue({
         ok: true,
         json: jest.fn().mockResolvedValue([{ generated_text: 'Response' }])
      });
      global.fetch = mockFetch;

      const mockLogger = (await import('./LoggerService')).logger;

      await backendClient.generateText('Test prompt');

      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('VITE_HF_TOKEN is not set'));
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: ''
          })
        })
      );
    });
  });

  describe('calculateEmbedding', () => {
    it('should return embedding on success', async () => {
      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue(mockEmbedding) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.calculateEmbedding('Test text');

      expect(response).toEqual(mockEmbedding);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        expect.any(Object)
      );
    });

    it('should return empty array if response is not ok', async () => {
      const mockResponse = { ok: false };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.calculateEmbedding('Test text');

      expect(response).toEqual([]);
    });

    it('should return empty array if fetch throws error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const response = await backendClient.calculateEmbedding('Test text');

      expect(logger.error).toHaveBeenCalled();
      expect(response).toEqual([]);
    });

    it('should return empty array if response json is not an array', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({ notAnArray: true }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.calculateEmbedding('Test text');

      expect(response).toEqual([]);
    });
  });
});

  describe('getInstance', () => {
    it('should return a singleton instance', async () => {
      // Need to wipe the singleton for a true test
      const { BackendClient } = await import('./BackendClient');
      const instance1 = BackendClient.getInstance();
      const instance2 = BackendClient.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('generateText full branches', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterAll(() => {
      global.fetch = originalFetch;
    });

    it('should handle undefined safeResponse when triage halts', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: true,
        tier: 'CRISIS',
        // undefined safeResponse
      });

      const response = await backendClient.generateText('I want to hurt myself');
      expect(response).toBeNull();
    });

    it('should cover parameters branch with missing options', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue([{ generated_text: 'Test response' }]) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await backendClient.generateText('Test prompt');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"temperature":0.7')
        })
      );
    });

    it('should handle API errors parsing failure', async () => {
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'SAFE'
      });

      const mockResponse = { ok: false, status: 500, json: jest.fn().mockRejectedValue(new Error('unparseable')) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const response = await backendClient.generateText('Test prompt');

      expect(logger.error).toHaveBeenCalled();
      expect(response).toBeNull();
    });
  });

  describe('calculateEmbedding authorization branches', () => {
    it('should use empty string for authorization if no token', async () => {
      jest.resetModules();
      jest.mock('../utils/env', () => ({
        getEnv: jest.fn().mockReturnValue('')
      }));

      const { backendClient } = await import('./BackendClient');

      const mockFetch = jest.fn().mockResolvedValue({
         ok: true,
         json: jest.fn().mockResolvedValue([0.1])
      });
      global.fetch = mockFetch;

      await backendClient.calculateEmbedding('Test text');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: ''
          })
        })
      );
    });
  });
