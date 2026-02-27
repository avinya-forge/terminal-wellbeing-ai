# Backlog

> **Priority order is absolute.** SHOWSTOPPERS must be done before anything else.
> Next demo: **Monday 3 March 2026**.

---

## 🟠 P1 — High Priority (Must be done before Demo 2)

### Epic 1: Mobile Preview & Remote Access Infrastructure (10 Tasks)
- [ ] [P1-01] | Document the exact steps to access on mobile (ipconfig → phone browser) in README | [TODO]
- [ ] [P1-02] | Implement ngrok one-liner: `npx ngrok http 5173` | [TODO]
- [ ] [P1-03] | Test remote mobile access using ngrok URL | [TODO]
- [ ] [P1-04] | Create single start script: `npm run preview-mobile` to start Vite + ngrok | [TODO]
- [ ] [P1-05] | Parse and print the generated ngrok URL in the terminal | [TODO]
- [ ] [P1-06] | Implement Cloudflare Tunnel setup script | [TODO]
- [ ] [P1-07] | Configure free named domain for Cloudflare Tunnel | [TODO]
- [ ] [P1-08] | Document persistent URL access via Cloudflare in README | [TODO]
- [ ] [P1-09] | Add CI/CD checks to ensure mobile preview scripts run without errors | [TODO]
- [ ] [P1-10] | Add visual indicator in UI for active tunnel connection | [TODO]

### Epic 2: UI Quality & Accessibility Refinements (10 Tasks)
- [ ] [P1-11] | Replace all "Model Loading" text in UI with "Service Status: Loading..." | [TODO]
- [ ] [P1-12] | Replace all "Model Error" text in UI with "Service Status: Error" | [TODO]
- [ ] [P1-13] | Standardize "Service Status: Connected" across UI | [TODO]
- [ ] [P1-14] | Write Playwright tests for "Service Status" text rendering | [TODO]
- [ ] [P1-15] | Verify keyboard navigation sequence (Tab index) for all actionable terminal UI elements | [TODO]
- [ ] [P1-16] | Add `aria-label` to dynamically rendered terminal inputs | [TODO]
- [ ] [P1-17] | Fix contrast ratio for secondary text elements in terminal themes | [TODO]
- [ ] [P1-18] | Ensure reduced-motion respects typing indicator disablement | [TODO]
- [ ] [P1-19] | Add user configuration toggle to disable typing animations manually | [TODO]
- [ ] [P1-20] | Create accessibility report using `generate-a11y-report.ts` script for new UI elements | [TODO]

---

## 🟡 P2 — Medium Priority (Post-Demo 2)

### Epic 3: Safety & Location-Aware Crisis Guidelines (10 Tasks)
- [ ] [P2-01] | Draft audit requirements document for `clinical_guidelines.json` | [TODO]
- [ ] [P2-02] | Identify and list UK-specific crisis contacts | [TODO]
- [ ] [P2-03] | Identify and list US-specific crisis contacts | [TODO]
- [ ] [P2-04] | Identify and list Australia-specific crisis contacts | [TODO]
- [ ] [P2-05] | Implement locale-detection logic in browser | [TODO]
- [ ] [P2-06] | Update `SafetyTriageService` to conditionally load contacts based on locale | [TODO]
- [ ] [P2-07] | Write unit tests for UK contact routing | [TODO]
- [ ] [P2-08] | Write unit tests for US contact routing | [TODO]
- [ ] [P2-09] | Write unit tests for fallback contact routing | [TODO]
- [ ] [P2-10] | Integrate external review feedback into `clinical_guidelines.json` | [TODO]

### Epic 4: `/care` Daily Action Plan Command (10 Tasks)
- [ ] [P2-11] | Define `CarePlan` interface in TypeScript | [TODO]
- [ ] [P2-12] | Create dummy data for 5 different daily action plans | [TODO]
- [ ] [P2-13] | Implement `/care` command parser in `TerminalInput` | [TODO]
- [ ] [P2-14] | Build UI component to render action plan cleanly in terminal | [TODO]
- [ ] [P2-15] | Connect `/care` command to local `MemoryService` for history context | [TODO]
- [ ] [P2-16] | Implement logic to mark actions as 'done' via CLI (e.g., `/care done 1`) | [TODO]
- [ ] [P2-17] | Persist daily action plan state to localStorage | [TODO]
- [ ] [P2-18] | Add privacy mode bypass check for action plan writes | [TODO]
- [ ] [P2-19] | Write unit test for `/care` rendering | [TODO]
- [ ] [P2-20] | Write unit test for `/care done` state update | [TODO]

