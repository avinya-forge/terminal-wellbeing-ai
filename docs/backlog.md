# Backlog

> **Priority order is absolute.** SHOWSTOPPERS must be done before anything else.
> Next demo: **Monday 3 March 2026**.

---

## 🔴 P0 — SHOWSTOPPERS (Demo Failed · Fix Immediately)

> These broke the 23 Feb 2026 demo. Every item here is a regression or missing basic.
> Nothing new is built until this entire section is green.

### Visual / Interaction Basics

- [x] [SH-01] | Terminal fills 100% viewport width — removed 820px maxWidth cap | [DONE]
- [x] [SH-02] | Typed text invisible in input bar — `#terminal-input { color: #c8ffc8 }` override | [DONE]
- [x] [SH-03] | "Online" label has no green indicator — heartbeat-ring pulsing dot added next to text | [DONE]
- [ ] [SH-04] | `modelLoaded` never visually becomes `true` — audit `initializeModel()` on page load; the header stays "Connecting..." forever | [TODO] ⚠️
- [ ] [SH-05] | Boot messages don't animate in demo conditions — check typewriter timing and onComplete chain under real load | [TODO] ⚠️
- [ ] [SH-06] | Block cursor misaligned — `left: N ch` doesn't track real pixel position; switch to absolute CSS overlay or remove custom cursor entirely | [TODO]
- [ ] [SH-07] | App.tsx artificial 100ms delay — `ready` gate causes flash; remove it, Terminal renders immediately | [TODO]
- [ ] [SH-08] | Scroll-to-bottom races typewriter — `messagesEndRef.scrollIntoView` fires before message finishes rendering; gate it on `onComplete` | [TODO]
- [ ] [SH-09] | Long AI responses break horizontal layout on narrow screens | [TODO]
- [ ] [SH-10] | `/help` output is not readable — verify formatting, colours and word-wrap in full-screen layout | [TODO]
- [ ] [SH-11] | Panic overlay (Ctrl+P / `/panic`) — tab focus not trapped; Escape doesn't close | [TODO]
- [ ] [SH-12] | Theme persistence broken — `/theme` saves to localStorage but `applyTheme()` reads wrong key on reload | [TODO]
- [ ] [SH-13] | Privacy mode doesn't suppress localStorage — `useLocalStorage` still writes when privacy is ON | [TODO]

### Test Coverage (Stale / Missing)

- [x] [SH-T01] | `TerminalHeader.test.tsx` — rewritten with correct text assertions (11 tests) | [DONE]
- [x] [SH-T02] | `TerminalInput.test.tsx` — rewritten with 14 precise tests | [DONE]
- [ ] [SH-T03] | `TerminalOutput.test.tsx` — verify sequential boot tests reflect new animate/onComplete API | [TODO]
- [ ] [SH-T04] | `TerminalMessage.test.tsx` — add tests for `animate=false` and `onComplete` callback | [TODO]
- [ ] [SH-T05] | `Terminal.test.tsx` — message send → appears in output; `/clear` resets; `/panic` shows overlay | [TODO]
- [ ] [SH-T06] | `Terminal.test.tsx` — input disabled while isTyping is true | [TODO]
- [ ] [SH-T07] | `PanicOverlay.test.tsx` — crisis contacts rendered; close button works; Escape closes | [TODO]
- [ ] [SH-T08] | `Terminal.accessibility.test.tsx` — axe-core passes with zero violations | [TODO]

---

## 🟠 P1 — High Priority (Must be done before Demo 2)

### Mobile Preview Access

- [x] [P1-01] | `npm run dev:mobile` script — `vite --host 0.0.0.0` exposes on local Wi-Fi | [DONE]
- [ ] [P1-02] | Document the exact steps to access on mobile (ipconfig → phone browser) in README | [TODO]
- [ ] [P1-03] | ngrok one-liner: `npx ngrok http 5173` — test and document for remote mobile access | [TODO]
- [ ] [P1-04] | Single start script: `npm run preview-mobile` — starts Vite + ngrok, prints the URL | [TODO]

### UI Quality

- [ ] [P1-05] | Input: Up arrow recalls last sent message (standard terminal muscle memory) | [TODO]
- [ ] [P1-06] | TypingIndicator "Thinking…" announced to screen readers via `aria-live` | [TODO]
- [ ] [P1-07] | Input: multi-line paste flattened to single line before send | [TODO]
- [ ] [P1-08] | Replace all "Model Loading" text in UI with "Service Status" terminology | [TODO]

---

## 🟡 P2 — Medium Priority (Post-Demo 2)

### Safety & Guidelines

- [ ] [P2-01] | Audit `clinical_guidelines.json` with external medical review | [TODO]
- [ ] [P2-02] | Add location-aware crisis contacts (detect UK vs US vs default) | [TODO]

### Features

- [ ] [P2-03] | `/care` daily action plan command — show today's recommended actions | [TODO]
- [ ] [P2-04] | Hydration and medication micro-tracker in terminal | [TODO]
- [ ] [P2-05] | Persistent URL for mobile access (Cloudflare Tunnel with free named domain) | [TODO]
- [ ] [P2-06] | Backend memory: research long-term context offloading to server | [TODO]

---

## 🟢 P3 — Longer Term

### Architecture

- [ ] [P3-01] | HIPAA-compliant medical data schema | [TODO]
- [ ] [P3-02] | Migrate local health data to encrypted storage (`Web Crypto` already implemented) | [TODO]
- [ ] [P3-03] | Backend inference microservice (remove HF token from browser env) | [TODO]

### Research

- [ ] [P3-04] | Voice interface feasibility study | [TODO]
- [ ] [P3-05] | Multi-modal mood analysis from vitals data | [TODO]

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
