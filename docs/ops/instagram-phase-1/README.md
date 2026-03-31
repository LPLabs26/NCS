# Instagram Phase 1 Operator Kit

This folder is the canonical Phase 1 operating layer for Instagram.

Use these files in order:

1. `strategy.md` for cadence, timing, approval rules, and engagement logic.
2. `weekly-operating-schedule.md` for the seven-day publishing rhythm.
3. `content-queue.csv` as the live queue and slot tracker.
4. `performance-log.csv` as the weekly scorecard.
5. `maintenance-workflow.md` for the review and adjustment loop.

Helpful script:

- `python3 scripts/instagram_phase1_report.py`

Phase 1 is intentionally approval-first and lightweight:

- the repo is the source of truth
- Mission Control is the approval wall
- posting is still manual in Instagram or Meta Business Suite
- no fake API automation is claimed here