### Epic 5: Medication & Hydration Tracker (10 Tasks)
- [ ] [P2-21] | Define `HealthMetric` schema (medication, hydration) | [TODO]
- [ ] [P2-22] | Implement `/track water <amount>` command | [TODO]
- [ ] [P2-23] | Implement `/track med <name>` command | [TODO]
- [ ] [P2-24] | Create simple UI widget or table to display tracked metrics | [TODO]
- [ ] [P2-25] | Add daily reset logic for hydration tracker | [TODO]
- [ ] [P2-26] | Implement reminders for medication based on schedule in `localStorage` | [TODO]
- [ ] [P2-27] | Integrate tracking commands with `/stats` output | [TODO]
- [ ] [P2-28] | Ensure health tracking data is cleared when Privacy Mode is enabled | [TODO]
- [ ] [P2-29] | Write unit tests for `/track` parsing | [TODO]
- [ ] [P2-30] | Write integration tests for hydration accumulation | [TODO]

### Epic 6: Backend Inference Microservice (10 Tasks)
- [ ] [P2-31] | Scaffold Node.js/Express server in a `backend/` directory | [TODO]
- [ ] [P2-32] | Set up HuggingFace API client securely on the backend | [TODO]
- [ ] [P2-33] | Create `/api/infer` endpoint to handle prompts | [TODO]
- [ ] [P2-34] | Add CORS configuration to allow local frontend requests | [TODO]
- [ ] [P2-35] | Move HF Token from frontend environment variables to backend | [TODO]
- [ ] [P2-36] | Update frontend `BackendClient.ts` to route requests to local microservice | [TODO]
- [ ] [P2-37] | Add error handling and fallback mechanism for microservice timeout | [TODO]
- [ ] [P2-38] | Implement rate limiting on the `/api/infer` endpoint | [TODO]
- [ ] [P2-39] | Write API tests using Supertest | [TODO]
- [ ] [P2-40] | Document backend setup and execution steps in README | [TODO]

---

## 🟢 P3 — Longer Term

### Epic 7: HIPAA-Compliant Health Data Schema (10 Tasks)
- [ ] [P3-01] | Research HIPAA requirements for text-based mental health data | [TODO]
- [ ] [P3-02] | Draft JSON schema for PHI (Protected Health Information) | [TODO]
- [ ] [P3-03] | Implement schema validation using Zod | [TODO]
- [ ] [P3-04] | Update `MemoryService` to enforce Zod schema on write | [TODO]
- [ ] [P3-05] | Strip PII (Personally Identifiable Information) before embedding generation | [TODO]
- [ ] [P3-06] | Write unit tests for PII stripping function | [TODO]
- [ ] [P3-07] | Update session export to use compliant schema | [TODO]
- [ ] [P3-08] | Add explicit user consent step before first schema save | [TODO]
- [ ] [P3-09] | Document schema architecture in `docs/architecture.md` | [TODO]
- [ ] [P3-10] | Refactor `clinical_guidelines.json` validation to use Zod | [TODO]

### Epic 8: Multi-Device Sync via Encrypted Storage (10 Tasks)
- [ ] [P3-11] | Research encrypted cloud storage options (e.g., Firebase + Web Crypto) | [TODO]
- [ ] [P3-12] | Define sync protocol (conflict resolution, timestamping) | [TODO]
- [ ] [P3-13] | Implement payload encryption step before transmission | [TODO]
- [ ] [P3-14] | Create user authentication mock for sync testing | [TODO]
- [ ] [P3-15] | Implement `SyncService` to handle background polling | [TODO]
- [ ] [P3-16] | Add terminal UI indicator for sync status (e.g., `[Syncing...]`) | [TODO]
- [ ] [P3-17] | Handle offline queuing and retry for failed syncs | [TODO]
- [ ] [P3-18] | Implement manual `/sync` command | [TODO]
- [ ] [P3-19] | Write integration tests for conflict resolution | [TODO]
- [ ] [P3-20] | Perform security audit of encryption keys during sync | [TODO]

