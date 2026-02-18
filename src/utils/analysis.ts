import { AnalysisResult } from '../types/ai';
import { SENTIMENT_DICTIONARY, INTENSIFIERS, EMOJIS } from '../data/sentiment';
import { TOPIC_KEYWORDS } from '../data/topics';

export function analyzeSentiment(text: string): number {
  if (!text) return 0;

  // Improved tokenizer to capture words, punctuation, and emojis
  // Using a simpler regex that works broadly if unicode property escapes fail in some envs,
  // but trying unicode first. If strict environment, fallback to explicit ranges.
  // For safety in this environment, I'll use a broad non-whitespace match but prioritize words.

  // Matches: words (with apostrophes), punctuation, or any non-whitespace sequence (to catch emojis/symbols)
  // But strictly, we want to isolate emojis.
  // Let's use a robust regex for words and specific ranges for emojis if possible, or just standard "words".
  // Note: The previous regex ignored emojis.

  const tokenRegex = /[a-z']+|[.,!?;]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/gi;
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
  // But allow strong emotions to breakthrough
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
