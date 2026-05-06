# map

Cross-doc index. Use this to find the canonical doc for any topic.

## by topic
| Topic | Canonical doc |
|---|---|
| product purpose, principles, non-goals | `vision.md` |
| component / service / util layout | `arch.md` |
| safety engine + model router internals | `system-design.md` |
| ADRs (decisions made and why) | `decisions.md` |
| coding patterns and naming | `conventions.md` |
| environment + scripts + CI gates | `overview.md` |
| current sprint tasks + bugs | `backlog.md` |
| milestone sequencing | `roadmap.md` |
| open blockers needing user input | `doubts.md` |
| past releases | `release-notes.md` |
| project pulse / debt | `metrics.md` |
| coverage targets and gaps | `coverage.md` |
| manual / e2e walkthrough | `test-cases.md` |
| process + agent rules | `agent-standards.md`, `standards.md`, `habits.md`, `hygiene.md` |

## conflict map
upstream: none
downstream: none

## SSOT alignment
- README's Visual-Index is the canonical link list.
- `vision.md`, `backlog.md`, `release-notes.md` must agree on the active
  milestone identifier (`M3 / S3 EVOLVE-ALIGN` at time of writing).
- `package.json#version` should track the most recent entry in
  `release-notes.md`.
