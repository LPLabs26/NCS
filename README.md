# NCS

Operating system for NCS Aesthetics.

This repo now contains two active layers:

- the existing NCS content and operations system
- the new Next.js social scheduler app for official Instagram Graph publishing

## NCS operations system

This repo supports:

- brand strategy
- content planning
- daily pulse checks
- booking gap-fill marketing
- autonomous Instagram team operations
- approval and scheduling workflows
- competitive research
- SOPs for a luxury, high-touch esthetics business

Key existing areas:

- `docs/brand/`
- `docs/content/`
- `docs/automation/`
- `docs/ops/`
- `research/competitors/`
- `research/trends/`
- `templates/`
- `mission-control/`
- `site/`
- `docs/`
- `docs-site-build/`
- `exports/`

The operational Instagram system lives in `docs/ops/instagram-phase-1/`.

Useful command:

```bash
python3 scripts/instagram_phase1_report.py
```

## Social scheduler app

The new internal scheduler app lives at the repo root as a Next.js app.

It is built for:

- creating and editing Instagram posts
- storing captions, hashtags, CTA copy, scheduled dates, assets, and approval state
- validating media before publish
- publishing approved posts through the official Instagram Graph API
- collecting daily post metrics
- running safely in `DRY_RUN=true` by default

Core app files:

- `lib/meta/instagram.ts`
- `lib/scheduler/publishDuePosts.ts`
- `app/admin/calendar/page.tsx`
- `app/admin/posts/page.tsx`
- `app/admin/posts/[id]/page.tsx`
- `app/api/cron/publish/route.ts`
- `app/api/assets/upload/route.ts`
- `scripts/importContentCalendar.ts`

## Scheduler stack

- Next.js 16 + TypeScript
- Supabase Postgres + Supabase Auth
- Cloudflare R2 or AWS S3-compatible object storage
- cron-friendly publish and metrics endpoints
- official Meta/Instagram Graph API flows only

## Scheduler setup

Copy `.env.example` to `.env.local` and fill in:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PAGE_ID`
- `IG_USER_ID`
- `PAGE_ACCESS_TOKEN`
- `ASSET_PUBLIC_BASE_URL`
- `CRON_SECRET`

Notes:

- `META_API_VERSION` defaults to `v25.0`
- `APP_TIMEZONE` defaults to `America/Los_Angeles`
- `DRY_RUN` should stay `true` until the owner approves the first real live publish
- `ASSET_PUBLIC_BASE_URL` must be a public HTTPS base URL because Meta fetches media by URL

Run the Supabase migration:

- `supabase/migrations/20260420_initial_schema.sql`

## Local development

```bash
npm install
npm run dev
```

## Seed starter content

```bash
npm run import:calendar
```

To import a custom CSV or JSON file:

```bash
npm run import:calendar -- ./path/to/calendar.csv
```

## Cron endpoints

- `GET/POST /api/cron/publish`
- `GET/POST /api/cron/metrics`

Pass either:

- `Authorization: Bearer <CRON_SECRET>`
- `x-cron-secret: <CRON_SECRET>`

## Existing static surfaces

You can still open the older static tools directly:

- `site/index.html`
- `mission-control/index.html`

Or serve the repo root locally:

```bash
python3 -m http.server 8080
```

Then visit:

- `http://localhost:8080/site/`
- `http://localhost:8080/mission-control/`
