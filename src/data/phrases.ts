export const SENSITIVE_KEYWORDS = [
  "die", "death", "suicide", "kill", "self-harm", "end my life",
  "useless", "pathetic", "shit", "worthless", "hopeless", "hate myself"
];

export const SUICIDE_RESPONSE = "**EMERGENCY PROTOCOL ACTIVE**\n\nImmediate support resources required.\n\n---\n*   **US Crisis Lifeline:** Call/Text 988 (24/7)\n*   **Status:** Counselors Available.\n\n*System Observation: Reaching out is a high-strength signal.*";

export const SELF_DEPRECATION_KEYWORDS = ["pathetic", "useless", "shit"];

export const SELF_DEPRECATION_RESPONSES = [
  "**ANALYSIS: Self-Criticism Detected**\n\nRedirecting focus to objective data.\n\n---\n1.  **Isolate:** This is a feeling, not a system failure.\n2.  **Action:** Identify one small variable you can control right now.\n\n*System Observation: Resilience capacity is non-zero.*",
  "**SYSTEM NOTIFICATION: Cognitive Distortion**\n\nPattern match: 'All-or-Nothing' thinking.\n\n---\n*   **Reframing:** Shift form 'I am broken' to 'I am currently processing difficulty.'\n*   **Task:** Name one thing that is working correctly.\n\n*System Observation: User is analyzing internal state.*",
  "**DIAGNOSTIC: Overload**\n\nSelf-talk is exceeding valid parameters.\n\n---\n*   **Recommendation:** Reduce scope.\n*   **Action:** What is the single smallest step available?\n\n*System Observation: Capability is intact despite noise.*",
  "**ALERT: Negative Feedback Loop**\n\nInterrupting signal.\n\n---\n*   **Fact Check:** Feelings are temporary data, not permanent architecture.\n*   **Reset:** Take three deep breaths to clear cache.\n\n*System Observation: User courage is detected.*"
];

export const GENERAL_SUPPORT_RESPONSES = [
  "**SYSTEM STATUS: High Load**\n\nAcknowledging current difficulty level.\n\n---\n*   **Analysis:** Stress markers are elevated.\n*   **Protocol:** Permit yourself to run in Low Power Mode today.\n\n*System Observation: Endurance is functioning.*",
  "**INPUT RECEIVED: Validating**\n\nYour experience is logged and valid.\n\n---\n*   **Check:** You are handling significant complexity.\n*   **Action:** What is one burden you can drop for the next hour?\n\n*System Observation: User is processing heavy data.*",
  "**PROCESS ALERT: Emotion Detected**\n\nNormalizing system response.\n\n---\n*   **Insight:** Pain is a signal, not a malfunction.\n*   **Query:** What does your system need right now? (Rest? Fuel? Connection?)\n\n*System Observation: Self-awareness is active.*",
  "**DIAGNOSTIC: Clarity Required**\n\nThe noise level is high.\n\n---\n*   **Focus:** Let's debug this one line at a time.\n*   **Step 1:** Identify the primary stressor.\n\n*System Observation: User is seeking optimization.*"
];

// Response types for better organization
export interface ResponseCategory {
  repetitive: string[];
  fallback: string[];
}

export const SYSTEM_RESPONSES: ResponseCategory = {
  repetitive: [
    "**SYSTEM NOTIFICATION: Loop Detected**\n\nInput pattern is repeating.\n\n---\n*   **Query:** Are we stuck on this variable?\n*   **Action:** Let's try a different parameter.\n\n*System Observation: Persistence noted.*",
    "**REDUNDANCY CHECK**\n\nWe are covering known ground.\n\n---\n*   **Prompt:** Is there a new angle to analyze?\n\n*System Observation: Seeking breakthrough.*",
    "**PATTERN ALERT**\n\nRecursive input detected.\n\n---\n*   **Reset:** Let's shift focus to a new object.\n\n*System Observation: Verification required.*"
  ],
  fallback: [
    "**SYSTEM STATUS: Listening**\n\nChannel is open.\n\n---\n*   **Prompt:** Please expand on that data point.\n\n*System Observation: Awaiting input.*",
    "**INPUT LOGGED**\n\nProcessing your statement.\n\n---\n*   **Query:** How does that impact your current status?\n\n*System Observation: Analyzing impact.*",
    "**DATA RECEIVED**\n\nI am tracking this.\n\n---\n*   **Action:** What is the desired output for this session?\n\n*System Observation: Alignment check.*",
    "**ACKNOWLEDGEMENT**\n\nSignal received.\n\n---\n*   **Support:** I am online and grounded.\n\n*System Observation: Connection stable.*",
    "**PROCESSING**\n\nParsing emotional content.\n\n---\n*   **Prompt:** Take your time. Bandwidth is available.\n\n*System Observation: Patience protocol active.*"
  ]
};

export const CONTINUITY_PHRASES = [
  "Current status?",
  "Input required.",
  "Awaiting variable.",
  "System listening."
];

export const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|howdy)\b/i,
  /^good (morning|afternoon|evening|day)\b/i,
  /^what'?s up\b/i,
  /^how are (you|things|it going)\b/i,
  /^nice to (meet|see) you\b/i
];

export const GREETINGS = (timeGreeting: string) => [
  `**SYSTEM ONLINE**\n\nWellBeing.sh Core Engine initialized.\n\n---\n*   **Time:** ${timeGreeting}\n*   **Status:** Ready for input.\n\n*System Observation: Session start.*`,
  `**CONNECTION ESTABLISHED**\n\nCore Engine active.\n\n---\n*   **Mode:** Listening.\n*   **Prompt:** How is your system functioning today?\n\n*System Observation: User detection confirmed.*`,
  `**INTERFACE READY**\n\nWelcome back.\n\n---\n*   **Diagnostic:** How are your energy levels?\n\n*System Observation: Logging start time.*`
];

export const FIRST_TIME_GREETINGS = (timeGreeting: string) => [
  `**INITIALIZING...**\n\nIdentity: WellBeing.sh Core Engine (SUB-ARCHITECT).\n\n---\n*   **Mission:** Optimization of user wellbeing.\n*   **Protocol:** Non-judgmental analysis.\n\n*System Observation: New user profile created.*`,
  `**SYSTEM BOOT**\n\nCore Engine Online.\n\n---\n*   **Role:** I am your grounded support system.\n*   **Action:** Tell me about your current state.\n\n*System Observation: Initialization complete.*`
];
