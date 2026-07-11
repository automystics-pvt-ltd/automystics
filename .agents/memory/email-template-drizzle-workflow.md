---
name: email-template-drizzle-workflow
description: Workflow for adding admin-editable email templates and picking up new drizzle schema columns in @workspace/db
---

When adding admin-customizable email copy (subject/body) backed by a drizzle column in `lib/db`:

- Use a simple `{{var}}` + `{{#var}}...{{/var}}` (conditional block) template syntax rather than a full templating library — it's easy for non-technical admins to read/edit in a plain textarea, and easy to render with two regex passes (conditional blocks first, then plain substitution).
- Store one raw (unescaped) value set for the plain-text email and one HTML-escaped value set for the HTML email, rendering the same template against each — avoids maintaining two divergent copies of the copy.

**Why:** keeps admin-facing text editable without code changes while staying simple enough to validate/preview client-side.

**Gotcha:** after adding a new column/export to `lib/db/src/schema/*.ts`, `pnpm --filter @workspace/db run push` updates the DB, but consuming packages (api-server, frontend) type-check against `lib/db/dist/*.d.ts`, which is stale until you run `pnpm --filter @workspace/db exec tsc -b --force`. Forgetting this produces confusing "has no exported member" / "property does not exist" errors in unrelated files that already import from `@workspace/db`.
