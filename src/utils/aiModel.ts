import { AIModelService, ProgressCallback } from "../services/AIModelService";
import { Message } from "../types/Message";
import { ModelConfig } from "../config/models";
import {
  sanitizePromptContent,
  isSensitiveTopic,
  isGreeting,
  postProcessResponse
} from "./ai-helpers";

// Re-export helpers for backward compatibility and testing
export { sanitizePromptContent, isSensitiveTopic, isGreeting, postProcessResponse };
export type { ProgressCallback };

// Create a singleton instance
const aiService = new AIModelService();

// Export wrapper functions that delegate to the service instance

export async function initializeModel(onProgress?: ProgressCallback): Promise<boolean> {
  return aiService.initializeModel(onProgress);
}

export function getCurrentModel(): ModelConfig {
  return aiService.getCurrentModel();
}

export function switchModel(index: number): boolean {
  return aiService.switchModel(index);
}

export function getAvailableModels(): Array<{name: string, displayName: string, description: string}> {
  return aiService.getAvailableModels();
}

export function prepareContext(messages: Message[]): string {
  return aiService.prepareContext(messages);
}

export function getSupportiveResponse(input: string): string {
  return aiService.getSupportiveResponse(input);
}

export async function generateResponse(input: string, messages: Message[]): Promise<string> {
  return aiService.generateResponse(input, messages);
}
