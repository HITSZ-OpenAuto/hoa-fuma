#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

hoa_backend="${HOA_BACKEND:-$repo_root/.tools/bin/hoa-backend}"
repos_list="$repo_root/lib/data/repos_list.txt"
major_data_archive="https://github.com/HITSZ-OpenAuto/hoa-major-data/archive/refs/heads/main.tar.gz"
workdir="$(mktemp -d)"
trap 'rm -rf "$workdir" temp' EXIT

if [ ! -r "$repos_list" ]; then
  echo "Missing $repos_list. Run ./scripts/fetch-data.sh first." >&2
  exit 1
fi

rm -rf content/blog content/news content/docs
mkdir -p content
for type in blog news; do
  rm -rf temp
  git clone --depth 1 --filter=blob:none "https://github.com/HITSZ-OpenAuto/hoa-${type}" temp
  mv "temp/${type}" "content/${type}"
  rm -rf temp
done

curl -fsSL "$major_data_archive" | tar -xz -C "$workdir"
mv "$workdir/hoa-major-data-main" "$workdir/hoa-major-data"
ln -s "$repo_root/content" "$workdir/content"
ln -s "$repos_list" "$workdir/repos_list.txt"

(
  cd "$workdir"
  "$hoa_backend" --fetch
)
