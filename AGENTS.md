## Project overview

- Next.js/Fumadocs frontend for HOA project.
- Use `pnpm` for Node commands.

## Setup and development

- Install dependencies and local tools/data: `make prepare`
- Fetch content: `make content`
- Start dev server: `make dev`
- Clean generated local state: `make clean`

`make prepare` downloads frontend data into `lib/data/` and installs `hoa-backend` into `.tools/bin/`; it must not install Cargo packages or write to global user bins.

## Checks

Before finishing changes, run:

```bash
make check
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
