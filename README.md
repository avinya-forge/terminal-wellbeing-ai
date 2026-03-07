# terminal wellbeing ai
**North Star:** "a terminal where you feel heard, not assessed."

![version](https://img.shields.io/badge/version-v2.1.0--alpha-green)

## the pulse
| milestone | version | phase | status | tech debt | backlog density |
|---|---|---|---|---|---|
| demo 2 | v2.1.0-alpha | audit & release preparation | no-go | 52% coverage (req >95%) | 55/60 |

## documentation map
- [vision.md](./docs/vision.md)
- [backlog.md](./docs/backlog.md)
- [release-notes.md](./docs/release-notes.md)
- [rules/habits.md](./docs/rules/habits.md)
- [rules/hygiene.md](./docs/rules/hygiene.md)
- [standards/ultra-lean.md](./docs/standards/ultra-lean.md)

## quick start
**active milestone: demo 2 blockers & ui re-engineering**
we are actively fixing visual bugs and test coverage to unblock demo 2. key priorities include fixing text visibility, proper terminal layout, and reaching 95% test coverage.

**to run locally:**
```bash
npm install
npm run dev
```

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
