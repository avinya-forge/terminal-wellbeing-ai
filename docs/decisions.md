# decisions

Architecture decision records reconstructed from code state. Newer decisions
go on top.

## ADR-008 — Flat docs/ folder
**Status:** accepted (M3)
**Context:** docs were nested under architecture/, planning/, engineering/,
release/, rules/, testing/. Cross-linking required path memory and the SSOT
audit script (`run.sh --sync`) had to maintain a directory tree.
**Decision:** Flatten everything into `docs/`. One file per topic, file name
implies category.
**Consequences:** README's Visual-Index path links shorten; `run.sh --sync`
no longer needs `mkdir -p docs/<sub>`; cross-references use bare filename.

## ADR-007 — 3-tier safety engine + adaptive routing
**Status:** accepted (v2.1.0-alpha)
**Context:** Original design halted only on suicide keywords. Demo 1 surfaced
edge cases (e.g. self-harm methods, exploitation language) that needed a
non-emergency but non-AI path.
**Decision:** Introduce four tiers (`SAFE`, `HIGH_SENSITIVITY`,
`UNSAFE_TERRITORY`, `IMMEDIATE_EMERGENCY`) backed by `clinical_guidelines.json`.
Halt inference on tier 1 / 2; route tier 3 to empathy model regardless of
tone scoring.
**Consequences:** Two services (`SafetyTriageService`, `ModelRouter`) replace
the previous monolithic check. Archive entries persisted to localStorage
under `twa_archived_conversations` (cap 100).

## ADR-006 — Backend-first inference with local fallback
**Status:** accepted (v2.1.0-alpha)
**Context:** Loading 7B-class models in-browser is unreliable on low-end
hardware. Pure server-side calls fail when offline.
**Decision:** Prefer HF Inference API (gated by `VITE_HF_TOKEN`); fall back to
local `transformers.js` pipeline; final fallback is `SYSTEM_RESPONSES.fallback`
static content. Wrap all paths in `CircuitBreaker`.
**Consequences:** Two code paths in `AIModelService.generateResponse`. Token
must be supplied via `.env`.

## ADR-005 — AES-GCM encrypted long-term memory
**Status:** accepted (v1.8.0)
**Context:** Long-term memory enables RAG-style context retrieval, but
plaintext localStorage is a privacy hazard.
**Decision:** Generate AES-GCM 256 key on first run via Web Crypto, store JWK
under `wellbeing_encryption_key`, encrypt memory blob with random IV per save.
**Consequences:** Loss of key = loss of memory. Tests must mock `crypto.subtle`.

## ADR-004 — Off-main-thread embeddings
**Status:** accepted (v1.8.0)
**Context:** MiniLM embedding inference blocks the UI thread.
**Decision:** Move embedding work to a Web Worker (`EmbeddingWorker`) with a
factory pattern (`workerFactory.ts`) for testability.
**Consequences:** Async embed API; tests inject a mock worker.

## ADR-003 — Circuit breaker for AI calls
**Status:** accepted (v1.8.0)
**Context:** Unreliable model loading caused indefinite "Connecting…" state.
**Decision:** `CircuitBreaker` (CLOSED → OPEN → HALF_OPEN) wraps init + each
inference call. 3 failures → OPEN; 30s reset timeout → HALF_OPEN.
**Consequences:** `CircuitBreakerOpenError` short-circuits to static fallback;
header status updates accordingly.

## ADR-002 — Token-bucket rate limiting on NHS client
**Status:** accepted (v2.1.0-alpha)
**Context:** NHS Inference API published 10/min limit per subscription key.
**Decision:** `TokenBucket(10, 10, 60_000)` instance scoped to `nhs-client`.
On rate-limit miss, fall back to `nhsFallbackCache`, otherwise throw.
**Consequences:** Cache must be warm or the call fails; covered in
`e2e/nhs-routing.spec.ts`.

## ADR-001 — Command registry pattern
**Status:** accepted (v1.6.0)
**Context:** Inline conditionals for each command grew unwieldy.
**Decision:** `COMMANDS: Record<string, CommandHandler>` in
`src/commands/index.ts`. Handlers live in `src/commands/handlers/<name>.ts`,
one file per command, each independently testable.
**Consequences:** New commands = new file + registry entry. NL fall-through
preserved via `simpleCommands` allowlist for non-slash input.
