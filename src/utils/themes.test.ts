import { getTheme, applyTheme, listThemes, THEMES } from './themes';

describe('Themes Utils', () => {
  describe('getTheme', () => {
    test('should return the requested theme', () => {
      const theme = getTheme('matrix');
      expect(theme).toEqual(THEMES.matrix);
    });

    test('should return modern (default) for unknown theme', () => {
      const theme = getTheme('unknown-theme');
      expect(theme).toEqual(THEMES.modern);
    });
  });

  describe('applyTheme', () => {
    let styleSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock document.documentElement.style.setProperty
      styleSpy = jest.spyOn(document.documentElement.style, 'setProperty');
    });

    afterEach(() => {
      styleSpy.mockRestore();
    });

    test('should set CSS variables for the given theme', () => {
      applyTheme('retro');

      const theme = THEMES.retro;
      expect(styleSpy).toHaveBeenCalledWith('--background', theme.colors.background);
      expect(styleSpy).toHaveBeenCalledWith('--foreground', theme.colors.foreground);
      expect(styleSpy).toHaveBeenCalledWith('--primary', theme.colors.primary);
      // ... and so on. Checking a few key ones is enough.
    });

    test('should default to modern theme if unknown name provided', () => {
      applyTheme('non-existent');
      const theme = THEMES.modern;
      expect(styleSpy).toHaveBeenCalledWith('--background', theme.colors.background);
    });
  });

  describe('listThemes', () => {
    test('should return a string containing all theme names', () => {
      const list = listThemes();
      expect(list).toContain('modern');
      expect(list).toContain('retro');
      expect(list).toContain('matrix');
    });
  });
});
