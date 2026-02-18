import { Message } from "../types/Message";
import { generateResponse } from "../services/ai";

/**
 * Response content types
 */
interface SystemResponses {
  welcome: string[];
  help: string;
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
  help: `
    Available commands:

    /help - Show this help message
    /clear - Clear the terminal
    /resources - Show mental health resources (try /resources anxiety)
    /panic - Show immediate crisis resources
    /models - List available AI models
    /model <number> - Switch to a different AI model
    /privacy - Toggle privacy mode (prevents saving history)
    /export - Export your session data

    You can also just type normally to chat with me about how you're feeling.
    I'm here to listen and support you.
  `,
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
  return SYSTEM_RESPONSES.help;
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
    console.error("Error generating response:", error);
    return SYSTEM_RESPONSES.error;
  }
}
