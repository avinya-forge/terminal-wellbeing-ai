import { AnalysisResult } from '../types/ai';

// Simple sentiment dictionary (can be expanded)
const SENTIMENT_DICTIONARY: Record<string, number> = {
  // Negative
  sad: -0.8,
  unhappy: -0.7,
  depressed: -0.9,
  anxious: -0.8,
  scared: -0.8,
  fear: -0.8,
  worry: -0.6,
  worried: -0.6,
  stress: -0.7,
  stressed: -0.7,
  tired: -0.4,
  exhausted: -0.6,
  pain: -0.7,
  hurt: -0.7,
  bad: -0.5,
  awful: -0.8,
  terrible: -0.8,
  hopeless: -0.9,
  alone: -0.6,
  lonely: -0.7,
  angry: -0.7,
  mad: -0.6,
  upset: -0.6,
  fail: -0.7,
  failure: -0.8,
  guilt: -0.7,
  shame: -0.8,

  // Positive
  happy: 0.8,
  good: 0.5,
  great: 0.8,
  wonderful: 0.9,
  better: 0.5,
  hope: 0.7,
  hopeful: 0.7,
  excited: 0.8,
  calm: 0.6,
  relaxed: 0.6,
  peace: 0.7,
  love: 0.8,
  like: 0.4,
  enjoy: 0.6,
  proud: 0.8,
  strong: 0.7,
  safe: 0.6,
  grateful: 0.8,
  thanks: 0.4,
  thank: 0.4,
  ok: 0.2,
  okay: 0.2,
  fine: 0.1
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  family: ['mom', 'dad', 'mother', 'father', 'sister', 'brother', 'parents', 'family', 'child', 'kids', 'son', 'daughter'],
  work: ['work', 'job', 'boss', 'career', 'office', 'colleague', 'fired', 'hired', 'promotion', 'salary', 'deadline'],
  relationships: ['partner', 'boyfriend', 'girlfriend', 'spouse', 'husband', 'wife', 'dating', 'breakup', 'ex', 'love', 'relationship'],
  health: ['health', 'sick', 'ill', 'pain', 'doctor', 'hospital', 'medicine', 'body', 'sleep', 'tired', 'insomnia'],
  school: ['school', 'college', 'university', 'exam', 'test', 'grade', 'class', 'teacher', 'professor', 'study', 'homework'],
  anxiety: ['anxious', 'panic', 'worry', 'worried', 'scared', 'fear', 'nervous', 'stress', 'overwhelmed'],
  depression: ['depressed', 'sad', 'feeling down', 'hopeless', 'empty', 'numb', 'crying'],
  future: ['future', 'goal', 'plan', 'dream', 'life', 'purpose', 'direction'],
  sleep: ['sleep', 'dream', 'nightmare', 'awake', 'insomnia', 'rest']
};

export function analyzeSentiment(text: string): number {
  if (!text) return 0;

  // Split by spaces but keep punctuation to detect clause boundaries
  // Use words array and index for window-based lookahead/lookbehind
  const words = text.toLowerCase().match(/[a-z']+|[.,!?;]/g) || [];
  if (words.length === 0) return 0;

  let score = 0;
  let sentimentWordCount = 0;
  let negationActiveUntil = -1;

  const NEGATION_WORDS = new Set(['no', 'not', 'never', 'dont', "don't", 'didnt', "didn't", 'wont', "won't", 'cant', "can't", 'neither', 'nor']);
  const RESET_WORDS = new Set(['but', 'however', 'although', 'though', '.', ',', '!', '?', ';']);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (RESET_WORDS.has(word)) {
      negationActiveUntil = -1;
      continue;
    }

    if (NEGATION_WORDS.has(word)) {
      // Set negation window for next 3 words (e.g. "not very very happy")
      negationActiveUntil = i + 3;
      continue;
    }

    const sentimentValue = SENTIMENT_DICTIONARY[word];
    if (sentimentValue !== undefined) {
      const isNegated = i <= negationActiveUntil;
      score += sentimentValue * (isNegated ? -1 : 1);
      sentimentWordCount++;
    }
  }

  // Normalize score between -1 and 1
  if (sentimentWordCount === 0) return 0;

  // Dampen the score based on word count to avoid extreme swings from single words
  const normalized = Math.max(-1, Math.min(1, score / Math.max(1, Math.sqrt(sentimentWordCount))));
  return normalized;
}

export function extractTopics(text: string): string[] {
  if (!text) return [];

  const foundTopics: Set<string> = new Set();

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    // Use word boundaries to avoid partial matches (e.g., "hispanic" matching "panic")
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

  return {
    sentiment,
    topics,
    entities: [], // Placeholder for future entity extraction
    mood
  };
}
