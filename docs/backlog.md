# Backlog

## Phase 2: Deep Personalization (Refinement)

### [EPIC-2.3] User Profile Expansion (10 WU)
- [x] [ID-2.3.10] | Persist profile changes immediately (debounce check) | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.11] | Add "Response Speed" preference (simulated delay) | [INDEPENDENT] | [DONE]
- [x] [ID-2.3.13] | Test Profile persistence across sessions | [INDEPENDENT] | [DONE]

### [EPIC-2.4] Memory Hardening & Security (10 WU)
- [ ] [ID-2.4.9] | Create "Memory Migration" tool for version upgrades | [INDEPENDENT] | [TODO]
- [ ] [ID-2.4.10] | Profile Memory usage with large vector sets | [INDEPENDENT] | [TODO]

## Phase 3: Accessibility & UX

### [EPIC-3.2] UI & Focus Management (10 WU)
- [ ] [ID-3.2.6] | Test focus trap implementation in modal dialogs (if any) | [INDEPENDENT] | [TODO]
- [ ] [ID-3.2.7] | Verify high contrast mode support in Windows/macOS | [INDEPENDENT] | [TODO]
- [ ] [ID-3.2.9] | Test with NVDA screen reader (manual) | [INDEPENDENT] | [TODO]
- [ ] [ID-3.2.10] | Test with VoiceOver screen reader (manual) | [INDEPENDENT] | [TODO]

### [EPIC-3.3] Visual Polish (10 WU)
- [x] [ID-3.3.1] | Profile `TypingIndicator` performance | [INDEPENDENT] | [DONE]
- [x] [ID-3.3.2] | Refactor `TypingIndicator` to use CSS animations | [INDEPENDENT] | [DONE]
- [ ] [ID-3.3.4] | Verify "smooth scrolling" behavior | [INDEPENDENT] | [TODO]
- [x] [ID-3.3.6] | Standardize spacing using Tailwind utility classes | [INDEPENDENT] | [DONE]
- [ ] [ID-3.3.7] | Add loading skeletons for initial load | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.8] | Polish scrollbar styling for cross-browser consistency | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.9] | Fix any z-index layering issues | [INDEPENDENT] | [TODO]
- [ ] [ID-3.3.10] | Create "Visual Regression" baseline screenshots | [INDEPENDENT] | [TODO]

### [EPIC-3.4] Automated Accessibility Pipeline (10 WU)
- [x] [ID-3.4.1] | Install `playwright` and `@axe-core/playwright` | [INDEPENDENT] | [DONE]
- [x] [ID-3.4.2] | Create `a11y.spec.ts` for automated audit | [BLOCKS-ID-3.4.1] | [DONE]
- [x] [ID-3.4.3] | Implement "Critical Path" accessibility tests | [BLOCKS-ID-3.4.2] | [DONE]
- [x] [ID-3.4.4] | Configure CI to fail on accessibility violations | [INDEPENDENT] | [DONE]
- [ ] [ID-3.4.5] | Create `A11yReport` generator for CI artifacts | [INDEPENDENT] | [TODO]
- [ ] [ID-3.4.6] | Add `pa11y-ci` for static analysis | [INDEPENDENT] | [TODO]
- [ ] [ID-3.4.7] | Integrate Lighthouse CI check | [INDEPENDENT] | [TODO]
- [ ] [ID-3.4.8] | Document A11y standards for contributors | [INDEPENDENT] | [TODO]
- [ ] [ID-3.4.9] | Create custom A11y matchers for Jest | [INDEPENDENT] | [TODO]
- [ ] [ID-3.4.10] | Automate "Keyboard Navigation" test flows | [INDEPENDENT] | [TODO]

## Phase 4: Performance & Optimization (Sprint 2.0.0)

### [EPIC-4.1] Web Worker AI Offloading (10 WU)
- [ ] [ID-4.1.1] | Design `AIWorker` interface and message protocol | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.2] | Create `src/workers/ai.worker.ts` entry point | [BLOCKS-ID-4.1.1] | [TODO]
- [ ] [ID-4.1.3] | Move `AIModelService` inference logic to Worker | [BLOCKS-ID-4.1.2] | [TODO]
- [ ] [ID-4.1.4] | Implement `WorkerBridge` in main thread | [BLOCKS-ID-4.1.3] | [TODO]
- [ ] [ID-4.1.5] | Handle Worker errors and termination | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.6] | Add loading state management for Worker initialization | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.7] | Test Worker fallback (if Worker fails, run on main?) | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.8] | Profile memory usage of Worker vs Main thread | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.9] | Optimize message passing (Transferable Objects) | [INDEPENDENT] | [TODO]
- [ ] [ID-4.1.10] | Update documentation for Worker architecture | [INDEPENDENT] | [TODO]

