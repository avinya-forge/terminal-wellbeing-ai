# backlog

## executive summary
this backlog has been refined to follow the **breadth-then-depth** and **ai-ready context** standards. it is structured into epics containing granular tabular tasks.

- **MILESTONE [M1]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

- **TASK [C3-001]: Refactor .memory/context-anchor.json** | [DONE] | [Pillar-Refactor]
- **SPEC:** Refactor .memory/context-anchor.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-002]: Refactor components.json** | [DONE] | [Pillar-Refactor]
- **SPEC:** Refactor components.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-003]: Refactor e2e/a11y.spec.ts** | [DONE] | [Pillar-Refactor]
- **SPEC:** Refactor e2e/a11y.spec.ts to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-004]: Refactor e2e/service-status.spec.ts** | [DONE] | [Pillar-Refactor]
- **SPEC:** Refactor e2e/service-status.spec.ts to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [C3-005]: Refactor package-lock.json** | [DONE] | [Pillar-Refactor]
- **SPEC:** Refactor package-lock.json to ensure o(1) optimal paths where possible so that code quality is maintained. Target 1-2hrs atomicity.

- **TASK [E4-001]: Strict Typing Enforcement Part 1** | [DONE] | [Pillar-Typing]
- **SPEC:** Enforce strict typing in all context handlers and state managers. Replace any instances of generic Object types with exact interfaces. Target 1-2hrs atomicity.

- **TASK [E5-001]: Robust Error Handling Part 1** | [DONE] | [Pillar-Resilience]
- **SPEC:** Implement central error boundary to catch all unhandled promise rejections and component errors. Display safe fallback UI without exposing stack traces. Target 1-2hrs atomicity.

- **MILESTONE [M2]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

- **TASK [E6-001]: API & Inline Documentation Part 1** | [DONE] | [Pillar-Docs]
- **SPEC:** Document all core domain services (e.g. SessionManager, AIModelService) using typedoc compatible inline comments. Highlight input/output constraints. Target 1-2hrs atomicity.

- **TASK [E7-001]: Comprehensive Test Coverage Part 1** | [DONE] | [Pillar-Testing]
- **SPEC:** Write unit tests for the core SessionManager logic focusing strictly on branch coverage for privacy mode and state migration handling. Target 1-2hrs atomicity.

- **TASK [E8-001]: Finalize SSOT alignment** | [DONE] | [Pillar-Architecture]
- **SPEC:** Audit all three source-of-truth markdown files (vision, backlog, release-notes) and enforce perfect parity of naming conventions and current milestone statuses. Target 1-2hrs atomicity.

- **MILESTONE [M3]** | **PHASE [S3-EVOLVE-ALIGN]** | **GATEKEEPER** [0-Hygiene-Error | 95% Test | Build-Pass]

- **TASK [E9-001]: Test Coverage for AIModelService.ts** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 84 uncovered statements) in src/services/AIModelService.ts.

- **TASK [E9-002]: Test Coverage for use-toast.ts** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 53 uncovered statements) in src/hooks/use-toast.ts.

- **TASK [E9-003]: Test Coverage for MemoryService.ts** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 37 uncovered statements) in src/services/MemoryService.ts.

- **TASK [E9-004]: Test Coverage for notes.ts handler** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 33 uncovered statements) in src/commands/handlers/notes.ts.

- **TASK [E9-005]: Test Coverage for index.ts command parser** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 29 uncovered statements) in src/commands/index.ts.

- **TASK [E9-006]: Test Coverage for sessionManager.ts** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 28 uncovered statements) in src/utils/sessionManager.ts.

- **TASK [E9-007]: Test Coverage for ai.ts handler** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 22 uncovered statements) in src/commands/handlers/ai.ts.

- **TASK [E9-008]: Test Coverage for toast.tsx component** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 20 uncovered statements) in src/components/ui/toast.tsx.

- **TASK [E9-009]: Test Coverage for profile.ts handler** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 19 uncovered statements) in src/commands/handlers/profile.ts.

- **TASK [E9-010]: Test Coverage for embeddings.worker.ts** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests to bridge the coverage gap (currently 19 uncovered statements) in src/workers/embeddings.worker.ts.

- **TASK [E9-011]: Test Coverage for remaining UI and handlers** | [TODO] | [Pillar-Testing]
- **SPEC:** Add unit tests for resources.ts, Terminal.tsx, theme.ts, use-mobile.tsx, EmbeddingWorker.ts to get remaining coverage to >95% overall.
