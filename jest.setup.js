// Add any global test setup here

// ─── GLOBAL FETCH GUARD ─────────────────────────────────────────────────────
// Prevents ANY real HTTP call to the Hugging Face Inference API during tests.
// This is belt-and-suspenders: individual test files must still mock `fetch`,
// but this failsafe catches any forgotten mocks.
const BLOCKED_HOSTS = ['api-inference.huggingface.co', 'huggingface.co'];
const _originalFetch = global.fetch;
global.fetch = function guardedFetch(input, init) {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url && BLOCKED_HOSTS.some(host => url.includes(host))) {
    throw new Error(
      `[TEST GUARD] Attempted live HF API call blocked: ${url}\n` +
      `Tests must mock global.fetch before calling BackendClient methods.\n` +
      `Add: global.fetch = jest.fn() in your beforeEach().`
    );
  }
  return _originalFetch ? _originalFetch.call(this, input, init) : Promise.reject(new Error('fetch not available'));
};
// ─────────────────────────────────────────────────────────────────────────────

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

// Mock Web Crypto API
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const nodeCrypto = require('crypto');

// Create a crypto object compatible with Web Crypto API
const webCrypto = {
  subtle: nodeCrypto.webcrypto.subtle,
  getRandomValues: (buffer) => nodeCrypto.webcrypto.getRandomValues(buffer)
};

// Polyfill global crypto if missing
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: webCrypto
  });
}

// Polyfill window.crypto for JSDOM
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    writable: true,
    value: webCrypto
  });
}
