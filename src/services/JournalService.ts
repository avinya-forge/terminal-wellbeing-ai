import { JournalEntry, JournalEntries } from '../types/Journal';
import { logger } from './LoggerService';

const JOURNAL_STORAGE_KEY = 'wellbeing_journal';

export class JournalService {
  private entries: JournalEntries = [];
  private privacyMode: boolean = false;

  constructor() {
    this.entries = this.loadEntries();
  }

  private getStorage(): Storage | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    return null;
  }

  private loadEntries(): JournalEntries {
    if (this.privacyMode) return [];
    const storage = this.getStorage();
    if (!storage) return [];

    try {
      const stored = storage.getItem(JOURNAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error('Failed to load journal entries:', error);
      return [];
    }
  }

  private saveEntries(): void {
    const storage = this.getStorage();
    if (!storage) return;

    if (this.privacyMode) {
      storage.removeItem(JOURNAL_STORAGE_KEY);
      return;
    }
    try {
      storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(this.entries));
    } catch (error) {
      logger.error('Failed to save journal entries:', error);
    }
  }

  public setPrivacyMode(enabled: boolean): void {
    this.privacyMode = enabled;
    if (enabled) {
      // Clear storage when privacy mode is enabled
      this.saveEntries();
    } else {
      // Save current memory state when privacy mode is disabled
      this.saveEntries();
    }
  }

  public addNote(content: string, sentimentScore?: number): JournalEntry {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random().toString(36).substring(2);

    const newEntry: JournalEntry = {
      id,
      content,
      timestamp: new Date().toISOString(),
      sentimentScore
    };

    this.entries.unshift(newEntry);
    this.saveEntries();
    return newEntry;
  }

  public getNotes(): JournalEntries {
    return this.entries;
  }

  public deleteNote(id: string): boolean {
    const initialLength = this.entries.length;
    this.entries = this.entries.filter(entry => entry.id !== id);
    if (this.entries.length !== initialLength) {
      this.saveEntries();
      return true;
    }
    return false;
  }

  public clearNotes(): void {
    this.entries = [];
    this.saveEntries();
  }

  public getEntryCount(): number {
    return this.entries.length;
  }
}

export const journalService = new JournalService();
