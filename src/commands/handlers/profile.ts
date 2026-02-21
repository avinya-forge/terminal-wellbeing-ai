import { ParsedCommand } from "../../utils/commandParser";
import { getUserProfile, updateUserProfile, clearProfile, exportProfileData } from "../../utils/sessionManager";

export async function handleProfileCommand(parsed: ParsedCommand): Promise<string> {
  const profile = getUserProfile();

  if (parsed.args.length === 0) {
    const name = profile.userName || "Not set";
    const tone = profile.preferences?.tone || "empathetic";
    const length = profile.preferences?.responseLength || "medium";
    const speed = profile.preferences?.speed || "medium";
    const messages = profile.messageCount || 0;
    const warnings = profile.triggerWarnings?.length ? profile.triggerWarnings.join(", ") : "None";

    return `User Profile:
Name: ${name}
Preferred Tone: ${tone}
Response Length: ${length}
Response Speed: ${speed}
Messages Exchanged: ${messages}
Trigger Warnings: ${warnings}

Usage:
/profile name <your_name>
/profile tone <casual|formal|empathetic>
/profile length <short|medium|long>
/profile speed <fast|medium|slow>
/profile warnings <topic1>, <topic2>
/profile reset
/profile export
/profile view`;
  }

  const subCommand = parsed.args[0].toLowerCase();
  const value = parsed.args.slice(1).join(" ").trim();

  if (subCommand === "view") {
    const name = profile.userName || "Not set";
    const tone = profile.preferences?.tone || "empathetic";
    const length = profile.preferences?.responseLength || "medium";
    const speed = profile.preferences?.speed || "medium";
    const messages = profile.messageCount || 0;
    const warnings = profile.triggerWarnings?.length ? profile.triggerWarnings.join(", ") : "None";

    return `User Profile Details:
---------------------
Name: ${name}
Tone: ${tone}
Length: ${length}
Speed: ${speed}
Messages: ${messages}
Warnings: ${warnings}
Privacy Mode: ${profile.privacyMode ? "Enabled" : "Disabled"}`;
  }

  if (subCommand === "name") {
    if (!value) return "Please provide a name. Usage: /profile name <your_name>";

    if (value.length > 50) {
        return "Name is too long. Please keep it under 50 characters.";
    }

    // Basic validation
    if (/[^a-zA-Z0-9\s\-_]/.test(value)) {
        return "Name contains invalid characters. Please use letters, numbers, spaces, hyphens, or underscores.";
    }

    updateUserProfile({ userName: value });
    return `Profile updated. Nice to meet you, ${value}.`;
  }

  if (subCommand === "tone") {
    const validTones = ["casual", "formal", "empathetic"] as const;
    if (!(validTones as readonly string[]).includes(value)) {
      return `Invalid tone. Options: ${validTones.join(", ")}`;
    }

    updateUserProfile({
      preferences: {
        ...profile.preferences,
        tone: value as typeof validTones[number]
      }
    });
    return `Profile updated. I will try to be more ${value} in my responses.`;
  }

  if (subCommand === "length") {
    const validLengths = ["short", "medium", "long"] as const;
    if (!(validLengths as readonly string[]).includes(value)) {
      return `Invalid length. Options: ${validLengths.join(", ")}`;
    }

    updateUserProfile({
      preferences: {
        ...profile.preferences,
        responseLength: value as typeof validLengths[number]
      }
    });
    return `Profile updated. I will keep my responses ${value}.`;
  }

  if (subCommand === "speed") {
    const validSpeeds = ["fast", "medium", "slow"] as const;
    if (!(validSpeeds as readonly string[]).includes(value)) {
      return `Invalid speed. Options: ${validSpeeds.join(", ")}`;
    }

    updateUserProfile({
      preferences: {
        ...profile.preferences,
        speed: value as typeof validSpeeds[number]
      }
    });
    return `Profile updated. I will respond at ${value} speed.`;
  }

  if (subCommand === "warnings" || subCommand === "trigger-warnings") {
    if (!value) {
       return `Current Trigger Warnings: ${profile.triggerWarnings?.join(", ") || "None"}.
Usage: /profile warnings <topic1>, <topic2>`;
    }

    const warnings = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    updateUserProfile({ triggerWarnings: warnings });
    return `Trigger warnings updated: ${warnings.join(", ")}`;
  }

  if (subCommand === "reset") {
      if (value === "confirm") {
          clearProfile();
          return "Profile has been reset to defaults.";
      }
      return "Are you sure you want to reset your profile? This cannot be undone.\nType '/profile reset confirm' to proceed.";
  }

  if (subCommand === "export") {
      const data = exportProfileData();
      return `Here is your profile data (JSON):

${data}

You can copy and save this text.`;
  }

  return `Unknown subcommand '${subCommand}'. Try /profile for options.`;
}
