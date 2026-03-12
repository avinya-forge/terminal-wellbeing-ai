# terminal wellbeing ai
> **"a terminal where you feel heard, not assessed."**

![version](https://img.shields.io/badge/version-v2.1.0--alpha-green)

A mental health chatbot with a terminal-like interface, built using React and TypeScript. This application provides a supportive conversation experience for users seeking mental health support.

## quick start
**active milestone: demo 2 blockers & ui re-engineering**
we are actively fixing visual bugs and test coverage to unblock demo 2. key priorities include fixing text visibility, proper terminal layout, and reaching 95% test coverage.

**to run locally:**
```bash
npm install
npm run build
```

## the pulse
| Milestone | Version | Phase | Status | Debt% | Density |
|---|---|---|---|---|---|
| demo 2 | v2.1.1 | S3 [EVOLVE/ALIGN] | go | ~75% coverage (req >95%) | 22/60 |

## documentation map
- [vision](./docs/architecture/vision.md)
- [arch](./docs/architecture/arch.md)
- [decisions](./docs/architecture/decisions.md)
- [backlog](./docs/planning/backlog.md)
- [map](./docs/planning/map.md)
- [doubts](./docs/planning/doubts.md)
- [test-cases](./docs/testing/test-cases.md)
- [coverage](./docs/testing/coverage.md)
- [release-notes](./docs/release/release-notes.md)
- [metrics](./docs/release/metrics.md)
- [habits](./docs/rules/habits.md)
- [hygiene](./docs/rules/hygiene.md)
- [standards](./docs/rules/standards.md)

## tech stack
- **React** (v18.3.1): Modern UI library
- **TypeScript** (v5.0.2): Type-safe JavaScript
- **Tailwind CSS** (v3.4.11): Utility-first CSS framework
- **Vite** (v4.4.5): Fast build tool
- **Hugging Face Transformers** (v3.5.1): AI model inference

### ai models
The application intelligently routes requests via a 3-tier safety engine. Neutral, complex, and brief queries are handled by specialized local/remote models, while sensitive or critical distress input halts AI inference and presents NHS/emergency signposting immediately.

### tests
Run unit and integration tests:
```bash
npm test
npm run test:coverage
```

## license
This project is open source and available under the MIT License.
