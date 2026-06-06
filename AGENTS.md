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
