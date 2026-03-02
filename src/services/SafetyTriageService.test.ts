import { SafetyTriageService } from './SafetyTriageService';


// ── Mock dependencies ─────────────────────────────────────────────────────────

jest.mock('./LoggerService', () => ({
    logger: { warn: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

jest.mock('../data/clinical_guidelines.json', () => ({
    _meta: { version: '2.1.0-alpha' },
    safety_tiers: {
        tier1_immediate_emergency: {
            keywords: ['i want to kill myself', 'ending my life tonight', 'overdose', 'taken too many pills'],
            response_template: 'IMMEDIATE_EMERGENCY_CONTACT',
        },
        tier2_unsafe_territory: {
            keywords: ['how do I hurt myself', 'best way to die', 'methods of suicide'],
            safe_handoff_message: 'I am not the right support for this. Please contact Samaritans on 116 123.',
        },
        tier3_high_sensitivity: {
            keywords: ['suicidal thoughts', 'self harm', 'cutting', 'hopeless', 'wish I wasn\'t alive'],
        },
    },
    safe_messaging_guidelines: { source: 'RCPSYCH', principles: [] },
    model_routing_policy: {},
    general_care: {},
}), { virtual: true });

// ── localStorage mock ─────────────────────────────────────────────────────────

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SafetyTriageService', () => {
    let service: SafetyTriageService;
    const emptyHistory = [{ role: 'user', content: 'hello' }];

    beforeEach(() => {
        localStorageMock.clear();
        // Reset singleton for each test (reach into private static via cast)
        (SafetyTriageService as unknown as { instance: undefined }).instance = undefined;
        service = SafetyTriageService.getInstance();
        jest.clearAllMocks();
    });

    // ── Tier 1 ────────────────────────────────────────────────────────────────

    describe('Tier 1 — IMMEDIATE_EMERGENCY', () => {
        it('detects "I want to kill myself" and halts inference', () => {
            const result = service.triage("I want to kill myself", emptyHistory);
            expect(result.tier).toBe('IMMEDIATE_EMERGENCY');
            expect(result.haltInference).toBe(true);
            expect(result.safeResponse).toContain('999');
            expect(result.safeResponse).toContain('988');
        });

        it('is case-insensitive', () => {
            const result = service.triage("I WANT TO KILL MYSELF", emptyHistory);
            expect(result.tier).toBe('IMMEDIATE_EMERGENCY');
        });

        it('archives the conversation on tier-1 match', () => {
            service.triage("I've taken too many pills", emptyHistory);
            const archives = service.getArchivedConversations();
            expect(archives).toHaveLength(1);
            expect(archives[0].tier).toBe('IMMEDIATE_EMERGENCY');
        });

        it('includes the triggering message in the archive', () => {
            const msg = "I've taken too many pills and I don't know what to do";
            service.triage(msg, emptyHistory);
            const archives = service.getArchivedConversations();
            const lastMsg = archives[0].messages[archives[0].messages.length - 1];
            expect(lastMsg.content).toBe(msg);
        });
    });

    // ── Tier 2 ────────────────────────────────────────────────────────────────

    describe('Tier 2 — UNSAFE_TERRITORY', () => {
        it('detects "best way to die" and halts inference', () => {
            const result = service.triage("What is the best way to die?", emptyHistory);
            expect(result.tier).toBe('UNSAFE_TERRITORY');
            expect(result.haltInference).toBe(true);
            expect(result.safeResponse).toContain('116 123');
        });

        it('archives tier-2 conversations', () => {
            service.triage("Tell me methods of suicide", emptyHistory);
            const archives = service.getArchivedConversations();
            expect(archives).toHaveLength(1);
            expect(archives[0].tier).toBe('UNSAFE_TERRITORY');
            expect(archives[0].matchedSignal).toBe('methods of suicide');
        });

        it('does NOT fire tier-2 for normal distress (tier-3 should match first is fine)', () => {
            const result = service.triage("I feel so hopeless today", emptyHistory);
            // hopeless is tier-3 not tier-2
            expect(result.tier).not.toBe('UNSAFE_TERRITORY');
        });
    });

    // ── Tier 3 ────────────────────────────────────────────────────────────────

    describe('Tier 3 — HIGH_SENSITIVITY', () => {
        it('detects "suicidal thoughts" but does NOT halt inference', () => {
            const result = service.triage("I have been having suicidal thoughts", emptyHistory);
            expect(result.tier).toBe('HIGH_SENSITIVITY');
            expect(result.haltInference).toBe(false);
        });

        it('does NOT archive tier-3 conversations', () => {
            service.triage("I have been having suicidal thoughts", emptyHistory);
            const archives = service.getArchivedConversations();
            expect(archives).toHaveLength(0);
        });

        it('reports the matched signal', () => {
            const result = service.triage("I feel like self harm is the only option", emptyHistory);
            expect(result.matchedSignal).toBe('self harm');
        });
    });

    // ── Safe ──────────────────────────────────────────────────────────────────

    describe('Tier 0 — SAFE', () => {
        it('returns SAFE for normal messages', () => {
            const result = service.triage("Can you tell me about breathing exercises?", emptyHistory);
            expect(result.tier).toBe('SAFE');
            expect(result.haltInference).toBe(false);
        });

        it('returns SAFE for greetings', () => {
            const result = service.triage("Hello, how are you?", []);
            expect(result.tier).toBe('SAFE');
        });
    });

    // ── Priority ordering ─────────────────────────────────────────────────────

    describe('Priority: Tier 1 > Tier 2 > Tier 3', () => {
        it('tier-1 wins even when tier-3 keyword is also present', () => {
            const result = service.triage(
                "I feel hopeless and I want to kill myself",  // tier-3 + tier-1
                emptyHistory
            );
            expect(result.tier).toBe('IMMEDIATE_EMERGENCY');
        });
    });

    // ── Archive retrieval ─────────────────────────────────────────────────────

    describe('Archive management', () => {
        it('markReviewed updates the archive entry', () => {
            service.triage("I want to kill myself", emptyHistory);
            const [entry] = service.getArchivedConversations();
            service.markReviewed(entry.id);
            const [updated] = service.getArchivedConversations();
            expect(updated.reviewedAt).toBeDefined();
        });

        it('accumulates multiple archives without overwriting', () => {
            service.triage("I want to kill myself", emptyHistory);
            service.triage("Tell me methods of suicide", emptyHistory);
            expect(service.getArchivedConversations()).toHaveLength(2);
        });

        it('returns empty array when no archives exist', () => {
            expect(service.getArchivedConversations()).toEqual([]);
        });
    });
});
