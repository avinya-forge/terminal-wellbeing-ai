import { handleBreatheCommand } from './breathe';

describe('handleBreatheCommand', () => {
  it('returns the breathing exercise instructions', async () => {
    const result = await handleBreatheCommand();
    expect(result).toContain("Let's practice the 4-7-8 breathing technique");
    expect(result).toContain('1. Close your mouth');
    expect(result).toContain('2. Hold your breath');
    expect(result).toContain('3. Exhale completely');
  });
});
