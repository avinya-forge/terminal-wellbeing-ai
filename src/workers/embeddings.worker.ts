import { pipeline, FeatureExtractionPipeline } from '@huggingface/transformers';

interface EmbedMessage {
  type: 'embed';
  id: string;
  text: string;
}

interface InitMessage {
  type: 'init';
}

type WorkerMessage = EmbedMessage | InitMessage;

// Store the promise to prevent race conditions on double-init
let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

const initializePipeline = (): Promise<FeatureExtractionPipeline> => {
  if (!extractorPromise) {
    // Use type assertion if necessary, but try to keep it safe
    // Cast options to any to avoid "Expression produces a union type that is too complex to represent" error
    // and "quantized does not exist in type PretrainedModelOptions" error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extractorPromise = (pipeline as any)('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      quantized: true,
    }) as Promise<FeatureExtractionPipeline>;
  }
  return extractorPromise;
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event;

  if (data.type === 'init') {
    try {
        await initializePipeline();
        self.postMessage({ type: 'init_complete' });
    } catch (error) {
        self.postMessage({ type: 'error', error: error instanceof Error ? error.message : String(error) });
    }
  } else if (data.type === 'embed') {
    try {
      const pipe = await initializePipeline();

      const output = await pipe(data.text, { pooling: 'mean', normalize: true });

      // Output is a Tensor. .data is the underlying TypedArray.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Accessing .data on the output which is typed as Tensor
      const embedding = Array.from(output.data);

      self.postMessage({ id: data.id, embedding });
    } catch (error) {
      self.postMessage({ id: data.id, error: error instanceof Error ? error.message : String(error) });
    }
  }
};
