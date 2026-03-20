import { journalService } from './JournalService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(7)
  }
});

describe('JournalService', () => {
  beforeEach(() => {
    localStorage.clear();
    journalService.clearNotes();
    journalService.setPrivacyMode(false);
  });

  test('should add a note', () => {
    const note = journalService.addNote('Test note');
    expect(note.content).toBe('Test note');
    expect(journalService.getNotes()).toHaveLength(1);
    expect(journalService.getEntryCount()).toBe(1);
  });

  test('should persist notes to localStorage', () => {
    journalService.addNote('Persistent note');
    const stored = JSON.parse(localStorage.getItem('wellbeing_journal') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].content).toBe('Persistent note');
  });

  test('should delete a note', () => {
    const note = journalService.addNote('To be deleted');
    const result = journalService.deleteNote(note.id);
    expect(result).toBe(true);
    expect(journalService.getNotes()).toHaveLength(0);
  });

  test('should handle privacy mode', () => {
    journalService.addNote('Public note');
    expect(localStorage.getItem('wellbeing_journal')).not.toBeNull();

    journalService.setPrivacyMode(true);
    expect(localStorage.getItem('wellbeing_journal')).toBeNull(); // Cleared from storage

    journalService.addNote('Private note');
    expect(journalService.getNotes()).toHaveLength(2); // In memory
    expect(localStorage.getItem('wellbeing_journal')).toBeNull(); // Still not stored
  });

  test('should not load or save entries when localStorage is missing', async () => {
    // Hide localStorage
    const originalLocalStorage = global.localStorage;
    Object.defineProperty(global, 'localStorage', {
      value: undefined,
      configurable: true
    });

    // Create a new instance so it checks getStorage()
    // It should load empty notes
    const { JournalService } = await import('./JournalService');
    const instance = new JournalService();

    expect(instance.getNotes()).toHaveLength(0);

    // Add note shouldn't throw error
    instance.addNote('Test note');

    expect(instance.getNotes()).toHaveLength(1);

    // Restore localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      configurable: true
    });
  });

  test('should handle JSON parse errors gracefully when loading', async () => {
    localStorage.setItem('wellbeing_journal', 'invalid-json');

    const { JournalService } = await import('./JournalService');
    const instance = new JournalService();

    expect(instance.getNotes()).toHaveLength(0);
  });

  test('should handle save error', async () => {
    // Mock setItem to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => { throw new Error('Quota Exceeded'); });

    const { JournalService } = await import('./JournalService');
    const instance = new JournalService();

    // This shouldn't throw an unhandled error
    instance.addNote('Test note');

    // Restore
    localStorage.setItem = originalSetItem;
  });

  test('should not delete note if id is not found', () => {
    journalService.clearNotes();
    journalService.addNote('Note 1');
    const result = journalService.deleteNote('invalid-id');
    expect(result).toBe(false);
    expect(journalService.getNotes()).toHaveLength(1);
  });

  test('should not load entries when privacy mode is enabled', async () => {
    jest.resetModules();

    const { JournalService } = await import('./JournalService');
    class TestJournalService extends JournalService {
      constructor() {
        super();
        this.setPrivacyMode(true);
        // Force a reload
        this['entries'] = this['loadEntries']();
      }
    }

    const instance = new TestJournalService();
    expect(instance.getNotes()).toHaveLength(0);
  });

  test('should fallback to Date.now() for id if crypto is not available', async () => {
    // Hide crypto
    const originalCrypto = global.crypto;
    Object.defineProperty(global, 'crypto', {
      value: undefined,
      configurable: true
    });

    const { JournalService } = await import('./JournalService');
    const instance = new JournalService();

    const note = instance.addNote('Test note');
    expect(note.id).toBeDefined();
    expect(typeof note.id).toBe('string');

    // Restore crypto
    Object.defineProperty(global, 'crypto', {
      value: originalCrypto,
      configurable: true
    });
  });
});
