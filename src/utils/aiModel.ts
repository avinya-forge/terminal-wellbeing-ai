import { pipeline } from "@huggingface/transformers";
import { Message } from "../components/Terminal";
import { AVAILABLE_MODELS, ModelConfig } from "../config/models";
import {
  SENSITIVE_KEYWORDS,
  SUICIDE_RESPONSE,
  SELF_DEPRECATION_KEYWORDS,
  SELF_DEPRECATION_RESPONSES,
  GENERAL_SUPPORT_RESPONSES,
  SYSTEM_RESPONSES,
  CONTINUITY_PHRASES,
  GREETING_PATTERNS,
  GREETINGS,
  FIRST_TIME_GREETINGS
} from "../data/phrases";

// System constants
const MAX_RECENT_RESPONSES = 15;
const MAX_CONTEXT_MESSAGES = 8;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const DEFAULT_MODEL_INDEX = 0;

// Type definition for the text generator
type TextGenerator = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (text: string, options: any): Promise<any>;
};

// Use a more specific type for generation options
type GenerationOptions = {
  max_length: number;
  temperature: number;
  top_p: number;
  no_repeat_ngram_size: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// Cache for the text generators
interface ModelCache {
  [key: string]: TextGenerator | null;
}

const textGenerators: ModelCache = {};
let currentModelIndex = DEFAULT_MODEL_INDEX;

// Track previously sent responses to avoid repetition using a more efficient data structure
const recentResponses: Set<string> = new Set();

// Helper function to escape special characters in strings for RegExp
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Initialize the text generation pipelines with retry mechanism
export async function initializeModel(): Promise<boolean> {
  let retries = 0;
  
  const attemptInitialization = async (): Promise<boolean> => {
    try {
      // Start with the default model
      const defaultModel = AVAILABLE_MODELS[DEFAULT_MODEL_INDEX];
      console.log(`Initializing primary AI model (${defaultModel.displayName})...`);
      
      textGenerators[defaultModel.name] = (await pipeline(
        "text-generation",
        defaultModel.name,
        { device: defaultModel.device }
      )) as unknown as TextGenerator;
      
      console.log(`Primary AI model (${defaultModel.displayName}) initialized successfully`);
      
      // Initialize other models in the background after the primary model is loaded
      setTimeout(() => {
        initializeAdditionalModels();
      }, 1000);
      
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error initializing AI model (attempt ${retries + 1}/${MAX_RETRIES}): ${errorMessage}`);
      return false;
    }
  };
  
  // First attempt
  let success = await attemptInitialization();
  
  // Retry logic
  while (!success && retries < MAX_RETRIES - 1) {
    retries++;
    console.log(`Retrying model initialization in ${RETRY_DELAY}ms... (${retries}/${MAX_RETRIES - 1})`);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    
    success = await attemptInitialization();
  }
  
  return success;
}

// Initialize additional models in the background
async function initializeAdditionalModels(): Promise<void> {
  for (let i = 0; i < AVAILABLE_MODELS.length; i++) {
    // Skip the default model as it's already loaded
    if (i === DEFAULT_MODEL_INDEX) continue;
    
    const model = AVAILABLE_MODELS[i];
    try {
      console.log(`Initializing additional model: ${model.displayName}...`);
      textGenerators[model.name] = (await pipeline(
        "text-generation",
        model.name,
        { device: model.device }
      )) as unknown as TextGenerator;
      console.log(`Model ${model.displayName} initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize model ${model.displayName}:`, error);
      // Continue with other models even if one fails
    }
  }
}

// Get the current active model configuration
export function getCurrentModel(): ModelConfig {
  return AVAILABLE_MODELS[currentModelIndex];
}

// Switch to a different model by index
export function switchModel(index: number): boolean {
  if (index >= 0 && index < AVAILABLE_MODELS.length) {
    currentModelIndex = index;
    return true;
  }
  return false;
}

// Get list of available models for UI display
export function getAvailableModels(): Array<{name: string, displayName: string, description: string}> {
  return AVAILABLE_MODELS.map(model => ({
    name: model.name,
    displayName: model.displayName,
    description: model.description
  }));
}

// Sanitize user input to prevent prompt injection by neutralizing delimiters
export function sanitizePromptContent(text: string): string {
  if (!text) return "";
  return text
    .replace(/Human:/gi, (match) => match.replace(':', '_'))
    .replace(/Assistant:/gi, (match) => match.replace(':', '_'))
    .replace(/System:/gi, (match) => match.replace(':', '_'));
}

// Convert conversation history to context for the model with improved formatting
export function prepareContext(messages: Message[]): string {
  // Get more context messages for better conversation flow
  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  
  // Add a system prompt to guide the model's behavior
  let context = "System: You are a supportive and empathetic mental health assistant. Respond conversationally and naturally. " +
    "Acknowledge the user's feelings, ask follow-up questions when appropriate, and provide thoughtful responses. " +
    "Be warm, friendly, and maintain a natural conversation flow.\n\n";
  
  // Add conversation history with proper formatting
  context += recentMessages.map(msg => {
    const role = msg.sender === "user" ? "Human" : "Assistant";
    const sanitizedContent = sanitizePromptContent(msg.content || "");
    return `${role}: ${sanitizedContent}`;
  }).join("\n");
  
  return context;
}

// Check if the topic is sensitive and needs special handling
export function isSensitiveTopic(input: string): boolean {
  const normalizedInput = input.toLowerCase();
  return SENSITIVE_KEYWORDS.some(keyword => normalizedInput.includes(keyword));
}

// Generate supportive responses for sensitive topics
export function getSupportiveResponse(input: string): string {
  const normalizedInput = input.toLowerCase();

  // For insulting self or chatbot
  if (SELF_DEPRECATION_KEYWORDS.some(keyword => normalizedInput.includes(keyword))) {
    return getUniqueResponse(SELF_DEPRECATION_RESPONSES);
  }
  
  // For suicidal thoughts
  if (normalizedInput.includes("suicide") || normalizedInput.includes("kill myself") || normalizedInput.includes("end my life")) {
    return SUICIDE_RESPONSE;
  }
  
  // For general negative self-talk
  return getUniqueResponse(GENERAL_SUPPORT_RESPONSES);
}

// Helper function to avoid repetitive responses
function getUniqueResponse(responses: string[]): string {
  // Filter out recently used responses
  const availableResponses = responses.filter(response => !recentResponses.has(response));
  
  // If all responses have been recently used, reset and use all
  const candidateResponses = availableResponses.length > 0 ? availableResponses : responses;
  
  // Select a random response
  const selectedResponse = candidateResponses[Math.floor(Math.random() * candidateResponses.length)];
  
  // Add to recent responses and maintain max size
  recentResponses.add(selectedResponse);
  if (recentResponses.size > MAX_RECENT_RESPONSES) {
    // Remove oldest response (first item in the set)
    const oldestResponse = recentResponses.values().next().value;
    if (oldestResponse) {
      recentResponses.delete(oldestResponse);
    }
  }
  
  return selectedResponse;
}

// Generate response using the AI model or fallback methods
export async function generateResponse(input: string, messages: Message[]): Promise<string> {
  // Check for greetings and introductions to make conversation more natural
  if (isGreeting(input)) {
    return getGreetingResponse(input, messages);
  }
  
  // Check for sensitive topics first
  if (isSensitiveTopic(input)) {
    return getSupportiveResponse(input);
  }
  
  // Check for repetitive messages
  const recentUserMessages = messages
    .filter(msg => msg.sender === "user")
    .slice(-3)
    .map(msg => msg.content.toLowerCase());
  
  if (recentUserMessages.length >= 2 && 
      recentUserMessages.slice(0, -1).some(msg => 
        msg === input.toLowerCase() || 
        (msg.length > 10 && input.toLowerCase().includes(msg))
      )) {
    return getUniqueResponse(SYSTEM_RESPONSES.repetitive);
  }
  
  // Get the current model configuration
  const currentModel = getCurrentModel();
  const modelGenerator = textGenerators[currentModel.name];
  
  // Try using the AI model if available
  if (modelGenerator) {
    try {
      const context = prepareContext(messages);
      const sanitizedInput = sanitizePromptContent(input);
      const prompt = `${context}
Human: ${sanitizedInput}
Assistant:`;
      
      const options: GenerationOptions = {
        max_length: currentModel.maxLength,
        temperature: currentModel.temperature,
        top_p: currentModel.topP,
        no_repeat_ngram_size: currentModel.noRepeatNgramSize
      };
      
      const result = await modelGenerator(prompt, options);
      
      if (result && result[0] && result[0].generated_text) {
        // Extract just the assistant's response
        const fullText = result[0].generated_text;
        const assistantResponseMatch = fullText.match(/Assistant:(.*?)(?=(Human:|$))/s);
        
        if (assistantResponseMatch && assistantResponseMatch[1] && assistantResponseMatch[1].trim()) {
          let responseText = assistantResponseMatch[1].trim();
          
          // Post-process the response to improve quality
          responseText = postProcessResponse(responseText, input);
          
          if (responseText.length > 10) {
            // Add to recent responses to avoid repetition
            if (recentResponses.size >= MAX_RECENT_RESPONSES) {
              // Remove the oldest response if we've reached the limit
              const oldestResponse = recentResponses.values().next().value;
              if (oldestResponse) {
                recentResponses.delete(oldestResponse);
              }
            }
            recentResponses.add(responseText);
            return responseText;
          }
        }
      }
      
      // Try fallback to another model if available
      return await tryFallbackModels(input, messages, currentModel.name);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error generating AI response with ${currentModel.displayName}: ${errorMessage}`);
      // Try fallback to another model if available
      return await tryFallbackModels(input, messages, currentModel.name);
    }
  }
  
  // Fallback to predefined responses if no models are available
  return getUniqueResponse(SYSTEM_RESPONSES.fallback);
}

