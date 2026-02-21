// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import { generateResponse, aiService } from './ai';
import { getUserProfile } from '../utils/sessionManager';

jest.mock('../utils/sessionManager');
jest.mock('./MemoryService', () => ({
  memoryService: {
    initialize: jest.fn(),
    setPrivacyMode: jest.fn(),
    retrieveRelevantContext: jest.fn(),
    addMemory: jest.fn(),
    _init: jest.fn()
  }
}));

describe('AI Response Delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(aiService, 'generateResponse').mockResolvedValue('Mock Response');
    (getUserProfile as jest.Mock).mockReturnValue({ preferences: { speed: 'medium' } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const flushPromises = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  test('should delay response by default (medium - 1000ms)', async () => {
    const promise = generateResponse('hi', []);

    let resolved = false;
    promise.then(() => { resolved = true; });

    await flushPromises();
    expect(resolved).toBe(false);

    // Advance 900ms
    jest.advanceTimersByTime(900);
    await flushPromises();
    expect(resolved).toBe(false);

    // Advance remaining 100ms
    jest.advanceTimersByTime(100);
    await flushPromises();
    expect(resolved).toBe(true);
  });

  test('should delay response for fast speed (300ms)', async () => {
    (getUserProfile as jest.Mock).mockReturnValue({ preferences: { speed: 'fast' } });
    const promise = generateResponse('hi', []);

    let resolved = false;
    promise.then(() => { resolved = true; });

    await flushPromises();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(290);
    await flushPromises();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(20);
    await flushPromises();
    expect(resolved).toBe(true);
  });

  test('should delay response for slow speed (2500ms)', async () => {
    (getUserProfile as jest.Mock).mockReturnValue({ preferences: { speed: 'slow' } });
    const promise = generateResponse('hi', []);

    let resolved = false;
    promise.then(() => { resolved = true; });

    await flushPromises();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(2400);
    await flushPromises();
    expect(resolved).toBe(false);

    jest.advanceTimersByTime(200);
    await flushPromises();
    expect(resolved).toBe(true);
  });
});
