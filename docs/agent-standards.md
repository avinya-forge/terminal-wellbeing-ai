# agent-standards

Rules for any AI agent (Claude Code, Copilot, etc.) operating in this repo.

## non-negotiables
- Force modularity. No one-off components.
- Never bypass `SafetyTriageService` when adding new inference paths.
- Never inline tier keywords — they live in `clinical_guidelines.json`.
- Never write secrets to docs, examples, or commits.
- Never delete the existing `backlog.md` entries; append-only with
  `[x]` or `[BLOCKER]` markers.

## before writing code
1. Read `vision.md`, `arch.md`, `conventions.md`.
2. Check `decisions.md` for prior ADRs that may already cover the change.
3. Check `backlog.md` for an existing task; if none, add one before
   implementing.

## before opening a PR
1. `npm run ci` (lint + test + build) must pass locally.
2. New code carries sibling tests; coverage stays ≥95%.
3. New service / handler appears in `arch.md` if structurally significant.
4. Any new ADR-level decision is captured in `decisions.md`.

## review reflexes
- Question any change to the safety pipeline. Default: more tests, less code.
- Prefer to extend `clinical_guidelines.json` over adding inline strings.
- Prefer fall-through fallbacks (cache → static phrases) over hard errors
  in the user path.
- Reject any change that uses `console.*` directly — use `logger`.
