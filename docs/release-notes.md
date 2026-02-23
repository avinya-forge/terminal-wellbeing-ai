# Release Notes

## v2.0.0 (Phase 7: The Backend Shift) - PLANNED
- **Architecture:** Transitioning AI inference from client-side to a scalable backend.
- **Delivery:** Implementing daily automated deployments for continuous feedback.
- **UX:** Simplified terminal interface, abstracting complex model management.
- **Deployment:** Staging environment accessible via browser for daily testing.


## v1.8.2 (Phase 5: Security Foundation & A11y Polish)

### [EPIC-5.1] Local Data Encryption (Foundation)
- [x] [ID-5.1.1] | Research & Document Web Crypto API (SubtleCrypto) usage | [INDEPENDENT] | [DONE]
- [x] [ID-5.1.2] | Implement `KeyManager` with PBKDF2 key derivation | [BLOCKS-ID-5.1.1] | [DONE]
- [x] [ID-5.1.3] | Verify/Refine `encryptData(data, key)` utility | [BLOCKS-ID-5.1.2] | [DONE]
- [x] [ID-5.1.4] | Verify/Refine `decryptData(data, key)` utility | [BLOCKS-ID-5.1.2] | [DONE]
- [x] [ID-5.1.7] | Implement `rotateKey` for secure key rotation | [INDEPENDENT] | [DONE]

### [EPIC-3.3] Visual Polish (Backlog Cleanup)
- [x] [ID-3.3.7] | Verify Loading Skeletons implementation | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.8] | Verify Custom Scrollbar styling | [INDEPENDENT] | [DONE]

### [EPIC-3.4] Automated Accessibility Pipeline
- [x] [ID-3.4.5] | Create `generate-a11y-report` script for CI artifacts | [INDEPENDENT] | [DONE]

## v1.8.1 (Phase 3: Accessibility & Visual Polish)

### [EPIC-3.2] UI & Focus Management (10 WU)
- [x] [ID-3.2.8] | Add visual focus indicators for all interactive elements | [INDEPENDENT] | [DONE]

### [EPIC-3.3] Visual Polish (10 WU)
- [x] [ID-3.3.1] | Profile `TypingIndicator` performance | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.2] | Refactor `TypingIndicator` to use CSS animations | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.3] | Optimize re-renders in `Terminal.tsx` | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.5] | Implement "Reduced Motion" media query support | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.6] | Standardize spacing using Tailwind utility classes | [INDEPENDENT] | [DONE]

### [EPIC-3.4] Automated Accessibility Pipeline (10 WU)
- [x] [ID-3.4.1] | Install `playwright` and `@axe-core/playwright` | [INDEPENDENT] | [DONE]
- [x] [ID-3.4.2] | Create `a11y.spec.ts` for automated audit | [BLOCKS-ID-3.4.1] | [DONE]
- [x] [ID-3.4.3] | Implement "Critical Path" accessibility tests | [BLOCKS-ID-3.4.2] | [DONE]
- [x] [ID-3.4.4] | Configure CI to fail on accessibility violations | [INDEPENDENT] | [DONE]

## v1.8.0 (Phase 1: Resilience & Architecture)

### [EPIC-1.1] AI Service Resilience (10 WU)
- [x] [ID-1.1.1] | Define `CircuitBreaker` class interface and configuration types | [INDEPENDENT] | [DONE]
- [x] [ID-1.1.2] | Implement `CircuitBreaker` state machine (Closed -> Open -> Half-Open) | [BLOCKS-ID-1.1.3] | [DONE]
- [x] [ID-1.1.3] | Implement failure counting logic in `CircuitBreaker` | [BLOCKS-ID-1.1.4] | [DONE]
- [x] [ID-1.1.4] | Implement timeout/reset logic for Open state | [INDEPENDENT] | [DONE]
- [x] [ID-1.1.5] | Integrate `CircuitBreaker` into `AIModelService.ts` initialization | [BLOCKS-ID-1.1.1] | [DONE]
- [x] [ID-1.1.6] | Integrate `CircuitBreaker` into `AIModelService.ts` generation | [BLOCKS-ID-1.1.1] | [DONE]
- [x] [ID-1.1.7] | Add unit tests for `CircuitBreaker` state transitions | [INDEPENDENT] | [DONE]
- [x] [ID-1.1.8] | Add unit tests for `CircuitBreaker` failure counting | [INDEPENDENT] | [DONE]

