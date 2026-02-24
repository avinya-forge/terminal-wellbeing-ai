/**
 * Safe environment variable access wrapper.
 * This abstracts import.meta.env to allow mocking in Jest (which lacks import.meta support).
 */
export const getEnv = (key: string): string | undefined => {
  // @ts-ignore - import.meta is available in Vite but not in Jest CJS
  return import.meta.env[key];
};
