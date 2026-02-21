export interface TopicAnalysis {
  topics: string[];
  sentiment: number; // -1.0 to 1.0
  keywords: string[];
}

export interface UserProfile {
  lastInteraction: string;
  sentimentTrend: number[]; // Last 5 sentiment scores
  topics: Record<string, number>; // Topic -> Frequency
  messageCount: number;
  userName?: string;
  privacyMode?: boolean; // If true, data is not persisted to localStorage
  triggerWarnings: string[];
  preferences: {
    responseLength: 'short' | 'medium' | 'long';
    tone: 'casual' | 'formal' | 'empathetic';
    speed: 'fast' | 'medium' | 'slow';
  };
}

import { Mood } from "../constants/moods";

export interface SessionData {
  id: string;
  startTime: string;
  messages: number;
  currentMood: Mood; // inferred from sentiment
  profile: UserProfile;
}

export interface AnalysisResult {
  sentiment: number;
  topics: string[];
  entities: string[];
  mood: Mood;
}
