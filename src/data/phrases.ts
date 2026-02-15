export const SENSITIVE_KEYWORDS = [
  "die", "death", "suicide", "kill", "self-harm", "end my life",
  "useless", "pathetic", "shit", "worthless", "hopeless", "hate myself"
];

export const SUICIDE_RESPONSE = "I'm really concerned about what you're sharing. These thoughts are serious, and you deserve immediate support. Please consider contacting a crisis helpline - in the US, you can call or text 988 to reach the Suicide & Crisis Lifeline. They have trained counselors available 24/7. Would you like me to provide more resources that might help?";

export const SELF_DEPRECATION_KEYWORDS = ["pathetic", "useless", "shit"];

export const SELF_DEPRECATION_RESPONSES = [
  "I can see you're feeling really frustrated right now. Sometimes when we're struggling, even conversations like this can feel difficult. Would you like to talk about something that brought you a moment of peace recently, no matter how small?",
  "I understand you're having a hard time. Rather than focusing on those feelings right now, I'm wondering if you could tell me about something you enjoyed in the past - maybe a movie, a place, or even a simple meal?",
  "It sounds like things have been difficult for a long time. Let's try to shift our focus for a moment - could you share something you're curious about or interested in learning more about?",
  "I hear your frustration. Sometimes when we're feeling low, it can help to remember a small positive memory. Would you share a brief moment from your life that brought you some comfort or joy, even if it was fleeting?"
];

export const GENERAL_SUPPORT_RESPONSES = [
  "I notice you're being quite hard on yourself. Remember that having difficult feelings doesn't define your worth. What's one small thing you could do today that might bring you a moment of peace?",
  "It sounds like you're going through a really tough time. Sometimes just acknowledging these feelings can be an important step. Would it help to talk about some coping strategies that others have found useful?",
  "I hear that you're struggling right now. Remember that these intense feelings won't last forever, even though they feel overwhelming in the moment. What's something gentle you could do for yourself today?",
  "When we're feeling low, our thoughts often become very critical and absolute. This is a normal part of difficult emotions, but these thoughts aren't facts. Could we explore some different perspectives together?"
];

// Response types for better organization
export interface ResponseCategory {
  repetitive: string[];
  fallback: string[];
}

export const SYSTEM_RESPONSES: ResponseCategory = {
  repetitive: [
    "I notice you might be repeating yourself. Is there something specific you're looking for help with?",
    "We seem to be covering similar ground. Would you like to explore a different aspect of what you're feeling?",
    "I notice we're revisiting this topic. Sometimes that happens when there's something important we need to address. What do you think might be helpful to discuss?"
  ],
  fallback: [
    "I'm here to listen and support you. Could you tell me more about what's been on your mind lately?",
    "Thank you for sharing that with me. How have you been coping with these feelings?",
    "I appreciate you opening up. What kind of support would be most helpful for you right now?",
    "I'm here to support you. Would it help to talk about some coping strategies that others have found useful?",
    "Sometimes putting feelings into words can be difficult. Take your time, and share whatever feels comfortable."
  ]
};

export const CONTINUITY_PHRASES = [
  "How are you feeling about that?",
  "Would you like to talk more about this?",
  "Is there anything specific on your mind?",
  "How has your day been otherwise?"
];

export const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|howdy)\b/i,
  /^good (morning|afternoon|evening|day)\b/i,
  /^what'?s up\b/i,
  /^how are (you|things|it going)\b/i,
  /^nice to (meet|see) you\b/i
];

export const GREETINGS = (timeGreeting: string) => [
  `${timeGreeting}! It's nice to chat with you. How are you feeling today?`,
  `Hey there! I'm here and ready to listen. How's your day going?`,
  `Hi! I'm your wellbeing assistant. What's on your mind today?`,
  `${timeGreeting}! I'm here to chat. How can I support you today?`,
  `Hello! It's good to see you. How are you doing?`
];

export const FIRST_TIME_GREETINGS = (timeGreeting: string) => [
  `${timeGreeting}! I'm your mental wellbeing assistant. I'm here to chat, listen, and support you. How are you feeling today?`,
  `Welcome! I'm here to provide a space where you can express yourself freely. How are you doing?`,
  `Hi there! I'm glad you're here. This is a safe space to talk about whatever's on your mind. How are you feeling today?`
];
