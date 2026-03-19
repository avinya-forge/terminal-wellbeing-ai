import { BackendClient } from '../BackendClient';
import { logger } from '../LoggerService';
import { safetyTriageService } from '../SafetyTriageService';
import { selectModel } from '../ModelRouter';

jest.mock('../LoggerService', () => ({
  logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  }
}));

jest.mock('../SafetyTriageService', () => ({
  safetyTriageService: {
    triage: jest.fn(),
  }
}));

jest.mock('../ModelRouter', () => ({
  selectModel: jest.fn(),
}));

jest.mock('../../utils/env', () => ({
  getEnv: jest.fn().mockReturnValue('mocked-token'),
}));

describe('BackendClient', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    jest.clearAllMocks();
    // Use prototype to avoid needing to reconstruct singleton for testing different token states
    Object.defineProperty(BackendClient.getInstance(), 'apiToken', { value: 'mocked-token', writable: true });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('getInstance should return a singleton instance', () => {
    const client1 = BackendClient.getInstance();
    const client2 = BackendClient.getInstance();
    expect(client1).toBe(client2);
  });

  describe('generateText', () => {
    it('should halt inference and return safe response if triage says so', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: true,
        tier: 'critical',
        safeResponse: 'Please seek help immediately.'
      });

      const response = await client.generateText('I feel terrible');
      expect(response).toBe('Please seek help immediately.');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Inference halted'));
    });

    it('should call HF Inference API with explicit model override', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'neutral'
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([{ generated_text: 'Generated override text' }])
      });

      const response = await client.generateText('Hello', { model: 'custom-model' });

      expect(response).toBe('Generated override text');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('custom-model'),
        expect.any(Object)
      );
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Explicit override'));
    });

    it('should call HF Inference API with selected model and options', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'neutral'
      });
      (selectModel as jest.Mock).mockReturnValue({
        modelId: 'selected-model',
        modelName: 'selected-model',
        reason: 'default reason'
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([{ generated_text: 'Generated text' }])
      });

      const response = await client.generateText('Hello', { max_length: 200, temperature: 0.8 });

      expect(response).toBe('Generated text');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('selected-model'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mocked-token'
          }),
          body: expect.stringContaining('"max_new_tokens":200')
        })
      );
    });

    it('should handle API missing token warning', async () => {
      const client = BackendClient.getInstance();
      Object.defineProperty(client, 'apiToken', { value: null, writable: true });

      (safetyTriageService.triage as jest.Mock).mockReturnValue({
        haltInference: false,
        tier: 'neutral'
      });
      (selectModel as jest.Mock).mockReturnValue({
        modelId: 'selected-model',
        modelName: 'selected-model',
        reason: 'default reason'
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([{ generated_text: 'Generated text' }])
      });

      await client.generateText('Hello');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('VITE_HF_TOKEN is not set'));
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: ''
          })
        })
      );
    });

    it('should handle API fetch error (not ok)', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({ haltInference: false, tier: 'neutral' });
      (selectModel as jest.Mock).mockReturnValue({ modelId: 'test-model', modelName: 'test-model', reason: 'test' });

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      });

      const response = await client.generateText('Hello');
      expect(response).toBeNull();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle API fetch error (not ok, json parse fails)', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({ haltInference: false, tier: 'neutral' });
      (selectModel as jest.Mock).mockReturnValue({ modelId: 'test-model', modelName: 'test-model', reason: 'test' });

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error('unparseable'))
      });

      const response = await client.generateText('Hello');
      expect(response).toBeNull();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle API fetch error (network error)', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({ haltInference: false, tier: 'neutral' });
      (selectModel as jest.Mock).mockReturnValue({ modelId: 'test-model', modelName: 'test-model', reason: 'test' });

      global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

      const response = await client.generateText('Hello');
      expect(response).toBeNull();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle unexpected response format', async () => {
      const client = BackendClient.getInstance();
      (safetyTriageService.triage as jest.Mock).mockReturnValue({ haltInference: false, tier: 'neutral' });
      (selectModel as jest.Mock).mockReturnValue({ modelId: 'test-model', modelName: 'test-model', reason: 'test' });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ not_an_array: true })
      });

      const response = await client.generateText('Hello');
      expect(response).toBeNull();
    });
  });

  describe('calculateEmbedding', () => {
    it('should calculate embedding successfully', async () => {
      const client = BackendClient.getInstance();
      const mockEmbedding = [0.1, 0.2, 0.3];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEmbedding)
      });

      const response = await client.calculateEmbedding('Test text');
      expect(response).toEqual(mockEmbedding);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sentence-transformers'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ inputs: 'Test text' })
        })
      );
    });

    it('should handle API missing token correctly for embeddings', async () => {
        const client = BackendClient.getInstance();
        Object.defineProperty(client, 'apiToken', { value: null, writable: true });
        const mockEmbedding = [0.1, 0.2, 0.3];

        global.fetch = jest.fn().mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue(mockEmbedding)
        });

        const response = await client.calculateEmbedding('Test text');
        expect(response).toEqual(mockEmbedding);
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: ''
            })
          })
        );
      });

    it('should handle not ok response', async () => {
      const client = BackendClient.getInstance();

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500
      });

      const response = await client.calculateEmbedding('Test text');
      expect(response).toEqual([]);
    });

    it('should handle unexpected response format', async () => {
      const client = BackendClient.getInstance();

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ not_an_array: true })
      });

      const response = await client.calculateEmbedding('Test text');
      expect(response).toEqual([]);
    });

    it('should handle network error', async () => {
      const client = BackendClient.getInstance();

      global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

      const response = await client.calculateEmbedding('Test text');
      expect(response).toEqual([]);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
