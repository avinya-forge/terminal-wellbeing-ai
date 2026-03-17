import { fetchNHSEndpoint } from './nhs-client';
import { getEnv } from '@/utils/env';
import { nhsFallbackCache } from './fallback-cache';

jest.mock('@/utils/env', () => ({
  getEnv: jest.fn()
}));

jest.mock('@/utils/rate-limiter', () => {
  const mockConsume = jest.fn().mockReturnValue(true);
  return {
    TokenBucket: jest.fn().mockImplementation(() => {
      return {
        consume: mockConsume
      };
    }),
    __mockConsume: mockConsume
  };
});

// Import the mocked module
import * as rateLimiterModule from '@/utils/rate-limiter';
const mockConsume = (rateLimiterModule as any).__mockConsume as jest.Mock;

describe('fetchNHSEndpoint', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    (getEnv as jest.Mock).mockReturnValue('fake-nhs-key');
    mockConsume.mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    nhsFallbackCache.clear();
  });

  it('throws an error if rate limit is exceeded and no cache exists', async () => {
    mockConsume.mockReturnValue(false);
    await expect(fetchNHSEndpoint('test')).rejects.toThrow('Rate limit exceeded');
  });

  it('uses fallback cache if rate limit is exceeded', async () => {
    nhsFallbackCache.set('services', { status: 'cached' });
    mockConsume.mockReturnValue(false);

    const result = await fetchNHSEndpoint('services');
    expect(result).toEqual({ status: 'cached' });
  });

  it('throws an error if VITE_NHS_API_KEY is missing', async () => {
    (getEnv as jest.Mock).mockReturnValue(undefined);
    await expect(fetchNHSEndpoint('test')).rejects.toThrow('Missing NHS API key');
  });

  it('fetches from the correct NHS endpoint with valid headers', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });

    const result = await fetchNHSEndpoint('services');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.nhs.uk/mental-health/services',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Subscription-Key': 'fake-nhs-key'
        })
      })
    );
    expect(result).toEqual({ status: 'success' });
  });

  it('throws an error if the NHS API responds with an error and no cache exists', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(fetchNHSEndpoint('invalid')).rejects.toThrow('NHS API error: 404 Not Found');
  });

  it('uses fallback cache if NHS API responds with an error', async () => {
    // Set a mock cache value
    nhsFallbackCache.set('services', { status: 'cached' });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const result = await fetchNHSEndpoint('services');
    expect(result).toEqual({ status: 'cached' });
  });

  it('caches the successful response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' })
    });

    await fetchNHSEndpoint('services');

    expect(nhsFallbackCache.get('services')).toEqual({ status: 'success' });
  });
});
