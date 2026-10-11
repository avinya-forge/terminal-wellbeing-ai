# backlog

## executive summary
This backlog follows the **breadth-then-depth** and **ai-ready context** standards. It is structured into epics containing granular tabular tasks, ordered **highest priority first** (P0 critical bugs → P1 high → P2 medium → P3 low / cleanup → done / blockers gated on external input).

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## priority legend
- **[P0][BUG]** — safety / correctness / data-loss; ship-stoppers.
- **[P1][BUG]** — functional regressions, broken docs, dev-experience pain.
- **[P2][TASK]** — granular feature / hardening work.
- **[P3][TASK]** — polish, cleanup, nice-to-have.
- **[BLOCKER]** — external decision needed; tracked in `doubts.md`.

---

## [EPIC] P0 — Critical Safety Bugs (Ship-Stoppers)

- [ ] [P0][BUG] **Tier-1 emergency keyword case mismatch** — `SafetyTriageService.triage()` calls `message.toLowerCase()` but `clinical_guidelines.json` Tier-1 keywords contain capital `I`.
  - [ ] [TASK] Update `SafetyTriageService` constructor to map over all `tier1_immediate_emergency`, `tier2_unsafe_territory`, and `tier3_high_sensitivity` keyword lists and transform them using `.toLowerCase()`. (Loc: `src/services/SafetyTriageService.ts:74-78`).
  - [ ] [TASK] Write specific unit tests in `src/services/SafetyTriageService.test.ts` to assert that triage correctly identifies keywords even when the input contains a mix of uppercase and lowercase letters.
  - [ ] [TASK] Update `EmergencyService.checkCriticalSymptoms` to map over the keywords from `clinicalGuidelines.safety_tiers.tier1_immediate_emergency.keywords` and transform them using `.toLowerCase()`. (Loc: `src/services/EmergencyService.ts:30-32`).
  - [ ] [TASK] Write a validation script or build-time assertion that parses `clinical_guidelines.json` and throws an error if any keyword contains uppercase characters, ensuring future additions comply.

## [EPIC] P0 — Critical System Bugs (Ship-Stoppers)

- [ ] [P0][BUG] **`scripts/manage.js cleanup` deletes essential files** — current cleanup() removes all `.sh` files and removes `tsconfig.node.json`.
  - [ ] [TASK] Modify the `unnecessaryConfigs` array in `scripts/manage.js` (line ~125) to remove `tsconfig.node.json` from the list of files to be deleted.
  - [ ] [TASK] Replace the `.sh` file deletion logic (which currently uses a glob `/\.(ps1|sh)$/`) with a hardcoded list of specifically targeted legacy scripts (e.g., `cleanup.sh` or `setup-ai-settings.sh`) to prevent accidental deletion of `run.sh` or user scripts.
  - [ ] [TASK] Implement a `--dry-run` flag in `scripts/manage.js` that prints out the files to be deleted without actually deleting them.

---

## [EPIC] P1 — Environment & Documentation Hotfixes

- [ ] [P1][BUG] **`run.sh` references old nested doc path** — `--backlog` greps `docs/planning/backlog.md`, but backlog now lives at `docs/backlog.md`.
  - [ ] [TASK] Locate references to `docs/planning/backlog.md` in `run.sh` and replace them with `docs/backlog.md`.
  - [ ] [TASK] Remove the obsolete `scripts/run.sh` file and point all `npm` scripts to the root `run.sh` file.

- [ ] [P1][BUG] **`.env.example` missing `VITE_NHS_API_KEY`** — `nhs-client.ts:15` requires the key but it is not documented.
  - [ ] [TASK] Append `VITE_NHS_API_KEY=` to `.env.example`.
  - [ ] [TASK] Add a comment above the new line in `.env.example` explaining that this key is obtained from the NHS developer portal.
  - [ ] [TASK] Modify `nhs-client.ts` to explicitly check for the presence of `VITE_NHS_API_KEY`. If missing, log a structured warning via `LoggerService` and fallback to local cache immediately without throwing an exception.

- [ ] [P1][BUG] **Version drift between README and `package.json`** — README badge shows `v2.1.6`, `package.json` says `2.1.12`.
  - [ ] [TASK] Update the version badge markdown in `README.md` from `v2.1.6` to `v2.1.12`.
  - [ ] [TASK] Create a `release` npm script in `package.json` that automates bumping the version across `package.json`, `README.md`, and appending a template to `release-notes.md`.

