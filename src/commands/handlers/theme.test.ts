import { handleThemeCommand, handleListThemesCommand } from './theme';
import { applyTheme, listThemes, THEMES } from '../../utils/themes';
import { logger } from '../../services/LoggerService';

jest.mock('../../utils/themes', () => ({
  applyTheme: jest.fn(),
  listThemes: jest.fn(),
  THEMES: {
    'default': {},
    'dark': {}
  }
}));

jest.mock('../../services/LoggerService', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('theme handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (listThemes as jest.Mock).mockReturnValue('default, dark');
  });

  describe('handleThemeCommand', () => {
    it('should list themes if no theme name is provided', async () => {
      const parsed = { command: 'theme', args: [], original: '/theme' };
      const response = await handleThemeCommand(parsed);
      expect(response).toContain('Current themes:');
      expect(response).toContain('default, dark');
      expect(applyTheme).not.toHaveBeenCalled();
    });

    it('should return error if theme is not found', async () => {
      const parsed = { command: 'theme', args: ['unknown'], original: '/theme unknown' };
      const response = await handleThemeCommand(parsed);
      expect(response).toContain('Theme "unknown" not found');
      expect(response).toContain('default, dark');
      expect(applyTheme).not.toHaveBeenCalled();
    });

    it('should apply theme, save to localStorage, and dispatch event', async () => {
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      const parsed = { command: 'theme', args: ['dark'], original: '/theme dark' };
      const response = await handleThemeCommand(parsed);

      expect(applyTheme).toHaveBeenCalledWith('dark');
      expect(setItemSpy).toHaveBeenCalledWith('terminal_theme', 'dark');
      expect(dispatchEventSpy).toHaveBeenCalled();
      expect(response).toBe('Theme changed to: dark');

      dispatchEventSpy.mockRestore();
      setItemSpy.mockRestore();
    });

    it('should log error if saving to localStorage fails', async () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      const parsed = { command: 'theme', args: ['dark'], original: '/theme dark' };
      await handleThemeCommand(parsed);

      expect(logger.error).toHaveBeenCalledWith('Failed to save theme preference', expect.any(Error));

      setItemSpy.mockRestore();
    });
  });

  describe('handleListThemesCommand', () => {
    it('should list themes correctly', async () => {
      const response = await handleListThemesCommand();
      expect(response).toContain('Available Themes:');
      expect(response).toContain('default, dark');
      expect(response).toContain('Use /theme <name> to switch');
    });
  });
});
