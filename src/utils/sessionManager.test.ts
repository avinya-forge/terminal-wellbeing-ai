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
  beforeEach(async () => {
    jest.useFakeTimers();
    localStorage.clear();
    clearProfile();
    resetSession();
    startSession();
    await setPrivacyMode(false);
  });

  afterEach(() => {
    jest.useRealTimers();
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
    expect(summary).toContain('Recent topics: work');
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

  it('persists profile across sessions with debounce', () => {
    // Initial state (saved by beforeEach)
    const initialStored = localStorage.getItem('wellbeing_user_profile');
    expect(initialStored).not.toBeNull();

    // Update session
    updateSession(createMessage('I love my family'));

    // Should not be saved immediately (content should be same as initial or at least not have the new data)
    // Note: Since localStorage is mocked simply, we just check that the new topic isn't persisted yet
    const immediateStored = localStorage.getItem('wellbeing_user_profile');
    expect(immediateStored).toBe(initialStored);

    // Advance timers to trigger save
    jest.advanceTimersByTime(1000);

    // Now it should be updated
    const finalStored = localStorage.getItem('wellbeing_user_profile');
    expect(finalStored).not.toBe(initialStored);

    if (finalStored) {
        const profile = JSON.parse(finalStored);
        expect(profile.topics.family).toBeGreaterThan(0);
    }
  });

  describe('Privacy Mode', () => {
    it('toggles privacy mode', async () => {
      // Ensure we start clean
      await setPrivacyMode(false);
      expect(getPrivacyMode()).toBe(false);

      const newState = await togglePrivacy();
      expect(newState).toBe(true);
      expect(getPrivacyMode()).toBe(true);

      const nextState = await togglePrivacy();
      expect(nextState).toBe(false);
      expect(getPrivacyMode()).toBe(false);
    });

    it('clears localStorage when privacy mode is enabled', async () => {
      updateSession(createMessage('Remember me'));
      jest.advanceTimersByTime(1000);
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();

      await setPrivacyMode(true);
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('does not save to localStorage while privacy mode is enabled', async () => {
      await setPrivacyMode(true);
      updateSession(createMessage('Secret message'));
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('restores saving when privacy mode is disabled', async () => {
      await setPrivacyMode(true);
      updateSession(createMessage('Secret message'));

      await setPrivacyMode(false);
      updateSession(createMessage('Public message'));
      jest.advanceTimersByTime(1000);
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();
    });
  });

  describe('Data Export', () => {
    it('exports session data as JSON string', () => {
      updateSession(createMessage('I like apples'));
      const json = exportSessionData();

      const data = JSON.parse(json);
      expect(data.profile).toBeDefined();
      expect(data.currentSession).toBeDefined();
      expect(data.generatedAt).toBeDefined();
      expect(data.profile.sentimentTrend.length).toBeGreaterThan(0);
    });
  });
});
