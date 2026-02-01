PM := pnpm

.PHONY: help prepare sync docs run build start clean clean-docs lint format check

help:
	@printf "%s\n" \
		"Targets:" \
		"  prepare     Install frontend deps and sync scripts venv" \
		"  sync        Sync scripts venv from uv.lock (.python-version driven)" \
		"  docs        Run scripts/main.py and format_mdx.py" \
		"  run         Launch the frontend dev server" \
		"  build       Build the frontend" \
		"  start       Start the built frontend (production)" \
		"  lint        Lint frontend and scripts" \
		"  format      Format frontend and scripts" \
		"  check       Run lint and format" \
		"  clean       Remove node_modules, .next, .source, and scripts/.venv" \
		"  clean-docs  Remove content/docs/"

prepare: sync
	$(PM) install
	uv tool install git+https://github.com/HITSZ-OpenAuto/hoa-majors.git

sync:
	uv sync --locked --project scripts

docs:
	uv run --project scripts scripts/main.py
	uv run --project scripts scripts/lib/format_mdx.py

run:
	$(PM) run dev

build:
	$(PM) run build

start:
	$(PM) start

lint:
	$(PM) run lint --fix
	uv run --project scripts ruff check . --fix

format:
	$(PM) run format
	uv run --project scripts ruff format .

check: lint format

clean:
	rm -rf node_modules .next .source scripts/.venv

clean-docs:
	rm -rf content/docs/
