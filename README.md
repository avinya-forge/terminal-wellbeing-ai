# Terminal Wellbeing AI
> **"A terminal where you feel heard, not assessed."**

![version](https://img.shields.io/badge/version-v2.1.12-green)

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
- [vision](./docs/vision.md)
- [arch](./docs/arch.md)
- [decisions](./docs/decisions.md)
- [system-design](./docs/system-design.md)
- [backlog](./docs/backlog.md)
- [map](./docs/map.md)
- [roadmap](./docs/roadmap.md)
- [doubts](./docs/doubts.md)
- [test-cases](./docs/test-cases.md)
- [coverage](./docs/coverage.md)
- [conventions](./docs/conventions.md)
- [overview](./docs/overview.md)
- [release-notes](./docs/release-notes.md)
- [metrics](./docs/metrics.md)
- [habits](./docs/habits.md)
- [hygiene](./docs/hygiene.md)
- [standards](./docs/standards.md)
- [agent-standards](./docs/agent-standards.md)

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
