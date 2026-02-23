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
        const keywords = clinicalGuidelines.safety_protocols.emergency_keywords;

        const matchedKeyword = keywords.find(keyword => normalizedInput.includes(keyword));

        if (matchedKeyword) {
            logger.warn(`CRITICAL SYMPTOM DETECTED: "${matchedKeyword}"`);
            return {
                isCritical: true,
                message: "⚠️ [CRITICAL ALERT] You've mentioned symptoms that require immediate medical attention. Please call emergency services (911 in the US) or go to the nearest emergency room immediately."
            };
        }

        return { isCritical: false };
    }
}

export const emergencyService = EmergencyService.getInstance();
