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
};

// Type definition for the text generator function
export type TextGenerator = {
  (text: string, options: GenerationOptions): Promise<TextGeneratorOutput>;
};
