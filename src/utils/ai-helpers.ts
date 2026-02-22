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

// Filter content based on user-defined trigger warnings
export function filterContent(text: string, warnings: string[] = []): string {
  if (!text || !warnings || !warnings.length) return text;

  let processed = text;
  for (const warning of warnings) {
    if (!warning || !warning.trim()) continue;
    try {
      // Use word boundaries \b to avoid matching substrings (e.g. "cat" in "category")
      // Flag 'gi' for global case-insensitive replacement
      const regex = new RegExp(`\\b${escapeRegExp(warning.trim())}\\b`, 'gi');
      processed = processed.replace(regex, '[REDACTED]');
    } catch (e) {
      console.warn(`Failed to create regex for warning: ${warning}`, e);
    }
  }
  return processed;
}

// Post-process the response to improve quality and conversational flow
export function postProcessResponse(response: string, input: string, warnings: string[] = []): string {
  // Logic to preserve Markdown formatting while removing repetitive phrases
  let processedResponse = response;

  const lines = response.split('\n');
  if (lines.length > 1) {
    const cleanedLines: string[] = [];
    let lastNonEmptyLine = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') {
        // Keep empty lines for formatting
        cleanedLines.push(line);
      } else {
        // Only add if it's not a duplicate of the last non-empty line
        if (trimmed !== lastNonEmptyLine) {
          cleanedLines.push(line);
          lastNonEmptyLine = trimmed;
        }
      }
    }
    processedResponse = cleanedLines.join('\n');

    // Collapse 3+ newlines to 2 (one blank line) to prevent excessive spacing
    processedResponse = processedResponse.replace(/\n{3,}/g, '\n\n');
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

  // Apply trigger warning filtering
  if (warnings && warnings.length > 0) {
    processedResponse = filterContent(processedResponse, warnings);
  }

  return processedResponse;
}
