# NCS Instagram Social Scheduler

Internal social media operating system for NCS Aesthetics.

This app is built to help NCS plan, approve, schedule, validate, and publish Instagram content through the official Meta and Instagram Graph API only.

## What this scheduler does

- create and edit Instagram posts
- store captions, hashtags, CTAs, content pillars, schedule dates, and approval state
- upload assets and require usage-rights confirmation
- validate media before publish
- publish approved content through the official Instagram Graph API
- collect daily metrics for published posts
- show a 30-day admin calendar and scheduling dashboard

## Safety defaults

- `DRY_RUN=true` by default
- `LIVE_CRON_ENABLED=false` by default
- editors can create and edit drafts only
- only owner/admin can approve, schedule, price-verify, or trigger publishing
- posts only publish when `status` is `approved` or `scheduled`
- posts must also be `owner_approved=true`
- posts with `requires_price_verification=true` are blocked until `price_verified=true`
- assets must have `usage_rights_confirmed=true`
- assets must use public HTTPS URLs
- Circadia product posts must not show public retail pricing
- specific Circadia services require owner confirmation before promotion
- official Circadia assets require approved access and usage rights
- production admin access fails closed if Supabase browser auth is not configured
- production admin access is allowlist-based through `admin_users`
- the first real live publish must be manual and owner-approved before cron can go live

## Why the official Meta API matters

This project does not use:

- Instagram scraping
- browser automation
- stored Instagram passwords
- unofficial posting tools

Publishing is implemented with the official Meta container -> publish flow so the account can be run safely and maintainably.

## Core app files

- `lib/meta/instagram.ts`
- `lib/scheduler/publishDuePosts.ts`
- `lib/scheduler/collectDailyMetrics.ts`
- `app/admin/calendar/page.tsx`
- `app/admin/posts/page.tsx`
- `app/admin/posts/[id]/page.tsx`
- `app/api/cron/publish/route.ts`
- `app/api/cron/metrics/route.ts`
- `app/api/assets/upload/route.ts`
- `app/api/meta/smoke-test/route.ts`
- `scripts/checkSchedulerSetup.ts`
- `scripts/importContentCalendar.ts`
- `scripts/runDryPublishCheck.ts`
- `scripts/addSchedulerAdmin.ts`
- `scripts/metaSmokeTest.ts`
- `scripts/checkAssetUrls.ts`

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in placeholder values with real local credentials
3. Install dependencies
4. Apply the Supabase migrations

```bash
npm install
npm run dev
```

Apply these migrations:

- `supabase/migrations/20260420_initial_schema.sql`
- `supabase/migrations/20260420_01_scheduler_hardening.sql`
- `supabase/migrations/20260420_02_post_role_safety.sql`
- `supabase/migrations/20260420_03_circadia_pillar.sql`

## Post-merge rollout

Use this exact order after cloning the merged repo:

```bash
npm ci
npm run social:check
npm run social:add-admin -- --email OWNER_EMAIL --role owner
npm run social:setup-storage
npm run social:seed
npm run social:meta-smoke
npm run social:check-assets
npm run social:dry-run
npm run lint
npm run typecheck
npm test
npm run build
```

Run the `social:*` commands from the repo root. They automatically load `.env.local` when it is present, so you do not need to export each variable by hand first.

What each rollout command does:

- `npm run social:check`
  Checks env values, safety defaults, table presence, and required publish-safety columns without printing secrets.
- `npm run social:add-admin -- --email OWNER_EMAIL --role owner`
  Adds the first allowlisted owner/admin/editor/viewer entry by email using the Supabase service role.
- `npm run social:setup-storage`
  Creates or verifies the public Supabase Storage bucket used for Meta-ready image/video URLs.
- `npm run social:seed`
  Imports the starter NCS calendar in safe mode. Posts stay draft, `owner_approved=false`, and package/Circadia guardrails stay on.
- `npm run social:meta-smoke`
  Verifies Meta config against harmless account endpoints only. It does not upload, create containers, or publish.
- `npm run social:check-assets`
  Audits stored asset URLs and usage-rights confirmation so Meta-ready public HTTPS URLs are easy to verify.
- `npm run social:dry-run`
  Runs the publish readiness audit in dry-run mode only and ends with `DRY RUN COMPLETE — NO POSTS WERE PUBLISHED`.

