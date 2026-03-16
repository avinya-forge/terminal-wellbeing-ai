# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## PDLC/SDLC Unified Backlog

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
- [x] [EPIC] Integrate third-party API for emergency NHS routing fallback [HIGH-RISK]
  - [x] TASK: nhs-api-client-setup | Loc: src/services/nhs-client.ts | Spec: Fetch from NHS endpoint, handle auth headers | Deps: fetch | Hygiene: [P1] [HIGH-RISK] secure API keys
  - [x] TASK: handle-api-rate-limiting | Loc: src/utils/rate-limiter.ts | Spec: Implement token bucket algorithm | Deps: none | Hygiene: 0 err, >95% cov
  - [x] TASK: implement-fallback-caching-mechanism | Loc: src/services/fallback-cache.ts | Spec: Redis or LRU cache for offline/failover | Deps: RedisClient? | Hygiene: Cache invalidation debt
  - [DEBT] API failover mechanism
  - [x] TASK: end-to-end-integration-tests | Loc: e2e/nhs-routing.spec.ts | Spec: Playwright tests covering API failure cases | Deps: playwright | Hygiene: Flaky tests risk
- [x] [EPIC] UI Re-engineering for Terminal Layout
  - [x] TASK: fix-text-visibility-issues | Loc: src/components/TerminalMessage.tsx | Spec: Update text styling classes for better contrast | Deps: none | Hygiene: 0 err, >95% cov
  - [x] TASK: implement-terminal-layout | Loc: src/components/Terminal.tsx | Spec: Adjust flex layouts and add terminal-like borders | Deps: none | Hygiene: 0 err, >95% cov
- [x] [EPIC] Reach 95% Test Coverage
  - [x] TASK: Write missing unit tests to reach coverage gatekeeper
  - [x] TASK: Fix visual bugs blocking demo 2
- [x] [RESOLVE] Reorganized repo documentation structure according to IO_SSOT mapping requirements.
- [x] [HIGH-RISK] [EPIC] Document 3-tier safety engine architecture
  - [x] TASK: Draft safety tier specifications in docs/architecture/system-design.md
  - [x] RESOLVE: Missing architecture diagrams for safety routing
- [x] [HIGH-RISK] [EPIC] Document adaptive model routing (specialized local/remote models)
  - [x] TASK: Update docs/architecture/system-design.md with model fallback logic
