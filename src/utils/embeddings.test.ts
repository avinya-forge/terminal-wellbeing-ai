import { calculateEmbedding, cosineSimilarity } from './embeddings';
import { pipeline } from '@huggingface/transformers';

// Mock the pipeline
jest.mock('@huggingface/transformers', () => ({
  pipeline: jest.fn()
}));

describe('Embedding Utils', () => {
  const mockPipeline = pipeline as jest.Mock;
  const mockExtractor = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPipeline.mockResolvedValue(mockExtractor);
  });

  describe('calculateEmbedding', () => {
    it('should calculate embedding for valid text', async () => {
      // Mock extractor output
      const mockOutput = {
        data: new Float32Array([0.1, 0.2, 0.3])
      };
      mockExtractor.mockResolvedValue(mockOutput);

      const result = await calculateEmbedding('hello world');

      expect(mockPipeline).toHaveBeenCalledWith('feature-extraction', 'Xenova/all-MiniLM-L6-v2', expect.any(Object));
      expect(mockExtractor).toHaveBeenCalledWith('hello world', expect.any(Object));
      // Float32Array when converted to array via Array.from should match
      expect(result[0]).toBeCloseTo(0.1);
      expect(result[1]).toBeCloseTo(0.2);
      expect(result[2]).toBeCloseTo(0.3);
    });

    it('should return empty array for empty input', async () => {
      const result = await calculateEmbedding('');
      expect(result).toEqual([]);
      expect(mockExtractor).not.toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      mockExtractor.mockRejectedValue(new Error('Pipeline failed'));
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
