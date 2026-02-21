import { calculateEmbedding, cosineSimilarity } from './embeddings';
import { EmbeddingWorker } from '../workers/EmbeddingWorker';

// Mock EmbeddingWorker
jest.mock('../workers/EmbeddingWorker');

describe('Embedding Utils', () => {
  let mockEmbed: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmbed = jest.fn();
    (EmbeddingWorker.getInstance as jest.Mock).mockReturnValue({
      embed: mockEmbed
    });
  });

  describe('calculateEmbedding', () => {
    it('should calculate embedding for valid text', async () => {
      mockEmbed.mockResolvedValue([0.1, 0.2, 0.3]);

      const result = await calculateEmbedding('hello world');

      expect(EmbeddingWorker.getInstance).toHaveBeenCalled();
      expect(mockEmbed).toHaveBeenCalledWith('hello world');
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should return empty array for empty input', async () => {
      const result = await calculateEmbedding('');
      expect(result).toEqual([]);
      expect(mockEmbed).not.toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      mockEmbed.mockRejectedValue(new Error('Worker failed'));
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
