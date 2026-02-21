import { EmbeddingWorker } from './EmbeddingWorker';
import * as workerFactory from './workerFactory';

jest.mock('./workerFactory');

describe('EmbeddingWorker', () => {
  let mockWorker: {
    postMessage: jest.Mock;
    terminate: jest.Mock;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((error: ErrorEvent) => void) | null;
  };

  beforeEach(() => {
    // Reset singleton instance by casting to any to access private static property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (EmbeddingWorker as any).instance = null;

    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
      onerror: null,
    };

    (workerFactory.createEmbeddingWorker as jest.Mock).mockReturnValue(mockWorker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize worker and return embedding', async () => {
    const worker = EmbeddingWorker.getInstance();
    const promise = worker.embed('hello');

    // Init should be called
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ type: 'init' });

    // Wait for async operations to proceed
    await new Promise(resolve => setTimeout(resolve, 0));

    // Embed should be called
    expect(mockWorker.postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'embed',
      text: 'hello'
    }));

    // Find the call with type 'embed' to get the ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedCall = mockWorker.postMessage.mock.calls.find((call: any[]) => call[0].type === 'embed');
    expect(embedCall).toBeDefined();
    const id = embedCall[0].id;

    // Simulate worker response
    if (mockWorker.onmessage) {
      mockWorker.onmessage({ data: { id, embedding: [0.1, 0.2] } } as MessageEvent);
    }

    const result = await promise;
    expect(result).toEqual([0.1, 0.2]);
  });

  it('should handle worker errors', async () => {
    const worker = EmbeddingWorker.getInstance();
    const promise = worker.embed('error');

    await new Promise(resolve => setTimeout(resolve, 0));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedCall = mockWorker.postMessage.mock.calls.find((call: any[]) => call[0].type === 'embed');
    expect(embedCall).toBeDefined();
    const id = embedCall[0].id;

    if (mockWorker.onmessage) {
      mockWorker.onmessage({ data: { id, error: 'Failed' } } as MessageEvent);
    }

    await expect(promise).rejects.toThrow('Failed');
  });

  it('should terminate worker', async () => {
    const worker = EmbeddingWorker.getInstance();

    // Simulate initialization
    const promise = worker.embed('hello');
    await new Promise(resolve => setTimeout(resolve, 0));

    // Respond to clear pending request (optional but cleaner)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedCall = mockWorker.postMessage.mock.calls.find((call: any[]) => call[0].type === 'embed');
    if (embedCall && mockWorker.onmessage) {
        mockWorker.onmessage({ data: { id: embedCall[0].id, embedding: [] } } as MessageEvent);
    }
    await promise;

    worker.terminate();
    expect(mockWorker.terminate).toHaveBeenCalled();
  });
});
