# Contributing Guide

## Code

- Please kindly open an issue first to discuss with the maintainers.
- Keep your scope of changes as isolated as possible
- Pass the pre-commit.

## Documentation

Please read our [contribution guide](https://hoa.moe/blog/contribution-guide/) in the website.

## Blog and news content

Blog and news content is maintained in separate repositories:

- Blog: https://github.com/HITSZ-OpenAuto/hoa-blog (content under `blog/`)
- News: https://github.com/HITSZ-OpenAuto/hoa-news (repo root is the news content)

The `main` branch of this repo holds the app and docs; CI fetches and extracts blog/news from those repos when building and previewing.

Locally, run `make content` (or `make prepare`) to populate `content/blog` and `content/news`.
