# Contributing Guide

## Code

- Please kindly open an issue first to discuss with the maintainers.
- Keep your scope of changes as isolated as possible
- Pass the pre-commit.

## Documentation

Please read our [contribution guide](https://hoa.moe/blog/contribution-guide/) in the website.

## Blog and news content

- Blog content lives in the **orphan** branch `blog` (root folder `blog/`). Open PRs to the `blog` branch for new posts.
- News content lives in the **orphan** branch `news` (content at branch root).
- The `main` branch holds the app and docs; CI fetches and extracts blog/news from those branches when building and previewing.
- Locally, run `make fetch-content` (or `make fetch-blog` / `make fetch-news`) to populate `content/blog` and `content/news` from the remote branches.
