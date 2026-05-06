# coverage

## gate
Global threshold: **>95%** on lines / statements / branches / functions
(Jest config + CI pipeline). Below 95% is a blocker for any merge into a
release tag.

## current status
- M3 / S3 milestone target: ≥95% — see release-notes.md `v2.1.0-alpha`
  for the prior achievement and `backlog.md` for files currently under
  the line.

## how to run
```
npm run test:coverage
```
Opens `coverage/lcov-report/index.html` for local inspection. CI uploads
to codecov via `.github/workflows/ci-cd.yml`.

## areas tracked
| Area | Owner | Target |
|---|---|---|
| `src/services/` | safety + model team | 100% branch on tier handling |
| `src/commands/handlers/` | command team | 95% — every handler must own a test file |
| `src/utils/` | platform | 95% — pure functions are easy, no excuse |
| `src/components/` | UI team | 90% — accept lower bar for snapshot-only files |
| `src/workers/` | platform | covered via mocked factory in `EmbeddingWorker.test.ts` |

## known gaps & follow-ups
Tracked as backlog tasks. See `backlog.md` `[EPIC] System Audit & Tech Debt
Remediation` for the live list.

## conventions
- Test files sit next to their target: `Foo.tsx` → `Foo.test.tsx`.
- A handler PR without a test PR is incomplete.
- Coverage of `data/*.ts` and `types/*.ts` is excluded — those are constants
  and type definitions only.
