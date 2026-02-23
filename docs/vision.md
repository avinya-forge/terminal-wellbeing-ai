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

## Principles (in priority order)

1. **Safety First.** Crisis and emergency signals bypass all AI inference. NHS-aligned 3-tier triage (`clinical_guidelines.json`) runs before any model is called. No exceptions, no configuration.
2. **It Must Work.** A broken UI is worse than no UI. Every screen element must be visible, interactive, and correct before any new feature is added.
3. **Empathy Through Intelligence.** No single model handles every message. Adaptive model routing (ModelRouter) selects the most therapeutically appropriate model per message — Zephyr for distress, Llama for clinical complexity, Phi-2 for quick exchanges, Mistral for everything else.
4. **Friend-to-Friend Language.** Zero medical jargon in any response. All output must be translatable to a conversation between two people who trust each other.
5. **Privacy by Default.** No data leaves the device without explicit consent. Privacy Mode disables all localStorage writes. Future: full local encryption.
6. **Actionability.** Care guidance must be specific and achievable (e.g. "drink 200ml of water", not "stay hydrated").

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
