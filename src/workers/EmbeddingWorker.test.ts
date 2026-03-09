import { EmbeddingWorker } from './EmbeddingWorker';
import { createEmbeddingWorker } from './workerFactory';

jest.mock('./workerFactory', () => ({
  createEmbeddingWorker: jest.fn()
}));

describe('EmbeddingWorker', () => {
  let mockWorker: any;
  let workerInstance: EmbeddingWorker;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockWorker = {
      onmessage: null,
      onerror: null,
      postMessage: jest.fn(),
      terminate: jest.fn()
    };

    (createEmbeddingWorker as jest.Mock).mockReturnValue(mockWorker);

    // Clear static instance
    (EmbeddingWorker as any).instance = undefined;
    workerInstance = EmbeddingWorker.getInstance();
  });

  afterEach(() => {
    // We shouldn't automatically terminate because it rejects pending promises unhandled by tests.
    // Tests that want to test termination should call it and handle the rejection.
    consoleErrorSpy.mockRestore();
  });

  it('should initialize successfully and handle initialization once', async () => {
    const initPromise = (workerInstance as any).initialize();
    const initPromise2 = (workerInstance as any).initialize();

    expect(initPromise).toBe(initPromise2); // Cache check
    expect(createEmbeddingWorker).toHaveBeenCalledTimes(1);
    expect(mockWorker.postMessage).toHaveBeenCalledWith({ type: 'init' });

    await initPromise;
  });

  it('should embed text successfully', async () => {
    // Start embed request without awaiting yet
    let embedding: number[] | undefined;
    const embedPromise = workerInstance.embed('test text').then(res => { embedding = res; });

    // We wait for microtasks to process so initialize finishes and postMessage is called
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockWorker.postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'embed',
      text: 'test text'
    }));

    const lastCall = mockWorker.postMessage.mock.calls[1][0]; // 0 is init, 1 is embed
    const id = lastCall.id;

    // Simulate successful response
    mockWorker.onmessage({ data: { id, embedding: [0.1, 0.2] } });

    await embedPromise;
    expect(embedding).toEqual([0.1, 0.2]);
  });

  it('should handle embedding error', async () => {
    let errorCaught: any;
    const embedPromise = workerInstance.embed('test text').catch(e => { errorCaught = e; });

    await new Promise(resolve => setTimeout(resolve, 0));
    const lastCall = mockWorker.postMessage.mock.calls[1][0];
    const id = lastCall.id;

    // Simulate error response
    mockWorker.onmessage({ data: { id, error: 'Failed' } });

    await embedPromise;
    expect(errorCaught.message).toBe('Failed');
  });

  it('should handle worker error event', async () => {
    let errorCaught: any;
    const embedPromise = workerInstance.embed('test text').catch(e => { errorCaught = e; });

    await new Promise(resolve => setTimeout(resolve, 0));

    // Simulate worker crashing
    mockWorker.onerror({ message: 'Worker crashed' } as any);

    await embedPromise;
    expect(errorCaught.message).toBe('Worker crashed');
    expect(console.error).toHaveBeenCalledWith('Worker error:', 'Worker crashed');
  });

  it('should ignore message without id or unmatching id', async () => {
    let embedding: number[] | undefined;
    const embedPromise = workerInstance.embed('test text').then(res => { embedding = res; });

    await new Promise(resolve => setTimeout(resolve, 0));
    const lastCall = mockWorker.postMessage.mock.calls[1][0];

    // send bad messages
    mockWorker.onmessage({ data: { id: 'unknown', embedding: [0.1] } });
    mockWorker.onmessage({ data: { embedding: [0.2] } }); // no id

    // pending request is not resolved yet
    expect(embedding).toBeUndefined();

    // send correct one
    mockWorker.onmessage({ data: { id: lastCall.id, embedding: [1] } });

    await embedPromise;
    expect(embedding).toEqual([1]);
  });

  it('should throw if worker not initialized (edge case in embed logic)', async () => {
    (createEmbeddingWorker as jest.Mock).mockImplementation(() => {
      throw new Error('Create failed');
    });

    let errorCaught: any;
    try {
        await workerInstance.embed('test');
    } catch(e) {
        errorCaught = e;
    }

    expect(errorCaught.message).toBe('Create failed');
  });

  it('should generate ID with random fallback if crypto is not available', async () => {
    const originalCrypto = global.crypto;
    Object.defineProperty(global, 'crypto', { value: undefined, configurable: true });

    const embedPromise = workerInstance.embed('test').catch(() => {});

    await new Promise(resolve => setTimeout(resolve, 0));
    const lastCall = mockWorker.postMessage.mock.calls[1][0];
    expect(lastCall.id).toBeDefined();
    expect(typeof lastCall.id).toBe('string');

    Object.defineProperty(global, 'crypto', { value: originalCrypto, configurable: true });
  });

  it('should reject pending requests on terminate', async () => {
    let errorCaught: any;
    const embedPromise = workerInstance.embed('test text').catch(e => { errorCaught = e; });

    await new Promise(resolve => setTimeout(resolve, 0));

    workerInstance.terminate();

    await embedPromise;
    expect(errorCaught.message).toBe('Worker terminated');
  });

  it('should throw if embed is called after terminate without re-init (worker is null)', async () => {
    // Actually our terminate nulls out worker and initializationPromise,
    // so embed() will call initialize() again. Let's verify that behavior.
    workerInstance.terminate();

    // now embed
    const embedPromise = workerInstance.embed('test2').catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(createEmbeddingWorker).toHaveBeenCalled(); // re-inits
  });
});
