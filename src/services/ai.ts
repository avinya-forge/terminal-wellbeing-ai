import { AIModelService, ProgressCallback } from "./AIModelService";
import { Message } from "../types/Message";
import { ModelConfig } from "../config/models";
import { getUserProfile } from "../utils/sessionManager";
import {
  sanitizePromptContent,
  isSensitiveTopic,
  isGreeting,
  postProcessResponse
} from "../utils/ai-helpers";

// Re-export helpers for backward compatibility and testing
export { sanitizePromptContent, isSensitiveTopic, isGreeting, postProcessResponse };
export type { ProgressCallback };

// Create a singleton instance
export const aiService = new AIModelService();

// Export wrapper functions that delegate to the service instance
// These are kept to minimize churn in consuming components,
// but direct usage of aiService is encouraged.

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

export async function prepareContext(messages: Message[]): Promise<string> {
  return await aiService.prepareContext(messages);
}

export function getSupportiveResponse(input: string): string {
  return aiService.getSupportiveResponse(input);
}

export async function generateResponse(input: string, messages: Message[]): Promise<string> {
  const profile = getUserProfile();
  const speed = profile.preferences?.speed || 'medium';
  let delay = 1000;
  if (speed === 'fast') delay = 300;
  if (speed === 'slow') delay = 2500;

  const [response] = await Promise.all([
    aiService.generateResponse(input, messages),
    new Promise(resolve => setTimeout(resolve, delay))
  ]);

  return response;
}
