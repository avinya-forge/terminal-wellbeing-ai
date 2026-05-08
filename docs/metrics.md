# metrics

## project-health
- buffer: **green** for visual / coverage work
- buffer: **yellow** for safety bug fixes (tier-1 case-sensitivity is open)
- bottlenecks: HIGH-RISK blockers tracked in `doubts.md` (DB choice, OAuth
  provider) — both gate M4.

## quantitative gates
| Metric | Target | Source |
|---|---|---|
| Global test coverage | ≥95% lines/branches/funcs | Jest output |
| Lint warnings | ≤10 (transitional) | `npm run lint` |
| TS errors | 0 | `tsc --noEmit` (in `npm run build`) |
| axe-core violations | 0 | Playwright e2e |
| CI build time | <8 min | GitHub Actions |
| Time-to-emergency-response | <100ms | `SafetyTriageService` triage path |

## qualitative pulse
- safety triage: green (covered by 14 tests across 3 tiers)
- adaptive routing: green (12 router tests)
- privacy mode: yellow (memory restore on toggle-off needs verification)
- accessibility: green (axe-core passes; reduced-motion respected)
- documentation: green after this M3 SSOT pass (was red — sparse stubs)
