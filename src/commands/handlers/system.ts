import { ParsedCommand } from "../../utils/commandParser";
import { getHelpResponse } from "../../data/responses";
import { exportSessionData } from "../../utils/sessionManager";
import { getAsciiArt } from "../../utils/ascii";

export async function handleHelpCommand(): Promise<string> {
    return getHelpResponse();
}

/**
 * Handle export session command
 */
export async function handleExportCommand(): Promise<string> {
    const data = exportSessionData();
    return `Here is your session data export (JSON):

${data}

You can copy and save this text for your records.`;
}

/**
 * Handle displaying ASCII art
 */
export async function handleArtCommand(parsed: ParsedCommand): Promise<string> {
  const mood = parsed.args[0];
  if (!mood) {
    return `Usage: /art <mood>\nTry: happy, sad, zen, coffee, heart, cat, tree`;
  }
  return getAsciiArt(mood);
}
