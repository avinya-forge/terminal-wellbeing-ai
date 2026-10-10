import guidelines from './clinical_guidelines.json';

describe('clinical_guidelines.json validation', () => {
    it('ensures all keywords are strictly lowercase to prevent case-mismatch regressions', () => {
        const tiers = guidelines.safety_tiers;
        const allKeywords = [
            ...tiers.tier1_immediate_emergency.keywords,
            ...tiers.tier2_unsafe_territory.keywords,
            ...tiers.tier3_high_sensitivity.keywords,
        ];

        allKeywords.forEach(keyword => {
            expect(keyword).toBe(keyword.toLowerCase());
        });
    });
});
