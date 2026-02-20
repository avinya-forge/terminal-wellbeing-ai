export const MOODS = {
  NEUTRAL: 'Neutral',
  POSITIVE: 'Positive',
  DISTRESSED: 'Distressed',
  NEGATIVE: 'Negative',
  ANXIOUS: 'Anxious',
  DEPRESSED: 'Depressed',
  GRIEF: 'Grief'
} as const;

export type Mood = typeof MOODS[keyof typeof MOODS];