### [EPIC-1.2] Code Hardening: Magic Strings (10 WU)
- [x] [ID-1.2.1] | Create `src/constants/moods.ts` and define mood types/enums | [INDEPENDENT] | [DONE]
- [x] [ID-1.2.2] | Migrate hardcoded mood strings from `analyzeText` to `moods.ts` | [BLOCKS-ID-1.2.1] | [DONE]
- [x] [ID-1.2.3] | Update `AnalysisResult` type to use strict Mood enum/union | [BLOCKS-ID-1.2.1] | [DONE]

### [EPIC-1.3] Observability: Error Logging (10 WU)
- [x] [ID-1.3.1] | Design `LoggerService` interface with log levels | [INDEPENDENT] | [DONE]
- [x] [ID-1.3.2] | Implement `ConsoleLogger` adapter | [BLOCKS-ID-1.3.1] | [DONE]
- [x] [ID-1.3.3] | Replace all `console.error` in `AIModelService` with `LoggerService.error` | [BLOCKS-ID-1.3.2] | [DONE]

### [EPIC-1.4] Testing Hardening (10 WU)
- [x] [ID-1.4.1] | Create `AIModelService.fallback.test.ts` | [INDEPENDENT] | [DONE]
- [x] [ID-1.4.2] | Mock `pipeline` failure scenarios for primary model | [INDEPENDENT] | [DONE]
- [x] [ID-1.4.3] | Verify fallback to secondary model on primary failure | [INDEPENDENT] | [DONE]
- [x] [ID-1.4.4] | Verify fallback to tertiary/heuristic on all model failure | [INDEPENDENT] | [DONE]
- [x] [ID-1.4.5] | Test `tryFallbackModels` loop logic explicitly | [INDEPENDENT] | [DONE]

### [EPIC-2.1] Long-term Memory Architecture (10 WU)
- [x] [ID-2.1.1] | Define `MemoryEntry` interface (content, timestamp, embedding) | [INDEPENDENT] | [DONE]
- [x] [ID-2.1.2] | Create `MemoryService` class structure | [INDEPENDENT] | [DONE]
- [x] [ID-2.1.3] | Implement `localStorage` adapter for `MemoryService` | [BLOCKS-ID-2.1.2] | [DONE]
- [x] [ID-2.2.1] | Research lightweight JS-based embedding library | [INDEPENDENT] | [DONE]
- [x] [ID-2.2.2] | Implement `calculateEmbedding(text)` helper function | [INDEPENDENT] | [DONE]
- [x] [ID-2.2.3] | Implement `cosineSimilarity(vecA, vecB)` helper | [INDEPENDENT] | [DONE]
- [x] [ID-2.2.4] | Implement `retrieveRelevantContext(query)` in `MemoryService` | [BLOCKS-ID-2.2.3] | [DONE]
- [x] [ID-2.2.5] | Integrate `MemoryService` into `AIModelService.prepareContext` | [BLOCKS-ID-2.2.4] | [DONE]
- [x] [ID-2.2.6] | Add unit tests for vector math helpers | [INDEPENDENT] | [DONE]
- [x] [ID-2.2.7] | Add unit tests for memory storage/retrieval | [INDEPENDENT] | [DONE]

### [EPIC-3.1] Accessibility Audit (10 WU)
- [x] [ID-3.1.1] | Install `axe-core` accessibility testing library | [INDEPENDENT] | [DONE]
- [x] [ID-3.1.2] | Create `verify_a11y.ts` script | [INDEPENDENT] | [DONE]
- [x] [ID-3.1.3] | Define "Critical Paths" for verification | [INDEPENDENT] | [DONE]
- [x] [ID-3.1.4] | Implement WCAG AA Color Contrast checker utility | [INDEPENDENT] | [DONE]
- [x] [ID-3.1.5] | Run contrast check on "Modern" theme | [BLOCKS-ID-3.1.4] | [DONE]
- [x] [ID-3.1.6] | Run contrast check on "Retro" theme | [BLOCKS-ID-3.1.4] | [DONE]
- [x] [ID-3.1.7] | Run contrast check on "Matrix" theme | [BLOCKS-ID-3.1.4] | [DONE]
- [x] [ID-3.1.8] | Run contrast check on "Cyberpunk" theme | [BLOCKS-ID-3.1.4] | [DONE]
- [x] [ID-3.1.9] | Run contrast check on "Ocean" theme | [BLOCKS-ID-3.1.4] | [DONE]
- [x] [ID-3.1.10] | Run contrast check on "Light" theme | [BLOCKS-ID-3.1.4] | [DONE]

## v1.7.1 (Archived Backlog Items)

