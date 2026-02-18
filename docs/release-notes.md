# Release Notes

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
