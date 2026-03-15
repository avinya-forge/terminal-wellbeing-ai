/**
 * Fallback cache for NHS routing when the API fails or is offline.
 * Implements a simple time-based in-memory cache.
 */

export class FallbackCache {
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();
  private defaultTtl: number;

  constructor(defaultTtlSeconds: number = 3600) {
    this.defaultTtl = defaultTtlSeconds * 1000;
  }

  set(key: string, value: unknown, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ? ttl * 1000 : this.defaultTtl);
    this.cache.set(key, { value, expiresAt });
  }

  get<T = unknown>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const nhsFallbackCache = new FallbackCache();
