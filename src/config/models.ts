// Available models configuration
export interface ModelConfig {
  name: string;
  displayName: string;
  maxLength: number;
  temperature: number;
  topP: number;
  noRepeatNgramSize: number;
  device: "wasm" | "auto" | "gpu" | "cpu" | "webgpu";
  description: string;
  isConversational: boolean;
}

// Multiple model options for different conversation needs
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    name: "distilgpt2",
    displayName: "DistilGPT-2",
    maxLength: 100,
    temperature: 0.7,
    topP: 0.9,
    noRepeatNgramSize: 2,
    device: "wasm",
    description: "Lightweight general-purpose model",
    isConversational: true
  },
  {
    name: "gpt2",
    displayName: "GPT-2",
    maxLength: 150,
    temperature: 0.8,
    topP: 0.92,
    noRepeatNgramSize: 3,
    device: "wasm",
    description: "Larger general-purpose model with better context handling",
    isConversational: true
  },
  {
    name: "EleutherAI/gpt-neo-125M",
    displayName: "GPT-Neo",
    maxLength: 200,
    temperature: 0.75,
    topP: 0.95,
    noRepeatNgramSize: 3,
    device: "wasm",
    description: "Open-source GPT alternative with improved reasoning",
    isConversational: true
  }
];
