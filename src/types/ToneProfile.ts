/**
 * ToneProfile — result of analysing a single user message.
 * Scored 0–1 for each dimension; highest score wins model selection.
 */
export interface ToneProfile {
    /** Neutral, conversational, general query */
    neutral: number;
    /** Empathy-critical: sadness, grief, distress, loneliness */
    distressed: number;
    /** Short / one-liner requiring fast turnaround */
    brief: number;
    /** Detailed health question, multi-step reasoning required */
    complex: number;
}

export interface ModelSelection {
    modelId: string;
    modelName: string;
    reason: string;
    toneProfile: ToneProfile;
}
