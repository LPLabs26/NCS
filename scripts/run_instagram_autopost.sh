#!/bin/zsh
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$REPO"
source /Users/patrice/.hermes/hermes-agent/venv/bin/activate
set -a
source /Volumes/Patrice/workspaces/NCS/instagram-session/credentials.env
set +a
mkdir -p "$REPO/logs"
python "$REPO/scripts/autopost_from_queue.py" >> "$REPO/logs/instagram-autopost.log" 2>&1
