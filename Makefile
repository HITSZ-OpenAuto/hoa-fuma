PM := pnpm

.PHONY: help prepare dev build start clean lint format type-check knip check content ignore-content-changes

help:
	@printf "%s\n" \
		"Targets:" \
		"  prepare                 Install deps and local tools/data" \
		"  dev                     Launch the frontend dev server" \
		"  build                   Build the frontend" \
		"  start                   Start the built frontend (production)" \
		"  lint                    Lint frontend" \
		"  format                  Format frontend" \
		"  type-check              Run type checks" \
		"  knip                    Run knip" \
		"  check                   Run lint, format, type checks, and knip" \
		"  clean                   Remove generated dependencies, builds, and local tools" \
		"  content                 Fetch blog, news, and docs content" \
		"  ignore-content-changes  Tell Git to ignore local changes under content/ (run once per clone)"

prepare:
	$(PM) install
	./scripts/fetch-data.sh
	./scripts/install-hoa-backend.sh

dev:
	$(PM) run dev

build:
	$(PM) run build

start:
	$(PM) start

lint:
	$(PM) run lint --fix

format:
	$(PM) run fmt

type-check:
	$(PM) run types:check

knip:
	$(PM) run knip

check: lint format type-check knip

clean:
	rm -rf node_modules .pnpm-store .next .source out build coverage .tools lib/data content repos *.tsbuildinfo

content:
	./scripts/fetch-data.sh
	./scripts/install-hoa-backend.sh
	./scripts/fetch-content.sh
	$(MAKE) ignore-content-changes

ignore-content-changes:
	@git ls-files content/ 2>/dev/null | xargs -I {} git update-index --skip-worktree {} 2>/dev/null; echo "Done. Git will ignore local changes under content/."
