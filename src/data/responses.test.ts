import { getInitialMessages, getHelpResponse, getResourcesResponse, getResponseForMessage } from './responses';
import * as aiModel from '../utils/aiModel';

// Mock the AI model
jest.mock('../utils/aiModel', () => ({
  generateResponse: jest.fn().mockResolvedValue('AI generated response')
}));

describe('Responses Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInitialMessages', () => {
    it('should return welcome messages with correct format', () => {
      const messages = getInitialMessages();
      
      // Check we have the expected number of messages
      expect(messages.length).toBe(2);
      
      // Check message structure
      messages.forEach(message => {
        expect(message).toHaveProperty('id');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('sender', 'bot');
        expect(message).toHaveProperty('timestamp');
        expect(typeof message.timestamp).toBe('string');
      });
      
      // Check message content
      expect(messages[0].content).toContain('Welcome to WellBeing.sh');
      expect(messages[1].content).toContain("I'm here to listen");
    });
  });

  describe('getHelpResponse', () => {
    it('should return help information', () => {
      const help = getHelpResponse();
      
      expect(help).toContain('Available commands');
      expect(help).toContain('/help');
      expect(help).toContain('/resources');
      expect(help).toContain('/clear');
    });
  });

  describe('getResourcesResponse', () => {
    it('should return mental health resources', () => {
      const resources = getResourcesResponse();
      
      expect(resources).toContain('Mental Health Resources');
      expect(resources).toContain('Crisis Text Line');
      expect(resources).toContain('Self-Care Practices');
    });
  });

  describe('getResponseForMessage', () => {
    it('should call AI model to generate response', async () => {
      const input = 'How are you today?';
      const messages = getInitialMessages();
      
      const response = await getResponseForMessage(input, messages);
      
      expect(response).toBe('AI generated response');
      expect(aiModel.generateResponse).toHaveBeenCalledWith(input, messages);
    });

    it('should handle errors gracefully', async () => {
      // Mock an error
      (aiModel.generateResponse as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      const input = 'trigger error';
      const messages = getInitialMessages();
      
      const response = await getResponseForMessage(input, messages);
      
      expect(response).toContain("I'm having trouble");
    });
  });
});
