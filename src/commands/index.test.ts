import { processCommand, COMMANDS } from './index';
import { getResponseForMessage } from '../data/responses';
import { logger } from '../services/LoggerService';
import { parseCommand } from '../utils/commandParser';

jest.mock('../data/responses');
jest.mock('../utils/sessionManager');
jest.mock('../services/LoggerService');
jest.mock('./handlers/theme');
jest.mock('./handlers/ai');
jest.mock('./handlers/notes');

// mock parseCommand to simulate parsed command output
jest.mock('../utils/commandParser', () => ({
  ...jest.requireActual('../utils/commandParser'),
  parseCommand: jest.fn(),
}));

describe('processCommand aliases and logic', () => {
  let originalCommands: Record<string, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    (getResponseForMessage as jest.Mock).mockResolvedValue('System response');
    // Save original commands to restore after test modifications
    originalCommands = { ...COMMANDS };
  });

  afterEach(() => {
    // Restore commands
    Object.assign(COMMANDS, originalCommands);
  });

  describe('simple commands and parsing', () => {
    it('should fall back to empty string for whitespace input', async () => {
      (parseCommand as jest.Mock).mockReturnValue(null);
      const response = await processCommand('   ', []);
      expect(response).toBe('');
      expect(getResponseForMessage).not.toHaveBeenCalled();
    });

    it('should handle unparsed text that does not match simple commands', async () => {
      (parseCommand as jest.Mock).mockReturnValue(null);
      const response = await processCommand('hello world', []);
      expect(getResponseForMessage).toHaveBeenCalledWith('hello world', []);
      expect(response).toBe('System response');
    });

    it('should trigger command for valid simple command without slash', async () => {
      // Mock stats command
      COMMANDS['stats'] = jest.fn().mockResolvedValue('Stats response');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'stats', args: [], original: 'stats' });
      const response = await processCommand('stats', []);
      expect(COMMANDS['stats']).toHaveBeenCalled();
      expect(response).toBe('Stats response');
    });

    it('should trigger help for simple natural language phrases', async () => {
      COMMANDS['help'] = jest.fn().mockResolvedValue('Help response');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'help', args: [], original: 'how to use this' });
      const response = await processCommand('how to use this', []);
      expect(COMMANDS['help']).toHaveBeenCalled();
      expect(response).toBe('Help response');
    });

    it('should trigger resources for simple natural language phrases', async () => {
      COMMANDS['resources'] = jest.fn().mockResolvedValue('Resources response');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'resources', args: [], original: 'need support' });
      const response = await processCommand('need support', []);
      expect(COMMANDS['resources']).toHaveBeenCalled();
      expect(response).toBe('Resources response');
    });

    it('should handle command execution error', async () => {
      COMMANDS['help'] = jest.fn().mockRejectedValue(new Error('Test error'));
      (parseCommand as jest.Mock).mockReturnValue({ command: 'help', args: [], original: '/help' });
      const response = await processCommand('/help', []);
      expect(logger.error).toHaveBeenCalled();
      expect(response).toContain('having trouble processing');
    });
  });

  describe('command aliases execution', () => {
    it('should execute themes', async () => {
      COMMANDS['themes'] = jest.fn().mockResolvedValue('Themes listed');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'themes', args: [], original: '/themes' });
      await processCommand('/themes', []);
      expect(COMMANDS['themes']).toHaveBeenCalled();
    });

    it('should execute ascii alias for art', async () => {
      COMMANDS['ascii'] = jest.fn().mockResolvedValue('Ascii art');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'ascii', args: [], original: '/ascii' });
      await processCommand('/ascii', []);
      expect(COMMANDS['ascii']).toHaveBeenCalled();
    });

    it('should execute models', async () => {
      COMMANDS['models'] = jest.fn().mockResolvedValue('Models listed');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'models', args: [], original: '/models' });
      await processCommand('/models', []);
      expect(COMMANDS['models']).toHaveBeenCalled();
    });

    it('should execute deletenote', async () => {
      COMMANDS['deletenote'] = jest.fn().mockResolvedValue('Note deleted');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'deletenote', args: ['1'], original: '/deletenote 1' });
      await processCommand('/deletenote 1', []);
      expect(COMMANDS['deletenote']).toHaveBeenCalled();
    });

    it('should execute clearnotes', async () => {
      COMMANDS['clearnotes'] = jest.fn().mockResolvedValue('Notes cleared');
      (parseCommand as jest.Mock).mockReturnValue({ command: 'clearnotes', args: [], original: '/clearnotes' });
      await processCommand('/clearnotes', []);
      expect(COMMANDS['clearnotes']).toHaveBeenCalled();
    });

    it('should fallback to getResponseForMessage if no slash and not simple command match', async () => {
      // Simulate parseCommand returning a command that is NOT in simpleCommands
      // e.g. "export" is not in simpleCommands array, but is in COMMANDS
      COMMANDS['export'] = jest.fn();
      (parseCommand as jest.Mock).mockReturnValue({ command: 'export', args: [], original: 'export data' });
      await processCommand('export data', []);
      expect(COMMANDS['export']).not.toHaveBeenCalled();
      expect(getResponseForMessage).toHaveBeenCalledWith('export data', []);
    });

    it('should fallback to getResponseForMessage if command does not exist', async () => {
      (parseCommand as jest.Mock).mockReturnValue({ command: 'unknown', args: [], original: '/unknown' });
      await processCommand('/unknown', []);
      expect(getResponseForMessage).toHaveBeenCalledWith('/unknown', []);
    });
  });
});
