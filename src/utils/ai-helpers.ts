import { SENSITIVE_KEYWORDS, GREETING_PATTERNS, CONTINUITY_PHRASES } from "../data/phrases";

// Helper function to escape special characters in strings for RegExp
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Sanitize user input to prevent prompt injection by neutralizing delimiters
export function sanitizePromptContent(text: string): string {
  if (!text) return "";
  return text
    .replace(/Human:/gi, (match) => match.replace(':', '_'))
    .replace(/Assistant:/gi, (match) => match.replace(':', '_'))
    .replace(/System:/gi, (match) => match.replace(':', '_'));
}

// Check if the topic is sensitive and needs special handling
export function isSensitiveTopic(input: string): boolean {
  const normalizedInput = input.toLowerCase();
  return SENSITIVE_KEYWORDS.some(keyword => normalizedInput.includes(keyword));
}

// Check if input is a greeting or introduction
export function isGreeting(input: string): boolean {
  return GREETING_PATTERNS.some(pattern => pattern.test(input.trim()));
}

// Post-process the response to improve quality and conversational flow
export function postProcessResponse(response: string, input: string): string {
  // Remove any repetitive phrases
  const lines = response.split('\n').filter(line => line.trim() !== '');
  let processedResponse = response;

  if (lines.length > 1) {
    // Remove duplicate consecutive lines
    const uniqueLines = lines.filter((line, index, arr) =>
      index === 0 || line !== arr[index - 1]
    );
    processedResponse = uniqueLines.join('\n');
  }

  // Ensure the response doesn't repeat the user's input verbatim
  if (processedResponse.toLowerCase().includes(input.toLowerCase()) && input.length > 5) {
    try {
      processedResponse = processedResponse.replace(new RegExp(escapeRegExp(input), 'gi'), 'what you mentioned');
    } catch (e) {
      // If regex fails, just continue without this replacement
      console.warn('Regex replacement failed:', e);
    }
  }

  // Add conversation continuity phrases if the response is short
  if (processedResponse.length < 30 && !processedResponse.includes('?')) {
    processedResponse += " " + CONTINUITY_PHRASES[Math.floor(Math.random() * CONTINUITY_PHRASES.length)];
  }

  return processedResponse;
}
