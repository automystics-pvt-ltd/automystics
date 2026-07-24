---
name: Drizzle-kit config ESM shim
description: drizzle-kit's internal loader provides __dirname for .ts config files even in ESM packages; replacing it with fileURLToPath breaks the tool.
---

# Drizzle-kit config ESM shim

**Rule:** Leave `__dirname` as-is in `drizzle.config.ts` even when the package is `"type": "module"`. Do not replace it with `import.meta.url` + `fileURLToPath`.

**Why:** drizzle-kit uses its own module loader / bundler (esbuild-based) to read `.ts` config files. That loader shims `__dirname` for TypeScript config files regardless of the package's `type` field. Replacing `__dirname` with the standard ESM pattern causes a `require is not defined` error because the loader then treats the file as ESM and its own CJS-compatible shims conflict.

**How to apply:** When setting up or modifying `lib/db/drizzle.config.ts`, keep `path.join(__dirname, ...)` for schema paths. Confirmed working in this project.
