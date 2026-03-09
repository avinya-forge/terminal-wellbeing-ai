import {
  startSession,
  updateSession,
  getProfileSummary,
  resetSession,
  clearProfile,
  setPrivacyMode,
  getPrivacyMode,
  togglePrivacy,
  updateUserProfile,
  getUserProfile,
  exportSessionData,
  exportProfileData,
  exportSessionMarkdown
} from './sessionManager';
import { journalService } from '../services/JournalService';
import { analyzeText } from './analysis';
import { MOODS } from '../constants/moods';

jest.mock('../services/JournalService');
jest.mock('../services/MemoryService');
jest.mock('./analysis');
jest.mock('../services/LoggerService');

describe('sessionManager', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    resetSession();
    clearProfile();
    jest.useRealTimers(); // Make sure timers are reset
    // Default analysis mock
    (analyzeText as jest.Mock).mockReturnValue({
      sentiment: 0,
      mood: MOODS.NEUTRAL,
      topics: ['general']
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('profile loading and saving', () => {
    it('should handle JSON parse error during loadProfile gracefully', async () => {
      localStorage.setItem('wellbeing_user_profile', 'invalid-json');

      // Force a reload by resetting the module
      jest.resetModules();
      const loggerMock = jest.requireMock('../services/LoggerService');
      const sm = await import('./sessionManager');

      const profile = sm.getUserProfile();
      expect(profile.messageCount).toBe(0);
      expect(loggerMock.logger.error).toHaveBeenCalledWith('Failed to load user profile', expect.any(Error));
    });

    it('should handle localStorage.setItem error during saveProfile gracefully', async () => {
      const setItemMock = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      jest.resetModules();
      const loggerMock = jest.requireMock('../services/LoggerService');
      const sm = await import('./sessionManager');

      sm.updateUserProfile({ userName: 'Test' });

      sm.clearProfile();

      expect(loggerMock.logger.error).toHaveBeenCalledWith('Failed to save user profile', expect.any(Error));
      setItemMock.mockRestore();
    });
  });

  describe('updateSession', () => {
    it('should keep sentimentTrend at max length 5', () => {
      startSession();
      for (let i = 0; i < 6; i++) {
        (analyzeText as jest.Mock).mockReturnValueOnce({
          sentiment: i,
          mood: MOODS.NEUTRAL,
          topics: ['test']
        });
        updateSession({ id: `msg_${i}`, content: `test ${i}`, sender: 'user', timestamp: new Date().toISOString() });
      }

      const profile = getUserProfile();
      expect(profile.sentimentTrend.length).toBe(5);
      expect(profile.sentimentTrend).toEqual([1, 2, 3, 4, 5]);
    });

    it('should ignore non-user messages', () => {
      startSession();
      updateSession({ id: 'msg_1', content: 'test', sender: 'bot', timestamp: new Date().toISOString() });
      const profile = getUserProfile();
      expect(profile.messageCount).toBe(0);
    });
  });

  describe('getProfileSummary', () => {
    it('should return privacy mode string if privacy mode is active', async () => {
      await setPrivacyMode(true);
      const summary = getProfileSummary();
      expect(summary).toContain('Privacy Mode Active');
    });

    it('should build summary correctly for highly distressed user', () => {
      updateUserProfile({ userName: 'Alice' });
      for (let i = 0; i < 5; i++) {
        (analyzeText as jest.Mock).mockReturnValueOnce({
          sentiment: -0.8,
          mood: MOODS.DEPRESSED,
          topics: ['stress']
        });
        updateSession({ id: `msg_${i}`, content: 'bad', sender: 'user', timestamp: new Date().toISOString() });
      }

      const summary = getProfileSummary();
      expect(summary).toContain("User's name is Alice");
      expect(summary).toContain('distressed recently');
      expect(summary).toContain('stress');
    });

    it('should build summary correctly for high spirits user', () => {
      for (let i = 0; i < 5; i++) {
        (analyzeText as jest.Mock).mockReturnValueOnce({
          sentiment: 0.8,
          mood: MOODS.POSITIVE,
          topics: ['joy']
        });
        updateSession({ id: `msg_${i}`, content: 'good', sender: 'user', timestamp: new Date().toISOString() });
      }

      const summary = getProfileSummary();
      expect(summary).toContain('good spirits');
    });

    it('should identify long term users', () => {
      updateUserProfile({ messageCount: 25 });
      const summary = getProfileSummary();
      expect(summary).toContain('long-term user');
    });

    it('should identify new users', () => {
      clearProfile();
      startSession(); // msg count 0
      const summary = getProfileSummary();
      expect(summary).toContain('new user');
    });
  });

  describe('privacy mode', () => {
    it('should toggle privacy mode and remove data', async () => {
      localStorage.setItem('terminal_messages', '[]');
      const newState = await togglePrivacy();
      expect(newState).toBe(true);
      expect(getPrivacyMode()).toBe(true);
      expect(localStorage.getItem('terminal_messages')).toBeNull();
      expect(localStorage.getItem('wellbeing_user_profile')).toBeNull();
    });
  });

  describe('exports', () => {
    it('should exportSessionData correctly', () => {
      (journalService.getNotes as jest.Mock).mockReturnValue([{ id: '1', content: 'note', timestamp: '2023' }]);
      startSession();
      const exported = exportSessionData();
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('generatedAt');
      expect(parsed).toHaveProperty('profile');
      expect(parsed).toHaveProperty('currentSession');
      expect(parsed).toHaveProperty('journal');
    });

    it('should exportProfileData correctly', () => {
      const exported = exportProfileData();
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('generatedAt');
      expect(parsed).toHaveProperty('profile');
    });

    it('should exportSessionMarkdown correctly', () => {
      (journalService.getNotes as jest.Mock).mockReturnValue([{ id: '1', content: 'my note', timestamp: '2023' }]);
      startSession();
      const md = exportSessionMarkdown();
      expect(md).toContain('# Wellbeing Session Export');
      expect(md).toContain('## Profile Summary');
      expect(md).toContain('## Current Session');
      expect(md).toContain('## Journal Notes');
      expect(md).toContain('my note');
    });

    it('should exportSessionMarkdown correctly without active session', () => {
      (journalService.getNotes as jest.Mock).mockReturnValue([]);
      resetSession();
      const md = exportSessionMarkdown();
      expect(md).toContain('# Wellbeing Session Export');
      expect(md).not.toContain('## Current Session');
      expect(md).not.toContain('## Journal Notes');
    });
  });
});