### Current Tasks
- [x] Refactor `aiModel.ts` to separate configuration and data.
- [x] Add unit tests for `aiModel.ts` logic (`isSensitiveTopic`, `sanitizePromptContent`).
- [x] Fix potential bug in command processing overlap between `Terminal.tsx` and `commands.ts`.
- [x] Implement local storage for conversation history (optional persistence).
- [x] Create a "Panic" mode for immediate crisis resource display.
- [x] Optimize model loading time and feedback.
- [x] Expand resource database to be searchable (e.g., /resources anxiety).
- [x] Refactor AI Model to Service Pattern.
- [x] Improve Analysis Logic (Sentiment negation, Topic extraction).
- [x] Implement Robust Command Parser (handle quotes/args).
- [x] Expand Resource Database (add 50+ entries).
- [x] Strict Type Refactoring (enable `no-explicit-any` and fix violations).
- [x] Implement Dynamic Help Command (`/help`).
- [x] Implement Motivational Quotes (`/quote`).
- [x] Implement Breathing Exercise (`/breathe`).
- [x] Enhance Resource Search (Scoring/Ranking).
- [x] Implement User Profile System (`/profile` command).

### Unified Batch Improvements (Completed)
- [x] Enhance Sentiment Analysis (intensifiers, emojis, refined negation).
- [x] Expand Topic Detection (grief, self-esteem, social anxiety, loneliness, mindfulness).
- [x] Implement Privacy Mode (toggle local storage, clear history).
- [x] Implement Session Export (/export command).
- [x] Update Terminal UI with Privacy Indicator.
- [x] Implement Journaling System (/note, /notes, /delete-note).
- [x] Consolidate AI Logic (Service Pattern, remove redundant utils).
- [x] Enhance Analysis Engine (Improved Tokenizer, Mood Trend Visualization).
- [x] Implement Theme System (`/theme`, `/themes`) with persistent preferences.
- [x] Add ASCII Art visualization (`/art`, `/ascii`) for mood expression.
- [x] Fix FOUC (Flash of Unstyled Content) on initial load.
- [x] Refactor UI components to fix Fast Refresh warnings in CI.
- [x] Refactor command architecture for better maintainability (`src/commands/`).
- [x] Implement Session Statistics (`/stats`) to view message count, mood trends, and topics.

### Future Improvements
- [x] Add accessibility features (ARIA labels) to the terminal interface.
- [x] Implement adaptive responses based on user history (session-based).
- [x] Implement offline mode using WebAssembly (PWA support).

## v1.7.0 (Unified Batch - Wellness Tools & Hygiene)
- **Feature: Dynamic Help** - The `/help` command now dynamically generates categories and command lists, ensuring it's always up-to-date.
- **Feature: Motivational Quotes** - Added `/quote` command to deliver random inspirational quotes from a database of 50+ entries.
- **Feature: Breathing Exercise** - Added `/breathe` command to guide users through the 4-7-8 breathing technique for anxiety reduction.
- **Feature: User Profile** - Introduced `/profile` command to set user name, preferred tone (casual/formal/empathetic), and response length, enabling a more personalized AI experience.
- **Feature: Markdown Export** - `/export markdown` now allows exporting session history in a readable Markdown format.
- **Feature: Expanded Themes** - Added 4 new themes: Dracula, Nord, Monokai, and Solarized Dark.
- **Enhancement: Search Ranking** - Improved `/resources` search to prioritize exact name matches and category matches over general descriptions.
- **Refactor: Strict Typing** - Enabled `no-explicit-any` in ESLint and resolved all violations in core services (`AIModelService`, `Terminal`).
- **Maintenance:** Standardized command handling and response data structures.

## v1.6.0 (Unified Batch - Stats & Architecture)
- **Feature: Session Statistics** - Added `/stats` command to visualize session duration, message counts, mood trends, and top topics.
- **Refactor: Command Architecture** - Migrated command handling to a scalable `src/commands/` structure, separating logic for AI, resources, notes, and system commands.
- **Refactor: UI Components** - Resolved "Fast Refresh" CI warnings by extracting component variants to `src/components/ui/variants.ts`.
- **Maintenance:** Updated test configuration to support new directory structure.

## v1.5.0 (Unified Batch - Visuals & Theming)
- **Feature: Theming System** - Added `/theme <name>` command to switch between 6 built-in themes (Modern, Retro, Matrix, Cyberpunk, Ocean, Light). Preferences are saved locally.
- **Feature: ASCII Art** - Added `/art <mood>` command to display expressive ASCII art (happy, sad, zen, coffee, etc.) in the terminal.
- **Enhancement: UX Polish** - Eliminated "Flash of Unstyled Content" (FOUC) by optimizing CSS variable loading.
- **Refactor:** consolidated theme logic into `src/utils/themes.ts` and updated `Terminal.tsx` to handle state efficiently.

