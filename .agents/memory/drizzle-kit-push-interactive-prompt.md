---
name: drizzle-kit push interactive prompt blocks non-interactive shells
description: drizzle-kit push asks a create-vs-rename question for new tables that can't be answered via simple stdin piping; use direct SQL as a fallback to unblock dev DB sync.
---

When a new table is added to a Drizzle schema and another table was dropped/renamed around the same time, `drizzle-kit push` shows an interactive arrow-key prompt ("Is X table created or renamed from another table?"). This prompt does not respond to `printf "\n" | pnpm run push` or similar simple stdin piping in the sandbox shell — it just reprints the same prompt.

**Why:** The prompt is a raw-mode CLI list picker (not a line-based readline prompt), so it needs real keypress/arrow-key input that a plain pipe can't supply.

**How to apply:** If drizzle-kit push is stuck on this prompt and you just need to unblock local dev testing, create the missing table directly with `psql "$DATABASE_URL" -c "CREATE TABLE IF NOT EXISTS ..."` matching the Drizzle schema's column defs, rather than fighting the interactive prompt.
