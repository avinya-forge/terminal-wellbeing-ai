1. **SYNC**: Execute `./run.sh --backlog` to reconcile backlog.md against actual codebase.

2. **DRILL-DOWN**: Based on `docs/planning/backlog.md`, we will select the Epic: "Integrate third-party API for emergency NHS routing fallback [HIGH-RISK]".
Specifically, we will take the un-atomized Phase 1 Epic task:
`[ ] TASK: nhs-api-client-setup | Loc: src/services/nhs-client.ts | Spec: Fetch from NHS endpoint, handle auth headers | Deps: fetch | Hygiene: [P1] [HIGH-RISK] secure API keys`

The other tasks in the Epic:
- `handle-api-rate-limiting`
- `implement-fallback-caching-mechanism` (this is `[NEEDS-SPLIT]`)
- `API failover mechanism` (this is `[DEBT]`)
- `end-to-end-integration-tests`

As per "SINGLE-EPIC FOCUS", we select "exactly ONE un-atomized Phase 1 Epic. Breakdown into 1-2hr segments (<50 LOC)."

Let's focus on: `nhs-api-client-setup`

3. **EXECUTION**:
- Create `src/services/nhs-client.ts` implementing a basic fetch from NHS endpoint with auth headers.
- Create unit tests for it to ensure >95% coverage and 0 errors, e.g. `src/services/nhs-client.test.ts`.

4. **BACKLOG UPDATE**:
- Update `docs/planning/backlog.md` to mark the task as `[x]`.

5. **PRE COMMIT**: Call `pre_commit_instructions` and follow its instructions.

6. **OUTPUT**: Generate the mandatory output format as requested by the user.
