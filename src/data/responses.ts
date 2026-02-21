import { Message } from "../types/Message";
import { generateResponse } from "../services/ai";
import { logger } from "../services/LoggerService";

export interface CommandDefinition {
  name: string;
  description: string;
  category: "General" | "Mental Health" | "Utilities" | "System";
  usage?: string;
}

export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  // General
  { name: "/help", description: "Show this help message", category: "General" },
  // Mental Health
  { name: "/panic", description: "Show immediate crisis resources (Ctrl+Shift+P)", category: "Mental Health" },
  { name: "/resources", description: "Search mental health resources", usage: "/resources [topic]", category: "Mental Health" },
  { name: "/quote", description: "Get a motivational quote", category: "Mental Health" },
  { name: "/breathe", description: "Start a 4-7-8 breathing exercise", category: "Mental Health" },
  { name: "/note", description: "Add a personal journal entry", usage: "/note <content>", category: "Mental Health" },
  { name: "/notes", description: "List all your journal entries", category: "Mental Health" },
  { name: "/delete-note", description: "Delete a journal entry by ID", usage: "/delete-note <id>", category: "Mental Health" },
  { name: "/clear-notes", description: "Clear all journal entries", category: "Mental Health" },
  // Utilities
  { name: "/clear", description: "Clear the terminal screen (Ctrl+K)", category: "Utilities" },
  { name: "/stats", description: "View session statistics", category: "Utilities" },
  { name: "/privacy", description: "Toggle privacy mode (disables storage)", category: "Utilities" },
  { name: "/export", description: "Export session data as JSON or Markdown", usage: "/export [markdown]", category: "Utilities" },
  { name: "/theme", description: "Change interface theme", usage: "/theme <name>", category: "Utilities" },
  { name: "/themes", description: "List all available themes", category: "Utilities" },
  { name: "/art", description: "Display ASCII art by mood", usage: "/art <mood>", category: "Utilities" },
  { name: "/profile", description: "Manage user profile & preferences", usage: "/profile [view|name|tone|length|warnings|reset|export]", category: "Utilities" },
  // System
  { name: "/models", description: "List available AI models", category: "System" },
  { name: "/model", description: "Switch AI model", usage: "/model <index>", category: "System" },
];


/**
 * Response content types
 */
interface SystemResponses {
  welcome: string[];
  error: string;
}

/**
 * System response content
 */
const SYSTEM_RESPONSES: SystemResponses = {
  welcome: [
    "Welcome to WellBeing.sh - Your open-source companion for mental health support.",
    "I'm here to listen, provide support, and offer resources to help you navigate difficult emotions. Type '/help' to see what I can do."
  ],
  error: "I'm having trouble processing that right now. Could you try rephrasing, or type /help to see what I can do?"
};

/**
 * Creates a message object with the given content
 * @param content Message content
 * @param id Optional message ID (defaults to timestamp-based ID)
 * @returns Message object
 */
function createBotMessage(content: string, id?: string): Message {
  return {
    id: id || Date.now().toString(),
    content,
    sender: "bot",
    timestamp: new Date().toISOString()
  };
}

/**
 * Returns initial welcome messages shown when the terminal starts
 * @returns Array of welcome messages
 */
export function getInitialMessages(): Message[] {
  return SYSTEM_RESPONSES.welcome.map((content, index) =>
    createBotMessage(content, (index + 1).toString())
  );
}

/**
 * Returns help information
 * @returns Help text
 */
export function getHelpResponse(): string {
  // Generate help text dynamically from definitions
  const categories = ["General", "Mental Health", "Utilities", "System"] as const;

  let helpText = "Available commands:\n\n";

  categories.forEach(category => {
    const cmds = COMMAND_DEFINITIONS.filter(cmd => cmd.category === category);
    if (cmds.length > 0) {
      helpText += `--- ${category} ---\n`;
      cmds.forEach(cmd => {
        const usage = cmd.usage || cmd.name;
        helpText += `${usage.padEnd(20)} - ${cmd.description}\n`;
      });
      helpText += "\n";
    }
  });

  helpText += "You can also just type normally to chat with me about how you're feeling.\n";
  helpText += "I'm here to listen and support you.";

  return helpText;
}

/**
 * Processes user input and generates appropriate response
 * @param input User input text
 * @param messages Conversation history
 * @returns Promise with response string
 */
export async function getResponseForMessage(input: string, messages: Message[]): Promise<string> {
  try {
    return await generateResponse(input, messages);
  } catch (error) {
    logger.error("Error generating response:", error);
    return SYSTEM_RESPONSES.error;
  }
}
