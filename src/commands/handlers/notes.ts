import { ParsedCommand } from "../../utils/commandParser";
import { journalService } from "../../services/JournalService";
import { analyzeSentiment } from "../../utils/analysis";

/**
 * Handle the note command to save a personal journal entry
 */
export async function handleNoteCommand(parsed: ParsedCommand): Promise<string> {
  const content = parsed.args.join(' ').trim();

  if (!content) {
    return `Please provide content for your note.
Usage: /note Today I felt...`;
  }

  // Analyze sentiment of the note for potential tracking (optional)
  const sentiment = analyzeSentiment(content);

  const entry = journalService.addNote(content, sentiment);

  return `Note saved successfully (ID: ${entry.id.substring(0, 8)}...).
Type /notes to view all your entries.`;
}

/**
 * Handle listing all journal notes
 */
export async function handleListNotesCommand(): Promise<string> {
  const notes = journalService.getNotes();

  if (notes.length === 0) {
    return `You have no saved notes.
Type /note <content> to create one.`;
  }

  let response = `Your Personal Notes (${notes.length}):\n\n`;

  notes.forEach((note) => {
    const date = new Date(note.timestamp).toLocaleString();
    const idSnippet = note.id.substring(0, 8);
    response += `[${date}] (ID: ${idSnippet})\n${note.content}\n\n`;
  });

  response += `To delete a note: /delete-note <id>
To clear all notes: /clear-notes`;

  return response;
}

/**
 * Handle deleting a specific note by ID
 */
export async function handleDeleteNoteCommand(parsed: ParsedCommand): Promise<string> {
  const idSnippet = parsed.args[0];

  if (!idSnippet) {
    return `Please provide the ID of the note to delete.
Usage: /delete-note <id>
(You can find IDs using /notes)`;
  }

  // Find note by partial ID match
  const notes = journalService.getNotes();
  const targetNote = notes.find(n => n.id.startsWith(idSnippet));

  if (!targetNote) {
    return `No note found with ID starting with "${idSnippet}".`;
  }

  const success = journalService.deleteNote(targetNote.id);

  if (success) {
    return `Note deleted successfully.`;
  } else {
    return `Failed to delete note.`;
  }
}

/**
 * Handle clearing all notes
 */
export async function handleClearNotesCommand(): Promise<string> {
  const count = journalService.getEntryCount();
  if (count === 0) {
    return `Journal is already empty.`;
  }

  journalService.clearNotes();
  return `Cleared all ${count} notes from your journal.`;
}
