import { processCommand } from './commands';
import { exportSessionData } from './sessionManager';
import { Message } from '../types/Message';

// Mock dependencies
jest.mock('./sessionManager', () => ({
  updateSession: jest.fn(),
  exportSessionData: jest.fn().mockReturnValue('{"mock": "data"}'),
  getPrivacyMode: jest.fn().mockReturnValue(false),
  setPrivacyMode: jest.fn(),
}));

jest.mock('../services/ai', () => ({
  getAvailableModels: jest.fn().mockReturnValue([{ name: 'test', displayName: 'Test Model', description: 'Test' }]),
  getCurrentModel: jest.fn().mockReturnValue({ name: 'test', displayName: 'Test Model', description: 'Test' }),
  switchModel: jest.fn().mockReturnValue(true),
}));

jest.mock('../data/resources', () => ({
  searchResources: jest.fn().mockReturnValue([]),
}));

jest.mock('../data/responses', () => ({
  getResponseForMessage: jest.fn().mockResolvedValue('Response'),
  getHelpResponse: jest.fn().mockReturnValue('Help Text'),
}));

// Mock commandParser if needed, or rely on real one if it's pure logic.
// Assuming parseCommand is imported from ./commandParser which is likely pure.
// If not, we might need to mock it. But let's try real one first.
// Wait, parseCommand is imported in commands.ts.

describe('Commands', () => {
  const messages: Message[] = [];

  it('handles /export command', async () => {
    const response = await processCommand('/export', messages);
    expect(response).toContain('Here is your session data export');
    expect(response).toContain('{"mock": "data"}');
    expect(exportSessionData).toHaveBeenCalled();
  });

  it('handles /help command', async () => {
    const response = await processCommand('/help', messages);
    expect(response).toBe('Help Text');
  });
});