- [ ] [P1][BUG] **Docs panic shortcut inconsistency** — older release notes mention `Ctrl+P` but actual binding is `Ctrl+Shift+P`.
  - [ ] [TASK] Search and replace `Ctrl+P` with `Ctrl+Shift+P` in `docs/release-notes.md` to accurately reflect the actual keybinding.
  - [ ] [TASK] Verify and resolve the intent documented in `doubts.md` with stakeholders to confirm whether `Ctrl+Shift+P` is the final desired shortcut.

---

## [EPIC] P1 — Core State & Privacy Bugs

- [ ] [P1][BUG] **`MemoryService.setPrivacyMode(false)` does not restore memories** — `initialize()` short-circuits because `this.initialized === true`.
  - [ ] [TASK] Update `src/services/MemoryService.ts` inside `setPrivacyMode` to reset `this.initialized = false` and `this.initializationPromise = null` before re-calling `this.initialize()`.
  - [ ] [TASK] Create a test case in `src/services/MemoryService.test.ts` that explicitly calls `setPrivacyMode(true)`, then `setPrivacyMode(false)`, and asserts that `loadMemories` is executed and memories are successfully reloaded.

---

## [EPIC] P2 — Safety pipeline hardening

- [ ] [TASK] Create a utility function `normalizeKeyword` in `SafetyTriageService.ts` that takes a string, applies `.toLowerCase()`, `.trim()`, and removes duplicate spaces.
- [ ] [TASK] Create a GitHub Action workflow file `.github/workflows/lint-keywords.yml` to automatically lint `clinical_guidelines.json` for uppercase letters and duplicates on PRs.
- [ ] [TASK] Extract the `EMERGENCY_RESPONSE` text from `SafetyTriageService.ts` and add it as a new field `response_template` under `tier1_immediate_emergency` in `clinical_guidelines.json`. Modify the code to read it from there.
- [ ] [TASK] Create a new protected route/page `/admin/archives` in the React frontend that displays the contents of `twa_archived_conversations` from `localStorage` for offline review.
- [ ] [TASK] Add unit tests in `SafetyTriageService.test.ts` using a library like `fast-check` to fuzz inputs with random capitalization and leading/trailing whitespace.
- [ ] [TASK] Update `docs/system-design.md` to include a section detailing the offline review process and the usage of the `markReviewed` function.

---

## [EPIC] P2 — Adaptive model routing reliability

- [ ] [TASK] Modify `BackendClient.ts:45-49` so that when `options.model` is provided, the returned object includes a mock `ToneProfile` object (with neutral/distressed/complex/brief set to 0) to prevent undefined property errors downstream.
- [ ] [TASK] Write an end-to-end test in Playwright (`e2e/routing.spec.ts`) that submits a tier-3 sensitive message, intercepts the HF API network request, and asserts that the URL matches the Zephyr 7B model endpoint.
- [ ] [TASK] Implement a maximum retry count and exponential backoff in `AIModelService.initializeModel` so that after 3 failed attempts, it throws an error instead of looping indefinitely.

---

## [EPIC] P2 — AIModelService cleanup

- [ ] [TASK] Store the `setTimeout` reference in a private class property `initializationTimeout` in `AIModelService.ts`. Add a `teardown()` method that calls `clearTimeout(this.initializationTimeout)`.
- [ ] [TASK] Define a specific Typescript interface for the `TextGenerator` object in `AIModelService.ts` to replace the `as unknown as TextGenerator` type assertions, improving type safety.
- [ ] [TASK] Trigger a UI toast notification (using the shadcn `use-toast` hook) in `Terminal.tsx` reading "Service Status: Unavailable (Circuit Breaker)" when a `CircuitBreakerOpenError` is caught.

---

## [EPIC] P2 — Privacy & persistence consistency

- [ ] [TASK] Update the "persistence map" section in `docs/arch.md` to include all currently active `localStorage` keys used in the application.
- [ ] [TASK] Update the `setPrivacyMode` function to explicitly call `localStorage.removeItem('wellbeing_encryption_key')` and `localStorage.removeItem('wellbeing_long_term_memory')` when privacy mode is enabled and the wipe option is selected.
- [ ] [TASK] Ensure the `/export` command logic (in `sessionManager.ts`) filters out or includes `twa_archived_conversations` based on privacy decisions, and add corresponding unit tests.
- [ ] [TASK] Write a migration script in `MemoryService.loadMemories` that detects if the loaded string is plain text (invalid JSON/unencrypted) and immediately encrypts and saves it, replacing the old entry.

---

## [EPIC] P2 — NHS client robustness

