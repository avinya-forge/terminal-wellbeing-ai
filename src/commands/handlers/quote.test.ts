import { handleQuoteCommand } from './quote';

describe('handleQuoteCommand', () => {
  it('should return a string', async () => {
    const response = await handleQuoteCommand();
    expect(typeof response).toBe('string');
  });

  it('should contain a quote and an author', async () => {
    const response = await handleQuoteCommand();
    // Quote is in double quotes, followed by newlines and em-dash or similar and author
    expect(response).toMatch(/"[^"]+"\n\n— .+/);
  });
});
