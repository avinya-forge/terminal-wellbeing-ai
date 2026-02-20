import { MemoryEntry, MemoryConfig } from '../types/memory';
import { calculateEmbedding, cosineSimilarity } from '../utils/embeddings';
import { logger } from './LoggerService';

const STORAGE_KEY = 'wellbeing_long_term_memory';

const DEFAULT_CONFIG: MemoryConfig = {
  maxEntries: 100, // Keep it small for now to avoid localStorage bloat
  similarityThreshold: 0.5, // Lowered threshold slightly to be more inclusive for testing
  contextWindowSize: 3 // Number of relevant memories to retrieve
};

const generateId = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export class MemoryService {
  private static instance: MemoryService;
  private memories: MemoryEntry[] = [];
  private config: MemoryConfig;
  private privacyMode: boolean = false;

  private constructor(config: Partial<MemoryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadMemories();
  }

  public static getInstance(config?: Partial<MemoryConfig>): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService(config);
    }
    return MemoryService.instance;
  }

  private loadMemories(): void {
    if (typeof window === 'undefined') return; // Server-side or non-browser env check

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memories = JSON.parse(stored);
        logger.info(`Loaded ${this.memories.length} memories from storage.`);
      }
    } catch (error) {
      logger.error('Failed to load memories from localStorage:', error);
      this.memories = [];
    }
  }

  public setPrivacyMode(enabled: boolean): void {
    this.privacyMode = enabled;
    if (enabled) {
      this.memories = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      logger.info('Privacy mode enabled for MemoryService. Memories cleared.');
    } else {
      this.loadMemories();
    }
  }

  private saveMemories(): void {
    if (typeof window === 'undefined' || this.privacyMode) return;

    try {
      // Enforce max entries limit (Keep newest)
      if (this.memories.length > this.config.maxEntries) {
         // Sort by timestamp descending (newest first)
         this.memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
         this.memories = this.memories.slice(0, this.config.maxEntries);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memories));
    } catch (error) {
      logger.error('Failed to save memories to localStorage:', error);
    }
  }

  public async addMemory(content: string, type: 'user' | 'assistant' | 'system', tags: string[] = []): Promise<MemoryEntry | null> {
    if (this.privacyMode) return null;
    if (!content || content.trim().length === 0) return null;

    try {
      const embedding = await calculateEmbedding(content);

      const entry: MemoryEntry = {
        id: generateId(),
        content,
        timestamp: new Date().toISOString(),
        embedding,
        type,
        tags
      };

      this.memories.push(entry);
      this.saveMemories();
      logger.info(`Added memory entry: ${entry.id}`);
      return entry;
    } catch (error) {
      logger.error('Failed to add memory:', error);
      return null;
    }
  }

  public async retrieveRelevantContext(query: string, limit: number = this.config.contextWindowSize): Promise<MemoryEntry[]> {
    if (!query || this.memories.length === 0) return [];

    try {
      const queryEmbedding = await calculateEmbedding(query);
      if (queryEmbedding.length === 0) return [];

      // Calculate similarity for all memories
      const scoredMemories = this.memories.map(memory => {
        // Skip if memory has no embedding
        if (!memory.embedding || memory.embedding.length === 0) {
           return { memory, score: -1 };
        }
        return {
          memory,
          score: cosineSimilarity(queryEmbedding, memory.embedding)
        };
      });

      // Filter by threshold and sort by score (descending)
      const relevant = scoredMemories
        .filter(item => item.score >= this.config.similarityThreshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.memory);

      return relevant;
    } catch (error) {
      logger.error('Failed to retrieve relevant context:', error);
      return [];
    }
  }

  public clearMemories(): void {
    this.memories = [];
    this.saveMemories();
    logger.info('Cleared all memories.');
  }

  public getMemories(): MemoryEntry[] {
      return [...this.memories];
  }

  public getMemoryCount(): number {
      return this.memories.length;
  }
}

export const memoryService = MemoryService.getInstance();
