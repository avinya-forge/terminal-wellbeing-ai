module.exports = {
  createEmbeddingWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: null,
    onerror: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })
};
