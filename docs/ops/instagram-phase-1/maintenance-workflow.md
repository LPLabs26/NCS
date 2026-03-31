# Maintenance Workflow

## Goal

Keep the schedule useful and adaptive without turning it into a reporting project.

## Daily maintenance

### Start of day

- check the next 24 hours in `content-queue.csv`
- confirm morning and midday assets are approved
- confirm the evening hero is approved or a fallback exists

### End of day

- mark each shipped slot `posted`
- note any miss or delay in the queue
- capture one short observation about replies saves DMs or booking intent

## Friday review

Reserve 20 minutes every Friday.

1. Open `content-queue.csv`.
2. Open `performance-log.csv`.
3. Review which morning posts earned replies or saves.
4. Review which Hydrafacial angle created DMs or booking taps.
5. Review which Circadia hero generated the strongest trust signal.
6. Decide one thing to repeat next week.
7. Decide one thing to stop or simplify next week.

## What to log

Do not chase every metric. Track only:

- slot completion
- approval completed 24 hours early
- replies
- saves
- shares
- profile visits
- booking taps or link clicks
- bookings traced to Instagram

## When to adjust timing

Only adjust a window when both are true:

- the slot posted consistently for two weeks
- engagement stayed weak relative to the other slots

If that happens:

- move the slot by 30 minutes
- test for one full week
- keep the better result and stop moving it

## When to adjust content mix

Adjust the content before adjusting the whole system.

Examples:

- if morning completion drops, use more story-first assets
- if midday engagement drops, use more FAQ or comparison formats
- if evening saves drop, strengthen the hook before changing the time

## Weekly handoff output

Every review should end with:

- one repeated angle
- one angle to pause
- one approval bottleneck to fix
- one queue gap to fill

## Lightweight preflight

Run:

```bash
python3 scripts/instagram_phase1_report.py
```

This script checks queue coverage and flags upcoming approval gaps.
