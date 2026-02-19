import { handleStatsCommand } from './stats';
import { Message } from '../../types/Message';

jest.mock('../../utils/analysis', () => ({
  analyzeSentiment: jest.fn().mockReturnValue(0.5),
  calculateMoodTrend: jest.fn().mockReturnValue('[+]'),
  extractTopics: jest.fn().mockReturnValue(['test-topic']),
}));

describe('handleStatsCommand', () => {
  const messages: Message[] = [
    {
      id: '1',
      content: 'Hello',
      sender: 'user',
      timestamp: new Date('2023-01-01T10:00:00Z').toISOString()
    },
    {
      id: '2',
      content: 'Hi there',
      sender: 'bot',
      timestamp: new Date('2023-01-01T10:01:00Z').toISOString()
    },
    {
      id: '3',
      content: 'I am happy',
      sender: 'user',
      timestamp: new Date('2023-01-01T10:02:00Z').toISOString()
    }
  ];

  it('calculates stats correctly', async () => {
    const result = await handleStatsCommand({ command: 'stats', args: [] }, messages);

    // Duration: 10:02 - 10:00 = 2 mins
    expect(result).toContain('Duration: 2 minutes');

    // Messages
    expect(result).toContain('Messages: 3 (2 You, 1 AI)');

    // Mood Trend
    expect(result).toContain('Mood Trend: [+]');

    // Topics
    expect(result).toContain('Top Topics:');
  });

  it('handles empty session', async () => {
    const result = await handleStatsCommand({ command: 'stats', args: [] }, []);
    expect(result).toContain('Not enough data');
  });
});
