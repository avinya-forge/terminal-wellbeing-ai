import { embeddingWorker } from '../workers/EmbeddingWorker';
import { logger } from '../services/LoggerService';

/**
 * Calculates the embedding vector for a given text.
 * Returns a 384-dimensional vector (for MiniLM-L6-v2).
 * Uses a Web Worker to offload the heavy lifting from the main thread.
 */
export async function calculateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  try {
    return await embeddingWorker.extract(text);
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
