import { analyseTone, selectModel, MODEL_REGISTRY } from './ModelRouter';

describe('ModelRouter', () => {

    describe('analyseTone()', () => {
        it('scores distressed high for sadness/grief keywords', () => {
            const profile = analyseTone("I feel so sad and lonely, I'm hopeless");
            expect(profile.distressed).toBeGreaterThanOrEqual(0.5);
            expect(profile.distressed).toBeLessThanOrEqual(1);
        });

        it('scores complex high for clinical questions', () => {
            const profile = analyseTone('Can you explain what medication side effects I should watch for with this treatment?');
            expect(profile.complex).toBeGreaterThanOrEqual(0.33);
        });

        it('scores brief high for short messages', () => {
            const profile = analyseTone('How are you?');
            expect(profile.brief).toBeGreaterThanOrEqual(0.9);
        });

        it('neutral is the residual — no distress/complexity/brief signals present', () => {
            const profile = analyseTone('Tell me about breathing exercises.');
            // neutral = 1 - topSignal; other signals should be low for this message
            expect(profile.distressed).toBeLessThan(0.5);
            expect(profile.complex).toBeLessThan(0.33);
        });

        it('all dimensions sum to a reasonable range (not all zero)', () => {
            const profile = analyseTone('I need some help today');
            const total = profile.distressed + profile.complex + profile.brief + profile.neutral;
            expect(total).toBeGreaterThan(0);
        });
    });

    describe('selectModel()', () => {
        it('selects Zephyr for distress signals', () => {
            const result = selectModel("I've been feeling so depressed and hopeless lately");
            expect(result.modelId).toBe(MODEL_REGISTRY.ZEPHYR.id);
        });

        it('selects Llama 3 for complex health reasoning', () => {
            const result = selectModel('Can you explain the clinical diagnosis and treatment options for my chronic symptoms?');
            expect(result.modelId).toBe(MODEL_REGISTRY.LLAMA3.id);
        });

        it('selects Phi-2 for short quick messages', () => {
            const result = selectModel('Hi!');
            expect(result.modelId).toBe(MODEL_REGISTRY.PHI2.id);
        });

        it('selects Mistral for neutral conversation', () => {
            const result = selectModel('Tell me about mindfulness techniques for general wellbeing.');
            expect(result.modelId).toBe(MODEL_REGISTRY.MISTRAL.id);
        });

        it('returns a reason string', () => {
            const result = selectModel('How are you doing?');
            expect(result.reason).toBeTruthy();
        });

        it('returns the toneProfile in the selection', () => {
            const result = selectModel('I feel anxious');
            expect(result.toneProfile).toBeDefined();
            expect(typeof result.toneProfile.distressed).toBe('number');
        });

        it('distress takes priority over complexity', () => {
            // A message with both distress AND complexity keywords
            const result = selectModel("I'm so depressed. Can you explain my medication treatment options?");
            expect(result.modelId).toBe(MODEL_REGISTRY.ZEPHYR.id);
        });
    });
});
