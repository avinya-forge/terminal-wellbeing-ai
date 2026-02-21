import { filterContent, postProcessResponse } from './ai-helpers';

describe('ai-helpers', () => {
  describe('filterContent', () => {
    test('should return original text if no warnings provided', () => {
      expect(filterContent('Hello world', [])).toBe('Hello world');
    });

    test('should redact warning keywords', () => {
      const warnings = ['anxiety', 'stress'];
      const text = 'This causes a lot of anxiety and stress.';
      const expected = 'This causes a lot of [REDACTED] and [REDACTED].';
      expect(filterContent(text, warnings)).toBe(expected);
    });

    test('should be case insensitive', () => {
      const warnings = ['anxiety'];
      const text = 'ANXIETY is real.';
      const expected = '[REDACTED] is real.';
      expect(filterContent(text, warnings)).toBe(expected);
    });

    test('should match whole words only', () => {
      const warnings = ['cat'];
      const text = 'The catalogue features a cat.';
      const expected = 'The catalogue features a [REDACTED].';
      expect(filterContent(text, warnings)).toBe(expected);
    });

    test('should handle multiple occurrences', () => {
        const warnings = ['bad'];
        const text = 'Bad things are bad.';
        const expected = '[REDACTED] things are [REDACTED].';
        expect(filterContent(text, warnings)).toBe(expected);
    });

    test('should handle empty text', () => {
        expect(filterContent('', ['bad'])).toBe('');
    });
  });

  describe('postProcessResponse', () => {
    test('should apply content filtering if warnings provided', () => {
        const input = "Tell me about stress";
        const response = "Stress is a common feeling.";
        const warnings = ['stress'];
        const processed = postProcessResponse(response, input, warnings);
        expect(processed).toContain('[REDACTED]');
        expect(processed).not.toContain('Stress');
    });

    test('should still perform standard post-processing (deduplication)', () => {
        const input = "Hello";
        const longText = "This is a sufficiently long response to avoid the continuity phrase addition logic being triggered by the post processor.";
        const response = `${longText}\n${longText}`;
        const processed = postProcessResponse(response, input);
        expect(processed).toBe(longText);
    });
  });
});
