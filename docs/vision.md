# vision

> **"A terminal where you feel heard, not assessed."**

## product purpose
Terminal Wellbeing AI is a browser-based mental health companion presented as a
retro terminal (`WellBeing.sh`). It is **not** a clinical tool, diagnostic
device, or replacement for professional care. It is a **safe-by-default
listening surface** that meets users where they are and routes them to real
human support the moment a conversation moves beyond what an AI should hold.

## who it's for
- People who want a low-friction place to put words to a difficult moment.
- People who prefer text/keyboard interfaces and dislike chat-app UI overhead.
- People who want privacy controls (local-only state, encryption, panic exit).
- Developers and researchers studying NHS-aligned safety patterns for AI
  conversation surfaces.

## non-goals
- Diagnosis or clinical assessment.
- Long-running therapy or treatment recommendations.
- Storing personally identifiable health data on remote servers.
- Replacing emergency services or crisis lines.

## product principles
1. **Safety first, inference second.** Every message is triaged by
   `SafetyTriageService` before any AI inference can run. Critical signals halt
   inference and surface 999/988/Samaritans/Shout immediately
   (see `src/services/SafetyTriageService.ts`).
2. **Heard, not assessed.** Responses validate experience, never diagnose.
   Tier-3 sensitive messages route to the empathy-tuned model
   (`Zephyr 7B`) regardless of tone scoring.
3. **Local-by-default.** Profile, journal, memory, and archived conversations
   live in `localStorage`. Long-term memory is encrypted with AES-GCM. Privacy
   mode (`/privacy`) clears persistent state.
4. **Always reachable exits.** The `/panic` command and the panic overlay
   (focus-trapped modal with 988 / 741741 / 911) are reachable from anywhere
   in the app via keyboard shortcut.
5. **Graceful degradation.** Backend down → local fallback model → static
   support phrases → emergency signposting. The user is never left with a
   broken UI or silence (`AIModelService`, `CircuitBreaker`, `FallbackCache`).
6. **Force modularity.** No one-off components. Commands live in
   `src/commands/handlers/`, services in `src/services/`, utilities in
   `src/utils/`. Each unit is unit-testable in isolation.

## experience pillars
| Pillar | What it means in code |
|---|---|
| Listening | typewriter rendering, sequential boot animation, validation phrasing |
| Routing | 3-tier safety triage → adaptive model router → HF inference |
| Privacy | `/privacy`, AES-GCM encrypted memory, opt-out persistence |
| Resilience | circuit breaker, fallback cache, rate limiter, retry-with-backoff |
| Accessibility | aria-live status, focus trap, reduced-motion, axe-core CI gate |

## scope of this milestone (M3 / S3)
Stabilize Demo 2 visual layer, push global test coverage above 95%,
document the safety architecture, and resolve the high-risk blockers tracked
in `docs/backlog.md` and `docs/doubts.md`.

## upstream references
- NHS England Mental Health Implementation Plan 2019–2024
- RCPSYCH Safe Messaging Guidelines on Suicide and Self-Harm
- NICE CG90: Depression in Adults (2022 update)
- HEE Digital Mental Health Framework
- Samaritans Media Guidelines 2023
