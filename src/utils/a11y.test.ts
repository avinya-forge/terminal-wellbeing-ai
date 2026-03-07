import {
  hexToRgb,
  hslToRgb,
  parseColor,
  getLuminance,
  getContrastRatio,
  checkContrast
} from './a11y';

describe('a11y utils', () => {
  describe('hexToRgb', () => {
    it('converts full hex to rgb', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('00ff00')).toEqual({ r: 0, g: 255, b: 0 }); // Without hash
    });

    it('converts shorthand hex to rgb', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('0f0')).toEqual({ r: 0, g: 255, b: 0 }); // Without hash
    });

    it('returns null for invalid hex strings', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#ffff')).toBeNull();
      expect(hexToRgb('#ffgghh')).toBeNull();
    });
  });

  describe('hslToRgb', () => {
    it('converts hsl values to rgb', () => {
      // 0, 100%, 50% -> red
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
      // 120, 100%, 50% -> green
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
      // 240, 100%, 50% -> blue
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
      // 0, 0%, 100% -> white
      expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
      // 0, 0%, 0% -> black
      expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    });
  });

  describe('parseColor', () => {
    it('parses valid hex colors', () => {
      expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('parses valid hsl strings', () => {
      expect(parseColor('0 100% 50%')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('120 100 50')).toEqual({ r: 0, g: 255, b: 0 });
      // Testing decimals
      expect(parseColor('0.5 50.5% 25.5%')).toBeDefined();
    });

    it('returns null for empty strings or invalid colors', () => {
      expect(parseColor('')).toBeNull();
      expect(parseColor('rgba(255, 0, 0, 1)')).toBeNull(); // Not supported by parser currently
      expect(parseColor('invalid color')).toBeNull();
    });
  });

  describe('getLuminance', () => {
    it('calculates correct luminance for white and black', () => {
      expect(getLuminance(255, 255, 255)).toBeCloseTo(1, 4);
      expect(getLuminance(0, 0, 0)).toBeCloseTo(0, 4);
    });

    it('calculates luminance for other colors', () => {
      // Red
      expect(getLuminance(255, 0, 0)).toBeCloseTo(0.2126, 4);
      // Green
      expect(getLuminance(0, 255, 0)).toBeCloseTo(0.7152, 4);
      // Blue
      expect(getLuminance(0, 0, 255)).toBeCloseTo(0.0722, 4);

      // Low value testing logic branch
      expect(getLuminance(10, 10, 10)).toBeLessThan(0.04);
    });
  });

  describe('getContrastRatio', () => {
    it('calculates contrast ratio correctly', () => {
      // White on Black
      expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
      // Black on White
      expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
      // Red on Black
      expect(getContrastRatio('#ff0000', '#000000')).toBeGreaterThan(5);
    });

    it('returns 0 for invalid colors and logs a warning', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getContrastRatio('invalid', '#000000')).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid colors: invalid, #000000');
      consoleSpy.mockRestore();
    });
  });

  describe('checkContrast', () => {
    it('evaluates contrast levels based on ratio', () => {
      // High contrast (White on Black) - Ratio 21
      const result = checkContrast('#ffffff', '#000000');
      expect(result.contrast).toBeCloseTo(21, 0);
      expect(result.aa).toBe(true);
      expect(result.aaa).toBe(true);
      expect(result.aaLarge).toBe(true);
      expect(result.aaaLarge).toBe(true);

      // Low contrast (Dark Gray on Black)
      const lowResult = checkContrast('#333333', '#000000');
      expect(lowResult.aa).toBe(false);
      expect(lowResult.aaa).toBe(false);
      expect(lowResult.aaLarge).toBe(false);
      expect(lowResult.aaaLarge).toBe(false);

      // Mid contrast (Ratio between 4.5 and 7)
      // Example: #757575 on #000000 is ~4.5-5.something
      const midResult = checkContrast('#767676', '#000000');
      expect(midResult.aa).toBe(true);
      expect(midResult.aaa).toBe(false);
      expect(midResult.aaLarge).toBe(true);
      expect(midResult.aaaLarge).toBe(true);
    });
  });
});
