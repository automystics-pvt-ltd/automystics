# Automystics — AI Automation Company Website

A full-stack marketing and admin website for Automystics, an AI automation company. Built as a pnpm monorepo with a React/Vite frontend and an Express/PostgreSQL backend.

## Architecture

```
artifacts/
  automystics/     — React 19 + Vite 7 + Tailwind CSS 4 frontend (public site + admin dashboard)
  api-server/      — Express 5 + Drizzle ORM backend (REST API, session auth)
  mockup-sandbox/  — Internal design/component preview tool
lib/
  db/              — Drizzle schema + PostgreSQL pool (shared by api-server)
  api-spec/        — OpenAPI specification (source of truth)
  api-zod/         — Auto-generated Zod schemas (from openapi.yaml via Orval)
  api-client-react/— Auto-generated React Query hooks (from openapi.yaml via Orval)
```

## How to Run

Dependencies are managed by pnpm workspaces. After any fresh clone or import:

```bash
pnpm install
pnpm --filter @workspace/db run push   # push schema to database
```

The two main workflows start automatically:
- **API Server** — `pnpm --filter @workspace/api-server run dev` (builds with esbuild, then runs)
- **Web App** — `pnpm --filter @workspace/automystics run dev`

## Environment Variables / Secrets

| Key              | Kind   | Required | Notes |
|------------------|--------|----------|-------|
| `SESSION_SECRET` | Secret | Yes      | Express session signing key |
| `ADMIN_PASSWORD` | Secret | No       | Admin account password (defaults to `Automystics@2026` in dev — **set before deploying**) |
| `DATABASE_URL`   | Auto   | Yes      | Managed by Replit — do not set manually |

## Database

Uses Replit's built-in PostgreSQL. Schema is managed with Drizzle Kit:

```bash
pnpm --filter @workspace/db run push          # push schema changes to dev DB
pnpm --filter @workspace/db run push-force    # force-push (drops conflicting data)
```

Production schema changes are applied automatically when you publish via Replit's Publish flow.

## API Code Generation

If you change `lib/api-spec/openapi.yaml`, regenerate the client/schema:

```bash
pnpm --filter @workspace/api-zod run generate
pnpm --filter @workspace/api-client-react run generate
```

## User Preferences

- Keep the existing monorepo structure (artifacts/, lib/).
- Use pnpm — never npm or yarn.
