import {
  updateSession,
  getProfileSummary,
  startSession,
  clearProfile,
  resetSession
} from './sessionManager';
import { Message } from '../types/Message';

describe('Session Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    clearProfile();
    resetSession();
    startSession();
  });

  const createMessage = (content: string, sender: 'user' | 'bot' = 'user'): Message => ({
    id: '1',
    content,
    sender,
    timestamp: new Date().toISOString()
  });

  it('initializes session correctly', () => {
    const session = startSession();
    expect(session.profile).toBeDefined();
    expect(session.messages).toBe(0);
    expect(session.currentMood).toBe('Neutral');
  });

  it('updates session and profile on user message', () => {
    const msg = createMessage('I am feeling happy about work');
    updateSession(msg);

    const summary = getProfileSummary();
    expect(summary).toContain('Mood: Positive');
    expect(summary).toContain('Interested in: work');
    expect(summary).toContain('New user');
  });

  it('identifies distress correctly', () => {
    updateSession(createMessage('I am so depressed and hopeless'));
    updateSession(createMessage('Everything is terrible'));

    const summary = getProfileSummary();
    expect(summary).toContain('Seems distressed');
  });

  it('tracks frequent user status', () => {
    for (let i = 0; i < 15; i++) {
      updateSession(createMessage('Just chatting'));
    }
    const summary = getProfileSummary();
    expect(summary).toContain('Frequent user');
  });

  it('persists profile across sessions', () => {
    updateSession(createMessage('I love my family'));

    // Simulate new session/reload
    resetSession();
    startSession(); // Should reload profile from localStorage

    const summary = getProfileSummary();
    // Profile (topics) should persist
    expect(summary).toContain('family');
  });
});
