import { MemoryEntry, MemoryConfig } from '../types/memory';
import { calculateEmbedding, cosineSimilarity } from '../utils/embeddings';
import { logger } from './LoggerService';
import { generateKey, exportKey, importKey, encryptData, decryptData } from '../utils/encryption';

const STORAGE_KEY = 'wellbeing_long_term_memory';
const KEY_STORAGE_KEY = 'wellbeing_encryption_key';

const DEFAULT_CONFIG: MemoryConfig = {
  maxEntries: 100, // Keep it small for now to avoid localStorage bloat
  similarityThreshold: 0.5,
  contextWindowSize: 3
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
  private encryptionKey: CryptoKey | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor(config: Partial<MemoryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public static getInstance(config?: Partial<MemoryConfig>): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService(config);
    }
    return MemoryService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._init();
    await this.initializationPromise;
  }

  private async _init(): Promise<void> {
    if (typeof window === 'undefined') {
        this.initialized = true;
        return;
    }

    try {
      // Load or generate key
      const keyString = localStorage.getItem(KEY_STORAGE_KEY);
      if (keyString) {
        try {
            this.encryptionKey = await importKey(keyString);
        } catch (e) {
            logger.error('Failed to import existing key, generating new one:', e);
            this.encryptionKey = await generateKey();
            if (typeof window !== 'undefined') {
              localStorage.setItem(KEY_STORAGE_KEY, await exportKey(this.encryptionKey));
            }
        }
      } else {
        this.encryptionKey = await generateKey();
        if (typeof window !== 'undefined') {
          localStorage.setItem(KEY_STORAGE_KEY, await exportKey(this.encryptionKey));
        }
      }

      await this.loadMemories();
      this.initialized = true;
      logger.info('MemoryService initialized with encryption.');
    } catch (error) {
      logger.error('Failed to initialize MemoryService:', error);
      this.initialized = true; // Mark as initialized so we don't retry forever
    }
  }

  private async loadMemories(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && this.encryptionKey) {
        try {
            const decrypted = await decryptData(stored, this.encryptionKey);
            this.memories = JSON.parse(decrypted);
            logger.info(`Loaded ${this.memories.length} memories from encrypted storage.`);
        } catch (decryptionError) {
            logger.warn('Failed to decrypt memories, trying fallback (plaintext):', decryptionError);
            // If decryption fails, maybe data was plain text?
            try {
                this.memories = JSON.parse(stored);
                logger.warn('Loaded plain text memories. Will encrypt on next save.');
            } catch (jsonError) {
                this.memories = [];
            }
        }
      } else if (stored) {
           this.memories = JSON.parse(stored);
      }
    } catch (error) {
      logger.error('Failed to load memories:', error);
      this.memories = [];
    }
  }

  public async setPrivacyMode(enabled: boolean): Promise<void> {
    this.privacyMode = enabled;
    if (enabled) {
      this.memories = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      logger.info('Privacy mode enabled for MemoryService. Memories cleared.');
    } else {
      await this.initialize();
    }
  }

  private async saveMemories(): Promise<void> {
    if (typeof window === 'undefined' || this.privacyMode) return;
    if (!this.encryptionKey) return;

    try {
      // Enforce max entries limit
      if (this.memories.length > this.config.maxEntries) {
         this.memories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
         this.memories = this.memories.slice(0, this.config.maxEntries);
      }

      const json = JSON.stringify(this.memories);
      const encrypted = await encryptData(json, this.encryptionKey);
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      logger.error('Failed to save memories:', error);
    }
  }

  public async addMemory(content: string, type: 'user' | 'assistant' | 'system', tags: string[] = []): Promise<MemoryEntry | null> {
    if (this.privacyMode) return null;
    if (!content || content.trim().length === 0) return null;

    await this.initialize();

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
      await this.saveMemories();
      logger.info(`Added memory entry: ${entry.id}`);
      return entry;
    } catch (error) {
      logger.error('Failed to add memory:', error);
      return null;
    }
  }

  public async retrieveRelevantContext(query: string, limit: number = this.config.contextWindowSize): Promise<MemoryEntry[]> {
    if (!query) return [];

    await this.initialize();

    if (this.memories.length === 0) return [];

    try {
      const queryEmbedding = await calculateEmbedding(query);
      if (queryEmbedding.length === 0) return [];

      const scoredMemories = this.memories.map(memory => {
        if (!memory.embedding || memory.embedding.length === 0) {
           return { memory, score: -1 };
        }
        return {
          memory,
          score: cosineSimilarity(queryEmbedding, memory.embedding)
        };
      });

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

  public async clearMemories(): Promise<void> {
    this.memories = [];
    await this.saveMemories();
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
