# Terminal Wellbeing AI
> **"A terminal where you feel heard, not assessed."**

![version](https://img.shields.io/badge/version-v2.1.6-green)

A mental health chatbot with a terminal-like interface, built using React and TypeScript. This application provides a supportive conversation experience for users seeking mental health support.

## Quick Start
**Active Milestone: Demo 2 Blockers & UI Re-engineering**
We are actively fixing visual bugs and test coverage to unblock Demo 2. Key priorities include fixing text visibility, establishing a proper terminal layout, and reaching 95% test coverage.

**To run locally:**
```bash
npm install
npm run build
```

## Pulse-Table
| Milestone | Version | Phase | Status | Debt% |
|---|---|---|---|---|
| demo 2 | v2.1.6 | S3 [EVOLVE/ALIGN] | go | >95% coverage |

## Visual-Index
- [vision](./docs/architecture/vision.md)
- [arch](./docs/architecture/arch.md)
- [decisions](./docs/architecture/decisions.md)
- [system-design](./docs/architecture/system-design.md)
- [backlog](./docs/planning/backlog.md)
- [map](./docs/planning/map.md)
- [roadmap](./docs/planning/roadmap.md)
- [doubts](./docs/planning/doubts.md)
- [test-cases](./docs/testing/test-cases.md)
- [coverage](./docs/testing/coverage.md)
- [conventions](./docs/engineering/conventions.md)
- [overview](./docs/engineering/overview.md)
- [release-notes](./docs/release/release-notes.md)
- [metrics](./docs/release/metrics.md)
- [habits](./docs/rules/habits.md)
- [hygiene](./docs/rules/hygiene.md)
- [standards](./docs/rules/standards.md)

## Tech Stack
- **React** (v18.3.1): Modern UI library
- **TypeScript** (v5.0.2): Type-safe JavaScript
- **Tailwind CSS** (v3.4.11): Utility-first CSS framework
- **Vite** (v4.4.5): Fast build tool
- **Hugging Face Transformers** (v3.5.1): AI model inference

### AI Models
The application intelligently routes requests via a 3-tier safety engine. Neutral, complex, and brief queries are handled by specialized local/remote models, while sensitive or critical distress input halts AI inference and presents NHS/emergency signposting immediately.

### Tests
Run unit and integration tests:
```bash
npm test
npm run test:coverage
```

## License
This project is open source and available under the MIT License.
