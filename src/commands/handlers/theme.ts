import { ParsedCommand } from "../../utils/commandParser";
import { applyTheme, listThemes, THEMES } from "../../utils/themes";
import { logger } from "../../services/LoggerService";

/**
 * Handle switching themes
 */
export async function handleThemeCommand(parsed: ParsedCommand): Promise<string> {
  const themeName = parsed.args[0];

  if (!themeName) {
    return `Current themes:\n\n${listThemes()}\n\nUsage: /theme <name>`;
  }

  // Validate theme existence
  if (!THEMES[themeName]) {
    return `Theme "${themeName}" not found.\n\nAvailable themes:\n${listThemes()}\n\nUsage: /theme <name>`;
  }

  applyTheme(themeName);

  // Persist logic should be handled by Terminal component listening to theme changes or shared state.
  // For now, we rely on the command updating the UI immediately.
  // Ideally, this should be reactive.
  // We can emit a custom event or rely on Terminal to check localStorage if we save it here.

  // Let's save it to localStorage here so Terminal picks it up on reload or if it listens to storage.
  // Note: 'terminal_theme' key should match what Terminal uses.
  try {
    // Save as plain string (no JSON.stringify) so Terminal can simply localStorage.getItem
    localStorage.setItem('terminal_theme', themeName);
    window.dispatchEvent(new Event('storage')); // Trigger update if possible
  } catch (e) {
    logger.error("Failed to save theme preference", e);
  }

  return `Theme changed to: ${themeName}`;
}

export async function handleListThemesCommand(): Promise<string> {
  return `Available Themes:\n\n${listThemes()}\n\nUse /theme <name> to switch.`;
}