### Epic 9: Voice Interface Feasibility Study (10 Tasks)
- [ ] [P3-21] | Research Web Speech API support across browsers | [TODO]
- [ ] [P3-22] | Create proof-of-concept for Speech-to-Text in a hidden component | [TODO]
- [ ] [P3-23] | Pipe Speech-to-Text output into `TerminalInput` | [TODO]
- [ ] [P3-24] | Research local Text-to-Speech models | [TODO]
- [ ] [P3-25] | Implement basic TTS for AI responses | [TODO]
- [ ] [P3-26] | Add UI toggle to enable/disable voice mode | [TODO]
- [ ] [P3-27] | Handle voice interruptions (push-to-talk vs continuous listening) | [TODO]
- [ ] [P3-28] | Evaluate performance impact of continuous listening | [TODO]
- [ ] [P3-29] | Document feasibility study findings in `docs/voice-study.md` | [TODO]
- [ ] [P3-30] | Present prototype findings and determine if full feature should be scheduled | [TODO]

### Epic 10: Multi-Modal Mood Analysis (10 Tasks)
- [ ] [P3-31] | Research Web Bluetooth API for vitals (heart rate) integration | [TODO]
- [ ] [P3-32] | Create dummy data generator for biometric inputs | [TODO]
- [ ] [P3-33] | Define `VitalsContext` type to append to AI prompts | [TODO]
- [ ] [P3-34] | Update `ModelRouter` to factor in biometric stress markers | [TODO]
- [ ] [P3-35] | Create terminal UI component to show current "stress level" gauge | [TODO]
- [ ] [P3-36] | Trigger `/breathe` exercise automatically on high stress spikes | [TODO]
- [ ] [P3-37] | Add explicit user opt-in for biometric data collection | [TODO]
- [ ] [P3-38] | Ensure biometric data is encrypted via `KeyManager` | [TODO]
- [ ] [P3-39] | Write integration test for high-stress automated interventions | [TODO]
- [ ] [P3-40] | Document multi-modal approach and privacy considerations | [TODO]

---

## ✅ Completed (Archive)

### Safety Architecture (Feb 2026)
- [x] NHS 3-tier `clinical_guidelines.json` (IMMEDIATE_EMERGENCY / UNSAFE_TERRITORY / HIGH_SENSITIVITY)
- [x] `SafetyTriageService.ts` — triage, archive to localStorage, NHS signposting
- [x] `ModelRouter.ts` — tone scoring + safety tier override → Zephyr 7B
- [x] `BackendClient.ts` — 3-step pipeline: triage → routing → HF inference
- [x] `jest.setup.js` — global HF API fetch guard (zero live calls during tests)
- [x] `EmergencyService.ts` updated to new schema

### Adaptive Model Routing (Feb 2026)
- [x] `ModelRouter.ts` with distress / complexity / brief / neutral tone scoring
- [x] `ToneProfile` type in `src/types/`
- [x] 12 unit tests for model routing logic

### CI/CD & Deployment (Feb 2026)
- [x] GitHub Actions daily deployment pipeline
- [x] Vite base path configuration for GitHub Pages

### UI Re-engineering (Feb 2026)
- [x] Sequential typewriter boot animation
- [x] Terminal header redesign with traffic lights
- [x] Input bar alignment and prompt glyph

### Security Foundation (v1.8.2)
- [x] Web Crypto AES-GCM encryption (`KeyManager`, `encryptData`, `decryptData`, `rotateKey`)
- [x] Automated accessibility pipeline (axe-core + Playwright)
- [x] Keyboard shortcuts (Ctrl+K, Ctrl+L, Ctrl+,)

### Features (v1.0–1.9)
- [x] Privacy Mode, Session Export, Journaling, Themes, ASCII Art
- [x] Resource database (50+ entries), Breathing exercise, Motivational quotes
- [x] User profile system, Content filtering, Long-term memory (embeddings)
- [x] Panic overlay, Crisis resource search, PWA offline support
