import { getInitialMessages, getHelpResponse, getResponseForMessage } from './responses';
import * as aiModel from '../services/ai';

// Mock the AI model
jest.mock('../services/ai', () => ({
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
      expect(messages[0].content).toContain('INITIALIZING...');
      expect(messages[1].content).toContain('SYSTEM BOOT');
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

  describe('getResponseForMessage', () => {
    it('should call AI model to generate response', async () => {
      const input = 'How are you today?';
      const messages = getInitialMessages();
      
      const response = await getResponseForMessage(input, messages);
      
      expect(response).toBe('AI generated response');
      expect(aiModel.generateResponse).toHaveBeenCalledWith(input, messages);
    });

    it('should handle errors gracefully', async () => {
      // Mock console.error to suppress expected error log
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock an error
      (aiModel.generateResponse as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      const input = 'trigger error';
      const messages = getInitialMessages();
      
      const response = await getResponseForMessage(input, messages);
      
      expect(response).toContain("I'm having trouble");

      consoleSpy.mockRestore();
    });
  });
});