## v1.4.0 (Unified Batch - Journaling & Refactor)
- **Feature: Personal Journaling** - Added a private journaling system. Use `/note <text>` to save thoughts, `/notes` to view them, and `/delete-note <id>` to remove them. Journal entries are included in session exports but respect Privacy Mode.
- **Enhancement: AI Architecture Consolidation** - Unified AI logic into a robust `AIModelService` pattern, removing redundant utility wrappers and improving code organization.
- **Enhancement: Smarter Analysis** - Improved text tokenization to better handle punctuation and emojis in sentiment analysis. Added internal mood trend calculation.
- **Maintenance:** Updated dependency management and test coverage for core services.

## v1.3.0 (Unified Batch - Iteration 3)
- **Feature: Privacy Mode** - Added a toggleable Privacy Mode (`/privacy`) that disables local storage persistence for sensitive sessions. Visual indicator included in the terminal header.
- **Feature: Session Export** - Added `/export` command to allow users to download their session data (profile, history, analysis) as JSON.
- **Enhancement: Advanced Sentiment Analysis** - Upgraded analysis engine to support intensifiers (e.g., "very happy"), emojis (😊, 😢), and refined negation handling.
- **Enhancement: Expanded Topic Detection** - Added detection for 5+ new mental health topics including Grief, Self-Esteem, Social Anxiety, Loneliness, and Mindfulness.
- **Refactor:** Modularized analysis logic into `src/data/sentiment.ts` and `src/data/topics.ts` for better maintainability.

## v1.2.1 (Refactor & Cleanup)
- **Refactor: AI Service Types** - Introduced strict type definitions (`TextGenerator`, `GenerationOptions`) for `AIModelService` to improve code safety and maintainability.
- **Refactor: Configuration** - Centralized the AI System Prompt in `src/config/ai-constants.ts` for easier updates and management.
- **Maintenance:** Resolved `any` type usage in AI service logic.

## v1.2.0 (Unified Batch - Consolidation)
- **Feature: Expanded Resource Database** - Added 50+ new mental health resources covering diverse categories (LGBTQ+, BIPOC, Youth, Seniors, Legal, Housing, etc.).
- **Enhancement: Smarter Analysis** - Improved sentiment analysis with window-based negation handling and precise topic extraction.
- **Refactor: AI Service Architecture** - Migrated AI logic to a robust `AIModelService` class pattern for better maintainability and testing.
- **Refactor: Command Parsing** - Implemented a robust command parser supporting quoted arguments (e.g., `/search "mental health"`) and safer command execution.

## v1.1.0 (Iter-03 Unified Batch)
- **Feature: Panic Mode** - Added a `/panic` command that displays a high-contrast overlay with immediate crisis resources (988, 741741, 911).
- **Feature: Searchable Resources** - Expanded mental health resource database (15+ organizations) and added search functionality to the `/resources` command (e.g., `/resources veterans`, `/resources suicide`).
- **Enhancement: Model Loading Feedback** - Improved the terminal initialization process to show detailed progress messages (loading model, tokenizer, etc.) instead of a generic "Initializing..." state.
- **Enhancement: Accessibility** - Added ARIA labels and improved screen reader support for the terminal interface.
- **Refactor:** Standardized AI model initialization and error handling.
- **Infrastructure:** Fixed environment issues and test configuration.
- **Feature: Adaptive Responses** - AI now analyzes user sentiment and topics to provide personalized, context-aware responses (session-based).
- **Feature: Offline Support (PWA)** - Application is now a Progressive Web App (PWA) with offline capabilities and installability.
- **Refactor:** Modularized `aiModel.ts` into smaller, testable components (`ai-helpers.ts`, `sessionManager.ts`, `analysis.ts`).
- **Infrastructure:** Added PWA configuration and improved test coverage.

## v1.0.1
- Fixed command processing logic to correctly handle arguments for slash commands (e.g., `/model 1`).
- Prevented conversational phrases (e.g., `help me`) from triggering commands unexpectedly.
- Added local storage persistence for conversation history.
- Improved accessibility with ARIA labels, live regions, and screen reader optimizations.

## v1.0.0
- Initial release of Terminal Wellbeing AI.
- Features:
  - Terminal-style chat interface.
  - Multi-model AI support (DistilGPT-2, GPT-2, GPT-Neo).
  - Sensitive topic detection and crisis resource redirection.
  - Command system (`/help`, `/clear`, `/resources`).

## v1.9.0 (Unified Batch - Security & Personalization)

