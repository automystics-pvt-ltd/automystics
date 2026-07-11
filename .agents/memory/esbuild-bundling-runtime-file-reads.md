---
name: esbuild bundling breaks packages that read sibling files at runtime
description: A backend service failed at runtime (ENOENT under dist/) even though the build succeeded, because esbuild bundled a package that reads a file relative to its own __dirname.
---

Packages like `connect-pg-simple` (reads `table.sql` next to their own module file at
runtime) break silently when esbuild bundles them into a single output file. The
build succeeds and boots fine, but the runtime file read resolves against the
bundle's output directory instead of the original package directory — especially
if the build also globally rebinds `__dirname`/`__filename` via a banner (a common
pattern for ESM output of CJS-style bundles).

**Why:** The failure only appears when the code path that does the file read is
actually exercised (e.g. first-ever session creation, lazy table creation) — so it
can pass a build/smoke test and only surface later as a generic 500 with a
misleading wrapped error, hiding the real `ENOENT` deep in a dependency.

**How to apply:** When a bundled Node backend throws ENOENT for a path under its
`dist/` directory that doesn't match anything in your own source, suspect a
bundled dependency doing a runtime relative file read. Fix by adding that package
to the bundler's `external` list (so it loads normally from `node_modules` and
keeps its own `__dirname`) rather than trying to copy the asset file manually.
