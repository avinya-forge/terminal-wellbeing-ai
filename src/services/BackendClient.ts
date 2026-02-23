import { logger } from './LoggerService';

export interface InferenceOptions {
    model?: string;
    temperature?: number;
    max_length?: number;
    top_p?: number;
}

export class BackendClient {
    private static instance: BackendClient;
    private apiToken: string | null = null;
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
     * This abstracts the heavy model processing from the client.
     */
    public async generateText(prompt: string, options: InferenceOptions = {}): Promise<string | null> {
        const model = options.model || "distilgpt2";
        const url = `${this.baseUrl}${model}`;

        if (!this.apiToken) {
            logger.warn("VITE_HF_TOKEN is not set. Inference API calls will likely fail.");
        }

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
     * This is used for memory retrieval and will eventually support backend dimensionality.
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
                body: JSON.stringify({
                    inputs: text
                }),
            });

            if (!response.ok) {
                return [];
            }

            const result = await response.json();
            return Array.isArray(result) ? result : [];
        } catch (error) {
            logger.error(`Error in BackendClient.calculateEmbedding:`, error);
            return [];
        }
    }
}

export const backendClient = BackendClient.getInstance();
