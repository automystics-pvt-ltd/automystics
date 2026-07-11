---
name: OpenAPI spec can lag hand-written routes
description: The api-server's Express routes can outpace lib/api-spec/openapi.yaml; generated React Query hooks won't exist for undocumented endpoints.
---

In this monorepo, `artifacts/api-server` routes are hand-written Express, while `lib/api-client-react` hooks are generated from `lib/api-spec/openapi.yaml` via orval. These can drift: a route can exist and work fine in the server while having no corresponding OpenAPI path, so no generated hook exists for it.

**Why:** discovered when building a new Expo artifact that needed to call existing public/enquiry endpoints (products, site settings, enquiries, demo requests) — the routes worked, but `openapi.yaml` only documented `/healthz`, so the generated client had no hooks for them.

**How to apply:** before assuming a generated hook exists for a backend endpoint, grep `lib/api-client-react/src/generated/api.ts` for it. If missing, add the path/schema to `lib/api-spec/openapi.yaml` (matching the actual route/zod validators) and run `pnpm --filter @workspace/api-spec run codegen` before writing client code — don't hand-write fetch calls.
