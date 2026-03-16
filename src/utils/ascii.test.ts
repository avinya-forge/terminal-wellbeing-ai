import { getAsciiArt, listAsciiKeys } from './ascii';

describe('ASCII Utils', () => {
  describe('getAsciiArt', () => {
    test('should return art for known keys', () => {
      const art = getAsciiArt('happy');
      expect(art).toContain('(^-^)');
    });

    test('should return art for aliases', () => {
      expect(getAsciiArt('smile')).toContain('(^-^)');
      expect(getAsciiArt('joy')).toContain('(^-^)');
      expect(getAsciiArt('cry')).toContain('(._.)');
      expect(getAsciiArt('depressed')).toContain('(._.)');
      expect(getAsciiArt('meditate')).toContain('()'); // part of zen
      expect(getAsciiArt('calm')).toContain('()');
      expect(getAsciiArt('mindfulness')).toContain('()');
      expect(getAsciiArt('break')).toContain('____'); // part of coffee
      expect(getAsciiArt('tea')).toContain('____');
      expect(getAsciiArt('love')).toContain('\\/  )'); // part of heart
      expect(getAsciiArt('care')).toContain('\\/  )');
      expect(getAsciiArt('nature')).toContain('###'); // part of tree
      expect(getAsciiArt('forest')).toContain('###');
      expect(getAsciiArt('kitty')).toContain('o o'); // part of cat
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
