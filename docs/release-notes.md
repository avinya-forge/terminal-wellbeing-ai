# Release Notes

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
