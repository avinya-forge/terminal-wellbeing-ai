import { analyzeSentiment, extractTopics, analyzeText, calculateMoodTrend } from './analysis';

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

    it('handles text with no valid tokens', () => {
        expect(analyzeSentiment('   ')).toBe(0);
        expect(analyzeSentiment('---+++***')).toBe(0);
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

    it('handles empty text extraction', () => {
        expect(extractTopics('')).toEqual([]);
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

    it('identifies anxious mood', () => {
      const result = analyzeText('I am feeling very worried and panicking');
      expect(result.topics).toContain('anxiety');
      expect(result.mood).toBe('Anxious');
    });

    it('identifies distressed mood', () => {
      const result = analyzeText('I am feeling so incredibly terrible and worthless. I hate everything and everyone.');
      expect(result.mood).toBe('Distressed');
    });

    it('identifies negative mood', () => {
      const result = analyzeText('I am feeling a bit unhappy today.');
      expect(result.mood).toBe('Negative');
    });

    it('identifies positive mood', () => {
      const result = analyzeText('I had a great time today!');
      expect(result.mood).toBe('Positive');
    });

    it('identifies neutral mood', () => {
        const result = analyzeText('I am going to work now.');
        expect(result.mood).toBe('Neutral');
    });
  });

  describe('calculateMoodTrend', () => {
    it('returns correct visual representation', () => {
      expect(calculateMoodTrend([0.5, 0.8, -0.5, 0.1, -0.4])).toBe('[++-•-]');
      expect(calculateMoodTrend([0.9, 0.9, 0.9])).toBe('[+++]');
      expect(calculateMoodTrend([-0.9, -0.9])).toBe('[--]');
      expect(calculateMoodTrend([0, 0, 0])).toBe('[•••]');
    });

    it('handles empty input', () => {
      expect(calculateMoodTrend([])).toBe('No data');
      // @ts-expect-error Testing runtime check
      expect(calculateMoodTrend(null)).toBe('No data');
    });
  });
});