### [EPIC-2.3] Deep Personalization (Content Filtering & Profile)
- **Feature: Content Filtering** - Implemented robust keyword redaction for trigger warnings. User-defined warnings in `/profile` are now automatically redacted from AI responses.
- **Feature: Profile Management** - Enhanced `/profile` command with new subcommands:
    - `/profile reset`: Safely resets user profile to defaults.
    - `/profile export`: Exports profile data as JSON.
    - `/profile view`: Displays comprehensive profile details including privacy status.
    - `/profile name`: Added validation for name length and characters.
- **Refactor:** Integrated content filtering into the `AIModelService` post-processing pipeline.

### [EPIC-2.4] Memory Hardening (Local Encryption)
- **Feature: Local Data Encryption** - Implemented AES-GCM encryption for long-term memory storage using Web Crypto API.
- **Architecture:** Refactored `MemoryService` to support asynchronous initialization and encrypted storage/retrieval.
- **Security:** Generated encryption keys are stored locally (for now) to obfuscate sensitive data in `localStorage`.
- **Integration:** Updated `AIModelService` and `SessionManager` to handle asynchronous memory operations.

### [EPIC-3.2] Accessibility Improvements
- **Feature: Keyboard Shortcuts** - Added global shortcuts for power users:
    - `Ctrl+K`: Clear terminal.
    - `Ctrl+L`: Focus input.
    - `Ctrl+,`: View profile.
- **Feature: Skip Link** - Added a hidden "Skip to Content" link for keyboard navigation.
- **Enhancement:** Audit of ARIA labels and focus management in `Terminal.tsx` and `TerminalInput.tsx`.

### [EPIC-2.3] User Profile Expansion (Completed Tasks)
- [x] [ID-2.3.4] | Implement `filterContent(response, warnings)` helper | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.5] | Integrate content filtering into `postProcessResponse` | [BLOCKS-ID-2.3.4] | [DONE]
- [x] [ID-2.3.6] | Add unit tests for content filtering logic | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.7] | Create "Profile Reset" command/flow | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.8] | Implement Profile Export separately from Session | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.9] | Add validation for "Name" field (length, profanity) | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.12] | Create UI/Command for viewing all available Trigger Warnings | [INDEPENDENT] | [DONE]

### [EPIC-2.4] Memory Hardening & Security (Completed Tasks)
- [x] [ID-2.4.1] | Implement AES-GCM encryption helper for `localStorage` | [INDEPENDENT] | [DONE]
- [x] [ID-2.4.2] | Add unit tests for Encryption/Decryption logic | [INDEPENDENT] | [DONE]
- [x] [ID-2.4.3] | Integrate encryption into `MemoryService.saveMemories` | [BLOCKS-ID-2.4.1] | [DONE]
- [x] [ID-2.4.4] | Integrate decryption into `MemoryService.loadMemories` | [BLOCKS-ID-2.4.3] | [DONE]

### [EPIC-3.2] UI & Focus Management (Completed Tasks)
- [x] [ID-3.2.1] | Audit `TerminalInput` focus management | [INDEPENDENT] | [DONE]
- [x] [ID-3.2.2] | Audit `TerminalOutput` live region updates | [INDEPENDENT] | [DONE]
- [x] [ID-3.2.3] | Fix missing `aria-labels` on interactive elements | [INDEPENDENT] | [DONE]
- [x] [ID-3.2.4] | Implement "Skip to Content" link for keyboard users | [INDEPENDENT] | [DONE]
- [x] [ID-3.2.5] | Add keyboard shortcuts for common commands (Ctrl+K, etc.) | [INDEPENDENT] | [DONE]

### [EPIC-2.3] User Profile Expansion (Completed Tasks - Sprint 1.8.1)
- [x] [ID-2.3.11] | Add "Response Speed" preference (simulated delay) | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.10] | Persist profile changes immediately (debounce check) | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.13] | Test Profile persistence across sessions | [INDEPENDENT] | [DONE]

### [EPIC-2.4] Memory Hardening & Security (Worker Implementation)
- [x] [ID-2.4.5] | Create `EmbeddingWorker` class for off-main-thread processing | [INDEPENDENT] | [DONE]
- [x] [ID-2.4.6] | Refactor `embeddings.ts` to communicate with Worker | [BLOCKS-ID-2.4.5] | [DONE]
- [x] [ID-2.4.7] | Add integration test for Worker communication | [INDEPENDENT] | [DONE]
- [x] [ID-2.4.8] | Strict Type Audit for `@huggingface/transformers` (remove `any`) | [INDEPENDENT] | [DONE]
