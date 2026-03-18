# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

## PDLC/SDLC Unified Backlog

- [EPIC] UI Re-engineering & Test Coverage Unblocker [M3]
  - [x] [TASK] Fix terminal layout issues in src/components/Terminal.tsx
  - [x] [TASK] Increase UI test coverage (>95%) by adding tests for input, label, separator, skeleton, sonner, toaster

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
