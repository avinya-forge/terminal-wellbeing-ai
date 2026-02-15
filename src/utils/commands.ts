import { Message } from "../components/Terminal";
import { getResponseForMessage, getHelpResponse, getResourcesResponse } from "../data/responses";
import { getAvailableModels, getCurrentModel, switchModel } from "../utils/aiModel";

// Define command types for better organization
type CommandHandler = (input: string, messages: Message[]) => Promise<string>;

// Command registry for easy maintenance and extension
const COMMANDS: Record<string, CommandHandler> = {
  help: async () => getHelpResponse(),
  resources: async () => getResourcesResponse(),
  model: async (input) => handleModelCommand(input),
  models: async () => listAvailableModels(),
};

/**
 * Process user commands and generate appropriate responses
 * @param input User input text
 * @param messages Conversation history
 * @returns Promise with response string
 */
export async function processCommand(input: string, messages: Message[]): Promise<string> {
  try {
    // Trim and convert to lowercase for comparison
    const normalizedInput = input.trim().toLowerCase();
    
    // Check if input is a command (with or without slash prefix)
    const commandText = normalizedInput.startsWith("/") ? normalizedInput.substring(1) : normalizedInput;
    
    // Look for command in registry
    const commandHandler = COMMANDS[commandText];
    if (commandHandler) {
      return await commandHandler(input, messages);
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
 * @param input User input containing model command
 * @returns Response message
 */
async function handleModelCommand(input: string): Promise<string> {
  const parts = input.trim().split(/\s+/);
  
  // If just /model with no arguments, show current model
  if (parts.length <= 1) {
    const currentModel = getCurrentModel();
    return `Current AI model: ${currentModel.displayName}
${currentModel.description}

Type /models to see all available models or /model <number> to switch models.`;
  }
  
  // Try to parse model index
  const modelIndex = parseInt(parts[1], 10);
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
