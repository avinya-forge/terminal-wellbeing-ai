import { EmbeddingWorker } from './EmbeddingWorker';

// Mock the factory module
jest.mock('./workerFactory', () => {
  class MockWorker {
     onmessage: ((e: MessageEvent) => void) | null = null;
     onerror: ((e: ErrorEvent) => void) | null = null;

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     postMessage(data: any) {
       // Simulate worker response
       if (data.type === 'init') {
         setTimeout(() => {
           if (this.onmessage) {
             this.onmessage({ data: { type: 'ready' } } as MessageEvent);
           }
         }, 10);
       } else if (data.type === 'extract') {
         setTimeout(() => {
           if (this.onmessage) {
             this.onmessage({
               data: {
                 type: 'extracted',
                 id: data.id,
                 vector: [0.1, 0.2, 0.3]
               }
             } as MessageEvent);
           }
         }, 10);
       }
     }

     terminate() {}
  }

  return {
    createEmbeddingWorker: jest.fn(() => new MockWorker())
  };
});

describe('EmbeddingWorker', () => {
  let worker: EmbeddingWorker;

  beforeEach(() => {
    worker = new EmbeddingWorker();
  });

  afterEach(() => {
    worker.terminate();
  });

  it('initializes correctly', async () => {
    await worker.initialize();
  });

  it('extracts embeddings', async () => {
    const vector = await worker.extract('hello world');
    expect(vector).toEqual([0.1, 0.2, 0.3]);
  });
});
