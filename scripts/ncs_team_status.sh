#!/bin/zsh
set -euo pipefail
ROOT="/Users/jorgesanchez/Desktop/NCS"
OUT="$ROOT/docs/ops/team-status.md"
NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"
cat > "$OUT" <<EOF
# NCS Team Status

Updated: $NOW

## Team lanes
- Samir — executive review / direction / final QA
- Peter — main content production lane
- Patrice — dashboard, systems, approval flow QA
- Michael — sidelined for now / not primary content lane

## Overnight operating rules
- Morning = Daily Tips
- Midday = Hydrafacial
- Evening = Circadia hero post
- Nothing posts until approved

## Current overnight objective
- Build and QA a 50-post ready bank
- Keep dashboard clear for Natalie
EOF
