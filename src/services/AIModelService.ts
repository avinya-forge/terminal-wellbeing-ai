import { pipeline } from "@huggingface/transformers";
import { Message } from "../types/Message";
import { TextGenerator, GenerationOptions } from "../types/AIModel";
import { AVAILABLE_MODELS, ModelConfig } from "../config/models";
import {
  SUICIDE_RESPONSE,
  SELF_DEPRECATION_KEYWORDS,
  SELF_DEPRECATION_RESPONSES,
  GENERAL_SUPPORT_RESPONSES,
  SYSTEM_RESPONSES,
  GREETINGS,
  FIRST_TIME_GREETINGS
} from "../data/phrases";
import { getProfileSummary, getUserProfile } from "../utils/sessionManager";
import {
  MAX_RECENT_RESPONSES,
  MAX_CONTEXT_MESSAGES,
  MAX_RETRIES,
  RETRY_DELAY,
  DEFAULT_MODEL_INDEX,
  SYSTEM_PROMPT
} from "../config/ai-constants";
import {
  sanitizePromptContent,
  isSensitiveTopic,
  isGreeting,
  postProcessResponse
} from "../utils/ai-helpers";
import { CircuitBreaker, CircuitBreakerOpenError } from "../utils/CircuitBreaker";
import { logger } from "./LoggerService";
import { memoryService } from "./MemoryService";
import { backendClient, InferenceOptions } from "./BackendClient";
import { emergencyService } from "./EmergencyService";

// Cache for the text generators
interface ModelCache {
  [key: string]: TextGenerator | null;
}

export type ProgressCallback = (status: string) => void;

export class AIModelService {
  private textGenerators: ModelCache = {};
  private currentModelIndex: number = DEFAULT_MODEL_INDEX;
  private recentResponses: Set<string> = new Set();
  private initialized: boolean = false;
  private circuitBreaker: CircuitBreaker;

