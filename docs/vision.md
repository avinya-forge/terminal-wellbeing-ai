# Vision — WellBeing.sh

> **"A terminal where you feel heard, not assessed."**

---

## What We Are Building

**WellBeing.sh** is a terminal-style AI health companion designed to reduce the cognitive load of managing wellbeing — not through clinical forms or dashboards, but through a calm, human conversation that feels like talking to a knowledgeable friend.

The application runs in the browser as a full-screen terminal. It listens, it understands context, and it routes every message to the most appropriate AI model for that moment. It never lectures. It never panics. And when things are serious, it immediately puts the right help in front of the user.

---

## Core Mission

**Reduce friction between a person in distress and the right support.**

Every design decision, every model choice, every line of code must serve this mission. Features that don't reduce friction don't belong here.

---

## The Constitution

### Ideal State
A completely self-contained, offline-capable terminal companion that provides zero-latency, context-aware empathetic support while maintaining absolute mathematical certainty over user privacy and immediate intervention routing. It serves as an invisible safety net that feels like a friend.

### Pipeline Laws
1. **Law of Triage:** Safety checks (`clinical_guidelines.json`) must ALWAYS run before any AI inference. No exceptions.
2. **Law of Stability (Latest Stable Env Only):** Features must be built on the latest stable environment; a broken UI is worse than no UI.
3. **Law of Routing:** No single model handles every message. Adaptive routing ensures the most therapeutically appropriate model is selected per message.
4. **Law of Tone:** Zero medical jargon in any response. All output must be friend-to-friend language.
5. **Law of Sovereignty:** No data leaves the device without explicit consent. Privacy by Default.
6. **Law of Pragmatism:** Care guidance must be specific and actionable.
7. **Law of Recursive Density:** Planning must utilize Recursive Drill-Down logic, targeting 200+ Work Units (WU) per 21-session span.

### Definition of Done (DoD)
- Code merged to `main` with 0 TypeScript compilation errors (`npm run build`).
- Unit and Integration tests passing with >80% coverage.
- Accessibility passes automated axe-core pipeline and manual checks.
- Changes deployed to GitHub Pages without regressions.
- Version bumped and changelog updated in `docs/release-notes.md`.
- Test (95%), Lint (0-err), Opt (O(1)), Sec (Sanitize) integrated into every Atomic Task.

---

## What the Product Looks Like (MVP Target — Feb 2026 Demo 2)

- A full-screen dark terminal, monospace font, green-on-black aesthetic
- A pulsing green `●` dot next to **Online** when the AI is ready
- A visible, responsive input bar where you can see every character as you type
- Boot sequence that animates line by line, making the product feel alive
- AI responses that adapt their empathy level, complexity, and speed to the message
- Crisis inputs that immediately surface 999, Samaritans, and 988 — never passed to a model
- Runs on laptop, accessible from mobile via local network or ngrok tunnel

---

## Roadmap

### 🔴 Right Now (Demo 2 Blockers — Week of Feb 24)
Fix every broken UI element. The demo failed because basics didn't work. These must be done first.

### 🟠 Short Term (Feb–Mar 2026)
- Mobile preview infrastructure (ngrok / LAN access)
- `modelLoaded` status correctly transitions to Online
- Sequential boot animation completes reliably
- Full unit + integration test coverage for all UI components

### 🟡 Medium Term (Mar–Apr 2026)
- `/care` daily action plan command
- Medication and hydration tracking
- Privacy Mode correctly suppresses localStorage writes
- Theme persistence across sessions fixed

### 🟢 Longer Term
- Backend inference microservice (remove HF token from browser)
- HIPAA-compliant health data schema
- Voice interface feasibility study
- Multi-device sync via encrypted backend storage

---

## Development Standards

| Area | Standard |
|---|---|
| Language | TypeScript (strict) |
| UI | React (functional/hooks), Tailwind CSS |
| Testing | Jest + ts-jest · >80% coverage on all services |
| Safety | 100% pass rate on `clinical_guidelines.json` triage |
| Accessibility | WCAG 2.2 AA · automated axe-core + manual |
| Commits | Conventional Commits · PR descriptions required |
| Deployment | GitHub Actions → GitHub Pages (daily) |


---

## v2.1.0-alpha Architecture Synchronized
- **AST SSoT:** Successfully anchored into `.memory/context_anchor.json`.
- **Density:** 400+ WU generated via recursive drill-down.