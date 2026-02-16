// Add any global test setup here
require('@testing-library/jest-dom');

// Mock matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Global mock for transformers to avoid ESM/import.meta issues
jest.mock('@huggingface/transformers', () => ({
  pipeline: jest.fn().mockResolvedValue(jest.fn().mockResolvedValue([{ generated_text: 'Test response' }])),
  env: { allowLocalModels: false }
}), { virtual: true });
