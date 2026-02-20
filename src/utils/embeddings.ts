import { pipeline } from '@huggingface/transformers';
import { logger } from '../services/LoggerService';

// We hold the pipeline instance in module scope (singleton)
// Using 'any' for the pipeline type to avoid complex type imports from transformers.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractor: any | null = null;

/**
 * Initializes the feature extraction pipeline.
 * Uses a quantized version of all-MiniLM-L6-v2 which is lightweight (~23MB).
 */
const getExtractor = async () => {
  if (!extractor) {
    logger.info('Initializing feature extraction pipeline...');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true,
      } as any);
      logger.info('Feature extraction pipeline initialized.');
    } catch (error) {
      logger.error('Failed to initialize feature extraction pipeline:', error);
      throw error;
    }
  }
  return extractor;
};

/**
 * Calculates the embedding vector for a given text.
 * Returns a 384-dimensional vector (for MiniLM-L6-v2).
 */
export async function calculateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  try {
    const pipe = await getExtractor();

    // pooling: 'mean' averages the token vectors into a single sentence vector
    // normalize: true ensures the vector has unit length (good for cosine similarity)
    const output = await pipe(text, { pooling: 'mean', normalize: true });

    // The output is a Tensor. In transformers.js, .data is the underlying typed array.
    // We convert it to a standard number array.
    if (output && output.data) {
        return Array.from(output.data);
    }

    return [];
  } catch (error) {
    logger.error('Error calculating embedding:', error);
    return [];
  }
}

/**
 * Calculates the Cosine Similarity between two vectors.
 * Result is between -1.0 (opposite) and 1.0 (identical).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
