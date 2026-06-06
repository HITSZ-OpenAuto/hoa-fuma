#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

tools_dir="${HOA_TOOLS_DIR:-.tools/bin}"
hoa_backend="$tools_dir/hoa-backend"
mkdir -p "$tools_dir"

if [ -x "$hoa_backend" ]; then
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64)
    archive_url="https://github.com/HITSZ-OpenAuto/hoa-backend/releases/latest/download/hoa-backend-macos-arm64.tar.gz"
    ;;
  Linux-x86_64)
    archive_url="https://github.com/HITSZ-OpenAuto/hoa-backend/releases/latest/download/hoa-backend-linux.tar.gz"
    ;;
  *)
    echo "Unsupported platform: $(uname -s)-$(uname -m)" >&2
    echo "Please download hoa-backend manually into $tools_dir/hoa-backend." >&2
    exit 1
    ;;
esac

curl -fsSL "$archive_url" | tar -xz -C "$tools_dir"
chmod +x "$hoa_backend"
