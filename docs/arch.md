# arch

High-level architecture map. Companion docs: `system-design.md` for the safety
engine + model router internals, `decisions.md` for ADRs, `conventions.md` for
coding patterns.

## separation of concerns

```
┌─────────────────────────────────────────────────────────────────────┐
│                       UI LAYER (React + Tailwind)                   │
│  src/components/                                                    │
│  ├─ Terminal.tsx          ── orchestrator                          │
│  ├─ TerminalHeader.tsx    ── status, privacy badge, traffic lights │
│  ├─ TerminalOutput.tsx    ── sequential boot + message rendering    │
│  ├─ TerminalInput.tsx     ── input, history, paste flatten          │
│  ├─ TerminalMessage.tsx   ── typewriter w/ reduced-motion respect   │
│  ├─ TypingIndicator.tsx   ── aria-live "thinking…" indicator        │
│  ├─ PanicOverlay.tsx      ── focus-trapped crisis modal             │
│  ├─ ReloadPrompt.tsx      ── PWA update banner                      │
│  └─ ui/*                  ── shadcn-style primitives                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          COMMAND LAYER                              │
│  src/commands/                                                      │
│  ├─ index.ts              ── command registry + slash/NL routing    │
│  └─ handlers/             ── ai, breathe, notes, profile, quote,    │
│                              resources, stats, system, theme        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER                              │
│  src/services/                                                      │
│  ├─ SafetyTriageService   ── 3-tier safety engine (HALT logic)      │
│  ├─ ModelRouter           ── tone + safety → model selection        │
│  ├─ BackendClient         ── HF Inference API caller                │
│  ├─ AIModelService        ── local pipeline + fallback orchestrator │
│  ├─ MemoryService         ── AES-GCM encrypted long-term memory     │
│  ├─ JournalService        ── private journal entries                │
│  ├─ EmergencyService      ── physical-emergency keyword detection   │
│  ├─ nhs-client            ── NHS API + rate-limit + cache fallback  │
│  ├─ fallback-cache        ── TTL in-memory cache                    │
│  └─ LoggerService         ── structured logger                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           UTIL LAYER                                │
│  src/utils/                                                         │
│  ├─ sessionManager   ── profile, sentiment trend, privacy           │
│  ├─ analysis         ── sentiment + topic extraction                │
│  ├─ ai-helpers       ── sanitize, sensitive detection, post-process │
│  ├─ commandParser    ── slash + NL tokenizer                        │
│  ├─ themes           ── theme registry + CSS-var application        │
│  ├─ encryption       ── Web Crypto AES-GCM helpers                  │
│  ├─ embeddings       ── cosine-sim + worker proxy                   │
│  ├─ rate-limiter     ── token bucket                                │
│  ├─ CircuitBreaker   ── CLOSED/OPEN/HALF_OPEN state machine         │
│  ├─ KeyManager       ── PBKDF2 key derivation + rotation            │
│  ├─ a11y             ── focus + aria helpers                        │
│  └─ ascii            ── ASCII-art renderer                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                 │
│  src/data/                                                          │
│  ├─ clinical_guidelines.json  ── NHS-aligned tier keywords          │
│  ├─ phrases.ts                ── greetings, fallback responses      │
│  ├─ quotes.ts                 ── motivational quotes                │
│  ├─ resources.ts              ── searchable resource directory      │
│  ├─ responses.ts              ── help, initial messages, dispatch   │
│  ├─ sentiment.ts              ── sentiment dictionary, intensifiers │
│  └─ topics.ts                 ── topic keyword sets                 │
└─────────────────────────────────────────────────────────────────────┘
```

## runtime flow (single message)

```
User types message
   │
   ▼
Terminal.handleSendMessage
   │
   ├─ panic / clear / privacy intercepts
   │
   ▼
processCommand(input, history)
   │
   ├─ slash → COMMANDS[name](parsed, messages)
   │
   └─ NL  → getResponseForMessage → generateResponse
              │
              ▼
              EmergencyService.checkCriticalSymptoms (Tier-1 fast path)
              │
              ▼
              isGreeting / isSensitiveTopic short-circuits
              │
              ▼
              BackendClient.generateText
                 │
                 ├─ SafetyTriageService.triage  ── HALT or proceed
                 │
                 ├─ ModelRouter.selectModel    ── pick HF model
                 │
                 └─ fetch HF Inference API     ── circuit breaker wrapped
              │
              ▼
              local pipeline fallback (transformers.js)
              │
              ▼
              static SYSTEM_RESPONSES.fallback
   │
   ▼
postProcessResponse → MemoryService.addMemory → render bot message
```

## persistence map (localStorage keys)
| Key | Owner | Notes |
|---|---|---|
| `terminal_messages` | `useLocalStorage` (Terminal) | cleared in privacy mode |
| `terminal_theme` | `handleThemeCommand`, `App.tsx` | plain string, JSON-legacy supported |
| `wellbeing_user_profile` | `sessionManager` | debounced 1s save |
| `wellbeing_journal` | `JournalService` | cleared in privacy mode |
| `wellbeing_long_term_memory` | `MemoryService` | AES-GCM encrypted |
| `wellbeing_encryption_key` | `MemoryService` | JWK string |
| `twa_archived_conversations` | `SafetyTriageService` | cap 100 entries |
