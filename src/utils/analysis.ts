import { AnalysisResult } from '../types/ai';
import { SENTIMENT_DICTIONARY, INTENSIFIERS, EMOJIS } from '../data/sentiment';
import { TOPIC_KEYWORDS } from '../data/topics';

/**
 * Analyzes the sentiment of a given text.
 * Returns a normalized score between -1.0 (negative) and 1.0 (positive).
 */
export function analyzeSentiment(text: string): number {
  if (!text) return 0;

  // Improved tokenizer to capture words, punctuation, and emojis.
  // We use specific unicode ranges for emojis to ensure they are captured as single tokens.
  // Also includes smart quotes in word matching.
  const tokenRegex = /[a-z0-9'\u2019]+|[.,!?;]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/gi;

  const words = text.toLowerCase().match(tokenRegex) || [];

  if (words.length === 0) return 0;

  let score = 0;
  let sentimentWordCount = 0;
  let negationActiveUntil = -1;

  const NEGATION_WORDS = new Set(['no', 'not', 'never', 'dont', "don't", 'didnt', "didn't", 'wont', "won't", 'cant', "can't", 'neither', 'nor', 'cannot']);
  const RESET_WORDS = new Set(['but', 'however', 'although', 'though', '.', ',', '!', '?', ';']);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check for Emojis first (direct mapping)
    if (EMOJIS[word] !== undefined) {
       score += EMOJIS[word];
       sentimentWordCount++;
       continue;
    }

    if (RESET_WORDS.has(word)) {
      negationActiveUntil = -1;
      continue;
    }

    if (NEGATION_WORDS.has(word)) {
      // Set negation window for next 3 words
      negationActiveUntil = i + 3;
      continue;
    }

    const sentimentValue = SENTIMENT_DICTIONARY[word];
    if (sentimentValue !== undefined) {
      const isNegated = i <= negationActiveUntil;

      // Check for intensifier in previous word
      let multiplier = 1.0;
      if (i > 0) {
        const prevWord = words[i - 1];
        if (INTENSIFIERS[prevWord]) {
           multiplier = INTENSIFIERS[prevWord];
        }
      }

      if (isNegated) {
        // If intensified negation ("not very good"), dampen the negation
        if (multiplier > 1.0) {
            score += sentimentValue * multiplier * -0.5;
        } else {
            score += sentimentValue * -1.0;
        }
      } else {
        score += sentimentValue * multiplier;
      }

      sentimentWordCount++;
    }
  }

  // Normalize score between -1 and 1
  if (sentimentWordCount === 0) return 0;

  // Dampen the score based on word count to avoid extreme swings from single words
  // But allow strong emotions to breakthrough.
  // Using a log-like scaling for word count impact.
  const normalized = Math.max(-1, Math.min(1, score / Math.max(1, Math.sqrt(sentimentWordCount))));
  return normalized;
}

export function extractTopics(text: string): string[] {
  if (!text) return [];

  const foundTopics: Set<string> = new Set();

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    // Use word boundaries to avoid partial matches
    if (keywords.some(keyword => new RegExp(`\\b${keyword}\\b`, 'i').test(text))) {
      foundTopics.add(topic);
    }
  }

  return Array.from(foundTopics);
}

export function calculateMoodTrend(sentimentHistory: number[]): string {
  if (!sentimentHistory || sentimentHistory.length === 0) return 'No data';

  // Return a visual representation like [++++-]
  return '[' + sentimentHistory.map(s => {
    if (s > 0.3) return '+';
    if (s < -0.3) return '-';
    return '•';
  }).join('') + ']';
}

export function analyzeText(text: string): AnalysisResult {
  const sentiment = analyzeSentiment(text);
  const topics = extractTopics(text);

  let mood = 'Neutral';
  if (sentiment > 0.3) mood = 'Positive';
  else if (sentiment < -0.6) mood = 'Distressed';
  else if (sentiment < -0.3) mood = 'Negative';

  // Heuristic adjustments
  if (topics.includes('anxiety')) mood = 'Anxious';
  if (topics.includes('depression') && sentiment < -0.2) mood = 'Depressed';
  if (topics.includes('grief') && sentiment < -0.2) mood = 'Grief';

  return {
    sentiment,
    topics,
    entities: [],
    mood
  };
}