// Try to use other available models as fallbacks
async function tryFallbackModels(input: string, messages: Message[], excludeModelName: string): Promise<string> {
  // Try each available model that isn't the one that just failed
  for (const model of AVAILABLE_MODELS) {
    if (model.name === excludeModelName) continue;
    
    const generator = textGenerators[model.name];
    if (!generator) continue;
    
    try {
      const context = prepareContext(messages);
      const sanitizedInput = sanitizePromptContent(input);
      const prompt = `${context}
Human: ${sanitizedInput}
Assistant:`;
      
      const options: GenerationOptions = {
        max_length: model.maxLength,
        temperature: model.temperature,
        top_p: model.topP,
        no_repeat_ngram_size: model.noRepeatNgramSize
      };
      
      const result = await generator(prompt, options);
      
      if (result && result[0] && result[0].generated_text) {
        const fullText = result[0].generated_text;
        const assistantResponseMatch = fullText.match(/Assistant:(.*?)(?=(Human:|$))/s);
        
        if (assistantResponseMatch && assistantResponseMatch[1] && assistantResponseMatch[1].trim()) {
          const responseText = assistantResponseMatch[1].trim();
          const response = postProcessResponse(responseText, input);
          if (response.length > 10) {
            return response;
          }
        }
      }
    } catch (error) {
      console.error(`Fallback model ${model.displayName} also failed:`, error);
      // Continue trying other models
    }
  }
  
  // If all models fail, use predefined responses
  return getUniqueResponse(SYSTEM_RESPONSES.fallback);
}

