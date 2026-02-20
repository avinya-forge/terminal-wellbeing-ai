import { CircuitBreaker, CircuitBreakerState, CircuitBreakerOpenError } from './CircuitBreaker';

describe('CircuitBreaker', () => {
  const config = {
    failureThreshold: 3,
    resetTimeout: 100 // 100ms
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start in CLOSED state', () => {
    const cb = new CircuitBreaker(config);
    expect(cb.getState()).toBe(CircuitBreakerState.CLOSED);
  });

  it('should transition to OPEN state after failure threshold is reached', async () => {
    const cb = new CircuitBreaker(config);
    const failingAction = async () => { throw new Error('Failed'); };

    for (let i = 0; i < config.failureThreshold; i++) {
        try {
            await cb.execute(failingAction);
        } catch (e) {
            // Ignore error
        }
    }

    expect(cb.getState()).toBe(CircuitBreakerState.OPEN);
  });

  it('should throw CircuitBreakerOpenError when OPEN', async () => {
    const cb = new CircuitBreaker(config);
    const failingAction = async () => { throw new Error('Failed'); };
    for (let i = 0; i < config.failureThreshold; i++) {
        try {
            await cb.execute(failingAction);
        } catch (e) {
             // Ignore error
        }
    }

    await expect(cb.execute(async () => 'Success')).rejects.toThrow(CircuitBreakerOpenError);
  });

  it('should transition to HALF_OPEN and then CLOSED after timeout and success', async () => {
    const cb = new CircuitBreaker(config);
    const failingAction = async () => { throw new Error('Failed'); };

    for (let i = 0; i < config.failureThreshold; i++) {
        try {
            await cb.execute(failingAction);
        } catch (e) {
             // Ignore error
        }
    }

    expect(cb.getState()).toBe(CircuitBreakerState.OPEN);

    // Fast-forward time
    jest.advanceTimersByTime(config.resetTimeout + 50);

    const successAction = async () => 'Success';
    const result = await cb.execute(successAction);

    expect(result).toBe('Success');
    expect(cb.getState()).toBe(CircuitBreakerState.CLOSED);
  });

    it('should transition back to OPEN if failure occurs after timeout (HALF_OPEN)', async () => {
    const cb = new CircuitBreaker(config);
    const failingAction = async () => { throw new Error('Failed'); };

    for (let i = 0; i < config.failureThreshold; i++) {
        try {
            await cb.execute(failingAction);
        } catch (e) {
             // Ignore error
        }
    }

    expect(cb.getState()).toBe(CircuitBreakerState.OPEN);

    // Fast-forward time
    jest.advanceTimersByTime(config.resetTimeout + 50);

    // Next execution fails
    try {
        await cb.execute(failingAction);
    } catch (e) {
         // Ignore error
    }

    expect(cb.getState()).toBe(CircuitBreakerState.OPEN);
  });
});
