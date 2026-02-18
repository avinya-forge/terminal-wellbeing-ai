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

    it('handles complex negation correctly', () => {
      expect(analyzeSentiment('I am not happy')).toBeLessThan(0);
      expect(analyzeSentiment('I am not very happy')).toBeLessThan(0);
      // "I am not going to the store, but I am happy" -> Should be positive (negation resets)
      expect(analyzeSentiment('I am not going to the store, but I am happy')).toBeGreaterThan(0);
    });

    it('handles intensifiers', () => {
      const happy = analyzeSentiment('happy');
      const veryHappy = analyzeSentiment('very happy');
      expect(veryHappy).toBeGreaterThan(happy);

      const sad = analyzeSentiment('sad');
      const verySad = analyzeSentiment('very sad');
      expect(verySad).toBeLessThan(sad);
    });

    it('handles emojis', () => {
       const happyEmoji = analyzeSentiment('😊');
       expect(happyEmoji).toBeGreaterThan(0);

       const sadEmoji = analyzeSentiment('😢');
       expect(sadEmoji).toBeLessThan(0);

       const mixed = analyzeSentiment('I am sad 😢');
       expect(mixed).toBeLessThan(-0.5);
    });

    it('handles mixed text and emojis', () => {
        expect(analyzeSentiment('I love this ❤️')).toBeGreaterThan(0.5);
        expect(analyzeSentiment('This is terrible 💔')).toBeLessThan(-0.5);
    });
  });

  describe('extractTopics', () => {
    it('extracts known topics', () => {
      const topics = extractTopics('I am worried about my job and my boss');
      expect(topics).toContain('work');
      expect(topics).toContain('anxiety');
    });

    it('extracts new topics', () => {
        expect(extractTopics('I miss my grandma so much')).toContain('grief');
        expect(extractTopics('I feel worthless and ugly')).toContain('self_esteem');
        expect(extractTopics('I am scared of talking to people at the party')).toContain('social_anxiety');
        expect(extractTopics('I am so lonely')).toContain('loneliness');
        expect(extractTopics('I need to meditate')).toContain('mindfulness');
    });

    it('returns empty array for no topics', () => {
      expect(extractTopics('the sky is blue')).toEqual([]);
    });

    it('avoids partial matches for topics', () => {
      // "panic" is a keyword for anxiety. "hispanic" contains "panic".
      expect(extractTopics('hispanic heritage')).not.toContain('anxiety');
      // "pain" is a keyword for health. "painting" contains "pain".
      expect(extractTopics('I am painting a picture')).not.toContain('health');
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

    it('identifies grief mood', () => {
        const result = analyzeText('I am grieving the loss of my father');
        expect(result.topics).toContain('grief');
        expect(result.mood).toBe('Grief');
    });
  });
});
