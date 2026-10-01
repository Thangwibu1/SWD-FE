# architecture-evaluation-frontend

React + TypeScript + Vite control/observation UI for the AI Architecture
Evaluation System. It talks to `architecture-evaluation-backend` only over
HTTP (`/api/v1`) and Server-Sent Events. It never computes official scores or
cost; every number shown comes from the backend.

This is an independent repository (no monorepo/workspace).

## Requirements

- Node.js 22.19.0 (see `engines`)
- npm 10
- Docker (optional, for the nginx image)

## Local development

```bash
cp .env.example .env
npm ci
npm run test
npm run dev        # http://localhost:5173
```

`.env` keys:

| Key                 | Default                        | Purpose       |
| ------------------- | ------------------------------ | ------------- |
| `VITE_API_BASE_URL` | `http://localhost:4000/api/v1` | REST base URL |
| `VITE_SSE_BASE_URL` | `http://localhost:4000/api/v1` | SSE base URL  |

## Scripts

| Script                            | Purpose                                                         |
| --------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                     | Vite dev server                                                 |
| `npm run build`                   | Type-check + production build to `dist/`                        |
| `npm run test`                    | Vitest + React Testing Library                                  |
| `npm run test:e2e`                | Playwright against `vite preview` (API mocked via `page.route`) |
| `npm run lint` / `npm run format` | ESLint / Prettier                                               |

First Playwright run needs a browser: `npx playwright install chromium`.

## Deployment

`docker build -t architecture-evaluation-frontend .` builds `dist/` and serves
it with nginx on port 8080. `nginx.conf` proxies `/api/` to `backend:4000`,
disables buffering/caching for the SSE route and caches hashed assets.
The evaluator has no auth in MVP: keep it on a private network or put an
authenticating reverse proxy in front before exposing it.
