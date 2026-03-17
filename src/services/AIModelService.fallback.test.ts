import { AIModelService } from './AIModelService';
import { pipeline } from '@huggingface/transformers';
import { AVAILABLE_MODELS } from '../config/models';
import { SYSTEM_RESPONSES } from '../data/phrases';

jest.mock('@huggingface/transformers', () => ({
  pipeline: jest.fn()
}));

describe('AIModelService Fallback Logic', () => {
  let service: AIModelService;
  const mockPipeline = pipeline as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    service = new AIModelService();
  });

  it('should initialize successfully when primary model works', async () => {
    mockPipeline.mockResolvedValue(async () => [{ generated_text: 'Assistant: Hello' }]);

    const result = await service.initializeModel();
    expect(result).toBe(true);
    expect(mockPipeline).toHaveBeenCalledWith('text-generation', AVAILABLE_MODELS[0].name, expect.any(Object));
  });

  it('should use fallback logic when primary generation fails', async () => {
    // Mock generators
    const primaryGenerator = jest.fn().mockRejectedValue(new Error('Primary failed'));
    const secondaryGenerator = jest.fn().mockResolvedValue([{
        generated_text: 'System: ...\nHuman: ...\nAssistant: I am the fallback response and I am definitely long enough to avoid being modified.'
    }]);

    mockPipeline.mockImplementation((_task, modelName) => {
        if (modelName === AVAILABLE_MODELS[0].name) return Promise.resolve(primaryGenerator);
        if (modelName === AVAILABLE_MODELS[1].name) return Promise.resolve(secondaryGenerator);
        return Promise.resolve(jest.fn());
    });

    // Initialize
    jest.useFakeTimers();
    await service.initializeModel();
    jest.runAllTimers(); // Trigger additional models loading
    jest.useRealTimers();

    // Generate response (Use non-greeting input)
    const response = await service.generateResponse('Analyze this situation', []);

    expect(primaryGenerator).toHaveBeenCalled();
    expect(secondaryGenerator).toHaveBeenCalled();
    expect(response).toBe('I am the fallback response and I am definitely long enough to avoid being modified.');
  });

  it('should return predefined fallback response when all models fail', async () => {
    const failingGenerator = jest.fn().mockRejectedValue(new Error('Failed'));
    mockPipeline.mockResolvedValue(failingGenerator);

    jest.useFakeTimers();
    await service.initializeModel();
    jest.runAllTimers();
    jest.useRealTimers();

    // Use non-greeting input
    const response = await service.generateResponse('Analyze this situation', []);

    // Should be one of the fallback responses
    expect(SYSTEM_RESPONSES.fallback).toContain(response);
  });

  it('should trigger Circuit Breaker on repeated failures', async () => {
      // Mock failure
      const primaryFailing = jest.fn().mockRejectedValue(new Error('Failed'));
      const fallbackFailing = jest.fn().mockRejectedValue(new Error('Failed'));

      mockPipeline.mockImplementation((_task, modelName) => {
        if (modelName === AVAILABLE_MODELS[0].name) return Promise.resolve(primaryFailing);
        return Promise.resolve(fallbackFailing);
      });

      jest.useFakeTimers();
      await service.initializeModel();
      jest.runAllTimers();
      jest.useRealTimers();

      // Call 3 times to trip breaker (threshold is 3)
      try { await service.generateResponse('Test 1', []); } catch(e) {
          // Ignore error
      }
      try { await service.generateResponse('Test 2', []); } catch(e) {
          // Ignore error
      }
      try { await service.generateResponse('Test 3', []); } catch(e) {
          // Ignore error
      }

      // 4th time should be immediate fallback due to CB Open
      const response = await service.generateResponse('Test 4', []);

      // Verify primaryFailing was called 3 times (threshold), not 4
      expect(primaryFailing).toHaveBeenCalledTimes(3);
      expect(SYSTEM_RESPONSES.fallback).toContain(response);
  });
});