Rollout rules:

- `DRY_RUN=true` means no posts should publish.
- `LIVE_CRON_ENABLED=false` means cron should not live publish.
- Owner/admin approval is required before any post can go live.
- First live publish should be manual, never cron.
- Cron should only be enabled after a successful manual live publish.
- If the magic-link email will be opened on another computer during local testing, set `NEXT_PUBLIC_APP_URL` to the MacBook's reachable network URL, for example `http://10.0.0.224:3001`.

## Required env vars

- `NODE_ENV=development`
- `META_API_VERSION`
- `META_APP_ID`
- `META_APP_SECRET`
- `PAGE_ID`
- `IG_USER_ID`
- `PAGE_ACCESS_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ASSET_PUBLIC_BASE_URL`
- `SUPABASE_ASSET_BUCKET=scheduler-assets` for Supabase Storage, or storage credentials for R2/S3
- `CRON_SECRET`
- `APP_TIMEZONE=America/Los_Angeles`
- `DRY_RUN=true`
- `LIVE_CRON_ENABLED=false`

## Import the content calendar

Seed the NCS starter calendar in safe mode:

```bash
npm run social:seed
```

Import a custom CSV or JSON file with the raw trusted-admin importer:

```bash
npm run import:calendar -- ./path/to/calendar.csv
```

The CLI import path uses Supabase service-role credentials and is intended only for a trusted owner/admin operator. The `social:seed` command is the safest default for the owner rollout because it forces draft-safe values.

Supported import fields:

- `title`
- `format`
- `pillar`
- `caption`
- `hashtags`
- `cta`
- `scheduled_at`
- `timezone`
- `status`
- `owner_approved`
- `requires_price_verification`
- `price_verified`
- `requires_owner_service_confirmation`
- `owner_service_confirmed`
- `requires_brand_asset_rights`
- `hide_public_product_pricing`

## Run a dry run safely

Keep this configuration:

```bash
DRY_RUN=true
LIVE_CRON_ENABLED=false
```

Then run:

```bash
npm run social:dry-run
```

This checks due posts, publish blockers, asset issues, approval issues, price-verification issues, and Circadia confirmation issues without publishing anything.

## Run the Meta smoke test

CLI:

```bash
npm run social:meta-smoke
```

API:

- `GET /api/meta/smoke-test`

This verifies the required env vars and checks that the configured Instagram business account is reachable without publishing anything.

## Tests and CI

Run locally:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same checks in `.github/workflows/ci.yml`.

## Safe deployment guide

Use the deployment checklist in:

- `docs/social-scheduler-deployment.md`
- `docs/first-post-dry-run.md`

It covers:

- env setup
- migrations
- admin allowlist setup
- storage setup
- Meta setup
- keeping dry run on
- seeding content
- approving the first post
- running the first manual live publish
- enabling live cron only after that succeeds
- rollback and troubleshooting
- Circadia pricing and service-promotion guardrails

## Owner/admin allowlist

Production scheduler access is limited to users in `public.admin_users`.

- `owner` and `admin` can approve, schedule, publish, price-verify, and manage the allowlist
- `editor` can create and edit draft content only
- `viewer` is read-only

Do not give editor accounts owner/admin access unless you trust them to publish live content.

Example seed:

```sql
insert into public.admin_users (email, role)
values ('owner@example.com', 'owner')
on conflict (email) do update set role = excluded.role;
```

Or use the helper:

```bash
npm run social:add-admin -- --email owner@example.com --role owner
```

Only owner/admin can approve, schedule, publish, price-verify, or confirm Circadia service promotion. Editors can create and edit drafts only.

## Pricing reminder

Do not publish Platinum Hydrafacial B3G1 package pricing until the owner confirms the correct price. Seeded package posts are intentionally blocked until the price is verified.

## Circadia compliance reminder

- Circadia is positioned as professional-grade skincare for licensed providers and trusted partners
- do not show public Circadia retail product pricing
- use claim-safe language such as `designed to`, `can help`, `supports`, `great for`, `may improve the look of`, `results vary`, and `book a consult`
- do not use medical or guaranteed-result claims
- only use official Circadia marketing assets if Natalie has approved access and usage rights
- confirm specific Circadia services before posting about SWiCH, Oxygen Rx, MandeliClear, DermaFrost, Calming Facial, or similar branded protocols
