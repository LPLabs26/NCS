#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
LOG_DIR="$ROOT/logs"
LOG_FILE="$LOG_DIR/overnight-ops.log"
mkdir -p "$LOG_DIR"
QUEUE="$ROOT/docs/ops/instagram-phase-1/content-queue.csv"
GIT_SHORT="$(git -C "$ROOT" status --short | wc -l | tr -d ' ')"
QUEUE_LINE="$(python3 - "$QUEUE" <<'PY'
import csv, sys
path = sys.argv[1]
counts = {'approved': 0, 'needs_review': 0, 'backlog': 0}
with open(path, newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        status = row.get('approval_status', '')
        queue_status = row.get('queue_status', '')
        if status == 'approved':
            counts['approved'] += 1
        elif status == 'needs_review':
            counts['needs_review'] += 1
        if queue_status == 'backlog':
            counts['backlog'] += 1
print(f"approved={counts['approved']} review={counts['needs_review']} backlog={counts['backlog']}")
PY
)"
printf '[%s] repo=%s changed_files=%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$ROOT" "$GIT_SHORT" "$QUEUE_LINE" >> "$LOG_FILE"
printf 'Appended %s\n' "$LOG_FILE"
