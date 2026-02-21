import { logger } from '../services/LoggerService';
import { createEmbeddingWorker } from './workerFactory';

export class EmbeddingWorker {
  private worker: Worker | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingRequests: Map<string, { resolve: (value: number[]) => void, reject: (reason: any) => void }> = new Map();
  private isReady: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Lazy initialization
  }

  public async initialize(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      try {
        // Initialize the worker using factory helper
        this.worker = createEmbeddingWorker();

        this.worker.onmessage = (e: MessageEvent) => {
          const { type, id, vector, error } = e.data;

          if (type === 'ready') {
            this.isReady = true;
            logger.info('EmbeddingWorker initialized successfully.');
            resolve();
          } else if (type === 'extracted') {
            const request = this.pendingRequests.get(id);
            if (request) {
              request.resolve(vector);
              this.pendingRequests.delete(id);
            }
          } else if (type === 'error') {
             if (id) {
               const request = this.pendingRequests.get(id);
               if (request) {
                 request.reject(new Error(error));
                 this.pendingRequests.delete(id);
               }
             } else {
               // If initialization fails
               if (!this.isReady) {
                 reject(new Error(error));
               } else {
                 logger.error(`EmbeddingWorker Error: ${error}`);
               }
             }
          }
        };

        this.worker.onerror = (e) => {
            logger.error('EmbeddingWorker Error Event:', e);
            if (!this.isReady) {
                reject(new Error('Worker initialization failed'));
            }
        };

        this.worker.postMessage({ type: 'init' });
      } catch (err) {
        logger.error('Failed to create EmbeddingWorker:', err);
        reject(err);
      }
    });

    return this.initPromise;
  }

  public async extract(text: string): Promise<number[]> {
    if (!this.worker || !this.isReady) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7);
      this.pendingRequests.set(id, { resolve, reject });

      this.worker!.postMessage({ type: 'extract', text, id });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Embedding extraction timed out'));
        }
      }, 30000);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.initPromise = null;
      this.pendingRequests.clear();
      logger.info('EmbeddingWorker terminated.');
    }
  }
}

// Export singleton
export const embeddingWorker = new EmbeddingWorker();
