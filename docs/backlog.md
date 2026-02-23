# Backlog

## Phase 0: Safety & Care-Cycle Initialization (High Priority)

### [EPIC-0.1] [CRITICAL] Emergency Protocols (Care-Cycle 1)
- [x] [ID-0.1.1] | Implement `EmergencyService` for symptom bypass | [INDEPENDENT] | [DONE]
- [x] [ID-0.1.2] | Integrate Emergency bypass into `AIModelService` | [BLOCKS-ID-0.1.1] | [DONE]
- [x] [ID-0.1.3] | Create unit tests for safety triggers | [INDEPENDENT] | [DONE]
- [ ] [ID-0.1.4] | Audit `clinical_guidelines.json` with external medical review | [INDEPENDENT] | [TODO]

### [EPIC-0.2] Health Data Discovery
- [x] [ID-0.2.1] | Complete initial symptom scan (DISCOVERY) | [INDEPENDENT] | [DONE]
- [ ] [ID-0.2.2] | Design HIPAA-compliant medical data schema | [INDEPENDENT] | [TODO]
- [ ] [ID-0.2.3] | Implement Vitals API integration service | [INDEPENDENT] | [TODO]
- [ ] [ID-0.2.4] | Create Medication History persistence layer | [INDEPENDENT] | [TODO]

## Phase 1: Foundation & Backend Abstraction

### [EPIC-1.1] CI/CD & Deployment
- [x] [ID-1.1.1] | Establish daily deployment pipeline (GitHub Actions) | [INDEPENDENT] | [DONE]
- [x] [ID-1.1.2] | Configure Vite base path for repository hosting | [INDEPENDENT] | [DONE]

### [EPIC-1.2] Backend Inference Shift
- [x] [ID-1.2.1] | Create `BackendClient` for HF Inference API | [INDEPENDENT] | [DONE]
- [x] [ID-1.2.2] | Refactor `AIModelService` for Backend-First inference | [BLOCKS-ID-1.2.1] | [DONE]
- [ ] [ID-1.2.3] | Research long-term memory offloading to backend | [INDEPENDENT] | [TODO]

## Phase 2: UX Simplicity & Medical Companion UI

### [EPIC-2.1] Command & Interaction Simplification
- [x] [ID-2.1.1] | Hide technical AI commands (/model, /models) from help | [INDEPENDENT] | [DONE]
- [x] [ID-2.1.2] | Implement Natural Language heuristics for common tasks | [INDEPENDENT] | [DONE]
- [ ] [ID-2.1.3] | Replace all "Model Loading" UI with "Service Status" | [INDEPENDENT] | [TODO]

### [EPIC-2.2] Care Plan Visualization
- [ ] [ID-2.2.1] | Implement `/care` command to view daily actions | [INDEPENDENT] | [TODO]
- [ ] [ID-2.2.2] | Create granular hydration and medication tracker UI | [INDEPENDENT] | [TODO]

## Phase 3: Security, Accessibility & Polish

### [EPIC-3.1] Security & Privacy
- [x] [ID-3.1.1] | Research & Implement Web Crypto for local encryption | [INDEPENDENT] | [DONE]
- [ ] [ID-3.1.2] | Migrate all local health data to encrypted storage | [BLOCKS-ID-3.1.1] | [TODO]

### [EPIC-3.2] Accessibility (WCAG 2.2 AA)
- [x] [ID-3.2.1] | Setup automated a11y audit pipeline (axe-core) | [INDEPENDENT] | [DONE]
- [ ] [ID-3.2.2] | Manual screen reader audit (NVDA/VoiceOver) | [INDEPENDENT] | [TODO]

## Research & Future Horizons
- [ ] [EPIC-6.1] | Voice Interface feasibility study | [TODO]
- [ ] [EPIC-6.2] | Multi-modal image analysis (Mood from vitals) | [TODO]
