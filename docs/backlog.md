# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M1]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

- **TASK [C3-001]: Refactor .memory/context-anchor.json** | [TODO] | [Pillar-Refactor]
- **SPEC:** Refactor .memory/context-anchor.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-002]: Refactor components.json** | [TODO] | [Pillar-Refactor]
- **SPEC:** Refactor components.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-003]: Refactor e2e/a11y.spec.ts** | [TODO] | [Pillar-Refactor]
- **SPEC:** Refactor e2e/a11y.spec.ts to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-004]: Refactor e2e/service-status.spec.ts** | [TODO] | [Pillar-Refactor]
- **SPEC:** Refactor e2e/service-status.spec.ts to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-005]: Refactor package-lock.json** | [TODO] | [Pillar-Refactor]
- **SPEC:** Refactor package-lock.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [E4-001]: Strict Typing Enforcement Part 1** | [TODO] | [Pillar-Typing]
- **SPEC:** Enforce strict typing in all context handlers and state managers. Replace any instances of generic Object types with exact interfaces. Target 1-2hrs atomicity.

- **TASK [E5-001]: Robust Error Handling Part 1** | [TODO] | [Pillar-Resilience]
- **SPEC:** Implement central error boundary to catch all unhandled promise rejections and component errors. Display safe fallback UI without exposing stack traces. Target 1-2hrs atomicity.

- **MILESTONE [M2]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

- **TASK [E6-001]: API & Inline Documentation Part 1** | [TODO] | [Pillar-Docs]
- **SPEC:** Document all core domain services (e.g. SessionManager, AIModelService) using typedoc compatible inline comments. Highlight input/output constraints. Target 1-2hrs atomicity.

- **TASK [E7-001]: Comprehensive Test Coverage Part 1** | [TODO] | [Pillar-Testing]
- **SPEC:** Write unit tests for the core SessionManager logic focusing strictly on branch coverage for privacy mode and state migration handling. Target 1-2hrs atomicity.

- **TASK [E8-001]: Finalize SSOT alignment** | [TODO] | [Pillar-Architecture]
- **SPEC:** Audit all three source-of-truth markdown files (vision, backlog, release-notes) and enforce perfect parity of naming conventions and current milestone statuses. Target 1-2hrs atomicity.
