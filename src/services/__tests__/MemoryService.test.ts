import { MemoryService } from '../MemoryService';
import { calculateEmbedding } from '../../utils/embeddings';
import { generateKey, exportKey, importKey, encryptData, decryptData } from '../../utils/encryption';
import { logger } from '../LoggerService';

jest.mock('../../utils/embeddings');
jest.mock('../../utils/encryption');
jest.mock('../LoggerService');

describe('MemoryService', () => {
  let memoryService: MemoryService;
  let mockCrypto: { randomUUID: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock crypto.randomUUID
    mockCrypto = {
        randomUUID: jest.fn().mockReturnValue('test-uuid')
    };
    Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true
    });

    (calculateEmbedding as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    (generateKey as jest.Mock).mockResolvedValue('mock-key');
    (exportKey as jest.Mock).mockResolvedValue('mock-exported-key');
    (importKey as jest.Mock).mockResolvedValue('mock-key');
    (encryptData as jest.Mock).mockImplementation(async (data) => `encrypted_${data}`);
    (decryptData as jest.Mock).mockImplementation(async (data) => data.replace('encrypted_', ''));

    // We need to re-instantiate or reset the singleton for testing
    // Since it's a singleton, we use getInstance but we might need to reset its state
    // Let's create a new instance via casting to any to access private constructor if needed,
    // but getInstance is public. However, to clear state between tests, we can call clearMemories
    memoryService = (MemoryService as unknown).instance = undefined;
    memoryService = MemoryService.getInstance();
  });

  afterAll(() => {
     jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with a new key if none exists', async () => {
      await memoryService.initialize();
      expect(generateKey).toHaveBeenCalled();
      expect(localStorage.getItem('wellbeing_encryption_key')).toBe('mock-exported-key');
      expect(memoryService['initialized']).toBe(true);
    });

    it('should initialize with existing key if available', async () => {
      localStorage.setItem('wellbeing_encryption_key', 'existing-key');
      await memoryService.initialize();
      expect(importKey).toHaveBeenCalledWith('existing-key');
      expect(memoryService['initialized']).toBe(true);
    });

    it('should generate new key if import fails', async () => {
      localStorage.setItem('wellbeing_encryption_key', 'bad-key');
      (importKey as jest.Mock).mockRejectedValueOnce(new Error('Import failed'));
      await memoryService.initialize();
      expect(logger.error).toHaveBeenCalled();
      expect(generateKey).toHaveBeenCalled();
      expect(memoryService['initialized']).toBe(true);
    });

    it('should handle missing window gracefully during init', async () => {
      const originalWindow = global.window;
      delete (global as unknown).window;

      const newInstance = new (MemoryService as unknown)();
      await newInstance.initialize();
      expect(newInstance['initialized']).toBe(true);

      global.window = originalWindow;
    });

    it('should load encrypted memories', async () => {
        const memories = [{ id: '1', content: 'test', type: 'user', timestamp: '2023' }];
        localStorage.setItem('wellbeing_encryption_key', 'existing-key');
        localStorage.setItem('wellbeing_long_term_memory', `encrypted_${JSON.stringify(memories)}`);

        await memoryService.initialize();
        expect(decryptData).toHaveBeenCalled();
        expect(memoryService.getMemories()).toHaveLength(1);
    });

    it('should fallback to plain text if decryption fails', async () => {
        const memories = [{ id: '1', content: 'test', type: 'user', timestamp: '2023' }];
        localStorage.setItem('wellbeing_encryption_key', 'existing-key');
        localStorage.setItem('wellbeing_long_term_memory', JSON.stringify(memories));

        (decryptData as jest.Mock).mockRejectedValueOnce(new Error('Decrypt fail'));

        await memoryService.initialize();
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('fallback'), expect.any(Error));
        expect(memoryService.getMemories()).toHaveLength(1);
    });

    it('should handle JSON parse error on fallback', async () => {
        localStorage.setItem('wellbeing_encryption_key', 'existing-key');
        localStorage.setItem('wellbeing_long_term_memory', 'invalid-json');

        (decryptData as jest.Mock).mockRejectedValueOnce(new Error('Decrypt fail'));

        await memoryService.initialize();
        expect(memoryService.getMemories()).toHaveLength(0);
    });

    it('should load plain text memories if no key (unlikely state, but covered)', async () => {
         const memories = [{ id: '1', content: 'test', type: 'user', timestamp: '2023' }];
         // Force key to be null after init start but before loadMemories
         // Let's just mock loadMemories behavior directly or simulate it
         const newInstance = new (MemoryService as unknown)();
         localStorage.setItem('wellbeing_long_term_memory', JSON.stringify(memories));
         // Need to call private loadMemories without key
         await newInstance['loadMemories']();
         expect(newInstance.getMemories()).toHaveLength(1);
    });

  });

  describe('privacy mode', () => {
    it('should enable privacy mode and clear memories', async () => {
      await memoryService.addMemory('test', 'user');
      expect(memoryService.getMemories()).toHaveLength(1);

      await memoryService.setPrivacyMode(true);
      expect(memoryService['privacyMode']).toBe(true);
      expect(memoryService.getMemories()).toHaveLength(0);
      expect(localStorage.getItem('wellbeing_long_term_memory')).toBeNull();
    });

    it('should re-initialize when privacy mode disabled', async () => {
      await memoryService.setPrivacyMode(true);
      const initSpy = jest.spyOn(memoryService, 'initialize');
      await memoryService.setPrivacyMode(false);
      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe('addMemory', () => {
    it('should not add memory if privacy mode is on', async () => {
      await memoryService.setPrivacyMode(true);
      const result = await memoryService.addMemory('test', 'user');
      expect(result).toBeNull();
    });

    it('should not add memory if content is empty', async () => {
      const result = await memoryService.addMemory('   ', 'user');
      expect(result).toBeNull();
    });

    it('should add memory and save to storage', async () => {
      const result = await memoryService.addMemory('test content', 'user', ['tag1']);
      expect(result).not.toBeNull();
      expect(result?.content).toBe('test content');
      expect(result?.embedding).toEqual([0.1, 0.2, 0.3]);
      expect(result?.type).toBe('user');

      const stored = localStorage.getItem('wellbeing_long_term_memory');
      expect(stored).toContain('encrypted_');
      expect(memoryService.getMemoryCount()).toBe(1);
    });

    it('should enforce max entries limit', async () => {
      // Configure with maxEntries = 2
      memoryService = new (MemoryService as unknown)({ maxEntries: 2 });
      await memoryService.initialize();

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-01-01T00:00:00Z'));
      await memoryService.addMemory('test 1', 'user');
      // Mock timestamp so they are ordered
      // wait some time for unique timestamps
      jest.setSystemTime(new Date('2023-01-02T00:00:00Z'));
      await memoryService.addMemory('test 2', 'user');
      jest.setSystemTime(new Date('2023-01-03T00:00:00Z'));
      await memoryService.addMemory('test 3', 'user');

      const memories = memoryService.getMemories();
      expect(memories).toHaveLength(2);
      // The newest should be kept
      expect(memories[0].content).toBe('test 3');
      expect(memories[1].content).toBe('test 2');

      jest.useRealTimers();
    });

    it('should handle embedding calculation error', async () => {
       (calculateEmbedding as jest.Mock).mockRejectedValueOnce(new Error('Embedding fail'));
       const result = await memoryService.addMemory('test', 'user');
       expect(result).toBeNull();
       expect(logger.error).toHaveBeenCalled();
    });

    it('should handle generateId without crypto', async () => {
        const originalCrypto = global.crypto;
        delete (global as unknown).crypto;

        const result = await memoryService.addMemory('test', 'user');
        expect(result?.id).toBeDefined();

        global.crypto = originalCrypto;
    });
  });

  describe('retrieveRelevantContext', () => {
    it('should return empty array if query is empty', async () => {
      const result = await memoryService.retrieveRelevantContext('');
      expect(result).toEqual([]);
    });

    it('should return empty array if no memories exist', async () => {
      const result = await memoryService.retrieveRelevantContext('query');
      expect(result).toEqual([]);
    });

    it('should return empty array if query embedding is empty', async () => {
      await memoryService.addMemory('test content', 'user');
      (calculateEmbedding as jest.Mock).mockResolvedValueOnce([]);

      const result = await memoryService.retrieveRelevantContext('query');
      expect(result).toEqual([]);
    });

    it('should retrieve relevant memories based on similarity', async () => {
      // Mock cosineSimilarity indirectly by returning embeddings that will score high/low
      // Actually, cosineSimilarity is imported, we might need to mock it or let it run
      // It's defined in embeddings.ts which we mocked. Let's mock the implementation
      const embeddingsMock = require('../../utils/embeddings') as any;
      embeddingsMock.cosineSimilarity = jest.fn()
         .mockReturnValueOnce(0.9) // matches
         .mockReturnValueOnce(0.2) // below threshold (default 0.5)
         .mockReturnValueOnce(0.8); // matches

      memoryService = new (MemoryService as unknown)({ similarityThreshold: 0.5, contextWindowSize: 2 });
      await memoryService.initialize();

      // Inject some memories manually to avoid calling addMemory which also uses calculateEmbedding
      memoryService['memories'] = [
          { id: '1', content: 'match 1', embedding: [1], timestamp: '1', type: 'user', tags: [] },
          { id: '2', content: 'no match', embedding: [2], timestamp: '2', type: 'user', tags: [] },
          { id: '3', content: 'match 2', embedding: [3], timestamp: '3', type: 'user', tags: [] },
      ];

      const result = await memoryService.retrieveRelevantContext('query');
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('match 1');
      expect(result[1].content).toBe('match 2');
    });

    it('should handle memory with no embedding during retrieval', async () => {
      const embeddingsMock = require('../../utils/embeddings') as any;
      embeddingsMock.cosineSimilarity = jest.fn().mockReturnValue(0.9);

      memoryService['memories'] = [
          { id: '1', content: 'match 1', embedding: [], timestamp: '1', type: 'user', tags: [] },
      ];

      const result = await memoryService.retrieveRelevantContext('query');
      expect(result).toHaveLength(0);
    });

    it('should handle retrieval error', async () => {
      await memoryService.addMemory('test', 'user');
      (calculateEmbedding as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const result = await memoryService.retrieveRelevantContext('query');
      expect(result).toEqual([]);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('clearMemories', () => {
    it('should clear all memories and save', async () => {
      await memoryService.addMemory('test', 'user');
      expect(memoryService.getMemories()).toHaveLength(1);

      await memoryService.clearMemories();
      expect(memoryService.getMemories()).toHaveLength(0);
      expect(localStorage.getItem('wellbeing_long_term_memory')).toContain('encrypted_[]');
    });
  });
});
