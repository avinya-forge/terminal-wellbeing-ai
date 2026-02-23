import { logger } from './LoggerService';
import { selectModel } from './ModelRouter';
import { safetyTriageService } from './SafetyTriageService';

export interface InferenceOptions {
    model?: string;
    temperature?: number;
    max_length?: number;
    top_p?: number;
    /** Conversation history for triage context */
    history?: Array<{ role: string; content: string }>;
}

export class BackendClient {
    private static instance: BackendClient;
    private apiToken: string | null = null;

    // ── Model registry (routing handled by ModelRouter) ───────────────────────
    // mistralai/Mistral-7B-Instruct-v0.2  → neutral / conversational
    // meta-llama/Meta-Llama-3-8B-Instruct → complex health reasoning
    // microsoft/phi-2                      → brief / fast
    // HuggingFaceH4/zephyr-7b-beta         → distress / high sensitivity
    private baseUrl: string = "https://api-inference.huggingface.co/models/";

    private constructor() {
        this.apiToken = import.meta.env.VITE_HF_TOKEN || null;
    }

    public static getInstance(): BackendClient {
        if (!BackendClient.instance) {
            BackendClient.instance = new BackendClient();
        }
        return BackendClient.instance;
    }

    /**
     * Generates text using the Hugging Face Inference API.
     *
     * Pipeline:
     *   1. SafetyTriageService.triage() — if HALT, return safe handoff immediately
     *   2. ModelRouter.selectModel()    — pick best model for tone + safety tier
     *   3. HF Inference API call
     */
    public async generateText(prompt: string, options: InferenceOptions = {}): Promise<string | null> {
        // ── 1. Safety triage — runs before any inference ──────────────────────
        const history = options.history ?? [];
        const triage = safetyTriageService.triage(prompt, history);

        if (triage.haltInference) {
            logger.warn(`[BackendClient] Inference halted — safety tier: ${triage.tier}`);
            return triage.safeResponse ?? null;
        }

        // ── 2. Model selection — tone + safety tier aware ─────────────────────
        const selection = options.model
            ? { modelId: options.model, modelName: options.model, reason: 'Explicit override' }
            : selectModel(prompt, triage.tier);

        const model = selection.modelId;
        const url = `${this.baseUrl}${model}`;

        if (!this.apiToken) {
            logger.warn("VITE_HF_TOKEN is not set. Inference API calls will likely fail.");
        }

        logger.info(`[BackendClient] → ${selection.modelName} (${triage.tier}) | ${selection.reason}`);

        // ── 3. HF Inference API call ──────────────────────────────────────────
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.apiToken ? `Bearer ${this.apiToken}` : "",
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: options.max_length || 150,
                        temperature: options.temperature || 0.7,
                        top_p: options.top_p || 0.9,
                        return_full_text: false
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HF Inference API error: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();

            if (Array.isArray(result) && result[0]?.generated_text) {
                return result[0].generated_text.trim();
            }

            return null;
        } catch (error) {
            logger.error(`Error in BackendClient.generateText:`, error);
            return null;
        }
    }

    /**
     * Calculates embeddings for a given text.
     * Uses sentence-transformers — not subject to safety triage.
     */
    public async calculateEmbedding(text: string): Promise<number[]> {
        const model = "sentence-transformers/all-MiniLM-L6-v2";
        const url = `${this.baseUrl}${model}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.apiToken ? `Bearer ${this.apiToken}` : "",
                },
                body: JSON.stringify({ inputs: text }),
            });

            if (!response.ok) { return []; }

            const result = await response.json();
            return Array.isArray(result) ? result : [];
        } catch (error) {
            logger.error(`Error in BackendClient.calculateEmbedding:`, error);
            return [];
        }
    }
}

export const backendClient = BackendClient.getInstance();
