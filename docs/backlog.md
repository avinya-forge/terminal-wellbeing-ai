# Backlog

## Current Tasks
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

## Unified Batch Improvements (Completed)
- [x] Enhance Sentiment Analysis (intensifiers, emojis, refined negation).
- [x] Expand Topic Detection (grief, self-esteem, social anxiety, loneliness, mindfulness).
- [x] Implement Privacy Mode (toggle local storage, clear history).
- [x] Implement Session Export (/export command).
- [x] Update Terminal UI with Privacy Indicator.
- [x] Implement Journaling System (/note, /notes, /delete-note).
- [x] Consolidate AI Logic (Service Pattern, remove redundant utils).
- [x] Enhance Analysis Engine (Improved Tokenizer, Mood Trend Visualization).

## Future Improvements
- [x] Add accessibility features (ARIA labels) to the terminal interface.
- [x] Implement adaptive responses based on user history (session-based).
- [x] Implement offline mode using WebAssembly (PWA support).
