export function createEmbeddingWorker(): Worker {
  return new Worker(new URL('./embeddings.worker.ts', import.meta.url), {
    type: 'module'
  });
}
