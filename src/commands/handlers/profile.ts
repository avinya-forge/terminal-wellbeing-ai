import { ParsedCommand } from "../../utils/commandParser";
import { getUserProfile, updateUserProfile } from "../../utils/sessionManager";

export async function handleProfileCommand(parsed: ParsedCommand): Promise<string> {
  const profile = getUserProfile();

  if (parsed.args.length === 0) {
    const name = profile.userName || "Not set";
    const tone = profile.preferences?.tone || "empathetic";
    const length = profile.preferences?.responseLength || "medium";
    const messages = profile.messageCount || 0;

    return `User Profile:
Name: ${name}
Preferred Tone: ${tone}
Response Length: ${length}
Messages Exchanged: ${messages}

Usage:
/profile name <your_name>
/profile tone <casual|formal|empathetic>
/profile length <short|medium|long>`;
  }

  const subCommand = parsed.args[0].toLowerCase();
  const value = parsed.args.slice(1).join(" ").trim();

  if (subCommand === "name") {
    if (!value) return "Please provide a name. Usage: /profile name <your_name>";
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

  return `Unknown subcommand '${subCommand}'. Try /profile for options.`;
}
