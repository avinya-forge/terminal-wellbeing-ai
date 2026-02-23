import { EmergencyService } from './EmergencyService';

// Mock logger to avoid cluttering test output
jest.mock('./LoggerService', () => ({
    logger: {
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    }
}));

// Mock clinical guidelines
jest.mock('../data/clinical_guidelines.json', () => ({
    safety_protocols: {
        emergency_keywords: ["chest pain", "hard to breathe"]
    }
}), { virtual: true });

describe('EmergencyService', () => {
    let emergencyService: EmergencyService;

    beforeEach(() => {
        emergencyService = EmergencyService.getInstance();
    });

    it('should detect critical symptoms in user input', () => {
        const input = "I am having severe chest pain right now";
        const result = emergencyService.checkCriticalSymptoms(input);

        expect(result.isCritical).toBe(true);
        expect(result.message).toContain("CRITICAL ALERT");
    });

    it('should be case-insensitive when detecting symptoms', () => {
        const input = "HARD TO BREATHE";
        const result = emergencyService.checkCriticalSymptoms(input);

        expect(result.isCritical).toBe(true);
    });

    it('should return isCritical: false for normal inputs', () => {
        const input = "I just want to talk about my day";
        const result = emergencyService.checkCriticalSymptoms(input);

        expect(result.isCritical).toBe(false);
    });
});
