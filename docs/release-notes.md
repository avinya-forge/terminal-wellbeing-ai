# Release Notes

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
