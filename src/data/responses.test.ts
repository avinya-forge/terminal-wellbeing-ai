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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let originalWindow: any;

    beforeAll(() => {
      originalWindow = global.window;
    });

    afterAll(() => {
      global.window = originalWindow;
    });

    it('should return aligned format on desktop', () => {
      // Mock desktop width
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });

      const help = getHelpResponse();

      expect(help).toContain('Available commands');
      // Should contain aligned format (command + padding + dash + description)
      // We look for a line containing the command and description separated by " - "
      expect(help).toMatch(/\/help\s+- Show this help message/);
      // It should NOT contain the vertical format pattern (command followed by newline followed by description)
      // This is harder to regex negatively without being fragile, so we rely on the positive match above.
    });

    it('should return vertical format on mobile', () => {
      // Mock mobile width
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

      const help = getHelpResponse();
      
      expect(help).toContain('Available commands');
      // Should contain vertical format:
      // /help
      // Show this help message
      expect(help).toContain('/help\nShow this help message');
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
