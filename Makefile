PM := pnpm

.PHONY: help prepare dev build start clean lint format type-check knip check content ignore-content-changes

help:
	@printf "%s\n" \
		"Targets:" \
		"  prepare                 Install deps and hoa-backend" \
		"  dev                     Launch the frontend dev server" \
		"  build                   Build the frontend" \
		"  start                   Start the built frontend (production)" \
		"  lint                    Lint frontend" \
		"  format                  Format frontend" \
		"  type-check              Run type checks" \
		"  knip                    Run knip" \
		"  check                   Run lint, format, type checks, and knip" \
		"  clean                   Remove node_modules, .next, .source" \
		"  content                 Fetch blog and news content" \
		"  ignore-content-changes  Tell Git to ignore local changes under content/ (run once per clone)"

prepare:
	$(PM) install
	test -d hoa-major-data || git clone https://github.com/HITSZ-OpenAuto/hoa-major-data
	@if [ "$$(uname -s)" = "Darwin" ] && [ "$$(uname -m)" = "arm64" ]; then \
		echo "Downloading hoa-backend binary for macOS-arm64..."; \
		mkdir -p $(HOME)/.cargo/bin; \
		curl -L https://github.com/HITSZ-OpenAuto/hoa-backend/releases/latest/download/hoa-backend-macos-arm64.tar.gz | tar -xz -C $(HOME)/.cargo/bin; \
	elif [ "$$(uname -s)" = "Linux" ] && [ "$$(uname -m)" = "x86_64" ]; then \
		echo "Downloading hoa-backend binary for Linux..."; \
		mkdir -p $(HOME)/.cargo/bin; \
		curl -L https://github.com/HITSZ-OpenAuto/hoa-backend/releases/latest/download/hoa-backend-linux.tar.gz | tar -xz -C $(HOME)/.cargo/bin; \
	else \
		cargo install --git https://github.com/HITSZ-OpenAuto/hoa-backend.git; \
	fi
	curl -o repos_list.txt https://raw.githubusercontent.com/HITSZ-OpenAuto/repos-management/refs/heads/main/repos_list.txt

dev:
	$(PM) run dev

build:
	$(PM) run build

start:
	$(PM) start

lint:
	$(PM) run lint --fix

format:
	$(PM) run format

type-check:
	$(PM) run types:check

knip:
	$(PM) run knip

check: lint format type-check knip

clean:
	rm -rf node_modules .next .source

content:
	rm -rf content/blog content/news
	mkdir -p content/blog content/news
	curl -L https://github.com/HITSZ-OpenAuto/hoa-blog/tarball/main | tar -xz -C content/blog --strip-components=2
	curl -L https://github.com/HITSZ-OpenAuto/hoa-news/tarball/main | tar -xz -C content/news --strip-components=2
	hoa-backend --fetch
	$(MAKE) ignore-content-changes

ignore-content-changes:
	@git ls-files content/ 2>/dev/null | xargs -I {} git update-index --skip-worktree {} 2>/dev/null; echo "Done. Git will ignore local changes under content/."
