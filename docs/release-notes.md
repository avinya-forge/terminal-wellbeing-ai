# Release Notes

## v2.0.0-beta — Demo 2 Ready (Mar 2026)

> **Internal milestone.** Demo 2 is unblocked. Showstoppers and critical accessibility issues addressed.
> This beta establishes the foundational UI layer and comprehensive test coverage.
> What was fixed: 13 Visual/Interaction basics and 8 Test Coverage gaps.

### ✅ What's Working

**Visual / Interaction Basics**
- Status Consistency: Replaced disparate UI state strings with standardized "Service Status: Loading...", "Service Status: Connected", and "Service Status: Error" text patterns.
- Terminal fills 100% viewport width — removed 820px maxWidth cap
- Typed text invisible in input bar — `#terminal-input { color: #c8ffc8 }` override
- "Online" label has no green indicator — heartbeat-ring pulsing dot added next to text
- `modelLoaded` never visually becomes `true` — added 15s timeout to model loading to prevent infinite hang
- Boot messages don't animate in demo conditions — fixed sequential rendering logic in `TerminalOutput`
- Block cursor misaligned — replaced custom cursor with native caret + CSS styling
- App.tsx artificial 100ms delay — removed delay, verified immediate rendering
- Scroll-to-bottom races typewriter — implemented `onScrollToBottom` synchronization with typewriter animation
- Long AI responses break horizontal layout on narrow screens — added `maxWidth: 100%` and `overflow-wrap: anywhere`
- `/help` output is not readable — improved mobile formatting with indentation
- Panic overlay (Ctrl+P / `/panic`) — tab focus not trapped; Escape doesn't close
- Theme persistence broken — `/theme` saves to localStorage but `applyTheme()` reads wrong key on reload
- Privacy mode doesn't suppress localStorage — `useLocalStorage` still writes when privacy is ON

**Test Coverage (Stale / Missing)**
- `TerminalHeader.test.tsx` — rewritten with correct text assertions (11 tests)
- `TerminalInput.test.tsx` — rewritten with 14 precise tests
- `TerminalOutput.test.tsx` — verified sequential boot tests
- `TerminalMessage.test.tsx` — add tests for `animate=false` and `onComplete` callback
- `Terminal.test.tsx` — verified message send, clear, and panic overlay flow
- `Terminal.test.tsx` — verified input disabled state (with timeout fix)
- `PanicOverlay.test.tsx` — crisis contacts rendered; close button works; Escape closes
- `Terminal.accessibility.test.tsx` — fixed role and label assertions

**High Priority Improvements**
- `npm run dev:mobile` script — `vite --host 0.0.0.0` exposes on local Wi-Fi
- Input: Up arrow recalls last sent message (standard terminal muscle memory)
- TypingIndicator "Thinking…" announced to screen readers via `aria-live`
- Input: multi-line paste flattened to single line before send

## v2.0.0-alpha — Post-Demo 1 Reset (23 Feb 2026)

> **Internal milestone.** First public demo attempted. Demo surfaced critical UI regressions.
> This alpha marks the architectural foundation that is now in place.
> What works: safety pipeline, adaptive model routing, test isolation.
> What broke the demo: input text invisible, "Online" indicator missing, layout not full-screen.
> These are fixed in this release.

### ✅ What's Working

**Safety Architecture (NHS-aligned)**
- 3-tier safety triage engine (`SafetyTriageService`) runs before any AI inference
  - Tier 1 IMMEDIATE_EMERGENCY: halts inference, surfaces 999 / Samaritans / 988 contacts
  - Tier 2 UNSAFE_TERRITORY: halts inference, archives conversation to localStorage for review
  - Tier 3 HIGH_SENSITIVITY: routes to Zephyr 7B empathy model
- `clinical_guidelines.json` expanded with NHS Mental Health Plan / RCPSYCH / NICE CG90 references
- Conversation archival: `localStorage['twa_archived_conversations']` — inspect in DevTools anytime
- `EmergencyService` updated to new schema

**Adaptive Model Routing**
- `ModelRouter.ts` tone-scores every message across distress / complexity / brief / neutral dimensions
- Safety tier overrides tone scoring — HIGH_SENSITIVITY always gets Zephyr regardless of tone
- Model registry: Mistral 7B (neutral), Llama 3 8B (complex), Phi-2 (brief), Zephyr 7B (distress)

**UI Fixes (Demo 2 preparation)**
- Full-screen terminal — removed 820px maxWidth; terminal now fills 100% viewport
- Input text visibility — `#terminal-input { color: #c8ffc8 }` ensures typed text always readable
- Heartbeat green dot — `heartbeat-ring` CSS keyframe pings outward every 2s next to "Online"
- `npm run dev:mobile` script — exposes Vite on `0.0.0.0` for mobile LAN access

**Test Isolation**
- Global HF API fetch guard in `jest.setup.js` — any test that accidentally hits `api-inference.huggingface.co` throws immediately
- `TerminalHeader.test.tsx` — rewritten (11 tests, 2 snapshots)
- `TerminalInput.test.tsx` — rewritten (14 tests)
- `SafetyTriageService.test.tsx` — 14 tests across all 3 tiers
- `BackendClient.test.tsx` — fixed stale model assertion, added emergency-halt test
- `ModelRouter.test.tsx` — 12 tests for tone routing
- **Total: 61 tests passing, tsc: 0 errors**

