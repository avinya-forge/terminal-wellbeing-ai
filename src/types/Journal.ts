export interface JournalEntry {
  id: string;
  content: string;
  timestamp: string;
  tags?: string[];
  sentimentScore?: number;
}

export type JournalEntries = JournalEntry[];
