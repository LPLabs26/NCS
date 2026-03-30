#!/bin/zsh
set -euo pipefail
ROOT="/Users/jorgesanchez/Desktop/NCS"
OUT="$ROOT/logs/overnight-ops.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] Overnight content sprint active: Peter=production Patrice=QA/systems Samir=review" >> "$OUT"
