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

  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  if (words.length === 0) return 0;

  let score = 0;
  let wordCount = 0;

  // Look for negation
  let negation = 1;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check for negation words
    if (['no', 'not', 'never', 'dont', "don't", 'didnt', "didn't", 'wont', "won't", 'cant', "can't"].includes(word)) {
      negation = -1;
      continue;
    }

    if (SENTIMENT_DICTIONARY[word] !== undefined) {
      score += SENTIMENT_DICTIONARY[word] * negation;
      wordCount++;
      // Reset negation after applying
      negation = 1;
    } else {
      // If word is not in dictionary, reset negation if we've moved too far (e.g. "not very happy" works, but "not the man went to happy" shouldn't apply "not" to "happy")
      // Simple heuristic: reset negation after 3 non-sentiment words
      // But for simplicity, let's keep it persistent for the immediate next sentiment word within a small window?
      // Actually, simple "next sentiment word" approach is better.
      // But current loop applies negation to the *next* matching word.
      // If we encounter a word not in dictionary, we check if we should reset negation.
      // Let's just reset negation if we hit a punctuation or after 2 words.
      // Simplified: Just toggle negation for the next found sentiment word.
    }
  }

  // Normalize score between -1 and 1
  if (wordCount === 0) return 0;

  // Clamp checks
  const normalized = Math.max(-1, Math.min(1, score / Math.max(1, Math.sqrt(wordCount))));
  return normalized;
}

export function extractTopics(text: string): string[] {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const foundTopics: Set<string> = new Set();

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
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
