# NCS Google Sheets Import Pack

Created: 2026-04-01

This folder contains a seeded Google Sheets import pack built from the repo templates and the current Instagram Phase 1 queue.

Files
- Dashboard.csv
- Daily Cadence.csv
- Content Pipeline.csv
- Booking Tracker.csv
- Leads + DMs.csv
- Weekly Brief.csv
- KPI Log.csv
- Competitors.csv
- Trends.csv

Recommended workbook name
- NCS Aesthetics Dashboard

Recommended tab order
1. Dashboard
2. Daily Cadence
3. Content Pipeline
4. Booking Tracker
5. Leads + DMs
6. Weekly Brief
7. KPI Log
8. Competitors
9. Trends

What is already seeded
- Demo 3-lane cadence week from content-calendar.csv
- Current Phase 1 queue transformed into a Content Pipeline tab
- Dashboard summary values based on the seeded cadence and queue health
- Weekly Brief and KPI starter row
- Fresno competitor verification rows updated on 2026-04-01

What still requires live business data
- Booking Tracker rows
- Leads + DMs rows
- Real weekly KPI totals

Live Google Sheets status
- Google OAuth is not authenticated on this machine yet.
- The repo-side import pack is ready, but creating the actual live Sheet still requires Google authorization.

Fastest next step once auth is available
1. Create a Google Sheet named NCS Aesthetics Dashboard
2. Import each CSV as its matching tab
3. Freeze header row on every tab
4. Add dropdowns from docs/ops/google-sheets-logic-spec.md
5. Replace seeded zeros with live booking and DM data as operations start
