/// <reference lib="webworker" />

import { pipeline, Pipeline } from '@huggingface/transformers';

// Type definitions for the pipeline output
interface Tensor {
  data: Float32Array;
  dims: number[];
  type: string;
}

interface FeatureExtractionPipeline extends Pipeline {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (text: string | string[], options?: Record<string, any>): Promise<Tensor>;
}

// Define message types for type safety in the worker
export type WorkerMessage =
  | { type: 'init' }
  | { type: 'extract'; text: string; id: string };

export type WorkerResponse =
  | { type: 'ready' }
  | { type: 'extracted'; id: string; vector: number[] }
  | { type: 'error'; id?: string; error: string };

// Use typed pipeline
let extractor: FeatureExtractionPipeline | null = null;

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type } = e.data;

  try {
    if (type === 'init') {
      if (!extractor) {
        // Initialize the model
        // Cast the result to our typed interface since the library types might be generic
        extractor = (await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          quantized: true,
        })) as unknown as FeatureExtractionPipeline;
      }
      self.postMessage({ type: 'ready' });
    } else if (type === 'extract') {
      const { text, id } = e.data;

      if (!extractor) {
        throw new Error('Extractor not initialized');
      }

      if (!text || text.trim().length === 0) {
        self.postMessage({ type: 'extracted', id, vector: [] });
        return;
      }

      const output = await extractor(text, { pooling: 'mean', normalize: true });

      // Convert Tensor to standard array
      // The output.data is a Float32Array usually
      const vector = Array.from(output.data) as number[];

      self.postMessage({ type: 'extracted', id, vector });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: 'id' in e.data ? (e.data as { id: string }).id : undefined,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
