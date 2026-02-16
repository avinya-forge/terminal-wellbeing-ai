import { processCommand, formatTimestamp } from './commands';
import * as responses from '../data/responses';
import { Message } from '../components/Terminal';
import { searchResources } from '../data/resources';

// Mock the responses module
jest.mock('../data/responses', () => ({
  getHelpResponse: jest.fn().mockReturnValue('Help information'),
  getResponseForMessage: jest.fn().mockResolvedValue('AI response')
}));

// Mock the resources module
jest.mock('../data/resources', () => ({
  searchResources: jest.fn().mockReturnValue([
    {
      name: 'Test Resource',
      category: 'Test Category',
      contact: '123-456-7890',
      description: 'A test resource description',
      url: 'http://test.com',
      tags: ['test']
    }
  ])
}));

// Mock the aiModel module
jest.mock('./aiModel', () => ({
  getCurrentModel: jest.fn().mockReturnValue({
    name: 'distilgpt2',
    displayName: 'DistilGPT-2',
    description: 'Lightweight model for testing'
  }),
  switchModel: jest.fn().mockImplementation((index) => index >= 0 && index < 3),
  getAvailableModels: jest.fn().mockReturnValue([
    { name: 'distilgpt2', displayName: 'DistilGPT-2', description: 'Lightweight model' },
    { name: 'gpt2', displayName: 'GPT-2', description: 'Medium model' },
    { name: 'gpt-neo', displayName: 'GPT-Neo', description: 'Larger model' }
  ])
}));

describe('Commands Utility', () => {
  // Sample conversation for testing
  const sampleMessages: Message[] = [
    {
      id: '1',
      content: 'Hello there',
      sender: 'user',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      content: 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processCommand', () => {
    it('should process help command correctly', async () => {
      const result = await processCommand('help', sampleMessages);
      expect(result).toBe('Help information');
      expect(responses.getHelpResponse).toHaveBeenCalled();
    });

    it('should process help command with slash prefix', async () => {
      const result = await processCommand('/help', sampleMessages);
      expect(result).toBe('Help information');
      expect(responses.getHelpResponse).toHaveBeenCalled();
    });

    it('should process resources command correctly', async () => {
      const result = await processCommand('resources', sampleMessages);
      expect(result).toContain('Mental Health Resources:');
      expect(result).toContain('Test Resource');
    });

    it('should process resources command with query', async () => {
      const result = await processCommand('/resources test', sampleMessages);
      expect(result).toContain('Mental Health Resources matching "test":');
      expect(result).toContain('Test Resource');
      expect(searchResources).toHaveBeenCalledWith('test');
    });

    it('should handle no resources found', async () => {
      (searchResources as jest.Mock).mockReturnValueOnce([]);

      const result = await processCommand('/resources none', sampleMessages);
      expect(result).toContain('No resources found for "none"');
    });

    it('should handle non-command inputs', async () => {
      const result = await processCommand('How are you today?', sampleMessages);
      expect(result).toBe('AI response');
      expect(responses.getResponseForMessage).toHaveBeenCalledWith('How are you today?', sampleMessages);
    });

    it('should handle errors gracefully', async () => {
      // Mock an error
      (responses.getResponseForMessage as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      const result = await processCommand('trigger error', sampleMessages);
      expect(result).toContain("I'm having trouble");
    });

    it('should treat "help me" as conversation, not command', async () => {
      const result = await processCommand('help me', sampleMessages);
      expect(result).toBe('AI response');
      expect(responses.getResponseForMessage).toHaveBeenCalledWith('help me', sampleMessages);
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamps correctly', () => {
      // Create a date with a known time
      const testDate = new Date(2023, 0, 1, 14, 30); // Jan 1, 2023, 2:30 PM
      const result = formatTimestamp(testDate);
      
      // The exact format might depend on locale, but we can check the basic structure
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      
      // In most locales, this should contain either "14:30" or "2:30"
      expect(result).toMatch(/(14:30|2:30)/);
    });
  });

  describe('Model Switching Commands', () => {
    it('should process models command correctly', async () => {
      const result = await processCommand('/models', sampleMessages);
      expect(result).toContain('Available AI Models');
      expect(result).toContain('DistilGPT-2');
      expect(result).toContain('GPT-2');
    });

    it('should process model command with no arguments', async () => {
      const result = await processCommand('/model', sampleMessages);
      expect(result).toContain('Current AI model');
      expect(result).toContain('DistilGPT-2');
    });

    it('should process model command with valid index', async () => {
      const result = await processCommand('/model 1', sampleMessages);
      expect(result).toContain('Switched to model');
      expect(result).toContain('GPT-2');
    });

    it('should handle model command with invalid index', async () => {
      const result = await processCommand('/model 99', sampleMessages);
      expect(result).toContain('Invalid model number');
    });

    it('should handle model command with non-numeric argument', async () => {
      const result = await processCommand('/model xyz', sampleMessages);
      expect(result).toContain('Invalid model number');
      expect(result).toContain('Please use a number');
    });
  });
});
