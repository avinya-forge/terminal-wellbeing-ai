// Type definition for the text generator output
export type TextGeneratorOutput = Array<{
  generated_text: string;
}>;

// Type definition for the text generator options
export type GenerationOptions = {
  max_length: number;
  temperature: number;
  top_p: number;
  no_repeat_ngram_size: number;
  // Use any to support additional options passed to HuggingFace pipeline
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// Type definition for the text generator function
export type TextGenerator = {
  (text: string, options: GenerationOptions): Promise<TextGeneratorOutput>;
};
