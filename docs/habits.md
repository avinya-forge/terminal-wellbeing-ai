# habits

Rituals applied at every loop iteration.

| Action | When | Outcome |
|---|---|---|
| complete | task hits acceptance criteria | mark `[x]` in `backlog.md` |
| bump | task expands beyond a 1–2hr atomic unit | split + add granular sub-tasks under same epic |
| drill | epic still has un-atomized tasks | break the next phase-1 epic into <50 LOC steps |
| refresh | sprint-end retrospective | move done items to `release-notes.md`, prune stale doubts |
| audit | nightly / pre-merge | run `./run.sh --backlog`, `./run.sh --test`, axe-core |

## loop discipline
1. **One in-progress task at a time.** If you must context-switch, mark the
   current task back to pending with a note, do not orphan it.
2. **Atomic commits.** Every commit either passes CI on its own or is
   labelled `wip:` and rebased before merge.
3. **Doc parity per change.** A code change touching the safety pipeline
   means an ADR check; a new command means a `backlog.md` task; a new
   localStorage key means a row in `arch.md`.
