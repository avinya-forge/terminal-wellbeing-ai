// Mock localStorage before importing sessionManager
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import {
  updateSession,
  getProfileSummary,
  startSession,
  clearProfile,
  resetSession,
  setPrivacyMode,
  getPrivacyMode,
  togglePrivacy,
  exportSessionData
} from './sessionManager';
import { Message } from '../types/Message';

describe('Session Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    clearProfile();
    resetSession();
    startSession();
    setPrivacyMode(false);
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
    expect(summary).toContain('Recent topics: work');
    // "New user" might not appear if message count logic changed or threshold met differently
    // Actually, one message = count 1 < 5, so "This is a new user" should appear.
    expect(summary).toContain('This is a new user');
  });

  it('identifies distress correctly', () => {
    updateSession(createMessage('I am so depressed and hopeless'));
    updateSession(createMessage('Everything is terrible'));

    const summary = getProfileSummary();
    expect(summary).toContain('User seems distressed recently');
  });

  it('tracks frequent user status', () => {
    for (let i = 0; i < 25; i++) {
      updateSession(createMessage('Just chatting'));
    }
    const summary = getProfileSummary();
    expect(summary).toContain('This is a long-term user');
  });

  it('persists profile across sessions', () => {
    updateSession(createMessage('I love my family'));

    // Simulate new session/reload
    // Note: Since 'currentProfile' is a module-level variable in sessionManager.ts,
    // we can't easily "unload" the module to test re-initialization from localStorage
    // without using jest.resetModules() or similar.
    // However, we can verify that localStorage HAS the data.

    const stored = localStorage.getItem('wellbeing_user_profile');
    expect(stored).not.toBeNull();
    if (stored) {
        const profile = JSON.parse(stored);
        expect(profile.topics.family).toBeGreaterThan(0);
    }
  });

  describe('Privacy Mode', () => {
    it('toggles privacy mode', () => {
      // Ensure we start clean
      setPrivacyMode(false);
      expect(getPrivacyMode()).toBe(false);

      const newState = togglePrivacy();
      expect(newState).toBe(true);
      expect(getPrivacyMode()).toBe(true);

      const nextState = togglePrivacy();
      expect(nextState).toBe(false);
      expect(getPrivacyMode()).toBe(false);
    });

    it('clears localStorage when privacy mode is enabled', () => {
      updateSession(createMessage('Remember me'));
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();

      setPrivacyMode(true);
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('does not save to localStorage while privacy mode is enabled', () => {
      setPrivacyMode(true);
      updateSession(createMessage('Secret message'));
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('restores saving when privacy mode is disabled', () => {
      setPrivacyMode(true);
      updateSession(createMessage('Secret message'));

      setPrivacyMode(false);
      updateSession(createMessage('Public message'));
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();
    });
  });

  describe('Data Export', () => {
    it('exports session data as JSON string', () => {
      updateSession(createMessage('I like apples')); // "like" is positive
      const json = exportSessionData();

      const data = JSON.parse(json);
      expect(data.profile).toBeDefined();
      expect(data.currentSession).toBeDefined();
      expect(data.generatedAt).toBeDefined();
      expect(data.profile.sentimentTrend.length).toBeGreaterThan(0);
    });
  });
});
