import { JournalService } from '../JournalService';
import { logger } from '../LoggerService';

jest.mock('../LoggerService', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('JournalService', () => {
  let journalService: JournalService;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup a clean mock for localStorage
    const mockStorage: { [key: string]: string } = {};
    const localStorageMock = {
      getItem: jest.fn((key: string) => mockStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(() => {
        for (const key in mockStorage) {
          delete mockStorage[key];
        }
      }),
      length: 0,
      key: jest.fn(),
    };

    originalLocalStorage = global.localStorage;
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  describe('Initialization and loadEntries', () => {
    it('should initialize with empty array if storage is empty', () => {
      journalService = new JournalService();
      expect(journalService.getNotes()).toEqual([]);
    });

    it('should load entries from storage if available', () => {
      const mockEntries = [{ id: '1', content: 'test', timestamp: new Date().toISOString() }];
      global.localStorage.setItem('wellbeing_journal', JSON.stringify(mockEntries));

      journalService = new JournalService();
      expect(journalService.getNotes()).toEqual(mockEntries);
    });

    it('should handle malformed JSON in storage and log error', () => {
      global.localStorage.setItem('wellbeing_journal', 'invalid json');

      journalService = new JournalService();
      expect(logger.error).toHaveBeenCalledWith('Failed to load journal entries:', expect.any(Error));
      expect(journalService.getNotes()).toEqual([]);
    });

    it('should return empty array if getStorage returns null (e.g. no localStorage)', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
      });

      journalService = new JournalService();
      expect(journalService.getNotes()).toEqual([]);
    });
  });

  describe('addNote', () => {
    beforeEach(() => {
      journalService = new JournalService();
    });

    it('should add a new note, generate UUID, and save to storage', () => {
      const originalCrypto = global.crypto;
      Object.defineProperty(global, 'crypto', {
        value: {
          randomUUID: jest.fn().mockReturnValue('mock-uuid-123'),
        },
        writable: true,
      });

      const newEntry = journalService.addNote('Hello World', 0.8);

      expect(newEntry.id).toBe('mock-uuid-123');
      expect(newEntry.content).toBe('Hello World');
      expect(newEntry.sentimentScore).toBe(0.8);
      expect(newEntry.timestamp).toBeDefined();

      const notes = journalService.getNotes();
      expect(notes.length).toBe(1);
      expect(notes[0]).toEqual(newEntry);

      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'wellbeing_journal',
        expect.any(String)
      );

      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    });

    it('should fallback to Date.now() if crypto.randomUUID is not available', () => {
      const originalCrypto = global.crypto;
      Object.defineProperty(global, 'crypto', {
        value: undefined,
        writable: true,
      });

      const newEntry = journalService.addNote('Fallback ID');
      expect(newEntry.id).toBeDefined();
      expect(typeof newEntry.id).toBe('string');
      expect(newEntry.id.length).toBeGreaterThan(0);

      Object.defineProperty(global, 'crypto', {
        value: originalCrypto,
        writable: true,
      });
    });
  });

  describe('getNotes', () => {
    it('should return all entries', () => {
      journalService = new JournalService();
      journalService.addNote('First note');
      journalService.addNote('Second note');

      const notes = journalService.getNotes();
      expect(notes.length).toBe(2);
      expect(notes[0].content).toBe('Second note'); // unshifted
      expect(notes[1].content).toBe('First note');
    });
  });

  describe('getEntryCount', () => {
    it('should return the correct count of entries', () => {
      journalService = new JournalService();
      expect(journalService.getEntryCount()).toBe(0);

      journalService.addNote('One note');
      expect(journalService.getEntryCount()).toBe(1);

      journalService.addNote('Two notes');
      expect(journalService.getEntryCount()).toBe(2);
    });
  });

  describe('deleteNote', () => {
    beforeEach(() => {
      journalService = new JournalService();
    });

    it('should delete an existing note by id and return true', () => {
      const note = journalService.addNote('To be deleted');
      expect(journalService.getEntryCount()).toBe(1);

      const result = journalService.deleteNote(note.id);

      expect(result).toBe(true);
      expect(journalService.getEntryCount()).toBe(0);
      expect(global.localStorage.setItem).toHaveBeenCalledTimes(2); // 1 for add, 1 for delete
    });

    it('should return false if note to delete does not exist', () => {
      journalService.addNote('Keep me');
      const initialCallCount = (global.localStorage.setItem as jest.Mock).mock.calls.length;

      const result = journalService.deleteNote('non-existent-id');

      expect(result).toBe(false);
      expect(journalService.getEntryCount()).toBe(1);
      // setItem shouldn't be called again
      expect(global.localStorage.setItem).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('clearNotes', () => {
    it('should empty the entries array and save state', () => {
      journalService = new JournalService();
      journalService.addNote('Note 1');
      journalService.addNote('Note 2');

      expect(journalService.getEntryCount()).toBe(2);

      journalService.clearNotes();

      expect(journalService.getEntryCount()).toBe(0);
      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'wellbeing_journal',
        JSON.stringify([])
      );
    });
  });

  describe('setPrivacyMode', () => {
    beforeEach(() => {
      journalService = new JournalService();
      journalService.addNote('Some note');
    });

    it('should clear storage when privacy mode is enabled', () => {
      journalService.setPrivacyMode(true);

      expect(global.localStorage.removeItem).toHaveBeenCalledWith('wellbeing_journal');

      // Creating a new instance should now load empty array since privacy mode isn't persisted
      // globally across instances but in the current instance context it would not save to storage anymore.
      // However, if we instantiate a NEW one while storage was cleared:
      const newService = new JournalService();
      expect(newService.getNotes()).toEqual([]);
    });

    it('should not load from storage if privacy mode is true', () => {
        // Since privacyMode is instance-level and set on the singleton typically, we can test it
        // by making a new service, setting privacy, and then manually triggering a load if we could.
        // Actually we can test `addNote` when privacy is on.
        journalService.setPrivacyMode(true);
        journalService.addNote('Private note');

        expect(global.localStorage.removeItem).toHaveBeenCalledWith('wellbeing_journal');
        // setItem shouldn't be called after privacy mode is enabled
        expect(global.localStorage.setItem).not.toHaveBeenCalledWith(
          'wellbeing_journal',
          expect.stringContaining('Private note')
        );
    });

    it('should save current state when privacy mode is disabled', () => {
      journalService.setPrivacyMode(true); // enabled
      (global.localStorage.setItem as jest.Mock).mockClear();

      journalService.setPrivacyMode(false); // disabled

      expect(global.localStorage.setItem).toHaveBeenCalledWith(
        'wellbeing_journal',
        expect.any(String)
      );
    });
  });

  describe('saveEntries', () => {
    it('should handle storage.setItem errors and log them', () => {
      journalService = new JournalService();

      (global.localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Quota exceeded');
      });

      journalService.addNote('Note to trigger save');

      expect(logger.error).toHaveBeenCalledWith('Failed to save journal entries:', expect.any(Error));
    });

    it('should safely exit saveEntries if getStorage returns null', () => {
      journalService = new JournalService();

      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
      });

      // Adding note calls saveEntries
      expect(() => {
        journalService.addNote('Test note');
      }).not.toThrow();
    });
  });
});
