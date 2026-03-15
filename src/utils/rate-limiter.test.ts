import { TokenBucket } from './rate-limiter';

describe('TokenBucket Rate Limiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1000000000000)); // fixed time
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests when bucket has capacity', () => {
    const bucket = new TokenBucket(5, 5, 1000); // 5 tokens, refills 5 per second

    expect(bucket.consume(1)).toBe(true);
    expect(bucket.getTokens()).toBe(4);
    expect(bucket.consume(4)).toBe(true);
    expect(bucket.getTokens()).toBe(0);
  });

  it('denies requests when bucket is empty', () => {
    const bucket = new TokenBucket(2, 2, 1000);

    expect(bucket.consume(2)).toBe(true);
    expect(bucket.consume(1)).toBe(false); // empty
  });

  it('refills tokens over time', () => {
    const bucket = new TokenBucket(3, 3, 1000); // refills 3 per 1000ms

    expect(bucket.consume(3)).toBe(true); // bucket empty
    expect(bucket.consume(1)).toBe(false);

    // Advance 500ms -> should refill 1.5 tokens
    jest.setSystemTime(new Date(1000000000500));
    expect(bucket.getTokens()).toBe(1.5);
    expect(bucket.consume(1)).toBe(true);
    expect(bucket.consume(1)).toBe(false);

    // Advance another 500ms -> should refill 1.5 tokens
    jest.setSystemTime(new Date(1000000001000));
    expect(bucket.consume(1)).toBe(true);
  });

  it('does not exceed capacity when refilling', () => {
    const bucket = new TokenBucket(5, 5, 1000);

    // Advance 10 seconds
    jest.setSystemTime(new Date(1000000010000));

    expect(bucket.getTokens()).toBe(5); // should be capped at 5
  });

  it('can consume multiple tokens at once', () => {
    const bucket = new TokenBucket(10, 10, 1000);

    expect(bucket.consume(5)).toBe(true);
    expect(bucket.getTokens()).toBe(5);
    expect(bucket.consume(6)).toBe(false); // only 5 left
  });
});
