# backlog

## executive summary
This backlog follows the **breadth-then-depth** and **ai-ready context**
standards. It is structured into epics containing granular tabular tasks,
ordered **highest priority first** (P0 critical bugs → P1 high → P2 medium →
P3 low / cleanup → done / blockers gated on external input).

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## priority legend
- **[P0][BUG]** — safety / correctness / data-loss; ship-stoppers.
- **[P1][BUG]** — functional regressions, broken docs, dev-experience pain.
- **[P2][TASK]** — granular feature / hardening work.
- **[P3][TASK]** — polish, cleanup, nice-to-have.
- **[BLOCKER]** — external decision needed; tracked in `doubts.md`.

---

## P0 — Critical bugs (ship-stoppers)

- [ ] [P0][BUG] **Tier-1 emergency keyword case mismatch** — `SafetyTriageService.triage()` calls `message.toLowerCase()` but `clinical_guidelines.json` Tier-1 keywords contain capital `I` (e.g. `"I want to kill myself"`, `"I'm going to kill myself"`, `"I've taken pills"`, `"I've hurt myself badly"`, `"I'm going to end it"`, `"I won't be here tomorrow"`). `lower.includes(kw)` returns false, so the most life-critical keywords never trigger emergency response. **Lifesaving check silently fails.**
  - [ ] [TASK] Lowercase keyword sets at load time in `SafetyTriageService` constructor (Loc: `src/services/SafetyTriageService.ts:74-78`).
  - [ ] [TASK] Add regression tests covering each capitalised keyword in mixed-case input (Loc: `src/services/SafetyTriageService.test.ts`).
  - [ ] [TASK] Apply same fix to `EmergencyService.checkCriticalSymptoms` (Loc: `src/services/EmergencyService.ts:30-32`) which reads the same JSON.
  - [ ] [TASK] Add a build-time assertion / unit test verifying every keyword in `clinical_guidelines.json` is lowercase to prevent regression.

- [ ] [P0][BUG] **`scripts/manage.js cleanup` deletes essential files** — current cleanup() removes all `.sh` files (deletes `run.sh`, the documented master controller) and removes `tsconfig.node.json` which is referenced from `tsconfig.json`. Running `npm run manage cleanup` breaks the build.
  - [ ] [TASK] Remove `tsconfig.node.json` from the unnecessary-configs list (Loc: `scripts/manage.js:120-128`).
  - [ ] [TASK] Scope the `.sh` deletion to a known-bad allowlist; do not glob (Loc: `scripts/manage.js:113-117`).
  - [ ] [TASK] Add a dry-run flag and surface what would be deleted before destructive action.

---

## P1 — High-priority bugs

- [ ] [P1][BUG] **`run.sh` references old nested doc path** — both `run.sh` and `scripts/run.sh` `--backlog` greps `docs/planning/backlog.md`, but backlog now lives at `docs/backlog.md` after the flat-docs migration. Same applies to `--sync` and `--skills` which write to `docs/planning/`, `docs/architecture/`, `docs/engineering/`.
  - [ ] [TASK] Update all `docs/<sub>/<file>.md` references to `docs/<file>.md` (Loc: `run.sh`, `scripts/run.sh`).
  - [ ] [TASK] Decide on a single canonical `run.sh` (root vs `scripts/`) and delete the duplicate. Update README + npm script wiring.

- [ ] [P1][BUG] **`.env.example` missing `VITE_NHS_API_KEY`** — `nhs-client.ts:15` requires the key but it is not documented. First call throws `Missing NHS API key` instead of degrading gracefully.
  - [ ] [TASK] Add `VITE_NHS_API_KEY=` to `.env.example` with comment pointing to NHS subscription portal.
  - [ ] [TASK] Improve error path: when key is absent, log warning and use cached/fallback content instead of throwing.

- [ ] [P1][BUG] **`MemoryService.setPrivacyMode(false)` does not restore memories** — `initialize()` short-circuits because `this.initialized === true`, leaving `this.memories === []` after a privacy-on→privacy-off toggle.
  - [ ] [TASK] Reset `initialized` and `initializationPromise` when entering privacy mode so the next `initialize()` can re-load (Loc: `src/services/MemoryService.ts:115-126`).
  - [ ] [TASK] Add test: privacy on → privacy off → memories reload (Loc: `src/services/MemoryService.test.ts`).

- [ ] [P1][BUG] **Version drift between README and `package.json`** — README badge shows `v2.1.6`, `package.json` says `2.1.12`, release-notes lists v2.1.7–v2.1.12 entries.
  - [ ] [TASK] Update README badge to track `package.json` version.
  - [ ] [TASK] Add a `release` npm script that bumps version + appends a release-notes entry to keep them in sync.

