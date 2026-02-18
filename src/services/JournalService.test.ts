import { journalService } from './JournalService';
import { JournalEntry } from '../types/Journal';

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
});
