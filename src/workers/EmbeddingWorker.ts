import { createEmbeddingWorker } from './workerFactory';

interface PendingRequest {
  resolve: (value: number[]) => void;
  reject: (reason?: unknown) => void;
}

export class EmbeddingWorker {
  private static instance: EmbeddingWorker;
  private worker: Worker | null = null;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): EmbeddingWorker {
    if (!EmbeddingWorker.instance) {
      EmbeddingWorker.instance = new EmbeddingWorker();
    }
    return EmbeddingWorker.instance;
  }

  private initialize(): Promise<void> {
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = new Promise((resolve, reject) => {
      try {
        this.worker = createEmbeddingWorker();

        this.worker.onmessage = (event: MessageEvent) => {
          const { id, embedding, error } = event.data;

          if (id) {
            const request = this.pendingRequests.get(id);
            if (request) {
              if (error) {
                request.reject(new Error(error));
              } else {
                request.resolve(embedding);
              }
              this.pendingRequests.delete(id);
            }
          }
        };

        this.worker.onerror = (error: ErrorEvent) => {
            console.error('Worker error:', error.message);
            // Reject all pending requests
            this.pendingRequests.forEach(req => req.reject(new Error(error.message)));
            this.pendingRequests.clear();
        };

        // We can send an init message if we want to pre-warm the worker
        this.worker.postMessage({ type: 'init' });
        resolve();

      } catch (error) {
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public async embed(text: string): Promise<number[]> {
    await this.initialize();

    if (!this.worker) {
      throw new Error('Worker not initialized');
    }

    const id = this.generateId();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      this.worker!.postMessage({ type: 'embed', id, text });
    });
  }

  public terminate(): void {
      if (this.worker) {
          this.worker.terminate();
          this.worker = null;
          this.initializationPromise = null;

          this.pendingRequests.forEach(req => req.reject(new Error('Worker terminated')));
          this.pendingRequests.clear();
      }
  }
}
