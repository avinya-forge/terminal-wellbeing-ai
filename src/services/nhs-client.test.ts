import { fetchNHSEndpoint } from './nhs-client';
import { getEnv } from '@/utils/env';

jest.mock('@/utils/env', () => ({
  getEnv: jest.fn()
}));

describe('fetchNHSEndpoint', () => {
  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
    (getEnv as jest.Mock).mockReturnValue('fake-nhs-key');
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('throws an error if the NHS API responds with an error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(fetchNHSEndpoint('invalid')).rejects.toThrow('NHS API error: 404 Not Found');
  });
});
