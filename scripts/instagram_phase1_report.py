#!/usr/bin/env python3

from __future__ import annotations

import csv
import sys
from collections import Counter
from datetime import date, timedelta
from pathlib import Path


QUEUE_PATH = Path(__file__).resolve().parents[1] / "docs/ops/instagram-phase-1/content-queue.csv"


def load_rows() -> list[dict[str, str]]:
    with QUEUE_PATH.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def parse_day(value: str) -> date:
    return date.fromisoformat(value)


def choose_today() -> date:
    if len(sys.argv) > 1:
        return parse_day(sys.argv[1])
    return date.today()


def main() -> int:
    rows = load_rows()
    today = choose_today()
    next_week = today + timedelta(days=7)
    next_three_days = today + timedelta(days=3)

    upcoming = [row for row in rows if today <= parse_day(row["publish_date"]) <= next_week]
    urgent = [row for row in upcoming if parse_day(row["publish_date"]) <= next_three_days]

    approval_counts = Counter(row["approval_status"] for row in upcoming)
    queue_counts = Counter(row["queue_status"] for row in upcoming)

    print(f"NCS Instagram Phase 1 report for {today.isoformat()}")
    print(f"Queue file: {QUEUE_PATH}")
    print()
    print("Upcoming 7-day slot count:", len(upcoming))
    print("Approval status:", dict(sorted(approval_counts.items())))
    print("Queue status:", dict(sorted(queue_counts.items())))
    print()

    approval_gaps = [row for row in urgent if row["approval_status"] not in {"approved", "posted"}]
    asset_gaps = [
        row for row in urgent
        if row["queue_status"] not in {"ready_to_post", "mission_control_ready", "posted"}
    ]

    print("Approval gaps in next 72 hours:")
    if approval_gaps:
        for row in approval_gaps:
            print(
                f"- {row['publish_date']} {row['target_time_pt']} {row['daypart']}: "
                f"{row['title']} [{row['approval_status']}]"
            )
    else:
        print("- none")

    print()
    print("Asset or queue gaps in next 72 hours:")
    if asset_gaps:
        for row in asset_gaps:
            print(
                f"- {row['publish_date']} {row['target_time_pt']} {row['daypart']}: "
                f"{row['title']} [{row['queue_status']}]"
            )
    else:
        print("- none")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
