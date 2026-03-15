/**
 * rate-limiter.ts
 * Implements a token bucket algorithm for API rate limiting.
 */

export class TokenBucket {
  private capacity: number;
  private refillRate: number; // tokens per millisecond
  private tokens: number;
  private lastRefillTime: number;

  /**
   * @param capacity Maximum number of tokens in the bucket.
   * @param refillRateTokens Number of tokens to refill per refill interval.
   * @param refillIntervalMs Interval in milliseconds to refill the tokens.
   */
  constructor(capacity: number, refillRateTokens: number, refillIntervalMs: number) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRateTokens / refillIntervalMs;
    this.lastRefillTime = Date.now();
  }

  /**
   * Consume a given number of tokens from the bucket.
   * @param tokensToConsume Number of tokens to consume. Defaults to 1.
   * @returns true if tokens were successfully consumed, false if not enough tokens.
   */
  consume(tokensToConsume: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokensToConsume) {
      this.tokens -= tokensToConsume;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  // Exposed for testing
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
}
