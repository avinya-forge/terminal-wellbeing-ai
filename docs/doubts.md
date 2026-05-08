# doubts

Open questions that block work in `backlog.md`. Resolve here before starting
the dependent tasks.

## blockers
- [BLOCKER] **DB choice missing**: We need to know which database to use
  (e.g., Postgres, MongoDB, SQLite) before we can "Analyze DB schema
  integration for persistent chat history" and "Drill down into schema
  definition".
- [BLOCKER] **OAuth provider choice missing**: We need to know which OAuth
  provider to use (e.g., Auth0, Google, GitHub) before we can "Implement
  OAuth for user session storage" and "Configure callback URLs and tokens".
- [BLOCKER] **NHS subscription key tier**: `nhs-client.ts` assumes a 10/min
  rate limit. Need confirmation of actual subscription tier and whether we
  must register a separate key for staging.

## clarifications needed
- [QUESTION] Should `MemoryService.setPrivacyMode(false)` re-load encrypted
  memory from storage, or is the privacy-on event a one-way wipe? Behaviour
  today depends on the cached `initialized` flag.
- [QUESTION] Are conversation archives (`twa_archived_conversations`)
  considered PII for the purposes of the privacy/export commands? Today
  `/export` does not include them.
- [QUESTION] What is the SLA for review of archived tier-1 / tier-2
  conversations? No `markReviewed` UI exists yet.
- [QUESTION] Confirm intended panic shortcut: release notes mention
  `Ctrl+P` but `useKeyboardShortcuts` binds `Ctrl+Shift+P`.
