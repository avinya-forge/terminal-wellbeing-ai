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
  exportSessionData,
  getUserProfile,
  updateUserProfile
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

    // Run timers to allow debounced save
    jest.advanceTimersByTime(2000);

    const summary = getProfileSummary();
    expect(summary).toContain('Recent topics: work');
    expect(summary).toContain('This is a new user');
  });

  it('identifies distress correctly', () => {
    updateSession(createMessage('I am so depressed and hopeless'));
    updateSession(createMessage('Everything is terrible'));

    // Run timers to allow debounced save
    jest.advanceTimersByTime(2000);

    const summary = getProfileSummary();
    expect(summary).toContain('User seems distressed recently');
  });

  it('tracks frequent user status', () => {
    for (let i = 0; i < 25; i++) {
      updateSession(createMessage('Just chatting'));
    }

    // Run timers to allow debounced save
    jest.advanceTimersByTime(2000);

    const summary = getProfileSummary();
    expect(summary).toContain('This is a long-term user');
  });

  it('persists profile across sessions', () => {
    updateSession(createMessage('I love my family'));

    // Run timers to allow debounced save
    jest.advanceTimersByTime(2000);

    const stored = localStorage.getItem('wellbeing_user_profile');
    expect(stored).not.toBeNull();
    if (stored) {
        const profile = JSON.parse(stored);
        expect(profile.topics.family).toBeGreaterThan(0);
    }
  });

  it('debounces profile saves during session updates', () => {
    const spy = jest.spyOn(localStorage, 'setItem');

    // Send multiple messages quickly
    updateSession(createMessage('Message 1'));
    updateSession(createMessage('Message 2'));
    updateSession(createMessage('Message 3'));

    // Should not have saved yet (debounce is 1000ms)
    expect(spy).not.toHaveBeenCalled();

    // Fast forward
    jest.advanceTimersByTime(1100);

    // Should have saved ONCE
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it('saves immediately when updating user profile settings', () => {
    const spy = jest.spyOn(localStorage, 'setItem');

    updateUserProfile({ userName: 'Test User' });

    // Should save immediately
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it('updates and persists speed preference', () => {
    const current = getUserProfile();
    updateUserProfile({
        preferences: {
            ...current.preferences,
            speed: 'fast'
        }
    });

    const profile = getUserProfile();
    expect(profile.preferences.speed).toBe('fast');

    const stored = localStorage.getItem('wellbeing_user_profile');
    const storedProfile = JSON.parse(stored!);
    expect(storedProfile.preferences.speed).toBe('fast');
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
      jest.advanceTimersByTime(2000);
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();

      await setPrivacyMode(true);
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('does not save to localStorage while privacy mode is enabled', async () => {
      await setPrivacyMode(true);
      updateSession(createMessage('Secret message'));
      jest.advanceTimersByTime(2000);
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });

    it('restores saving when privacy mode is disabled', async () => {
      await setPrivacyMode(true);
      updateSession(createMessage('Secret message'));
      jest.advanceTimersByTime(2000);

      await setPrivacyMode(false);
      updateSession(createMessage('Public message'));
      jest.advanceTimersByTime(2000);
      expect(localStorage.getItem('wellbeing_user_profile')).not.toBeNull();
    });
  });

  describe('Data Export', () => {
    it('exports session data as JSON string', () => {
      updateSession(createMessage('I like apples'));
      jest.advanceTimersByTime(2000);
      const json = exportSessionData();

      const data = JSON.parse(json);
      expect(data.profile).toBeDefined();
      expect(data.currentSession).toBeDefined();
      expect(data.generatedAt).toBeDefined();
      expect(data.profile.sentimentTrend.length).toBeGreaterThan(0);
    });
  });
});
