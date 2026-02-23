import { ToneProfile, ModelSelection } from '../types/ToneProfile';
import type { SafetyTier } from './SafetyTriageService';
import { logger } from './LoggerService';

/**
 * ModelRouter — Adaptive AI Model Selection
 *
 * Analyses every user message for tone, emotional content, and complexity,
 * then routes the request to the most therapeutically appropriate HF model.
 *
 * Routing table:
 *   distressed  → Zephyr 7B        (empathetic, supportive tone)
 *   complex     → Llama 3 8B       (clinical reasoning, detail)
 *   brief       → Phi-2            (fast, lightweight)
 *   neutral     → Mistral 7B       (balanced conversational)
 */

// ─── Model Registry ──────────────────────────────────────────────────────────

interface ModelEntry { id: string; name: string; trigger: string; }

export const MODEL_REGISTRY: Record<string, ModelEntry> = {
    MISTRAL: {
        id: 'mistralai/Mistral-7B-Instruct-v0.2',
        name: 'Mistral 7B Instruct',
        trigger: 'Neutral / conversational / general queries',
    },
    LLAMA3: {
        id: 'meta-llama/Meta-Llama-3-8B-Instruct',
        name: 'Llama 3 8B Instruct',
        trigger: 'Complex reasoning / detailed health questions',
    },
    PHI2: {
        id: 'microsoft/phi-2',
        name: 'Phi-2',
        trigger: 'Short / quick exchanges / low-latency',
    },
    ZEPHYR: {
        id: 'HuggingFaceH4/zephyr-7b-beta',
        name: 'Zephyr 7B',
        trigger: 'Distress / sadness / grief / empathy-critical',
    },
} as const;

// ─── Keyword Sets ─────────────────────────────────────────────────────────────

const DISTRESS_KEYWORDS = [
    'sad', 'sadness', 'depressed', 'depression', 'hopeless', 'worthless',
    'lonely', 'alone', 'grief', 'heartbroken', 'devastated', 'crying',
    'anxious', 'anxiety', 'panic', 'scared', 'terrified', 'overwhelmed',
    'exhausted', "can't cope", 'struggling', 'hurting', "don't want to",
    'giving up', 'no point', 'empty', 'numb', 'miserable', 'broken',
];

const COMPLEXITY_KEYWORDS = [
    'why', 'how does', 'explain', 'symptom', 'diagnosis', 'treatment',
    'medication', 'side effect', 'dosage', 'interact', 'cause', 'condition',
    'chronic', 'clinical', 'medical', 'doctor', 'hospital', 'therapy',
    'what should i', 'what do you think about', 'help me understand',
];

const BRIEF_PATTERN = /^.{1,40}[?!.]?$/; // ≤40 chars → probably a quick question

// ─── Tone Analyser ────────────────────────────────────────────────────────────

/**
 * Scores a message across four emotional/complexity dimensions.
 * Each dimension returns a value 0–1.
 */
export function analyseTone(message: string): ToneProfile {
    const lower = message.toLowerCase();
    const words = lower.split(/\s+/);

    // Distress score: fraction of distress keywords found (capped at 1)
    const distressHits = DISTRESS_KEYWORDS.filter(kw => lower.includes(kw)).length;
    const distressed = Math.min(distressHits / 2, 1); // 2+ keywords = max score

    // Complexity score: fraction of complexity indicators found
    const complexHits = COMPLEXITY_KEYWORDS.filter(kw => lower.includes(kw)).length;
    const complex = Math.min(complexHits / 3, 1); // 3+ = max score

    // Brief score: short messages get a high score
    const brief = BRIEF_PATTERN.test(message.trim()) && words.length <= 8 ? 0.9 : 0;

    // Neutral: everything else — inversely proportional to other signals
    const topSignal = Math.max(distressed, complex, brief);
    const neutral = Math.max(0, 1 - topSignal);

    return { neutral, distressed, complex, brief };
}

// ─── Router ───────────────────────────────────────────────────────────────────

/**
 * Selects the best model for a given user message.
 *
 * Safety tier overrides tone-based routing:
 *   HIGH_SENSITIVITY → always Zephyr 7B (empathetic)
 *   SAFE (default)   → distressed > complex > brief > neutral
 */
export function selectModel(message: string, safetyTier: SafetyTier = 'SAFE'): ModelSelection {
    const toneProfile = analyseTone(message);
    const { neutral, distressed, complex, brief } = toneProfile;

    let chosen = MODEL_REGISTRY.MISTRAL;
    let reason = 'Neutral/conversational tone detected';

    // Safety tier overrides tone scoring — HIGH_SENSITIVITY mandates Zephyr
    if (safetyTier === 'HIGH_SENSITIVITY') {
        chosen = MODEL_REGISTRY.ZEPHYR;
        reason = 'Safety tier HIGH_SENSITIVITY — empathy model mandated by NHS safe messaging guidelines';
    } else if (distressed >= 0.5) {
        chosen = MODEL_REGISTRY.ZEPHYR;
        reason = `Distress/empathy signals detected (score: ${distressed.toFixed(2)})`;
    } else if (complex >= 0.33) {
        chosen = MODEL_REGISTRY.LLAMA3;
        reason = `Complex health reasoning required (score: ${complex.toFixed(2)})`;
    } else if (brief >= 0.9 && distressed < 0.3 && complex < 0.2) {
        chosen = MODEL_REGISTRY.PHI2;
        reason = `Short message — fast response preferred (score: ${brief.toFixed(2)})`;
    }

    const selection: ModelSelection = {
        modelId: chosen.id,
        modelName: chosen.name,
        reason,
        toneProfile,
    };

    logger.debug(
        `[ModelRouter] → ${chosen.name} | ${reason} | tone: ${JSON.stringify({
            neutral: neutral.toFixed(2),
            distressed: distressed.toFixed(2),
            complex: complex.toFixed(2),
            brief: brief.toFixed(2),
        })}`
    );

    return selection;
}
