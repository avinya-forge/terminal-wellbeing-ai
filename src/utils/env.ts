/**
 * Safe environment variable access wrapper.
 * This abstracts import.meta.env to allow mocking in Jest (which lacks import.meta support).
 */
export const getEnv = (key: string): string | undefined => {
  return import.meta.env[key];
};
