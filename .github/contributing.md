# Contributing Guide

## Code

- Please kindly open an issue first to discuss with the maintainers.
- Keep your scope of changes as isolated as possible
- Pass the pre-commit.

## Documentation

Please read our [contribution guide](https://hoa.moe/blog/contribution-guide/) in the website.

## Blog and news

Blog and news is maintained in separate repositories:

- Blog: https://github.com/HITSZ-OpenAuto/hoa-blog
- News: https://github.com/HITSZ-OpenAuto/hoa-news

Site-specific blog overrides used for urgent fixes (until upstream merges) live under `content-patches/blog/` and are applied at the end of `scripts/fetch-content.sh`. Prefer landing durable edits in **hoa-blog** and retiring the patch afterward.
