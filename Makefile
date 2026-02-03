PM := pnpm

.PHONY: help prepare docs dev build start clean clean-docs clean-content lint format check content ignore-content-changes

help:
	@printf "%s\n" \
		"Targets:" \
		"  prepare                 Install deps, fetch blog/news content, and build docs" \
		"  docs                    Regenerate course docs (fuma_rs --fetch)" \
		"  dev                     Launch the frontend dev server" \
		"  build                   Build the frontend" \
		"  start                   Start the built frontend (production)" \
		"  lint                    Lint frontend" \
		"  format                  Format frontend" \
		"  check                   Run lint and format" \
		"  clean                   Remove node_modules, .next, .source, docs, blog and news" \
		"  clean-docs              Remove content/docs only" \
		"  clean-content           Remove content/blog and content/news only" \
		"  content                 Fetch blog and news content from external repos" \
		"  ignore-content-changes  Tell Git to ignore local changes under content/ (run once per clone)"

prepare: content
	$(PM) install
	test -d hoa-major-data || git clone https://github.com/HITSZ-OpenAuto/hoa-major-data
	cargo install --git https://github.com/HITSZ-OpenAuto/fuma-rs.git
	curl -o repos_list.txt https://raw.githubusercontent.com/HITSZ-OpenAuto/repos-management/refs/heads/main/repos_list.txt
	$(MAKE) docs
	$(MAKE) ignore-content-changes

docs:
	fuma_rs --fetch

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

check: lint format

clean:
	rm -rf node_modules .next .source content/docs content/blog content/news

clean-docs:
	rm -rf content/docs

clean-content:
	rm -rf content/blog content/news

content: clean-content
	# Blog/news content is maintained in separate repos:
	# - https://github.com/HITSZ-OpenAuto/hoa-blog (contains blog/)
	# - https://github.com/HITSZ-OpenAuto/hoa-news (repo root is news content)
	rm -rf .tmp-hoa-blog .tmp-hoa-news
	git clone --depth 1 https://github.com/HITSZ-OpenAuto/hoa-blog .tmp-hoa-blog
	git clone --depth 1 https://github.com/HITSZ-OpenAuto/hoa-news .tmp-hoa-news
	mkdir -p content/blog content/news
	git -C .tmp-hoa-blog archive HEAD blog/ | tar -x -C content
	git -C .tmp-hoa-news archive HEAD | tar -x -C content/news
	rm -rf .tmp-hoa-blog .tmp-hoa-news

ignore-content-changes:
	@git ls-files content/ 2>/dev/null | xargs -I {} git update-index --skip-worktree {} 2>/dev/null; echo "Done. Git will ignore local changes under content/."