### ❌ Known Issues (P0 — being fixed now)

(None)

### 🩹 Hotfixes (Feb 2026 Sprint)

**Showstopper Fixes**
- **Model Loading Hang (SH-04):** Added 15s timeout to model initialization circuit breaker to prevent infinite "Connecting..." state.
- **Boot Animation (SH-05):** Fixed race condition in `TerminalOutput` where boot messages failed to animate sequentially under load.
- **Cursor Alignment (SH-06):** Replaced custom JS-calculated block cursor with native CSS caret for perfect alignment.
- **Startup Speed (SH-07):** Removed artificial 100ms delay in `App.tsx`; terminal now renders immediately.
- **Scroll Sync (SH-08):** `Terminal` scroll now synchronizes with typewriter animation completion, ensuring new messages are always visible.
- **Theme Persistence (SH-12):** Moved theme initialization to `App.tsx` root to ensure correct application on mount.
- **Privacy Leak (SH-13):** `useLocalStorage` now respects global privacy mode, preventing writes to local storage. `terminal_messages` are explicitly cleared when entering privacy mode.
- **Panic Overlay (SH-11):** Implemented focus trap and Escape key listener for better accessibility and usability.
- **Input History (P1-05):** Added Up/Down arrow navigation for command history in `TerminalInput`.
- **Layout Robustness (SH-09):** Fixed horizontal overflow issues with long strings (e.g., URLs) by enforcing `maxWidth: 100%` and `overflow-wrap: anywhere`.
- **Mobile Help (SH-10):** Improved `/help` command formatting on mobile devices with proper indentation.
- **Accessibility (P1-06):** Added `aria-live="polite"` to `TypingIndicator` for screen reader announcements.
- **Input UX (P1-07):** Added paste handler to flatten multi-line input into a single line before sending.

---

## v1.9.0 — Security & Personalization

- **Feature:** Content filtering — keyword redaction for user-defined trigger warnings
- **Feature:** Profile Management — `/profile reset`, `/profile export`, `/profile view`, name validation
- **Feature:** Local encryption — AES-GCM via Web Crypto API for long-term memory
- **Feature:** Keyboard shortcuts — `Ctrl+K` clear, `Ctrl+L` focus, `Ctrl+,` profile
- **Feature:** Skip link for keyboard navigation

## v1.8.2 — Security Foundation & A11y

- **Security:** `KeyManager` with PBKDF2 key derivation, `rotateKey` support
- **A11y:** Automated axe-core pipeline in CI, generate-a11y-report script
- **Visual:** Loading skeletons, custom scrollbar styling verified

## v1.8.1 — Accessibility & Visual Polish

- Visual focus indicators for all interactive elements
- `TypingIndicator` refactored to CSS animations
- Reduced motion media query support
- Playwright + axe-core a11y spec, CI fails on violations

## v1.8.0 — Resilience & Architecture

- `CircuitBreaker` state machine for AI service resilience
- `LoggerService` with structured log levels
- Long-term memory with vector embeddings (`MemoryService`, `retrieveRelevantContext`)
- AES-GCM encryption for memory storage
- `EmbeddingWorker` for off-main-thread embedding processing

## v1.7.0 — Wellness Tools & Hygiene

- Dynamic `/help` command, `/quote`, `/breathe` (4-7-8 technique), `/profile`
- Expanded theme set (Dracula, Nord, Monokai, Solarized Dark)
- Strict TypeScript (`no-explicit-any` enforced throughout)

## v1.6.0 — Stats & Command Architecture

- `/stats` — session duration, message counts, mood trends, top topics
- `src/commands/` — scalable command architecture

## v1.5.0 — Visuals & Theming

- Theme system (`/theme <name>`) with 6 built-in themes, persistent preferences
- ASCII art command (`/art <mood>`)
- FOUC (Flash of Unstyled Content) eliminated

## v1.4.0 — Journaling & Refactor

- Private journaling (`/note`, `/notes`, `/delete-note`)
- `AIModelService` consolidation

## v1.3.0 — Privacy & Advanced Analysis

- Privacy Mode — toggles localStorage persistence for sensitive sessions
- Session Export (`/export`)
- Intensifiers, emoji sentiment, negation in analysis engine
- 5 new topic detectors (grief, self-esteem, social anxiety, loneliness, mindfulness)

## v1.2.0 — Resource Expansion

- 50+ mental health resources (LGBTQ+, BIPOC, Youth, Seniors, Legal, Housing)
- Smarter analysis with window-based negation
- `AIModelService` class pattern

## v1.1.0 — Crisis & Searchable Resources

- `/panic` command — high-contrast crisis overlay (988, 741741, 911)
- Searchable resource database
- Adaptive session-based AI responses
- PWA / offline support

## v1.0.0 — Initial Release

- Terminal-style chat interface
- Multi-model AI (DistilGPT-2, GPT-2, GPT-Neo)
- Sensitive topic detection and crisis resource redirection
- Core command system (`/help`, `/clear`, `/resources`)
