import { UserProfile, SessionData } from '../types/ai';
import { analyzeText } from './analysis';
import { Message } from '../types/Message';
import { journalService } from '../services/JournalService';
import { memoryService } from '../services/MemoryService';
import { MOODS } from '../constants/moods';
import { logger } from '../services/LoggerService';

const STORAGE_KEY = 'wellbeing_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  lastInteraction: new Date().toISOString(),
  sentimentTrend: [],
  topics: {},
  messageCount: 0,
  privacyMode: false,
  triggerWarnings: [],
  preferences: {
    responseLength: 'medium',
    tone: 'empathetic',
    speed: 'medium'
  }
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let currentProfile: UserProfile = loadProfile();
// Initialize services privacy mode based on loaded profile
journalService.setPrivacyMode(!!currentProfile.privacyMode);
// Suppress unhandled promise rejection and async log bleed in tests
const privacyPromise = memoryService.setPrivacyMode(!!currentProfile.privacyMode);
if (privacyPromise && typeof privacyPromise.catch === 'function') {
  privacyPromise.catch(e => {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Failed to set privacy mode on load', e);
    }
  });
}

let currentSession: SessionData | null = null;

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    logger.error('Failed to load user profile', e);
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile: UserProfile, force: boolean = false): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }

  if (profile.privacyMode) {
    // If privacy mode is enabled, ensure no data is left in storage
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      logger.error('Failed to save user profile', e);
    }
  };

  if (force) {
    persist();
  } else {
    saveTimeout = setTimeout(persist, 1000);
  }
}

export function startSession(): SessionData {
  if (currentSession) return currentSession;

  const now = new Date().toISOString();
  currentSession = {
    id: `session_${Date.now()}`,
    startTime: now,
    messages: 0,
    currentMood: MOODS.NEUTRAL,
    profile: currentProfile
  };

  return currentSession;
}

export function updateSession(message: Message): void {
  if (!currentSession) startSession();
  if (!currentSession) return; // Should not happen

  // Only analyze user messages
  if (message.sender === 'user') {
    const analysis = analyzeText(message.content);

    // Update profile
    currentProfile.messageCount++;
    currentProfile.lastInteraction = new Date().toISOString();

    // Update sentiment trend (keep last 5)
    currentProfile.sentimentTrend.push(analysis.sentiment);
    if (currentProfile.sentimentTrend.length > 5) {
      currentProfile.sentimentTrend.shift();
    }

    // Update topics
    analysis.topics.forEach(topic => {
      currentProfile.topics[topic] = (currentProfile.topics[topic] || 0) + 1;
    });

    // Update session mood
    currentSession.currentMood = analysis.mood;
    currentSession.messages++;

    saveProfile(currentProfile);
  }
}

export function getProfileSummary(): string {
  if (currentProfile.privacyMode) {
    return `User Mood: ${currentSession?.currentMood || MOODS.NEUTRAL}. (Privacy Mode Active)`;
  }

  const sentimentAvg = currentProfile.sentimentTrend.length > 0
    ? currentProfile.sentimentTrend.reduce((a, b) => a + b, 0) / currentProfile.sentimentTrend.length
    : 0;

  const topTopics = Object.entries(currentProfile.topics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);

  let summary = "";

  if (currentProfile.userName) {
    summary += `User's name is ${currentProfile.userName}. `;
  }

  summary += `User Mood: ${currentSession?.currentMood || MOODS.NEUTRAL}. `;

  if (topTopics.length > 0) {
    summary += `Recent topics: ${topTopics.join(', ')}. `;
  }

  // Preferences
  const { tone, responseLength } = currentProfile.preferences;
  summary += `Please use a ${tone} tone and keep responses ${responseLength}. `;

  if (currentProfile.messageCount > 20) {
    summary += `This is a long-term user. `;
  } else if (currentProfile.messageCount < 5) {
    summary += `This is a new user, be welcoming. `;
  }

  if (sentimentAvg < -0.4) {
    summary += `User seems distressed recently. Be extra supportive and validate their feelings. `;
  } else if (sentimentAvg > 0.4) {
    summary += `User seems in good spirits. `;
  }

  return summary;
}

export function resetSession(): void {
  currentSession = null;
  // We don't delete profile, just session state if we had any
}

export function clearProfile(): void {
  currentProfile = {
    ...DEFAULT_PROFILE,
    sentimentTrend: [],
    topics: {},
    preferences: { ...DEFAULT_PROFILE.preferences }
  };
  saveProfile(currentProfile, true);
}

// Privacy & Data Management

export async function setPrivacyMode(enabled: boolean): Promise<void> {
  currentProfile.privacyMode = enabled;
  journalService.setPrivacyMode(enabled);
  await memoryService.setPrivacyMode(enabled);
  if (enabled) {
    localStorage.removeItem(STORAGE_KEY);
    // Explicitly clear sensitive session data
    localStorage.removeItem('terminal_messages');
  } else {
    saveProfile(currentProfile, true);
  }
}

export function getPrivacyMode(): boolean {
  return !!currentProfile.privacyMode;
}

export async function togglePrivacy(): Promise<boolean> {
  const newState = !getPrivacyMode();
  await setPrivacyMode(newState);
  return newState;
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  currentProfile = {
    ...currentProfile,
    ...updates,
    preferences: {
      ...currentProfile.preferences,
      ...(updates.preferences || {})
    }
  };
  saveProfile(currentProfile);
}

export function getUserProfile(): UserProfile {
  return { ...currentProfile };
}

export function exportSessionData(): string {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: currentProfile,
    currentSession: currentSession,
    journal: journalService.getNotes()
  };
  return JSON.stringify(data, null, 2);
}

export function exportProfileData(): string {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: currentProfile
  };
  return JSON.stringify(data, null, 2);
}

export function exportSessionMarkdown(): string {
  const notes = journalService.getNotes();
  const summary = getProfileSummary();
  const date = new Date().toLocaleString();

  let md = `# Wellbeing Session Export - ${date}\n\n`;
  md += `## Profile Summary\n${summary}\n\n`;

  if (currentSession) {
    md += `## Current Session\n`;
    md += `- Mood: ${currentSession.currentMood}\n`;
    md += `- Messages: ${currentSession.messages}\n`;
    md += `- Duration: Since ${new Date(currentSession.startTime).toLocaleTimeString()}\n\n`;
  }

  if (notes.length > 0) {
    md += `## Journal Notes\n`;
    notes.forEach(note => {
      md += `### ${new Date(note.timestamp).toLocaleString()}\n`;
      md += `${note.content}\n\n`;
    });
  }

  return md;
}
