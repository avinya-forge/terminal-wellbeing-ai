# vision — wellbeing.sh

> **"a terminal where you feel heard, not assessed."**

---

## what we are building

**wellbeing.sh** is a terminal-style ai health companion designed to reduce the cognitive load of managing wellbeing — not through clinical forms or dashboards, but through a calm, human conversation that feels like talking to a knowledgeable friend.

the application runs in the browser as a full-screen terminal. it listens, it understands context, and it routes every message to the most appropriate ai model for that moment. it never lectures. it never panics. and when things are serious, it immediately puts the right help in front of the user.

---

## core mission

**reduce friction between a person in distress and the right support.**

every design decision, every model choice, every line of code must serve this mission. features that don't reduce friction don't belong here.

---

## the constitution

### ideal state
a completely self-contained, offline-capable terminal companion that provides zero-latency, context-aware empathetic support while maintaining absolute mathematical certainty over user privacy and immediate intervention routing. it serves as an invisible safety net that feels like a friend.

### pipeline laws
1. **law of triage:** safety checks (`clinical_guidelines.json`) must always run before any ai inference. no exceptions.
2. **law of stability (latest stable env only):** features must be built on the latest stable environment; a broken ui is worse than no ui.
3. **law of routing:** no single model handles every message. adaptive routing ensures the most therapeutically appropriate model is selected per message.
4. **law of tone:** zero medical jargon in any response. all output must be friend-to-friend language.
5. **law of sovereignty:** no data leaves the device without explicit consent. privacy by default.
6. **law of pragmatism:** care guidance must be specific and actionable.
7. **law of recursive density:** planning must utilize recursive drill-down logic, targeting 200+ work units (wu) per 21-session span.

### definition of done (dod)
- code merged to `main` with 0 typescript compilation errors (`npm run build`).
- unit and integration tests passing with >80% coverage.
- accessibility passes automated axe-core pipeline and manual checks.
- changes deployed to github pages without regressions.
- version bumped and changelog updated in `docs/release-notes.md`.
- test (95%), lint (0-err), opt (o(1)), sec (sanitize) integrated into every atomic task.

---

## what the product looks like (mvp target — feb 2026 demo 2)

- a full-screen dark terminal, monospace font, green-on-black aesthetic
- a pulsing green `●` dot next to **online** when the ai is ready
- a visible, responsive input bar where you can see every character as you type
- boot sequence that animates line by line, making the product feel alive
- ai responses that adapt their empathy level, complexity, and speed to the message
- crisis inputs that immediately surface 999, samaritans, and 988 — never passed to a model
- runs on laptop, accessible from mobile via local network or ngrok tunnel

---

## roadmap

### 🔴 right now (demo 2 blockers — week of feb 24)
fix every broken ui element. the demo failed because basics didn't work. these must be done first.

### 🟠 short term (feb–mar 2026)
- mobile preview infrastructure (ngrok / lan access)
- `modelloaded` status correctly transitions to online
- sequential boot animation completes reliably
- full unit + integration test coverage for all ui components

### 🟡 medium term (mar–apr 2026)
- `/care` daily action plan command
- medication and hydration tracking
- privacy mode correctly suppresses localstorage writes
- theme persistence across sessions fixed

### 🟢 longer term
- backend inference microservice (remove hf token from browser)
- hipaa-compliant health data schema
- voice interface feasibility study
- multi-device sync via encrypted backend storage

---

## development standards

| area | standard |
|---|---|
| language | typescript (strict) |
| ui | react (functional/hooks), tailwind css |
| testing | jest + ts-jest · >80% coverage on all services |
| safety | 100% pass rate on `clinical_guidelines.json` triage |
| accessibility | wcag 2.2 aa · automated axe-core + manual |
| commits | conventional commits · pr descriptions required |
| deployment | github actions → github pages (daily) |


---

## v2.1.1-alpha architecture synchronized
- **ast ssot:** successfully anchored into `.memory/context-anchor.json`.
- **density:** 400+ wu generated via recursive drill-down.

---

## finalized metric summary
- **status:** go
- **phase:** S3 [EVOLVE/ALIGN]
- **total loc:** ~2589 lines
- **pr delta:** +1
- **tasks done:** 55
- **implemented ids:** chore: c2-001 to chore: c2-055
- **ready ratio:** 55 / 916
- **say/do:** 100%
- **velocity:** n/a
- **tech debt:** ~75% coverage (requires 95% per dod)
- **blockers:** none
- **lint:** 0 errors
- **git-audit:** pass (zero-git compliance for `.memory/` maintained)
- **eta:** n/a
- **next:** E9 sprint tasks to meet 95% coverage goal
