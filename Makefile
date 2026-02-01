.PHONY: help prepare sync run clean clean-docs

help:
	@printf "%s\n" \
		"Targets:" \
		"  prepare     Install frontend deps and sync scripts venv" \
		"  sync        Sync scripts venv from uv.lock (.python-version driven)" \
		"  run         Run scripts/main.py using scripts project" \
		"  clean       Remove node_modules, .next, .source, and scripts/.venv" \
		"  clean-docs  Remove content/docs/"

prepare: sync
	bun install
	uv tool install git+https://github.com/HITSZ-OpenAuto/hoa-majors.git

sync:
	uv sync --locked --project scripts

run:
	uv run --project scripts scripts/main.py
	uv run --project scripts scripts/format_mdx.py

clean:
	rm -rf node_modules .next .source scripts/.venv

clean-docs:
	rm -rf content/docs/
