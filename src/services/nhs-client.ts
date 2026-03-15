/**
 * nhs-client.ts
 * Implements fetch from NHS endpoint with auth headers.
 */

import { getEnv } from '@/utils/env';
import { nhsFallbackCache } from './fallback-cache';
import { logger } from './LoggerService';
import { TokenBucket } from '@/utils/rate-limiter';

// Limit to 10 requests per minute per NHS API endpoint usage
const nhsApiRateLimiter = new TokenBucket(10, 10, 60000);

export async function fetchNHSEndpoint<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiKey = getEnv('VITE_NHS_API_KEY');

  if (!apiKey) {
    throw new Error('Missing NHS API key');
  }

  if (!nhsApiRateLimiter.consume(1)) {
    logger.warn('NHS API rate limit exceeded');
    throw new Error('Rate limit exceeded');
  }

  const url = `https://api.nhs.uk/mental-health/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Subscription-Key': apiKey,
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`NHS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    nhsFallbackCache.set(endpoint, data);
    return data;
  } catch (error) {
    const cachedData = nhsFallbackCache.get(endpoint);
    if (cachedData) {
      logger.warn(`NHS API request failed. Using fallback cache for endpoint: ${endpoint}`);
      return cachedData as T;
    }
    logger.error(`NHS API request failed and no fallback cache available for endpoint: ${endpoint}`, error);
    throw error;
  }
}