  constructor() {
    this.currentModelIndex = DEFAULT_MODEL_INDEX;
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeout: 30000 // 30s
    });
  }

  // Initialize the text generation pipelines with retry mechanism
  public async initializeModel(onProgress?: ProgressCallback): Promise<boolean> {
    if (this.initialized && this.textGenerators[AVAILABLE_MODELS[this.currentModelIndex].name]) {
      return true;
    }

    let retries = 0;

    const attemptInitialization = async (): Promise<boolean> => {
      try {
        // Initialize memory service (encryption key generation, etc.)
        await memoryService.initialize();

        // Check if we have a backend token
        const hasBackend = !!import.meta.env.VITE_HF_TOKEN;

        if (hasBackend) {
          logger.info("Backend inference token detected. Using Backend-First approach.");
          onProgress?.("Backend configured (Simplicity Mode)");
          this.initialized = true;
          return true;
        }

        // Start with the default model local fallback
        const defaultModel = AVAILABLE_MODELS[DEFAULT_MODEL_INDEX];
        logger.info(`Initializing local fallback AI model (${defaultModel.displayName})...`);
        onProgress?.(`Loading local ${defaultModel.displayName}...`);

        await this.circuitBreaker.execute(async () => {
          this.textGenerators[defaultModel.name] = (await pipeline(
            "text-generation",
            defaultModel.name,
            { device: defaultModel.device }
          )) as unknown as TextGenerator;
        });

        logger.info(`Primary AI model (${defaultModel.displayName}) initialized successfully`);
        onProgress?.(`${defaultModel.displayName} ready`);

        // Initialize other models in the background after the primary model is loaded
        setTimeout(() => {
          this.initializeAdditionalModels();
        }, 1000);

        this.initialized = true;
        return true;
      } catch (error: unknown) {
        if (error instanceof CircuitBreakerOpenError) {
          logger.warn("Circuit Breaker is OPEN. Skipping initialization.");
          onProgress?.("Service temporarily unavailable (Circuit Breaker)");
          return false;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Error initializing AI model (attempt ${retries + 1}/${MAX_RETRIES}): ${errorMessage}`);
        onProgress?.(`Error: ${errorMessage}. Retrying...`);
        return false;
      }
    };

    // First attempt
    let success = await attemptInitialization();

    // Retry logic
    while (!success && retries < MAX_RETRIES - 1) {
      retries++;
      logger.info(`Retrying model initialization in ${RETRY_DELAY}ms... (${retries}/${MAX_RETRIES - 1})`);
      onProgress?.(`Retrying initialization (${retries}/${MAX_RETRIES - 1})...`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

      success = await attemptInitialization();
    }

    return success;
  }

  // Initialize additional models in the background
  private async initializeAdditionalModels(): Promise<void> {
    for (let i = 0; i < AVAILABLE_MODELS.length; i++) {
      // Skip the default model as it's already loaded
      if (i === DEFAULT_MODEL_INDEX) continue;

      const model = AVAILABLE_MODELS[i];
      // Skip if already loaded
      if (this.textGenerators[model.name]) continue;

      try {
        logger.info(`Initializing additional model: ${model.displayName}...`);
        this.textGenerators[model.name] = (await pipeline(
          "text-generation",
          model.name,
          { device: model.device }
        )) as unknown as TextGenerator;
        logger.info(`Model ${model.displayName} initialized successfully`);
      } catch (error) {
        logger.error(`Failed to initialize model ${model.displayName}:`, error);
        // Continue with other models even if one fails
      }
    }
  }

  // Get the current active model configuration
  public getCurrentModel(): ModelConfig {
    return AVAILABLE_MODELS[this.currentModelIndex];
  }

  // Switch to a different model by index
  public switchModel(index: number): boolean {
    if (index >= 0 && index < AVAILABLE_MODELS.length) {
      this.currentModelIndex = index;
      return true;
    }
    return false;
  }

  // Get list of available models for UI display
  public getAvailableModels(): Array<{ name: string, displayName: string, description: string }> {
    return AVAILABLE_MODELS.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description
    }));
  }

  // Convert conversation history to context for the model with improved formatting
  public async prepareContext(messages: Message[]): Promise<string> {
    // Get more context messages for better conversation flow
    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

    // Use system prompt from constants
    let context = SYSTEM_PROMPT;

    // Add adaptive profile summary to context
    const profileSummary = getProfileSummary();
    if (profileSummary) {
      context += `System Note: ${profileSummary}\n\n`;
    }

    // Add Long-term Memory Context
    // We use the last user message to query memory
    const lastUserMessage = messages.slice().reverse().find(m => m.sender === 'user');
    if (lastUserMessage && lastUserMessage.content) {
      try {
        const memories = await memoryService.retrieveRelevantContext(lastUserMessage.content);
        if (memories.length > 0) {
          context += `Relevant Past Memories:\n${memories.map(m => `- ${m.content}`).join('\n')}\n\n`;
        }
      } catch (error) {
        logger.warn('Failed to retrieve memory context', error);
      }
    }

    // Add conversation history with proper formatting
    context += recentMessages.map(msg => {
      const role = msg.sender === "user" ? "Human" : "Assistant";
      const sanitizedContent = sanitizePromptContent(msg.content || "");
      return `${role}: ${sanitizedContent}`;
    }).join("\n");

    return context;
  }

  // Generate supportive responses for sensitive topics
  public getSupportiveResponse(input: string): string {
    const normalizedInput = input.toLowerCase();

    // For insulting self or chatbot
    if (SELF_DEPRECATION_KEYWORDS.some(keyword => normalizedInput.includes(keyword))) {
      return this.getUniqueResponse(SELF_DEPRECATION_RESPONSES);
    }

    // For suicidal thoughts
    if (normalizedInput.includes("suicide") || normalizedInput.includes("kill myself") || normalizedInput.includes("end my life") || normalizedInput.includes("want to die")) {
      return SUICIDE_RESPONSE;
    }

    // For general negative self-talk
    return this.getUniqueResponse(GENERAL_SUPPORT_RESPONSES);
  }

  // Helper function to avoid repetitive responses
  private getUniqueResponse(responses: string[]): string {
    // Filter out recently used responses
    const availableResponses = responses.filter(response => !this.recentResponses.has(response));

    // If all responses have been recently used, reset and use all
    const candidateResponses = availableResponses.length > 0 ? availableResponses : responses;

    // Select a random response
    const selectedResponse = candidateResponses[Math.floor(Math.random() * candidateResponses.length)];

    // Add to recent responses and maintain max size
    this.recentResponses.add(selectedResponse);
    if (this.recentResponses.size > MAX_RECENT_RESPONSES) {
      // Remove oldest response (first item in the set)
      const oldestResponse = this.recentResponses.values().next().value;
      if (oldestResponse) {
        this.recentResponses.delete(oldestResponse);
      }
    }

    return selectedResponse;
  }

  // Helper to save interactions to memory asynchronously
  private async saveInteractionToMemory(userInput: string, assistantResponse: string) {
    try {
      await memoryService.addMemory(userInput, 'user');
      await memoryService.addMemory(assistantResponse, 'assistant');
    } catch (error) {
      logger.error('Failed to save interaction to memory:', error);
    }
  }

  // Generate response using the AI model or fallback methods
  public async generateResponse(input: string, messages: Message[]): Promise<string> {
    // 0. [EMERGENCY_PROTOCOL] - Immediate Triage
    const emergencyCheck = emergencyService.checkCriticalSymptoms(input);
    if (emergencyCheck.isCritical) {
      return emergencyCheck.message || "EMERGENCY DETECTED. PLEASE CALL 911.";
    }

    // Check for greetings and introductions to make conversation more natural
    if (isGreeting(input)) {
      return this.getGreetingResponse(input, messages);
    }

    // Check for sensitive topics first
    if (isSensitiveTopic(input)) {
      return this.getSupportiveResponse(input);
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
      return this.getUniqueResponse(SYSTEM_RESPONSES.repetitive);
    }

    // Get the current model configuration
    const currentModel = this.getCurrentModel();

    // 1. Try Backend Abstraction First (Primary path)
    try {
      const context = await this.prepareContext(messages);
      const sanitizedInput = sanitizePromptContent(input);
      const prompt = `${context}\nHuman: ${sanitizedInput}\nAssistant:`;

      const options: InferenceOptions = {
        model: currentModel.name,
        temperature: currentModel.temperature,
        max_length: currentModel.maxLength,
        top_p: currentModel.topP,
      };

      logger.info(`Attempting backend inference for model: ${currentModel.name}`);
      const backendResponse = await backendClient.generateText(prompt, options);

      if (backendResponse) {
        let responseText = backendResponse;

        // Post-process (handle redactions, filterings)
        const profile = getUserProfile();
        const warnings = profile.triggerWarnings || [];
        responseText = postProcessResponse(responseText, input, warnings);

        if (responseText.length > 5) {
          this.recentResponses.add(responseText);
          this.saveInteractionToMemory(input, responseText);
          return responseText;
        }
      }
    } catch (error) {
      logger.warn("Backend inference failed, falling back to local processing.", error);
    }

    // 2. Local fallback if backend fails or is not configured
    const modelGenerator = this.textGenerators[currentModel.name];

    // Try using the AI model if available
    if (modelGenerator) {
      try {
        const context = await this.prepareContext(messages);
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

        const result = await this.circuitBreaker.execute(async () => {
          return await modelGenerator(prompt, options);
        });

        if (result && result[0] && result[0].generated_text) {
          // Extract just the assistant's response
          const fullText = result[0].generated_text;
          const assistantResponseMatch = fullText.match(/Assistant:(.*?)(?=(Human:|$))/s);

          if (assistantResponseMatch && assistantResponseMatch[1] && assistantResponseMatch[1].trim()) {
            let responseText = assistantResponseMatch[1].trim();

            // Post-process the response to improve quality, including content filtering
            const profile = getUserProfile();
            const warnings = profile.triggerWarnings || [];
            responseText = postProcessResponse(responseText, input, warnings);

            if (responseText.length > 10) {
              // Add to recent responses to avoid repetition
              if (this.recentResponses.size >= MAX_RECENT_RESPONSES) {
                // Remove the oldest response if we've reached the limit
                const oldestResponse = this.recentResponses.values().next().value;
                if (oldestResponse) {
                  this.recentResponses.delete(oldestResponse);
                }
              }
              this.recentResponses.add(responseText);

              // Save interaction to memory
              this.saveInteractionToMemory(input, responseText);

              return responseText;
            }
          }
        }

        // Try fallback to another model if available
        return await this.tryFallbackModels(input, messages, currentModel.name);
      } catch (error: unknown) {
        if (error instanceof CircuitBreakerOpenError) {
          logger.warn("Circuit Breaker OPEN during generation. Switching immediately to fallback.");
          // Fallback to static response immediately if circuit is open
          return this.getUniqueResponse(SYSTEM_RESPONSES.fallback);
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Error generating AI response with ${currentModel.displayName}: ${errorMessage}`);
        // Try fallback to another model if available
        return await this.tryFallbackModels(input, messages, currentModel.name);
      }
    }

    // Fallback to predefined responses if no models are available
    return this.getUniqueResponse(SYSTEM_RESPONSES.fallback);
  }

  // Try to use other available models as fallbacks
  private async tryFallbackModels(input: string, messages: Message[], excludeModelName: string): Promise<string> {
    // Try each available model that isn't the one that just failed
    for (const model of AVAILABLE_MODELS) {
      if (model.name === excludeModelName) continue;

      const generator = this.textGenerators[model.name];
      if (!generator) continue;

      try {
        const context = await this.prepareContext(messages);
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
            const profile = getUserProfile();
            const warnings = profile.triggerWarnings || [];
            const response = postProcessResponse(responseText, input, warnings);
            if (response.length > 10) {
              return response;
            }
          }
        }
      } catch (error) {
        logger.error(`Fallback model ${model.displayName} also failed:`, error);
        // Continue trying other models
      }
    }

    // If all models fail, use predefined responses
    return this.getUniqueResponse(SYSTEM_RESPONSES.fallback);
  }

  // Generate friendly, conversational greeting responses
  private getGreetingResponse(_input: string, messages: Message[]): string {
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
      return this.getUniqueResponse([...FIRST_TIME_GREETINGS(), ...GREETINGS(timeGreeting)]);
    }

    return this.getUniqueResponse(GREETINGS(timeGreeting));
  }
}