// Post-process the response to improve quality and conversational flow
export function postProcessResponse(response: string, input: string): string {
  // Remove any repetitive phrases
  const lines = response.split('\n').filter(line => line.trim() !== '');
  if (lines.length > 1) {
    // Remove duplicate consecutive lines
    const uniqueLines = lines.filter((line, index, arr) => 
      index === 0 || line !== arr[index - 1]
    );
    response = uniqueLines.join('\n');
  }
  
  // Ensure the response doesn't repeat the user's input verbatim
  if (response.toLowerCase().includes(input.toLowerCase()) && input.length > 5) {
    try {
      response = response.replace(new RegExp(escapeRegExp(input), 'gi'), 'what you mentioned');
    } catch (e) {
      // If regex fails, just continue without this replacement
      console.warn('Regex replacement failed:', e);
    }
  }
  
  // Add conversation continuity phrases if the response is short
  if (response.length < 30 && !response.includes('?')) {
    response += " " + CONTINUITY_PHRASES[Math.floor(Math.random() * CONTINUITY_PHRASES.length)];
  }
  
  return response;
}

// Check if input is a greeting or introduction
export function isGreeting(input: string): boolean {
  return GREETING_PATTERNS.some(pattern => pattern.test(input.trim()));
}

// Generate friendly, conversational greeting responses
function getGreetingResponse(_input: string, messages: Message[]): string {
  // Check if this is the first message in the conversation
  const isFirstInteraction = messages.filter(msg => msg.sender === "user").length <= 1;
  
  // Get time-appropriate greeting
  const timeOfDay = new Date().getHours();
  let timeGreeting = "Hello";
  
  if (timeOfDay < 12) {
    timeGreeting = "Good morning";
  } else if (timeOfDay < 18) {
    timeGreeting = "Good afternoon";
  } else {
    timeGreeting = "Good evening";
  }
  
  if (isFirstInteraction) {
    return getUniqueResponse([...FIRST_TIME_GREETINGS(timeGreeting), ...GREETINGS(timeGreeting)]);
  }
  
  return getUniqueResponse(GREETINGS(timeGreeting));
}
