import { calculateEmbedding, cosineSimilarity } from './embeddings';
import { embeddingWorker } from '../workers/EmbeddingWorker';

// Mock the worker
jest.mock('../workers/EmbeddingWorker', () => ({
  embeddingWorker: {
    extract: jest.fn()
  }
}));

describe('Embedding Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateEmbedding', () => {
    it('should calculate embedding for valid text', async () => {
      // Mock worker output
      (embeddingWorker.extract as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);

      const result = await calculateEmbedding('hello world');

      expect(embeddingWorker.extract).toHaveBeenCalledWith('hello world');
      expect(result[0]).toBeCloseTo(0.1);
      expect(result[1]).toBeCloseTo(0.2);
      expect(result[2]).toBeCloseTo(0.3);
    });

    it('should return empty array for empty input', async () => {
      const result = await calculateEmbedding('');
      expect(result).toEqual([]);
      expect(embeddingWorker.extract).not.toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      (embeddingWorker.extract as jest.Mock).mockRejectedValue(new Error('Worker failed'));
      const result = await calculateEmbedding('fail');
      expect(result).toEqual([]);
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate correct similarity for identical vectors', () => {
      const vecA = [1, 0, 0];
      const vecB = [1, 0, 0];
      expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1.0);
    });

    it('should calculate correct similarity for opposite vectors', () => {
      const vecA = [1, 0, 0];
      const vecB = [-1, 0, 0];
      expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(-1.0);
    });

    it('should calculate correct similarity for orthogonal vectors', () => {
      const vecA = [1, 0, 0];
      const vecB = [0, 1, 0];
      expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(0.0);
    });

    it('should handle zero vectors', () => {
      expect(cosineSimilarity([0,0,0], [1,2,3])).toBe(0);
    });

    it('should handle different lengths', () => {
        expect(cosineSimilarity([1,2], [1,2,3])).toBe(0);
    });
  });
});
