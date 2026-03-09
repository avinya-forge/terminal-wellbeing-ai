import {
  handleNoteCommand,
  handleListNotesCommand,
  handleDeleteNoteCommand,
  handleClearNotesCommand
} from '../notes';
import { journalService } from '../../../services/JournalService';
import { analyzeSentiment } from '../../../utils/analysis';

jest.mock('../../../services/JournalService', () => ({
  journalService: {
    addNote: jest.fn(),
    getNotes: jest.fn(),
    deleteNote: jest.fn(),
    getEntryCount: jest.fn(),
    clearNotes: jest.fn(),
  }
}));

jest.mock('../../../utils/analysis', () => ({
  analyzeSentiment: jest.fn()
}));

describe('notes handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleNoteCommand', () => {
    it('should return error message if no content provided', async () => {
      const parsed = { command: 'note', args: [], originalInput: '/note' };
      const response = await handleNoteCommand(parsed);
      expect(response).toContain('Please provide content');
      expect(journalService.addNote).not.toHaveBeenCalled();
    });

    it('should save note and return success message', async () => {
      const parsed = { command: 'note', args: ['hello', 'world'], originalInput: '/note hello world' };
      (analyzeSentiment as jest.Mock).mockReturnValue({ score: 0.5 });
      (journalService.addNote as jest.Mock).mockReturnValue({ id: '1234567890', content: 'hello world', timestamp: Date.now() });

      const response = await handleNoteCommand(parsed);

      expect(analyzeSentiment).toHaveBeenCalledWith('hello world');
      expect(journalService.addNote).toHaveBeenCalledWith('hello world', { score: 0.5 });
      expect(response).toContain('Note saved successfully');
      expect(response).toContain('12345678');
    });
  });

  describe('handleListNotesCommand', () => {
    it('should return empty message if no notes', async () => {
      (journalService.getNotes as jest.Mock).mockReturnValue([]);
      const response = await handleListNotesCommand();
      expect(response).toContain('You have no saved notes');
    });

    it('should return formatted list of notes', async () => {
      const notes = [
        { id: '1234567890', content: 'note 1', timestamp: new Date('2023-01-01').toISOString() },
        { id: '0987654321', content: 'note 2', timestamp: new Date('2023-01-02').toISOString() }
      ];
      (journalService.getNotes as jest.Mock).mockReturnValue(notes);

      const response = await handleListNotesCommand();

      expect(response).toContain('Your Personal Notes (2):');
      expect(response).toContain('12345678');
      expect(response).toContain('note 1');
      expect(response).toContain('09876543');
      expect(response).toContain('note 2');
    });
  });

  describe('handleDeleteNoteCommand', () => {
    it('should return error message if no ID provided', async () => {
      const parsed = { command: 'delete-note', args: [], originalInput: '/delete-note' };
      const response = await handleDeleteNoteCommand(parsed);
      expect(response).toContain('Please provide the ID');
      expect(journalService.deleteNote).not.toHaveBeenCalled();
    });

    it('should return error message if note not found', async () => {
      const parsed = { command: 'delete-note', args: ['123'], originalInput: '/delete-note 123' };
      (journalService.getNotes as jest.Mock).mockReturnValue([
        { id: '4567890', content: 'note 1', timestamp: Date.now() }
      ]);

      const response = await handleDeleteNoteCommand(parsed);
      expect(response).toContain('No note found');
      expect(journalService.deleteNote).not.toHaveBeenCalled();
    });

    it('should return success message if note deleted', async () => {
      const parsed = { command: 'delete-note', args: ['123'], originalInput: '/delete-note 123' };
      (journalService.getNotes as jest.Mock).mockReturnValue([
        { id: '1234567890', content: 'note 1', timestamp: Date.now() }
      ]);
      (journalService.deleteNote as jest.Mock).mockReturnValue(true);

      const response = await handleDeleteNoteCommand(parsed);
      expect(response).toContain('Note deleted successfully');
      expect(journalService.deleteNote).toHaveBeenCalledWith('1234567890');
    });

    it('should return failure message if delete fails', async () => {
      const parsed = { command: 'delete-note', args: ['123'], originalInput: '/delete-note 123' };
      (journalService.getNotes as jest.Mock).mockReturnValue([
        { id: '1234567890', content: 'note 1', timestamp: Date.now() }
      ]);
      (journalService.deleteNote as jest.Mock).mockReturnValue(false);

      const response = await handleDeleteNoteCommand(parsed);
      expect(response).toContain('Failed to delete note');
      expect(journalService.deleteNote).toHaveBeenCalledWith('1234567890');
    });
  });

  describe('handleClearNotesCommand', () => {
    it('should return empty message if no notes to clear', async () => {
      (journalService.getEntryCount as jest.Mock).mockReturnValue(0);
      const response = await handleClearNotesCommand();
      expect(response).toContain('Journal is already empty');
      expect(journalService.clearNotes).not.toHaveBeenCalled();
    });

    it('should clear notes and return success message', async () => {
      (journalService.getEntryCount as jest.Mock).mockReturnValue(5);
      const response = await handleClearNotesCommand();
      expect(journalService.clearNotes).toHaveBeenCalled();
      expect(response).toContain('Cleared all 5 notes');
    });
  });
});
