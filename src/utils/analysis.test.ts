import { analyzeSentiment, extractTopics, analyzeText } from './analysis';

describe('Analysis Utils', () => {
  describe('analyzeSentiment', () => {
    it('returns positive score for positive text', () => {
      expect(analyzeSentiment('I am happy and excited')).toBeGreaterThan(0);
      expect(analyzeSentiment('This is great')).toBeGreaterThan(0);
    });

    it('returns negative score for negative text', () => {
      expect(analyzeSentiment('I am sad and depressed')).toBeLessThan(0);
      expect(analyzeSentiment('I feel terrible')).toBeLessThan(0);
      // Check for distress threshold
      expect(analyzeSentiment('I am so depressed and hopeless')).toBeLessThan(-0.4);
    });

    it('returns neutral score for neutral text', () => {
      expect(analyzeSentiment('I am eating lunch')).toBe(0);
      expect(analyzeSentiment('')).toBe(0);
    });

    it('handles negation', () => {
      const positive = analyzeSentiment('happy');
      const negated = analyzeSentiment('not happy');
      expect(negated).toBeLessThan(positive);
      // "not happy" should ideally be negative or less positive
      expect(negated).toBeLessThan(0);
    });
  });

  describe('extractTopics', () => {
    it('extracts known topics', () => {
      const topics = extractTopics('I am worried about my job and my boss');
      expect(topics).toContain('work');
      expect(topics).toContain('anxiety');
    });

    it('returns empty array for no topics', () => {
      expect(extractTopics('the sky is blue')).toEqual([]);
    });
  });

  describe('analyzeText', () => {
    it('returns comprehensive analysis', () => {
      const result = analyzeText('I feel depressed about school');
      expect(result.sentiment).toBeLessThan(0);
      expect(result.topics).toContain('school');
      expect(result.topics).toContain('depression');
      expect(result.mood).toBe('Depressed');
    });
  });
});
