import { Message } from "../types/Message";
import { getResponseForMessage, getHelpResponse } from "../data/responses";
import { getAvailableModels, getCurrentModel, switchModel } from "../utils/aiModel";
import { searchResources, Resource } from "../data/resources";
import { updateSession, exportSessionData } from "./sessionManager";
import { parseCommand, ParsedCommand } from "./commandParser";

// Define command types for better organization
type CommandHandler = (parsed: ParsedCommand, messages: Message[]) => Promise<string>;

// Command registry for easy maintenance and extension
const COMMANDS: Record<string, CommandHandler> = {
  help: async () => getHelpResponse(),
  resources: async (parsed) => handleResourcesCommand(parsed),
  model: async (parsed) => handleModelCommand(parsed),
  models: async () => listAvailableModels(),
  export: async () => handleExportCommand(),
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

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Handle the model command to switch between AI models
 * @param parsed Parsed command object
 * @returns Response message
 */
async function handleModelCommand(parsed: ParsedCommand): Promise<string> {
  // If just /model with no arguments, show current model
  if (parsed.args.length === 0) {
    const currentModel = getCurrentModel();
    return `Current AI model: ${currentModel.displayName}
${currentModel.description}

Type /models to see all available models or /model <number> to switch models.`;
  }
  
  // Try to parse model index from first argument
  const modelIndex = parseInt(parsed.args[0], 10);
  if (isNaN(modelIndex)) {
    return `Invalid model number. Please use a number (e.g., /model 1).
Type /models to see available models.`;
  }
  
  // Get available models and try to switch
  const models = getAvailableModels();
  if (modelIndex < 0 || modelIndex >= models.length) {
    return `Invalid model number. Please choose a number between 0 and ${models.length - 1}.`;
  }
  
  // Switch the model
  const success = switchModel(modelIndex);
  if (success) {
    const newModel = getCurrentModel();
    return `Switched to model: ${newModel.displayName}
${newModel.description}`;
  } else {
    return `Failed to switch models. Please try again.`;
  }
}

/**
 * List all available AI models
 * @returns Formatted list of available models
 */
async function listAvailableModels(): Promise<string> {
  const models = getAvailableModels();
  const currentModel = getCurrentModel();
  
  let response = `Available AI Models:

`;
  
  models.forEach((model, index) => {
    const isCurrent = model.name === currentModel.name;
    response += `${index}: ${model.displayName}${isCurrent ? ' (current)' : ''}
   ${model.description}

`;
  });
  
  response += `To switch models, type /model <number>`;
  return response;
}

/**
 * Handle the resources command to list or search mental health resources
 * @param parsed Parsed command object
 * @returns Formatted list of resources
 */
async function handleResourcesCommand(parsed: ParsedCommand): Promise<string> {
  const query = parsed.args.join(' ').trim();

  const results = searchResources(query);

  if (results.length === 0) {
    return `No resources found for "${query}".

Try simpler keywords like "anxiety", "youth", "crisis", or just type /resources to see all available help.`;
  }

  const title = query
    ? `Mental Health Resources matching "${query}":`
    : `Mental Health Resources:`;

  return formatResourceList(results, title);
}

function formatResourceList(resources: Resource[], title: string): string {
  let response = `${title}\n\n`;

  resources.forEach(resource => {
    response += `• ${resource.name} [${resource.category}]\n`;
    response += `  ${resource.contact}\n`;
    response += `  ${resource.description}\n\n`;
  });

  if (resources.length > 5 && !title.includes("matching")) {
    response += `Tip: You can search resources by typing /resources <topic> (e.g., /resources youth)`;
  } else {
    response += `Remember, seeking help is a sign of strength.`;
  }

  return response;
}

/**
 * Handle export session command
 */
async function handleExportCommand(): Promise<string> {
    const data = exportSessionData();
    return `Here is your session data export (JSON):

${data}

You can copy and save this text for your records.`;
}
