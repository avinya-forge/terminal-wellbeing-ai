# hygiene

## non-negotiables
- 0 style violations on lint (max-warnings 10 ceiling kept for transitional
  noise; any new warnings get fixed before merge).
- 0 TS errors (`tsc --noEmit` is part of `npm run build`).
- 0 a11y violations from axe-core.
- 0 unhandled promise rejections in Jest output.
- Strict adherence to `standards.md` and `agent-standards.md`.

## smell list (escalate to backlog when observed)
- Inline emergency keywords outside `clinical_guidelines.json`.
- Direct `console.log` / `console.error` (use `logger`).
- New singletons without `getInstance()` accessor + reset path for tests.
- New localStorage keys not registered in `arch.md` persistence map.
- Magic numbers (timeouts, thresholds) — pull into `config/ai-constants.ts`.
- Unbounded `setTimeout` / `setInterval` without cleanup.
- Duplicate scripts (e.g. `run.sh` in two places — clean up first).

## tidy hooks
- `npm run lint` before every push.
- `npm run test:coverage` before any PR open.
- Delete dead code on sight; do not park `// TODO: remove`.
