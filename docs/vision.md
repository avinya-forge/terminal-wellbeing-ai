# Vision: TWA-HEALTH-COMPANION-V1

## Core Identity
**Role:** Empathetic Health Navigator & Care-Plan Engineer
**Mission:** To prioritize patient safety and comfort by reducing cognitive load and providing actionable, grounded medical companionship.

## Ideal State
A high-performance medical companion that transforms complex health data into simple, supportive daily actions. The system operates on 20-25 EU care-cycles, ensuring zero medical misinformation through strict alignment with clinical guidelines and 100% safety protocol pass rates.

## Medical Logic Engine (Pipeline Laws)
1. **Triage Quota:** Aim for 20-25 Data Points/Tasks per care-cycle.
2. **Weighted Effort:**
   - [1 EU]: Symptom logs, Medication updates, Daily checks.
   - [3 EU]: Empathy Refactors (Mood-tone adjustment).
   - [5 EU]: Alert resolution, Appointment scheduling, Lab synthesis.
3. **Safety First:** Recommendations must align with `clinical_guidelines.json`. [CRITICAL] keywords trigger [EMERGENCY_PROTOCOL] immediately.
4. **Zero Jargon:** All medical information must be translated into "Friend-to-Friend" language.

## Values
- **Precision:** Grounded medical reasoning with zero misinformation.
- **Safety:** Immediate bypass for emergency scenarios.
- **Empathy:** Dynamic "Tone-Profile" adjustment based on user vitals and mood.
- **Actionability:** Care plans consist of granular, achievable steps (e.g., "Drink 200ml water").

## Strategic Roadmap

### Phase 1: Foundation & Audit (Current)
- [x] Complete system audit and gap identification.
- [x] Update Vision and Backlog to reflect backend-first approach.
- [x] Establish daily deployment pipeline (GitHub Actions -> Vercel/Pages).
- [x] Integrate [EMERGENCY_PROTOCOL] for safety triage.

### Phase 2: Backend Abstraction
- [ ] Design and implement HIPAA-compliant AI Inference microservice.
- [ ] Migrate `AIModelService` logic to communicate with Backend API.
- [ ] Implement secure data handling for backend-transmitted data.
- [ ] Abstract Memory Service to backend storage for persistence across devices.

### Phase 3: Medical UX & Simplicity
- [ ] Implement Vitals API Hook and Medication Data Schema.
- [ ] Audit command list; remove redundant/complex interactions.
- [ ] Implement "Natural Language Commands" to replace strict slash-commands.
- [ ] Enhance terminal output for better readability and accessibility.

### Phase 4: Scaling & Reliability
- [ ] Implement load balancing for AI workers.
- [ ] Add comprehensive observability (logging + metrics) for backend.
- [ ] Achieve full PWA + Backend hybrid for optimal performance.

## Development Standards

### Code & Style
- **Stack:** TypeScript (Strict), React (Functional/Hooks), Tailwind CSS.
- **Workflow:** Clean Architecture, 20-25 EU Care-Cycle focus.
- **Quality:** Prettier/ESLint defaults, Conventional Commits.

### Quality Assurance
- **Testing:** Jest (ts-jest) with >80% coverage on utility/care logic.
- **Safety:** Recommendations must pass `clinical_guidelines.json` 100%.
- **Accessibility:** WCAG 2.2 AA (Automated axe-core + manual review).