- [ ] [P1][BUG] **Docs panic shortcut inconsistency** — older release notes mention `Ctrl+P` but actual binding is `Ctrl+Shift+P` (`useKeyboardShortcuts.ts:33`). Confirm intent in `doubts.md`, then make docs consistent.
  - [ ] [TASK] Update old release-notes entry to clarify shortcut.
  - [ ] [TASK] Confirm intent with stakeholder (tracked in `doubts.md`).

- [ ] [P1][BUG] **Empty / debris docs from prior nested layout** — `docs/roadmap.md` literally contained `test edit`, `docs/arch.md`, `docs/coverage.md`, `docs/test-cases.md`, `docs/decisions.md`, `docs/conventions.md`, `docs/overview.md`, `docs/vision.md`, `docs/agent-standards.md`, `docs/hygiene.md`, `docs/habits.md`, `docs/metrics.md`, `docs/map.md` were one-line stubs. Resolved in this M3 SSOT pass; verify no link rot remains.
  - [x] [TASK] Populate vision.md, arch.md, decisions.md, conventions.md, overview.md, coverage.md, test-cases.md, roadmap.md, map.md, habits.md, hygiene.md, metrics.md, agent-standards.md.

---

## P2 — Granular hardening tasks

- [ ] [P2][EPIC] Safety pipeline hardening
  - [ ] [TASK] Centralise tier-keyword normalisation: helper that lowercases, trims, and dedupes; reject empty strings on load (`src/services/SafetyTriageService.ts`).
  - [ ] [TASK] Add a CI check that lints `clinical_guidelines.json` for casing + duplicates.
  - [ ] [TASK] Move the Tier-1 EMERGENCY_RESPONSE template into `clinical_guidelines.json` so messaging changes are data-driven.
  - [ ] [TASK] Surface a tier-2 archive review tool behind `/admin archives` (or similar) for offline review.
  - [ ] [TASK] Add property-based tests fuzzing capitalisation, leading/trailing whitespace, punctuation around tier keywords.
  - [ ] [TASK] Document `markReviewed` workflow in `system-design.md`.

- [ ] [P2][EPIC] Adaptive model routing reliability
  - [ ] [TASK] Make `BackendClient.generateText` selection branch return a full `ModelSelection` with `toneProfile` even when an explicit model override is supplied (Loc: `src/services/BackendClient.ts:45-49`).
  - [ ] [TASK] Add e2e for tier-3 → Zephyr path that mocks HF response and asserts model URL.
  - [ ] [TASK] Cap retry/backoff inside `AIModelService.initializeModel`; today retries log "Loading…" forever on persistent failure.

- [ ] [P2][EPIC] AIModelService cleanup
  - [ ] [TASK] Cancel the background `setTimeout` that calls `initializeAdditionalModels` on service teardown to avoid leaks during tests / hot-reload (Loc: `src/services/AIModelService.ts:143-145`).
  - [ ] [TASK] Replace the `as unknown as TextGenerator` casts with a typed pipeline interface.
  - [ ] [TASK] Surface a `Service Status: Unavailable (Circuit Breaker)` toast when the breaker opens mid-session.

- [ ] [P2][EPIC] Privacy & persistence consistency
  - [ ] [TASK] Document every localStorage key in `arch.md` persistence map (done in this M3 pass — verify on add).
  - [ ] [TASK] When privacy mode toggles on, also clear `wellbeing_long_term_memory` AND `wellbeing_encryption_key` if user opts in to "wipe key" flow. Currently key persists.
  - [ ] [TASK] Decide whether `twa_archived_conversations` is included in `/export`. Add tests either way.
  - [ ] [TASK] Add idempotent migration for legacy plain-text memory blobs (today `loadMemories` warns then continues; add explicit `re-encrypt` step).

- [ ] [P2][EPIC] NHS client robustness
  - [ ] [TASK] Add jittered exponential backoff on transient 5xx from NHS API.
  - [ ] [TASK] Distinguish rate-limit hits from transport failures in `LoggerService` output.
  - [ ] [TASK] Write a Playwright spec that simulates rate-limit and asserts the cache fallback UX.