- [ ] [TASK] Update `src/services/nhs-client.ts` to implement jittered exponential backoff logic (using `Math.random()`) specifically when a 500, 502, 503, or 504 HTTP status code is received.
- [ ] [TASK] Update the error logging in `nhs-client.ts` to explicitly differentiate and log "Rate Limit Exceeded (429)" vs "Transport Failure" vs "Server Error (5xx)".
- [ ] [TASK] Write a Playwright spec `e2e/nhs-rate-limit.spec.ts` that mocks a 429 response from the NHS API and asserts that the UI successfully falls back to cached data.

---

## [EPIC] P2 — Terminal UX polish

- [ ] [TASK] Refactor `src/components/TerminalInput.tsx` to remove `setTimeout(0)` for cursor restoration and instead use React's `useLayoutEffect` to manipulate the input ref selection after state updates.
- [ ] [TASK] Update `Terminal.tsx` to explicitly add the user's `/panic` message text to the local messages array before setting the state to open the Panic Overlay.
- [ ] [TASK] Add CSS rules for `:focus-visible` to the skip link in `App.tsx` (e.g., `outline: 2px solid theme('colors.primary')`, `top: 0`) so it is clearly visible to sighted keyboard users.
- [ ] [TASK] Modify `ReloadPrompt.tsx` to JSON.stringify or extract specific properties from the `ServiceWorkerRegistration` object before logging it, avoiding `[object Object]` output.

---

## [EPIC] P2 — Test coverage gap closure

- [ ] [TASK] Write unit tests in `src/utils/themes.test.ts` that iterate through the `THEMES` object and assert that `applyTheme` sets the correct CSS variables on the document root.
- [ ] [TASK] Write unit tests for `getHelpResponse` in `src/data/responses.test.ts` that mock the user agent or screen size to test both the mobile and desktop formatting branches.
- [ ] [TASK] Write unit tests for `postProcessResponse` in `src/utils/ai-helpers.test.ts` to verify it correctly collapses repeating lines and collapses 3+ consecutive newlines into 2.
- [ ] [TASK] Write unit tests in `src/services/AIModelService.test.ts` that mock a backend failure, verify fallback to local models, and then verify fallback to static responses.
- [ ] [TASK] Expand `src/services/EmergencyService.test.ts` to include a test case for every single Tier-1 keyword present in `clinical_guidelines.json`.

---

## [EPIC] P3 — Polish & cleanup

- [ ] [TASK] Move `plan.md` to the `docs/` folder, or delete it if its contents are obsolete.
- [ ] [TASK] Identify differences between `run.sh` and `scripts/run.sh`, consolidate their logic into `run.sh` in the root directory, and document its usage in `docs/overview.md`.
- [ ] [TASK] Remove the `curl -s https://skills.sh/` command from `run.sh` to prevent unauthorized or untrusted remote content execution.
- [ ] [TASK] Create a new npm script `"lint:keywords": "node scripts/verify_keywords.js"` that executes the JSON-casing validation script.
- [ ] [TASK] Extract hardcoded timeouts (like 15000, 30000) from components/services into `src/config/ai-constants.ts` and import them where needed.
- [ ] [TASK] Run a global search for `console.error` and `console.warn` across `src/` and replace them with `logger.error` or `logger.warn` calls.
- [ ] [TASK] Review all files in `src/commands/handlers/` and add standard one-line JSDoc comments to all exported functions according to conventions.
- [ ] [TASK] Delete `TerminalOutput.test.tsx.snap` (or similar snapshot files) if snapshot testing is no longer used or the snapshot is unused.
- [ ] [TASK] Add a unit test verifying that every theme in the `THEMES` constant has exactly the same set of CSS variable keys as the default theme.

---

## [EPIC] Blocked on external input (see `doubts.md`)

- [BLOCKER] [TASK] Analyze DB schema integration for persistent chat history [HIGH-RISK]
  - [BLOCKER] [TASK] Define the exact SQL schema for chat history in a new document `docs/db-schema.md`.
  - [BLOCKER] [TASK] Write a raw SQL or ORM migration script for creating the tables.
  - [BLOCKER] [DEBT] Research and document DB scaling and latency concerns for storing large amounts of text.
  - [BLOCKER] [TASK] Review and document Row-Level Security (RLS) rules required for tenant isolation.

- [BLOCKER] [TASK] Implement OAuth for user session storage [HIGH-RISK]
  - [BLOCKER] [TASK] Create NextAuth.js or Auth.js configuration file with GitHub and Google providers.
  - [BLOCKER] [TASK] Create API routes for secure token endpoints.
  - [BLOCKER] [DEBT] Implement robust token refresh and expiry handling logic.
  - [BLOCKER] [TASK] Perform a security audit of the login flow and redirect mechanisms.
