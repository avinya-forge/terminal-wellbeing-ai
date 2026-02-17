/**
 * Interface for a parsed command
 */
export interface ParsedCommand {
  command: string;
  args: string[];
  originalInput: string;
}

/**
 * Parses a command string into command name and arguments.
 * Handles quoted arguments (single or double quotes).
 *
 * Examples:
 * - /help -> { command: 'help', args: [] }
 * - /resources anxiety -> { command: 'resources', args: ['anxiety'] }
 * - /search "mental health" -> { command: 'search', args: ['mental health'] }
 * - help -> { command: 'help', args: [] }
 *
 * @param input The raw input string
 * @returns ParsedCommand object or null if input is empty or invalid
 */
export function parseCommand(input: string): ParsedCommand | null {
  if (!input || !input.trim()) return null;

  const trimmedInput = input.trim();
  const isSlashCommand = trimmedInput.startsWith('/');

  // Regex to match:
  // 1. Quoted strings: "foo bar" or 'foo bar'
  // 2. Non-whitespace sequences: foo
  const regex = /"([^"]*)"|'([^']*)'|([^\s"']+)/g;

  const tokens: string[] = [];
  let match;

  while ((match = regex.exec(trimmedInput)) !== null) {
    const token = match[1] !== undefined ? match[1] :
                  match[2] !== undefined ? match[2] :
                  match[3];

    if (token !== undefined) {
      tokens.push(token);
    }
  }

  if (tokens.length === 0) return null;

  let commandName = tokens[0];
  let argsStartIndex = 1;

  if (isSlashCommand) {
      if (commandName.startsWith('/')) {
          commandName = commandName.substring(1);

          // Handle case where slash is separate token (e.g. "/ help")
          if (commandName === '') {
               if (tokens.length > 1) {
                   commandName = tokens[1];
                   argsStartIndex = 2;
               } else {
                   return null; // Just "/"
               }
          }
      }
  }

  // Remove the command tokens to get args
  const args = tokens.slice(argsStartIndex);

  return {
    command: commandName.toLowerCase(),
    args,
    originalInput: input
  };
}
