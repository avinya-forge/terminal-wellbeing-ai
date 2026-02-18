import { UserProfile, SessionData } from '../types/ai';
import { analyzeText } from './analysis';
import { Message } from '../types/Message';

const STORAGE_KEY = 'wellbeing_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  lastInteraction: new Date().toISOString(),
  sentimentTrend: [],
  topics: {},
  messageCount: 0,
  privacyMode: false,
  preferences: {
    responseLength: 'medium',
    tone: 'empathetic'
  }
};

let currentProfile: UserProfile = loadProfile();
let currentSession: SessionData | null = null;

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user profile', e);
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile: UserProfile): void {
  if (profile.privacyMode) {
    // If privacy mode is enabled, ensure no data is left in storage
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function startSession(): SessionData {
  if (currentSession) return currentSession;

  const now = new Date().toISOString();
  currentSession = {
    id: `session_${Date.now()}`,
    startTime: now,
    messages: 0,
    currentMood: 'Neutral',
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
    return `User Mood: ${currentSession?.currentMood || 'Neutral'}. (Privacy Mode Active)`;
  }

  const sentimentAvg = currentProfile.sentimentTrend.length > 0
    ? currentProfile.sentimentTrend.reduce((a, b) => a + b, 0) / currentProfile.sentimentTrend.length
    : 0;

  const topTopics = Object.entries(currentProfile.topics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);

  let summary = `User Mood: ${currentSession?.currentMood || 'Neutral'}. `;
  if (topTopics.length > 0) {
    summary += `Interested in: ${topTopics.join(', ')}. `;
  }

  if (currentProfile.messageCount > 10) {
    summary += `Frequent user. `;
  } else if (currentProfile.messageCount < 3) {
    summary += `New user. `;
  }

  if (sentimentAvg < -0.4) {
    summary += `Seems distressed recently. Be extra supportive. `;
  } else if (sentimentAvg > 0.4) {
    summary += `Seems in good spirits. `;
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
  saveProfile(currentProfile);
}

// Privacy & Data Management

export function setPrivacyMode(enabled: boolean): void {
  currentProfile.privacyMode = enabled;
  if (enabled) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    saveProfile(currentProfile);
  }
}

export function getPrivacyMode(): boolean {
  return !!currentProfile.privacyMode;
}

export function togglePrivacy(): boolean {
  const newState = !getPrivacyMode();
  setPrivacyMode(newState);
  return newState;
}

export function exportSessionData(): string {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: currentProfile,
    currentSession: currentSession
  };
  return JSON.stringify(data, null, 2);
}
