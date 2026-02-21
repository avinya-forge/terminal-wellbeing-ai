import { MemoryService } from './MemoryService';
import { calculateEmbedding } from '../utils/embeddings';
import { cosineSimilarity } from '../utils/embeddings';

// Mock dependencies
jest.mock('../utils/embeddings', () => ({
  calculateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  cosineSimilarity: jest.fn().mockReturnValue(0.9)
}));

describe('MemoryService', () => {
  let service: MemoryService;
  const mockCalculateEmbedding = calculateEmbedding as jest.Mock;
  const mockCosineSimilarity = cosineSimilarity as jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    window.localStorage.clear();
    // Re-instantiate if possible or use existing singleton
    service = MemoryService.getInstance();
    // Ensure service is initialized and cleared
    await service.initialize();
    await service.clearMemories();
  });

  it('should add memory correctly', async () => {
    const entry = await service.addMemory('test content', 'user');

    expect(entry).not.toBeNull();
    if (entry) {
        expect(entry.content).toBe('test content');
        expect(entry.embedding).toEqual([0.1, 0.2, 0.3]);
        expect(entry.type).toBe('user');
        expect(service.getMemoryCount()).toBe(1);
    }
  });

  it('should retrieve relevant context', async () => {
    // Add Memory 1
    mockCalculateEmbedding.mockResolvedValueOnce([1, 0, 0]);
    await service.addMemory('memory one', 'user');

    // Add Memory 2
    mockCalculateEmbedding.mockResolvedValueOnce([0, 1, 0]);
    await service.addMemory('memory two', 'user');

    // Search Query (matches Memory 1)
    mockCalculateEmbedding.mockResolvedValueOnce([1, 0, 0]);

    // Setup cosine mock
    mockCosineSimilarity.mockImplementation((a, b) => {
        // Simple dot product for mocking
        if (a[0] === 1 && b[0] === 1) return 1.0;
        return 0.0;
    });

    const results = await service.retrieveRelevantContext('query');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].content).toBe('memory one');
  });

  it('should respect max entries limit', async () => {
    // Force max entries to 2 via private access workaround for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).config.maxEntries = 2;

    mockCalculateEmbedding.mockResolvedValue([0.1]);

    await service.addMemory('1', 'user');
    // small delay to ensure timestamp difference
    await new Promise(r => setTimeout(r, 10));
    await service.addMemory('2', 'user');
    await new Promise(r => setTimeout(r, 10));
    await service.addMemory('3', 'user');

    expect(service.getMemoryCount()).toBe(2);

    const memories = service.getMemories();
    const contents = memories.map(m => m.content);

    // Should contain 2 and 3 (newest), 1 should be gone
    // Note: The service sorts by timestamp DESCENDING (newest first) on save
    // So we expect the newest (3, 2) to be present.
    expect(contents).toContain('2');
    expect(contents).toContain('3');
    expect(contents).not.toContain('1');
  });

  it('should persist to localStorage (encrypted)', async () => {
      await service.addMemory('persist me', 'user');

      const stored = window.localStorage.getItem('wellbeing_long_term_memory');
      expect(stored).not.toBeNull();
      // Should NOT contain plain text
      expect(stored).not.toContain('persist me');
      // Should look like base64 (alphanumeric + +/=)
      expect(stored).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  it('should respect privacy mode', async () => {
    await service.setPrivacyMode(true);

    const entry = await service.addMemory('secret', 'user');
    expect(entry).toBeNull();
    expect(service.getMemoryCount()).toBe(0);

    // Check localStorage
    expect(window.localStorage.getItem('wellbeing_long_term_memory')).toBeNull();

    // Turn off privacy mode
    await service.setPrivacyMode(false);
    // Should reload from storage (which is empty/cleared)
    expect(service.getMemoryCount()).toBe(0);

    // Add memory now
    const entry2 = await service.addMemory('public', 'user');
    expect(entry2).not.toBeNull();
    expect(service.getMemoryCount()).toBe(1);
  });
});
