# roadmap

Milestone view. Source of truth for sprint sequencing; pulls task detail from
`backlog.md`.

## M3 — S3 EVOLVE / ALIGN (active)
Stabilise Demo 2 visual layer, push global coverage above 95%, document the
safety architecture, and clear the known critical bugs.

- [active] safety: case-sensitivity bug in tier-1 keyword matching
- [active] hygiene: deduplicate `run.sh` (root vs `scripts/`)
- [active] hygiene: `scripts/manage.js cleanup` deletes essential files
- [active] env: document `VITE_NHS_API_KEY` in `.env.example`
- [active] coverage gap closure across services + handlers
- [active] doc tree flattening + SSOT alignment

## M4 — Persistence & Identity (next)
Resolve the two HIGH-RISK blockers tracked in `doubts.md`.

- DB choice for persistent chat history (Postgres vs SQLite vs IndexedDB).
- OAuth provider selection (Auth0 vs GitHub vs Google) and login flow.
- DB migration script + schema review.
- Token endpoint hardening + audit.

## M5 — Clinical Polish
- Expand Tier-1 / Tier-2 keyword coverage with NHS-supplied phrases.
- Add multi-language support starting with Welsh + Punjabi (NHS priority).
- Conversation archive review tooling (mark-reviewed UI, redaction).
- Per-tier outcome telemetry (anonymous, opt-in).

## M6 — Edge & Offline
- Service worker pre-caches local fallback model weights.
- IndexedDB-backed memory beyond localStorage size limits.
- Offline analytics queue with replay on reconnect.

## release cadence
- Internal alpha: rolling, tagged on every `main` merge that passes CI.
- Demo cuts: tagged `vX.Y.Z-demoN` with frozen feature set.
- Public beta: gated on M4 completion.
