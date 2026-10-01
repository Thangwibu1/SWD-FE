# IMPLEMENTATION_STATUS — architecture-evaluation-frontend

## Phase 0 — Bootstrap

### Implemented
- Independent Git repository, one `package.json` + `package-lock.json`, no workspace.
- React 19 + TypeScript strict + Vite 8, MUI theme with the spec status colours.
- React Router layout with sidebar: Dashboard, New Experiment, Experiments, Comparison, Architectures, Settings (placeholder pages until Phase 9).
- TanStack Query client, Vitest + React Testing Library + jest-dom setup, Playwright config against `vite preview`.
- ESLint (typescript-eslint, react-hooks, react-refresh), Prettier.
- `.env.example` (`VITE_API_BASE_URL`, `VITE_SSE_BASE_URL`), README.
- Dockerfile (Node build → nginx runtime). `nginx.conf` is an envsubst template: per-request DNS resolution for `BACKEND_UPSTREAM` (nginx starts even when backend is down), SSE route without buffering/cache, immutable hashed assets, no-cache `index.html`, SPA fallback, caller `X-Request-Id` preserved.
- GitHub Actions CI: npm ci, lint, test, build, Playwright, docker build.

### Files changed
- `package.json`, `package-lock.json`, `.npmrc`, `tsconfig.json`, `vite.config.ts`, `playwright.config.ts`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`
- `.gitignore`, `.dockerignore`, `.env.example`, `index.html`, `Dockerfile`, `nginx.conf`, `README.md`, `.github/workflows/ci.yml`
- `src/main.tsx`, `src/app/{App.tsx,router.tsx,theme.ts,query-client.ts}`, `src/components/layout/AppLayout.tsx`, `src/pages/PlaceholderPage.tsx`
- `src/tests/setup.ts`, `src/tests/App.test.tsx`, `e2e/smoke.spec.ts`

### Verification
- Fresh copy + `npm ci`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
- `npm run test`: PASS (2/2)
- `npm run test:e2e`: PASS (1/1, Chromium)
- `prettier --check`: PASS
- `docker build`: PASS; container serves `/` and SPA routes 200, `/api` → 502 when backend is absent (no crash), proxied `/api/v1/health` → 200 with backend on the same network; asset/index cache headers verified.

### Remaining blockers
- Pages are placeholders; real UI is Phase 9 (after evaluator core, per guide rule 34.3).
