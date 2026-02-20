export interface MemoryEntry {
  id: string;
  content: string;
  timestamp: string; // ISO 8601 string
  embedding: number[];
  type: 'user' | 'assistant' | 'system';
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface MemoryConfig {
  maxEntries: number;
  similarityThreshold: number;
  contextWindowSize: number;
}
