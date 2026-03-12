# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## PDLC/SDLC Unified Backlog

- [TASK] Analyze DB schema integration for persistent chat history [HIGH-RISK]
  - [TASK] Drill down into schema definition
  - [TASK] Implement db migration script
  - [DEBT] DB scaling and latency concerns
  - [TASK] Review security rules
- [TASK] Implement OAuth for user session storage [HIGH-RISK]
  - [TASK] Configure callback URLs and tokens
  - [TASK] Secure token endpoints
  - [DEBT] Token expiry handling
  - [TASK] Audit login flow
- [TASK] Integrate third-party API for emergency NHS routing fallback [HIGH-RISK]
  - [TASK] Handle API rate limiting
  - [TASK] Implement fallback caching mechanism
  - [DEBT] API failover mechanism
  - [TASK] End-to-end integration tests
- [RESOLVE] Reorganized repo documentation structure according to IO_SSOT mapping requirements.
