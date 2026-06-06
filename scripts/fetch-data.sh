#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

mkdir -p lib/data

curl -fsSL \
  -o lib/data/major_mapping.json \
  https://raw.githubusercontent.com/HITSZ-OpenAuto/hoa-major-data/main/major_mapping.json

curl -fsSL \
  -o lib/data/repos_list.txt \
  https://raw.githubusercontent.com/HITSZ-OpenAuto/repos-management/refs/heads/main/repos_list.txt
