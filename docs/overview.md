# overview

Engineering quick-start for new contributors.

## one-line summary
React 18 + TypeScript + Vite app. Tailwind for styling. Hugging Face Inference
API (with local `transformers.js` fallback) gated by an NHS-aligned safety
triage layer.

## minimum environment
- Node 20+ (CI uses node:20).
- npm 10+.
- A modern Chromium / Firefox / Safari for Web Crypto, Web Workers, and
  `localStorage`.

## install + run
```
npm install
npm run dev          # vite dev server
npm run dev:mobile   # expose on 0.0.0.0 for LAN testing
```

## scripts
| Script | Purpose |
|---|---|
| `npm run build` | `tsc && vite build` — must pass before merge |
| `npm test` | Jest unit + component tests |
| `npm run test:coverage` | Jest with coverage gate |
| `npm run lint` | ESLint, 10-warning ceiling |
| `npm run ci` | lint + test + build (mirrors CI) |
| `npm run preview` | preview production bundle |
| `npm run generate:icons` | regenerate PWA icons |
| `npm run manage` | wrapper around `scripts/manage.js` |

## env
Copy `.env.example` → `.env`. Required keys:
| Key | Used by | Required? |
|---|---|---|
| `VITE_HF_TOKEN` | `BackendClient`, `nhs-client` | optional — falls back to local |
| `VITE_NHS_API_KEY` | `nhs-client` | required for NHS endpoint calls |

## map by concern
- **Adding a slash command** → drop a file in `src/commands/handlers/`,
  register in `src/commands/index.ts`, add a sibling test.
- **Adding a theme** → extend `THEMES` in `src/utils/themes.ts`.
- **Adding tier keywords** → edit `src/data/clinical_guidelines.json` only.
- **Changing safety logic** → `src/services/SafetyTriageService.ts`. Tests
  in `src/services/SafetyTriageService.test.ts`.
- **Changing model routing** → `src/services/ModelRouter.ts`.
- **Persistence quirks** → see `docs/arch.md#persistence-map`.

## CI gates
1. ESLint (`max-warnings 10`).
2. Jest with coverage upload (codecov, non-blocking).
3. Playwright e2e + axe-core a11y (fails on any violation).
4. `tsc && vite build` (fails on TS errors).
