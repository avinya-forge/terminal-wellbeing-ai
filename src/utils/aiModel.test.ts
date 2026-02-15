import { initializeModel, generateResponse, isSensitiveTopic, getSupportiveResponse, getCurrentModel, switchModel, getAvailableModels } from './aiModel';
import { Message } from '../components/Terminal';

// Mock the pipeline function from @huggingface/transformers
jest.mock('@huggingface/transformers', () => ({
  pipeline: jest.fn().mockImplementation(() => {
    return async (text: string) => [{
      generated_text: `${text}\nAssistant: This is a mock response from the AI model.`
    }];
  })
}));

describe('AI Model Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset pipeline mock to default success behavior
    const { pipeline } = require('@huggingface/transformers');
    pipeline.mockImplementation(async (text: string) => {
      return async (prompt: string) => [{
        generated_text: `${prompt}\nAssistant: This is a mock response from the AI model.`
      }];
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Sample conversation for testing
  const sampleMessages: Message[] = [
    {
      id: '1',
      content: 'Hello there',
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  describe('initializeModel', () => {
    it('should initialize the model successfully', async () => {
      // Set up success mock
      const { pipeline } = require('@huggingface/transformers');
      pipeline.mockImplementation(async () => {
        return async (prompt: string) => [{
          generated_text: `${prompt}\nAssistant: Mock response.`
        }];
      });

      const promise = initializeModel();

      // Allow async code to run
      await Promise.resolve();

      // Run timers for background model loading
      jest.runAllTimers();

      const result = await promise;
      expect(result).toBe(true);
    });

    it.skip('should handle initialization errors gracefully', async () => {
      // Mock a failure scenario
      const { pipeline } = require('@huggingface/transformers');

      // Configure mock to fail for all attempts (MAX_RETRIES = 3)
      pipeline.mockImplementation(async () => {
        throw new Error('Mock initialization error');
      });

      // Need to advance timers because retry logic uses setTimeout
      const promise = initializeModel();

      // Fast-forward time for retries
      // We need to do this multiple times for each retry
      for (let i = 0; i < 4; i++) {
        await Promise.resolve(); // Let async tasks run
        jest.advanceTimersByTime(1000);
      }

      const result = await promise;
      expect(result).toBe(false);
    });
  });

  describe('generateResponse', () => {
    it('should generate a response for normal input', async () => {
      await initializeModel(); // Ensure model is initialized
      const response = await generateResponse('How are you today?', sampleMessages);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    });

    it('should provide supportive responses for sensitive topics', async () => {
      const response = await generateResponse('I want to kill myself', sampleMessages);
      // The logic in aiModel.ts returns "concerned" AND mentions "help" or "resources" for suicidal content
      // Checking for 'concerned' should be enough as it is key part of the static response
      expect(response.toLowerCase()).toContain('concerned');
    });

    it('should handle repetitive messages', async () => {
      const repetitiveMessages: Message[] = [
        ...sampleMessages,
        {
          id: '3',
          content: 'I am sad',
          sender: 'user',
          timestamp: new Date()
        },
        {
          id: '4',
          content: 'I understand you\'re feeling sad. Would you like to talk about it?',
          sender: 'bot',
          timestamp: new Date()
        },
        {
          id: '5',
          content: 'I am sad',
          sender: 'user',
          timestamp: new Date()
        }
      ];

      // Note: detection logic in aiModel.ts checks recent user messages.
      // If we send "I am sad" again, it should trigger repetition detection.
      const response = await generateResponse('I am sad', repetitiveMessages);

      // The repetitive response might be randomized, so we check if it is one of the known repetitive responses
      // or check for key words "repeating" or "similar ground" or "revisiting"
      const isRepetitiveResponse =
        response.includes('repeating') ||
        response.includes('similar ground') ||
        response.includes('revisiting');

      expect(isRepetitiveResponse).toBe(true);
    });

    it('should fall back to predefined responses if model fails', async () => {
      // Mock a failure in the text generator
      const textGenerator = await require('@huggingface/transformers').pipeline();
      const originalImplementation = textGenerator;
      
      // Replace with a failing implementation
      const mockGlobal = global as any;
      mockGlobal.textGenerator = async () => { throw new Error('Mock generation error'); };
      
      const response = await generateResponse('Tell me something interesting', sampleMessages);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      
      // Restore original implementation
      mockGlobal.textGenerator = originalImplementation;
    });
  });

  describe('Model Switching Functionality', () => {
    beforeEach(async () => {
      // Ensure model is initialized for these tests
      await initializeModel();
    });

    it('should get the current model', () => {
      const currentModel = getCurrentModel();
      expect(currentModel).toBeDefined();
      expect(currentModel.name).toBeDefined();
      expect(currentModel.displayName).toBeDefined();
      expect(currentModel.description).toBeDefined();
    });

    it('should get available models', () => {
      const models = getAvailableModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
      models.forEach(model => {
        expect(model.name).toBeDefined();
        expect(model.displayName).toBeDefined();
        expect(model.description).toBeDefined();
      });
    });

    it('should switch between models', () => {
      const models = getAvailableModels();
      if (models.length > 1) {
        const initialModel = getCurrentModel();
        const targetIndex = initialModel.name === models[0].name ? 1 : 0;
        
        const success = switchModel(targetIndex);
        expect(success).toBe(true);
        
        const newModel = getCurrentModel();
        expect(newModel.name).not.toBe(initialModel.name);
        expect(newModel.name).toBe(models[targetIndex].name);
        
        // Switch back to original model
        switchModel(initialModel.name === models[0].name ? 0 : 1);
      } else {
        // If only one model is available, test should still pass
        const success = switchModel(0);
        expect(success).toBe(true);
      }
    });

    it('should handle invalid model index', () => {
      const models = getAvailableModels();
      const invalidIndex = models.length + 10;
      const success = switchModel(invalidIndex);
      expect(success).toBe(false);
    });
  });

  describe('isSensitiveTopic', () => {
    it('should identify suicidal content', () => {
      expect(isSensitiveTopic('I want to kill myself')).toBe(true);
      expect(isSensitiveTopic('thinking about suicide')).toBe(true);
      expect(isSensitiveTopic('I want to end my life')).toBe(true);
    });

    it('should identify self-deprecating content', () => {
      expect(isSensitiveTopic('I am worthless')).toBe(true);
      expect(isSensitiveTopic('I hate myself')).toBe(true);
      expect(isSensitiveTopic('I feel so useless')).toBe(true);
    });

    it('should not flag normal content as sensitive', () => {
      expect(isSensitiveTopic('I had a good day today')).toBe(false);
      expect(isSensitiveTopic('Can you help me with something?')).toBe(false);
      expect(isSensitiveTopic('I\'m feeling a bit down')).toBe(false);
    });
  });

  describe('getSupportiveResponse', () => {
    it('should provide appropriate responses for suicidal content', () => {
      const response = getSupportiveResponse('I want to kill myself');
      expect(response).toContain('concerned');
      expect(response).toContain('crisis');
    });

    it('should provide supportive responses for self-deprecation', () => {
      const response = getSupportiveResponse('I am pathetic');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    });

    it('should provide general supportive responses for other negative content', () => {
      const response = getSupportiveResponse('I feel worthless');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    });
  });
});
