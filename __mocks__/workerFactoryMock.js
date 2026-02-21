// Mock implementation for Worker Factory
class MockWorker {
  constructor() {
    this.onmessage = null;
    this.onerror = null;
  }

  postMessage(data) {
    // Basic echo for testing if needed, or do nothing
    // Tests can spy on this or use specific mocks
  }

  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
}

module.exports = {
  createEmbeddingWorker: jest.fn(() => new MockWorker())
};
