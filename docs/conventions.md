# conventions

## file & directory layout
- `src/components/` — React UI. One file = one component. Tests live as
  siblings (`Foo.tsx` ↔ `Foo.test.tsx`).
- `src/commands/handlers/<name>.ts` — one file per slash command. Register in
  `src/commands/index.ts`.
- `src/services/` — singletons / stateful services. Use `getInstance()` for
  ones with cross-cutting state (`SafetyTriageService`, `MemoryService`,
  `EmergencyService`, `BackendClient`).
- `src/utils/` — pure functions. No singletons. No React imports.
- `src/data/` — static data, JSON, dictionaries. No logic.
- `src/types/` — TS interfaces only. No runtime code.
- `src/config/` — constants and registry tables.

## TypeScript
- `strict: true` is non-negotiable.
- No `any` — use `unknown` and narrow.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- All exported services/functions get a JSDoc one-liner.

## naming
- Components: `PascalCase.tsx`. Test sibling: `PascalCase.test.tsx`.
- Hooks: `useXxx.ts(x)`. Test sibling: `useXxx.test.ts(x)`.
- Services: `PascalCaseService.ts` (or `kebab-case.ts` for non-class
  modules like `nhs-client.ts`, `fallback-cache.ts`).
- localStorage keys: `wellbeing_<noun>` for app state,
  `terminal_<noun>` for UI, `twa_<noun>` for safety archive.

## testing
- Jest + React Testing Library for unit/component.
- Playwright + axe-core for e2e + a11y in `e2e/`.
- Mock the network in `jest.setup.js` so any leak to
  `api-inference.huggingface.co` throws.
- Aim for >95% global coverage. Branch coverage matters more than line.

## commits
- Lowercase imperative present tense — "add token-bucket limiter", not
  "Added…" or "Adds…".
- Reference epic / task IDs from `docs/backlog.md` when applicable.

## styling
- Tailwind utility classes for layout, CSS variables (HSL triplets) for
  theme-driven colour.
- Theme variables live in `src/utils/themes.ts` and are written to
  `:root` style props by `applyTheme()`.

## accessibility (non-negotiable)
- All interactive elements reachable by keyboard.
- `aria-live="polite"` for status text and typing indicators.
- Focus traps for modal dialogs (`PanicOverlay`).
- Respect `prefers-reduced-motion` for typewriter + scroll behaviour.
- CI runs axe-core and fails on any violation (see
  `e2e/a11y.spec.ts` and `.github/workflows/ci-cd.yml`).

## safety pipeline rules
- **Never call inference before `SafetyTriageService.triage`** completes.
- Tier 1 / 2 must `haltInference: true` and return a `safeResponse`.
- New tier-1 / tier-2 keywords go in `clinical_guidelines.json` only —
  never inline.
- Compare keyword matches case-insensitively in **both** directions
  (lowercase the message *and* the keyword) — never trust JSON casing.

## error handling
- Use `logger` from `LoggerService`, never raw `console.*`.
- Recoverable failures fall through to fallback layers; only propagate when
  the user must see them.
