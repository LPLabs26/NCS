#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
QUEUE="$ROOT/docs/ops/instagram-phase-1/content-queue.csv"
OUT="$ROOT/docs/ops/team-status.md"
NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"

read -r APPROVED REVIEW BACKLOG HERO_APPROVED <<EOF
$(python3 - "$QUEUE" <<'PY'
import csv, sys
path = sys.argv[1]
approved = review = backlog = hero_approved = 0
with open(path, newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        status = row.get('approval_status', '')
        queue_status = row.get('queue_status', '')
        daypart = row.get('daypart', '')
        if status == 'approved':
            approved += 1
            if daypart == 'Evening':
                hero_approved += 1
        elif status == 'needs_review':
            review += 1
        if queue_status == 'backlog':
            backlog += 1
print(approved, review, backlog, hero_approved)
PY
)
EOF

cat > "$OUT" <<EOF
# NCS Team Status

Updated: $NOW

## Working surfaces
- Active repo: $ROOT
- Public dashboard: https://lplabs26.github.io/NCS/
- Mission Control: https://lplabs26.github.io/NCS/mission-control/
- Executive dashboard: https://lplabs26.github.io/NCS/site/

## Team lanes
- Patrice — systems, dashboard, approval-flow QA
- Natalie — approvals and brand judgment
- Operator model — Morning Daily Tips / Midday Hydrafacial / Evening Circadia hero

## Queue snapshot
- Approved queue items: $APPROVED
- Needs review: $REVIEW
- Backlog items: $BACKLOG
- Approved evening hero posts: $HERO_APPROVED

## Operating rule
- Approve -> Schedule -> Confirm
- Morning and midday stay light-touch
- Evening is the hero lane and should be protected first
EOF

printf 'Wrote %s\n' "$OUT"
