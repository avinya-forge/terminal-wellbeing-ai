describe('embeddings.worker', () => {
  let postMessageMock: jest.Mock;
  let pipelineMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    postMessageMock = jest.fn();
    pipelineMock = jest.fn();

    jest.mock('@huggingface/transformers', () => ({
      pipeline: pipelineMock
    }));

    Object.defineProperty(global, 'self', {
      value: {
        onmessage: null,
        postMessage: postMessageMock
      },
      writable: true
    });
  });

  const getWorker = () => {
    require('./embeddings.worker');
    return (global as any).self.onmessage;
  };

  it('should initialize pipeline on init message', async () => {
    pipelineMock.mockResolvedValue(jest.fn());
    const onmessage = getWorker();

    await onmessage({ data: { type: 'init' } });

    expect(pipelineMock).toHaveBeenCalledWith('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
    expect(postMessageMock).toHaveBeenCalledWith({ type: 'init_complete' });
  });

  it('should handle initialization error', async () => {
    pipelineMock.mockRejectedValue(new Error('Init failed'));
    const onmessage = getWorker();

    await onmessage({ data: { type: 'init' } });

    expect(postMessageMock).toHaveBeenCalledWith({ type: 'error', error: 'Init failed' });
  });

  it('should perform embedding on embed message', async () => {
    const arr = new Float32Array([0.1, 0.2, 0.3]);
    const mockPipe = jest.fn().mockResolvedValue({
      data: arr
    });
    pipelineMock.mockResolvedValue(mockPipe);
    const onmessage = getWorker();

    await onmessage({ data: { type: 'embed', id: '123', text: 'hello' } });

    expect(mockPipe).toHaveBeenCalledWith('hello', { pooling: 'mean', normalize: true });
    expect(postMessageMock).toHaveBeenCalledWith({ id: '123', embedding: Array.from(arr) });
  });

  it('should handle embedding error', async () => {
    const mockPipe = jest.fn().mockRejectedValue(new Error('Embed failed'));
    pipelineMock.mockResolvedValue(mockPipe);
    const onmessage = getWorker();

    await onmessage({ data: { type: 'embed', id: '456', text: 'fail' } });

    expect(postMessageMock).toHaveBeenCalledWith({ id: '456', error: 'Embed failed' });
  });

  it('should handle non-Error throw', async () => {
    const mockPipe = jest.fn().mockRejectedValue('String Error');
    pipelineMock.mockResolvedValue(mockPipe);
    const onmessage = getWorker();

    await onmessage({ data: { type: 'embed', id: '789', text: 'fail string' } });

    expect(postMessageMock).toHaveBeenCalledWith({ id: '789', error: 'String Error' });
  });

  it('should handle init failure via non-Error throw', async () => {
    pipelineMock.mockRejectedValue('Init String Error');
    const onmessage = getWorker();

    await onmessage({ data: { type: 'init' } });

    expect(postMessageMock).toHaveBeenCalledWith({ type: 'error', error: 'Init String Error' });
  });

  it('should ignore unknown message types', async () => {
    const onmessage = getWorker();
    await onmessage({ data: { type: 'unknown' } });

    expect(postMessageMock).not.toHaveBeenCalled();
    expect(pipelineMock).not.toHaveBeenCalled();
  });
});
