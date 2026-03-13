/**
 * nhs-client.ts
 * Implements fetch from NHS endpoint with auth headers.
 */

import { getEnv } from '@/utils/env';

export async function fetchNHSEndpoint(endpoint: string, options?: RequestInit): Promise<any> {
  const apiKey = getEnv('VITE_NHS_API_KEY');

  if (!apiKey) {
    throw new Error('Missing NHS API key');
  }

  const url = `https://api.nhs.uk/mental-health/${endpoint}`;

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

  return response.json();
}
