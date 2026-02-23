/**
 * EmergencyService — physical emergency keyword detection.
 *
 * Covers physical emergencies (chest pain, stroke, etc.) using Tier 1 keywords
 * from clinical_guidelines.json. Mental health triage is handled by SafetyTriageService.
 */
import { logger } from './LoggerService';
import clinicalGuidelines from '../data/clinical_guidelines.json';

export interface EmergencyStatus {
    isCritical: boolean;
    message?: string;
}

export class EmergencyService {
    private static instance: EmergencyService;

    private constructor() { }

    public static getInstance(): EmergencyService {
        if (!EmergencyService.instance) {
            EmergencyService.instance = new EmergencyService();
        }
        return EmergencyService.instance;
    }

    public checkCriticalSymptoms(input: string): EmergencyStatus {
        const normalizedInput = input.toLowerCase();
        // Use Tier 1 keywords from the updated schema
        const keywords = clinicalGuidelines.safety_tiers.tier1_immediate_emergency.keywords;

        const matchedKeyword = keywords.find(keyword => normalizedInput.includes(keyword));

        if (matchedKeyword) {
            logger.warn(`CRITICAL SYMPTOM DETECTED: "${matchedKeyword}"`);
            return {
                isCritical: true,
                message: `⚠️ [CRITICAL ALERT] You've mentioned something that may require immediate help. In the UK: 999 or Samaritans 116 123. In the US: 988. Please reach out now.`
            };
        }

        return { isCritical: false };
    }
}

export const emergencyService = EmergencyService.getInstance();
