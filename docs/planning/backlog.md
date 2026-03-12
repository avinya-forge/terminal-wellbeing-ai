# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## PDLC/SDLC Unified Backlog

- [EPIC] Analyze DB schema integration for persistent chat history [HIGH-RISK]
  - [TASK] Drill down into schema definition
  - [TASK] Implement db migration script
  - [DEBT] DB scaling and latency concerns
  - [TASK] Review security rules
- [EPIC] Implement OAuth for user session storage [HIGH-RISK]
  - [TASK] Configure callback URLs and tokens
  - [TASK] Secure token endpoints
  - [DEBT] Token expiry handling
  - [TASK] Audit login flow
- [EPIC] Integrate third-party API for emergency NHS routing fallback [HIGH-RISK]
  - [ ] TASK: nhs-api-client-setup | Loc: src/services/nhs-client.ts | Spec: Fetch from NHS endpoint, handle auth headers | Deps: fetch | Hygiene: [P1] [HIGH-RISK] secure API keys
  - [ ] TASK: handle-api-rate-limiting | Loc: src/utils/rate-limiter.ts | Spec: Implement token bucket algorithm | Deps: none | Hygiene: 0 err, >95% cov
  - [NEEDS-SPLIT] TASK: implement-fallback-caching-mechanism | Loc: src/services/fallback-cache.ts | Spec: Redis or LRU cache for offline/failover | Deps: RedisClient? | Hygiene: Cache invalidation debt
  - [DEBT] API failover mechanism
  - [ ] TASK: end-to-end-integration-tests | Loc: e2e/nhs-routing.spec.ts | Spec: Playwright tests covering API failure cases | Deps: playwright | Hygiene: Flaky tests risk
- [RESOLVE] Reorganized repo documentation structure according to IO_SSOT mapping requirements.
