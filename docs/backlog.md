# Backlog

## Phase 1: Resilience & Architecture (Sprint 1.8.0)

### [EPIC-1.1] AI Service Resilience (10 WU)
- [ ] [ID-1.1.1] | Define `CircuitBreaker` class interface and configuration types | [INDEPENDENT] | [TODO]
- [ ] [ID-1.1.2] | Implement `CircuitBreaker` state machine (Closed -> Open -> Half-Open) | [BLOCKS-ID-1.1.3] | [TODO]
- [ ] [ID-1.1.3] | Implement failure counting logic in `CircuitBreaker` | [BLOCKS-ID-1.1.4] | [TODO]
- [ ] [ID-1.1.4] | Implement timeout/reset logic for Open state | [INDEPENDENT] | [TODO]
- [ ] [ID-1.1.5] | Integrate `CircuitBreaker` into `AIModelService.ts` initialization | [BLOCKS-ID-1.1.1] | [TODO]
- [ ] [ID-1.1.6] | Integrate `CircuitBreaker` into `AIModelService.ts` generation | [BLOCKS-ID-1.1.1] | [TODO]
- [ ] [ID-1.1.7] | Add unit tests for `CircuitBreaker` state transitions | [INDEPENDENT] | [TODO]
- [ ] [ID-1.1.8] | Add unit tests for `CircuitBreaker` failure counting | [INDEPENDENT] | [TODO]

### [EPIC-1.2] Code Hardening: Magic Strings (10 WU)
- [ ] [ID-1.2.1] | Create `src/constants/moods.ts` and define mood types/enums | [INDEPENDENT] | [TODO]
- [ ] [ID-1.2.2] | Migrate hardcoded mood strings from `analyzeText` to `moods.ts` | [BLOCKS-ID-1.2.1] | [TODO]
- [ ] [ID-1.2.3] | Update `AnalysisResult` type to use strict Mood enum/union | [BLOCKS-ID-1.2.1] | [TODO]

### [EPIC-1.3] Observability: Error Logging (10 WU)
- [ ] [ID-1.3.1] | Design `LoggerService` interface with log levels | [INDEPENDENT] | [TODO]
- [ ] [ID-1.3.2] | Implement `ConsoleLogger` adapter | [BLOCKS-ID-1.3.1] | [TODO]
- [ ] [ID-1.3.3] | Replace all `console.error` in `AIModelService` with `LoggerService.error` | [BLOCKS-ID-1.3.2] | [TODO]

### [EPIC-1.4] Testing Hardening (10 WU)
- [ ] [ID-1.4.1] | Create `AIModelService.fallback.test.ts` | [INDEPENDENT] | [TODO]
- [ ] [ID-1.4.2] | Mock `pipeline` failure scenarios for primary model | [INDEPENDENT] | [TODO]
- [ ] [ID-1.4.3] | Verify fallback to secondary model on primary failure | [INDEPENDENT] | [TODO]
- [ ] [ID-1.4.4] | Verify fallback to tertiary/heuristic on all model failure | [INDEPENDENT] | [TODO]
- [ ] [ID-1.4.5] | Test `tryFallbackModels` loop logic explicitly | [INDEPENDENT] | [TODO]
- [ ] [ID-1.5.1] | Create `OfflineMode.e2e.test.ts` | [INDEPENDENT] | [TODO]
- [ ] [ID-1.5.2] | Test PWA service worker registration event | [INDEPENDENT] | [TODO]
- [ ] [ID-1.5.3] | Test offline asset caching verification | [INDEPENDENT] | [TODO]

## Phase 2: Deep Personalization