- [ ] [P2][EPIC] Terminal UX polish
  - [ ] [TASK] `TerminalInput` paste cursor restore: replace `setTimeout(0)` hack with a `useLayoutEffect` after the controlled state commits (Loc: `src/components/TerminalInput.tsx:24-32`).
  - [ ] [TASK] Render the user's `/panic` invocation as a message before opening the overlay (today the input vanishes silently).
  - [ ] [TASK] `App.tsx` skip link: add visible focus styling so it's perceptible to sighted keyboard users when focused.
  - [ ] [TASK] `ReloadPrompt`: stringify `ServiceWorkerRegistration` properly in success log instead of `'SW Registered: ' + r` (currently logs `[object Object]`).

- [ ] [P2][EPIC] Test coverage gap closure
  - [ ] [TASK] Add tests for `src/utils/themes.ts` covering every theme switch + CSS-var write.
  - [ ] [TASK] Add tests for `src/data/responses.ts#getHelpResponse` mobile vs desktop branching.
  - [ ] [TASK] Add tests for `src/utils/ai-helpers.ts#postProcessResponse` repeating-line collapse + 3+ newline collapse.
  - [ ] [TASK] Add tests for `src/services/AIModelService.ts` fallback chain (backend fails → local pipeline → static fallback).
  - [ ] [TASK] Add tests for `src/services/EmergencyService.ts` covering each Tier-1 keyword (after the P0 case-fix lands).

---

## P3 — Polish & cleanup

- [ ] [P3][TASK] Remove debris file `plan.md` from repo root or move to `docs/` if still relevant; today it references the completed nhs-client task.
- [ ] [P3][TASK] Consolidate the two `run.sh` scripts; document the survivor in `overview.md`.
- [ ] [P3][TASK] Remove `--skills` external curl in `scripts/run.sh` — it appends untrusted content to `docs/conventions.md`.
- [ ] [P3][TASK] Add a `lint:keywords` script that runs the JSON-casing check from the P0 task.
- [ ] [P3][TASK] Move magic timeouts (15000 model load, 30000 breaker reset, 12 typing speed, 50 panic focus) into `config/ai-constants.ts`.
- [ ] [P3][TASK] Replace remaining `console.error` / `console.warn` (e.g. `useLocalStorage.ts`, `ai-helpers.ts`) with `logger`.
- [ ] [P3][TASK] Audit handler files for missing JSDoc one-liners per `conventions.md`.
- [ ] [P3][TASK] Remove unused `TerminalOutput.test.tsx` snapshot if rendering changes.
- [ ] [P3][TASK] Verify all `THEMES` entries set every CSS variable that `applyTheme` writes; add a test.

---

## Done (kept for audit trail)

- [EPIC] UI Re-engineering & Test Coverage Unblocker [M3]
  - [x] [TASK] Fix terminal layout issues in src/components/Terminal.tsx
  - [x] [TASK] Increase UI test coverage (>95%) by adding tests for input, label, separator, skeleton, sonner, toaster
  - [x] [TASK] Fix text visibility in terminal input

- [EPIC] Demo 2 Finalization [M3]
  - [x] [TASK] Verify Demo 2 visual bugs are resolved
  - [x] [TASK] Ensure test coverage is >95%

- [EPIC] System Audit & Tech Debt Remediation [M3]
  - [x] [TASK] Fix missing test coverage in src/hooks/useKeyboardShortcuts.ts
  - [x] [TASK] Fix missing test coverage in src/services/BackendClient.ts and src/services/JournalService.ts

- [EPIC] Improve MemoryService Test Coverage
  - [x] [TASK] Increase coverage for MemoryService

- [EPIC] Adaptive Model Routing Overrides
  - [x] [TASK] Handle safety tier overrides in ModelRouter

- [EPIC] Documentation SSOT pass [M3]
  - [x] [TASK] Flatten `docs/` into a single directory.
  - [x] [TASK] Populate previously-stub docs (vision, arch, decisions, conventions, overview, coverage, test-cases, roadmap, map, habits, hygiene, metrics, agent-standards).
  - [x] [TASK] Update README's Visual-Index to flat doc paths.

---

## Blocked on external input (see `doubts.md`)

- [BLOCKER] [EPIC] Analyze DB schema integration for persistent chat history [HIGH-RISK]
  - [BLOCKER] [TASK] Drill down into schema definition
  - [BLOCKER] [TASK] Implement db migration script
  - [BLOCKER] [DEBT] DB scaling and latency concerns
  - [BLOCKER] [TASK] Review security rules

- [BLOCKER] [EPIC] Implement OAuth for user session storage [HIGH-RISK]
  - [BLOCKER] [TASK] Configure callback URLs and tokens
  - [BLOCKER] [TASK] Secure token endpoints
  - [BLOCKER] [DEBT] Token expiry handling
  - [BLOCKER] [TASK] Audit login flow
