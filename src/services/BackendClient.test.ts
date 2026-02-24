import { BackendClient } from './BackendClient';
import { logger } from './LoggerService';
import { safetyTriageService } from './SafetyTriageService';
import { selectModel } from './ModelRouter';

// Mock dependencies
jest.mock('./LoggerService', () => ({
    logger: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    }
}));

jest.mock('./SafetyTriageService', () => ({
    safetyTriageService: {
        triage: jest.fn()
    }
}));

jest.mock('./ModelRouter', () => ({
    selectModel: jest.fn()
}));

describe('BackendClient', () => {
    let backendClient: BackendClient;

    beforeEach(() => {
        backendClient = BackendClient.getInstance();
        jest.clearAllMocks();
        // Mock fetch globally
        global.fetch = jest.fn();

        // Default safe triage
        (safetyTriageService.triage as jest.Mock).mockReturnValue({
            tier: 'SAFE',
            haltInference: false
        });

        // Default model selection
        (selectModel as jest.Mock).mockReturnValue({
            modelId: 'test-model',
            modelName: 'Test Model',
            reason: 'Test'
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('generateText', () => {
        it('should return generated text on successful API call', async () => {
            const mockResponse = [{ generated_text: 'Hello from the backend' }];
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await backendClient.generateText('Hi, how are you today?');
            expect(result).toBe('Hello from the backend');
            // URL must point to the HF inference API (model is chosen by ModelRouter)
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('api-inference.huggingface.co/models/'),
                expect.any(Object)
            );
        });

        it('should halt inference and return safe response for IMMEDIATE_EMERGENCY messages', async () => {
            // Mock triage to halt
            (safetyTriageService.triage as jest.Mock).mockReturnValue({
                tier: 'IMMEDIATE_EMERGENCY',
                haltInference: true,
                safeResponse: 'Call 999 or 116 123'
            });

            const result = await backendClient.generateText('I want to kill myself');
            // fetch must NOT have been called
            expect(global.fetch).not.toHaveBeenCalled();
            // Must return the NHS emergency contacts message
            expect(result).toContain('999');
            expect(result).toContain('116 123');
        });

        it('should return null on API error', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Server Error' }),
            });

            const result = await backendClient.generateText('Hi');
            expect(result).toBeNull();
            expect(logger.error).toHaveBeenCalled();
        });

        it('should handle fetch exceptions', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const result = await backendClient.generateText('Hi');
            expect(result).toBeNull();
            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('calculateEmbedding', () => {
        it('should return an array of numbers on success', async () => {
            const mockEmbedding = [0.1, 0.2, 0.3];
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockEmbedding,
            });

            const result = await backendClient.calculateEmbedding('Test text');
            expect(result).toEqual(mockEmbedding);
        });

        it('should return an empty array on failure', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
            });

            const result = await backendClient.calculateEmbedding('Test text');
            expect(result).toEqual([]);
        });
    });
});
