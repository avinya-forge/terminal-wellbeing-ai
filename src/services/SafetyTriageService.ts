/**
 * SafetyTriageService
 *
 * Three-tier safety engine aligned with NHS / RCPSYCH / Samaritans guidelines.
 *
 * Tier 1 — IMMEDIATE_EMERGENCY  : Life-threatening. Halt all inference. Provide 999/988.
 * Tier 2 — UNSAFE_TERRITORY     : Harmful territory. Archive conversation. Safe handoff.
 * Tier 3 — HIGH_SENSITIVITY     : Sensitive. Route to Zephyr. Apply safe messaging.
 * Tier 0 — SAFE                 : Normal. Proceed with tone-based model routing.
 */

import guidelines from '../data/clinical_guidelines.json';
import { logger } from './LoggerService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SafetyTier =
    | 'SAFE'
    | 'HIGH_SENSITIVITY'
    | 'UNSAFE_TERRITORY'
    | 'IMMEDIATE_EMERGENCY';

export interface TriageResult {
    tier: SafetyTier;
    /** True when inference must NOT proceed */
    haltInference: boolean;
    /** Response to show the user when haltInference is true */
    safeResponse?: string;
    /** Matched keyword that triggered the tier */
    matchedSignal?: string;
    /** Whether this conversation was archived */
    archived: boolean;
}

export interface ArchivedConversation {
    id: string;
    timestamp: string;
    tier: SafetyTier;
    matchedSignal: string;
    messages: Array<{ role: string; content: string }>;
    reviewedAt?: string;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function normalizeKeyword(kw: string): string {
    return kw.toLowerCase().trim().replace(/\s+/g, ' ');
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ARCHIVE_KEY = 'twa_archived_conversations';
const MAX_ARCHIVE_ENTRIES = 100; // cap storage usage

// ─── Service ──────────────────────────────────────────────────────────────────

export class SafetyTriageService {
    private static instance: SafetyTriageService;

    private tier1Keywords: string[];
    private tier2Keywords: string[];
    private tier3Keywords: string[];
    private tier2SafeHandoff: string;
    private tier1Response: string;

    private constructor() {
        const t = guidelines.safety_tiers;
        this.tier1Keywords = t.tier1_immediate_emergency.keywords.map(normalizeKeyword);
        this.tier2Keywords = t.tier2_unsafe_territory.keywords.map(normalizeKeyword);
        this.tier3Keywords = t.tier3_high_sensitivity.keywords.map(normalizeKeyword);
        this.tier2SafeHandoff = t.tier2_unsafe_territory.safe_handoff_message;
        this.tier1Response = t.tier1_immediate_emergency.response_template;
    }

    public static getInstance(): SafetyTriageService {
        if (!SafetyTriageService.instance) {
            SafetyTriageService.instance = new SafetyTriageService();
        }
        return SafetyTriageService.instance;
    }

    /**
     * Primary triage method. Call before every AI inference.
     */
    public triage(
        message: string,
        conversationHistory: Array<{ role: string; content: string }>
    ): TriageResult {
        const lower = normalizeKeyword(message);

        // ── Tier 1: Immediate Emergency ──────────────────────────────────────────
        const t1Hit = this.tier1Keywords.find(kw => lower.includes(kw));
        if (t1Hit) {
            logger.warn(`[SafetyTriage] TIER-1 IMMEDIATE EMERGENCY — signal: "${t1Hit}"`);
            this.archive('IMMEDIATE_EMERGENCY', t1Hit, message, conversationHistory);
            return {
                tier: 'IMMEDIATE_EMERGENCY',
                haltInference: true,
                safeResponse: this.tier1Response,
                matchedSignal: t1Hit,
                archived: true,
            };
        }

        // ── Tier 2: Unsafe Territory ─────────────────────────────────────────────
        const t2Hit = this.tier2Keywords.find(kw => lower.includes(kw));
        if (t2Hit) {
            logger.warn(`[SafetyTriage] TIER-2 UNSAFE TERRITORY — signal: "${t2Hit}"`);
            this.archive('UNSAFE_TERRITORY', t2Hit, message, conversationHistory);
            return {
                tier: 'UNSAFE_TERRITORY',
                haltInference: true,
                safeResponse: this.tier2SafeHandoff,
                matchedSignal: t2Hit,
                archived: true,
            };
        }

        // ── Tier 3: High Sensitivity ─────────────────────────────────────────────
        const t3Hit = this.tier3Keywords.find(kw => lower.includes(kw));
        if (t3Hit) {
            logger.info(`[SafetyTriage] TIER-3 HIGH SENSITIVITY — signal: "${t3Hit}"`);
            return {
                tier: 'HIGH_SENSITIVITY',
                haltInference: false,
                matchedSignal: t3Hit,
                archived: false,
            };
        }

        // ── Tier 0: Safe ─────────────────────────────────────────────────────────
        return { tier: 'SAFE', haltInference: false, archived: false };
    }

    /**
     * Archives a flagged conversation to localStorage for later review.
     * Returns the archive entry ID.
     */
    public archive(
        tier: SafetyTier,
        matchedSignal: string,
        currentMessage: string,
        history: Array<{ role: string; content: string }>
    ): string {
        const id = `archive_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const entry: ArchivedConversation = {
            id,
            timestamp: new Date().toISOString(),
            tier,
            matchedSignal,
            messages: [
                ...history,
                { role: 'user', content: currentMessage },
            ],
        };

        try {
            const raw = localStorage.getItem(ARCHIVE_KEY);
            const existing: ArchivedConversation[] = raw ? JSON.parse(raw) : [];
            // Cap at MAX_ARCHIVE_ENTRIES (drop oldest)
            const updated = [...existing, entry].slice(-MAX_ARCHIVE_ENTRIES);
            localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated));
            logger.info(`[SafetyTriage] Conversation archived → id: ${id} | tier: ${tier}`);
        } catch (err) {
            logger.error('[SafetyTriage] Failed to archive conversation:', err);
        }

        return id;
    }

    /**
     * Retrieves all archived conversations for review/analysis.
     */
    public getArchivedConversations(): ArchivedConversation[] {
        try {
            const raw = localStorage.getItem(ARCHIVE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    /**
     * Marks an archived conversation as reviewed (for future analysis tooling).
     */
    public markReviewed(id: string): void {
        try {
            const archives = this.getArchivedConversations();
            const updated = archives.map(a =>
                a.id === id ? { ...a, reviewedAt: new Date().toISOString() } : a
            );
            localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated));
        } catch (err) {
            logger.error('[SafetyTriage] Failed to mark conversation reviewed:', err);
        }
    }
}

export const safetyTriageService = SafetyTriageService.getInstance();
