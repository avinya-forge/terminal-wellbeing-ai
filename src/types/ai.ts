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
  preferences: {
    responseLength: 'short' | 'medium' | 'long';
    tone: 'casual' | 'formal' | 'empathetic';
  };
}

export interface SessionData {
  id: string;
  startTime: string;
  messages: number;
  currentMood: string; // inferred from sentiment
  profile: UserProfile;
}

export interface AnalysisResult {
  sentiment: number;
  topics: string[];
  entities: string[];
  mood: string;
}
