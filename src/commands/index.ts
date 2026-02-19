import { Message } from "../types/Message";
import { getResponseForMessage } from "../data/responses";
import { updateSession } from "../utils/sessionManager";
import { parseCommand, ParsedCommand } from "../utils/commandParser";

import { handleModelCommand, listAvailableModels } from "./handlers/ai";
import { handleResourcesCommand } from "./handlers/resources";
import { handleNoteCommand, handleListNotesCommand, handleDeleteNoteCommand, handleClearNotesCommand } from "./handlers/notes";
import { handleThemeCommand, handleListThemesCommand } from "./handlers/theme";
import { handleHelpCommand, handleExportCommand, handleArtCommand } from "./handlers/system";
import { handleStatsCommand } from "./handlers/stats";

// Define command types for better organization
type CommandHandler = (parsed: ParsedCommand, messages: Message[]) => Promise<string>;

// Command registry for easy maintenance and extension
export const COMMANDS: Record<string, CommandHandler> = {
  help: async () => handleHelpCommand(),
  stats: async (parsed, messages) => handleStatsCommand(parsed, messages),
  resources: async (parsed) => handleResourcesCommand(parsed),
  model: async (parsed) => handleModelCommand(parsed),
  models: async () => listAvailableModels(),
  export: async () => handleExportCommand(),
  note: async (parsed) => handleNoteCommand(parsed),
  notes: async () => handleListNotesCommand(),
  'delete-note': async (parsed) => handleDeleteNoteCommand(parsed),
  deletenote: async (parsed) => handleDeleteNoteCommand(parsed),
  'clear-notes': async () => handleClearNotesCommand(),
  clearnotes: async () => handleClearNotesCommand(),
  theme: async (parsed) => handleThemeCommand(parsed),
  themes: async () => handleListThemesCommand(),
  art: async (parsed) => handleArtCommand(parsed),
  ascii: async (parsed) => handleArtCommand(parsed),
};

/**
 * Process user commands and generate appropriate responses
 * @param input User input text
 * @param messages Conversation history
 * @returns Promise with response string
 */
export async function processCommand(input: string, messages: Message[]): Promise<string> {
  // Update session with user input
  updateSession({
    id: 'current',
    content: input,
    sender: 'user',
    timestamp: new Date().toISOString()
  });

  try {
    const parsed = parseCommand(input);

    // If input was parsed but might be just whitespace or filtered out?
    if (!parsed) {
        if (input.trim()) {
           // Handle standard conversations if input exists but parse failed (shouldn't happen with current parser unless empty)
           return await getResponseForMessage(input, messages);
        }
        return "";
    }

    const commandHandler = COMMANDS[parsed.command];

    // Check if valid command
    if (commandHandler) {
      // For non-slash commands, strictly verify it is intended as a command.
      // If the input does NOT start with '/', we treat it as a command ONLY if:
      // 1. It matches the command name exactly (no arguments).
      // This preserves existing behavior where "help" works but "help me" is chat.

      const isSlash = input.trim().startsWith('/');
      if (!isSlash && parsed.args.length > 0) {
           return await getResponseForMessage(input, messages);
      }

      return await commandHandler(parsed, messages);
    }

    // Handle standard conversations
    return await getResponseForMessage(input, messages);
  } catch (error) {
    console.error("Error processing command:", error);
    return "I'm having trouble processing that command. Please try again or type /help for available commands.";
  }
}
