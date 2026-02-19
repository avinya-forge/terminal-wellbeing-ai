import { ParsedCommand } from "../../utils/commandParser";
import { getAvailableModels, getCurrentModel, switchModel } from "../../services/ai";

/**
 * Handle the model command to switch between AI models
 * @param parsed Parsed command object
 * @returns Response message
 */
export async function handleModelCommand(parsed: ParsedCommand): Promise<string> {
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
export async function listAvailableModels(): Promise<string> {
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