### [EPIC-2.1] Long-term Memory Architecture (10 WU)
- [ ] [ID-2.1.1] | Define `MemoryEntry` interface (content, timestamp, embedding) | [INDEPENDENT] | [TODO]
- [ ] [ID-2.1.2] | Create `MemoryService` class structure | [INDEPENDENT] | [TODO]
- [ ] [ID-2.1.3] | Implement `localStorage` adapter for `MemoryService` | [BLOCKS-ID-2.1.2] | [TODO]
- [ ] [ID-2.2.1] | Research lightweight JS-based embedding library | [INDEPENDENT] | [TODO]
- [ ] [ID-2.2.2] | Implement `calculateEmbedding(text)` helper function | [INDEPENDENT] | [TODO]
- [ ] [ID-2.2.3] | Implement `cosineSimilarity(vecA, vecB)` helper | [INDEPENDENT] | [TODO]
- [ ] [ID-2.2.4] | Implement `retrieveRelevantContext(query)` in `MemoryService` | [BLOCKS-ID-2.2.3] | [TODO]
- [ ] [ID-2.2.5] | Integrate `MemoryService` into `AIModelService.prepareContext` | [BLOCKS-ID-2.2.4] | [TODO]
- [ ] [ID-2.2.6] | Add unit tests for vector math helpers | [INDEPENDENT] | [TODO]
- [ ] [ID-2.2.7] | Add unit tests for memory storage/retrieval | [INDEPENDENT] | [TODO]

### [EPIC-2.3] User Profile Expansion (10 WU)
- [ ] [ID-2.3.1] | Update `UserProfile` interface to include `triggerWarnings` | [INDEPENDENT] | [TODO]
- [ ] [ID-2.3.2] | Update `/profile` command parser for `trigger-warnings` | [BLOCKS-ID-2.3.1] | [TODO]
- [ ] [ID-2.3.3] | Create UI for "Trigger Warning" selection | [INDEPENDENT] | [TODO]
- [ ] [ID-2.3.4] | Implement `filterContent(response, warnings)` helper | [INDEPENDENT] | [TODO]
- [ ] [ID-2.3.5] | Integrate content filtering into `postProcessResponse` | [BLOCKS-ID-2.3.4] | [TODO]
- [ ] [ID-2.3.6] | Add unit tests for content filtering logic | [INDEPENDENT] | [TODO]

## Phase 3: Accessibility & UX

### [EPIC-3.1] Accessibility Audit (10 WU)
- [ ] [ID-3.1.1] | Install `axe-core` accessibility testing library | [INDEPENDENT] | [TODO]
- [ ] [ID-3.1.2] | Create `verify_a11y.ts` script | [INDEPENDENT] | [TODO]
- [ ] [ID-3.1.3] | Define "Critical Paths" for verification | [INDEPENDENT] | [TODO]
- [ ] [ID-3.1.4] | Implement WCAG AA Color Contrast checker utility | [INDEPENDENT] | [TODO]
- [ ] [ID-3.1.5] | Run contrast check on "Modern" theme | [BLOCKS-ID-3.1.4] | [TODO]
- [ ] [ID-3.1.6] | Run contrast check on "Retro" theme | [BLOCKS-ID-3.1.4] | [TODO]
- [ ] [ID-3.1.7] | Run contrast check on "Matrix" theme | [BLOCKS-ID-3.1.4] | [TODO]
- [ ] [ID-3.1.8] | Run contrast check on "Cyberpunk" theme | [BLOCKS-ID-3.1.4] | [TODO]
- [ ] [ID-3.1.9] | Run contrast check on "Ocean" theme | [BLOCKS-ID-3.1.4] | [TODO]
- [ ] [ID-3.1.10] | Run contrast check on "Light" theme | [BLOCKS-ID-3.1.4] | [TODO]

### [EPIC-3.2] UI & Focus Management (10 WU)
- [ ] [ID-3.2.1] | Audit `TerminalInput` focus management | [INDEPENDENT] | [TODO]
- [ ] [ID-3.2.2] | Audit `TerminalOutput` live region updates | [INDEPENDENT] | [TODO]
- [ ] [ID-3.2.3] | Fix missing `aria-labels` on interactive elements | [INDEPENDENT] | [TODO]

### [EPIC-3.3] Visual Polish (10 WU)
- [ ] [ID-3.3.1] | Profile `TypingIndicator` performance | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.2] | Refactor `TypingIndicator` to use CSS animations | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.3] | Optimize re-renders in `Terminal.tsx` | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.4] | Verify "smooth scrolling" behavior | [INDEPENDENT] | [TODO]