### [EPIC-4.2] Advanced Caching & PWA (10 WU)
- [ ] [ID-4.2.1] | Audit current Service Worker configuration | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.2] | Implement `StaleWhileRevalidate` for API responses | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.3] | Implement `CacheFirst` for static assets (fonts, images) | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.4] | Add "Update Available" toast notification | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.5] | Optimize font loading (swap, preload) | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.6] | Compress static assets (Brotli/Gzip) configuration | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.7] | Implement `virtual:pwa-register/react` properly | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.8] | Create PWA install prompt UI | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.9] | Test offline capability manually | [INDEPENDENT] | [TODO]
- [ ] [ID-4.2.10] | Verify manifest.json correctness | [INDEPENDENT] | [TODO]

## Phase 5: Security & Privacy (Sprint 2.1.0)

### [EPIC-5.1] Local Data Encryption (10 WU)
- [ ] [ID-5.1.1] | Research Web Crypto API (SubtleCrypto) | [INDEPENDENT] | [TODO]
- [ ] [ID-5.1.2] | Implement `KeyManager` for deriving keys from user salt | [BLOCKS-ID-5.1.1] | [TODO]
- [ ] [ID-5.1.3] | Implement `encryptData(data, key)` utility | [BLOCKS-ID-5.1.2] | [TODO]
- [ ] [ID-5.1.4] | Implement `decryptData(data, key)` utility | [BLOCKS-ID-5.1.2] | [TODO]
- [ ] [ID-5.1.5] | Migrate `localStorage` (Journal) to encrypted format | [BLOCKS-ID-5.1.3] | [TODO]
- [ ] [ID-5.1.6] | Migrate `localStorage` (Profile) to encrypted format | [BLOCKS-ID-5.1.3] | [TODO]
- [ ] [ID-5.1.7] | Handle key rotation/regeneration scenarios | [INDEPENDENT] | [TODO]
- [ ] [ID-5.1.8] | Add "Forgot Key" (Data Wipe) flow | [INDEPENDENT] | [TODO]
- [ ] [ID-5.1.9] | Verify performance impact of encryption | [INDEPENDENT] | [TODO]
- [ ] [ID-5.1.10] | Audit for potential side-channel leaks | [INDEPENDENT] | [TODO]

### [EPIC-5.2] Secure Data Export/Import (10 WU)
- [ ] [ID-5.2.1] | Define JSON Schema for Export Format v1 | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.2] | Implement `validateExport(json)` using schema | [BLOCKS-ID-5.2.1] | [TODO]
- [ ] [ID-5.2.3] | Implement `exportData(password?)` with optional encryption | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.4] | Implement `importData(json)` with validation | [BLOCKS-ID-5.2.2] | [TODO]
- [ ] [ID-5.2.5] | Add checksum verification for integrity | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.6] | Create UI for Import/Export management | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.7] | Test importing corrupted data | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.8] | Test importing large datasets | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.9] | Ensure PII is handled correctly during export | [INDEPENDENT] | [TODO]
- [ ] [ID-5.2.10] | Document Export Format for external tools | [INDEPENDENT] | [TODO]

## Phase 6: Future Horizons (Research)

### [EPIC-6.1] Voice Interface (10 WU)
- [ ] [ID-6.1.1] | Research Web Speech API browser compatibility | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.2] | Create `VoiceService` interface | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.3] | Implement `SpeechToText` listener | [BLOCKS-ID-6.1.2] | [TODO]
- [ ] [ID-6.1.4] | Implement `TextToSpeech` synthesizer | [BLOCKS-ID-6.1.2] | [TODO]
- [ ] [ID-6.1.5] | Create "Microphone" UI toggle | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.6] | Handle permission denial gracefully | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.7] | Test voice input with different accents (manual) | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.8] | Optimize for low-latency feedback | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.9] | Add privacy indicator for active microphone | [INDEPENDENT] | [TODO]
- [ ] [ID-6.1.10] | Implement "Wake Word" feasibility study | [INDEPENDENT] | [TODO]

### [EPIC-6.2] Multi-modal Input (10 WU)
- [ ] [ID-6.2.1] | Research image analysis models (client-side) | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.2] | Implement drag-and-drop file upload zone | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.3] | Create `ImageService` for processing uploads | [BLOCKS-ID-6.2.2] | [TODO]
- [ ] [ID-6.2.4] | Integrate "Mood from Image" analysis | [BLOCKS-ID-6.2.3] | [TODO]
- [ ] [ID-6.2.5] | Ensure strict privacy (image never leaves device) | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.6] | Create UI for displaying uploaded images | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.7] | Add accessibility (alt text generation) | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.8] | Test with various image formats (JPG, PNG, WebP) | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.9] | Profile memory usage of image processing | [INDEPENDENT] | [TODO]
- [ ] [ID-6.2.10] | Document multi-modal privacy guarantees | [INDEPENDENT] | [TODO]
