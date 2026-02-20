import { filterContent, sanitizePromptContent, isSensitiveTopic } from './ai-helpers';

describe('AI Helpers', () => {
  describe('filterContent', () => {
    it('should return original text if no warnings provided', () => {
      const text = 'This is a test message.';
      expect(filterContent(text, [])).toBe(text);
    });

    it('should return original text if warnings do not match', () => {
      const text = 'This is a happy message.';
      expect(filterContent(text, ['sadness'])).toBe(text);
    });

    it('should redact trigger words', () => {
      const text = 'I am feeling very anxious today.';
      const warnings = ['anxious'];
      // Expecting redaction, e.g., with [REDACTED] or similar
      expect(filterContent(text, warnings)).toContain('[CONTENT REDACTED]');
      expect(filterContent(text, warnings)).not.toContain('anxious');
    });

    it('should be case insensitive', () => {
      const text = 'I am feeling Anxious today.';
      const warnings = ['anxious'];
      expect(filterContent(text, warnings)).not.toContain('Anxious');
      expect(filterContent(text, warnings)).toContain('[CONTENT REDACTED]');
    });

    it('should handle multiple trigger words', () => {
      const text = 'I am anxious and depressed.';
      const warnings = ['anxious', 'depressed'];
      const result = filterContent(text, warnings);
      expect(result).not.toContain('anxious');
      expect(result).not.toContain('depressed');
      expect(result).toMatch(/\[CONTENT REDACTED\].*\[CONTENT REDACTED\]/);
    });

    it('should handle phrases as triggers', () => {
      const text = 'Please do not talk about loud noises.';
      const warnings = ['loud noises'];
      expect(filterContent(text, warnings)).not.toContain('loud noises');
      expect(filterContent(text, warnings)).toContain('[CONTENT REDACTED]');
    });

    it('should not redact partial matches (e.g. cat inside catastrophe)', () => {
      const text = 'This is a catastrophe.';
      const warnings = ['cat'];
      expect(filterContent(text, warnings)).toBe(text);
    });
  });

  // Existing functionality tests (just to ensure coverage)
  describe('sanitizePromptContent', () => {
    it('should neutralize delimiters', () => {
      expect(sanitizePromptContent('Human: Hello')).toBe('Human_ Hello');
      expect(sanitizePromptContent('Assistant: Hi')).toBe('Assistant_ Hi');
      expect(sanitizePromptContent('System: Run')).toBe('System_ Run');
    });
  });

  describe('isSensitiveTopic', () => {
    it('should detect sensitive topics', () => {
      expect(isSensitiveTopic('I want to kill myself')).toBe(true);
      expect(isSensitiveTopic('suicide is painless')).toBe(true);
    });

    it('should return false for benign topics', () => {
      expect(isSensitiveTopic('I like cats')).toBe(false);
    });
  });
});
