import { getAsciiArt, listAsciiKeys } from './ascii';

describe('ASCII Utils', () => {
  describe('getAsciiArt', () => {
    test('should return art for known keys', () => {
      const art = getAsciiArt('happy');
      expect(art).toContain('(^-^)');
    });

    test('should return art for aliases', () => {
      const art = getAsciiArt('smile');
      expect(art).toContain('(^-^)');
    });

    test('should return error message for unknown keys', () => {
      const art = getAsciiArt('unknown');
      expect(art).toContain('No art found');
    });

    test('should be case insensitive', () => {
      const art = getAsciiArt('HAPPY');
      expect(art).toContain('(^-^)');
    });
  });

  describe('listAsciiKeys', () => {
    test('should return list of keys', () => {
      const keys = listAsciiKeys();
      expect(keys).toContain('happy');
      expect(keys).toContain('sad');
    });
  });
});
