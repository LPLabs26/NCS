# Social Scheduler Deployment

This checklist keeps the NCS Instagram scheduler safe while moving from local setup to the first real publish.

## Required env vars

Set these in Vercel, your local `.env.local`, and any CI environment that needs them:

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
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`
- or `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET`
- `CRON_SECRET`
- `APP_TIMEZONE=America/Los_Angeles`
- `DRY_RUN=true`
- `LIVE_CRON_ENABLED=false`

## Supabase migration

Apply both migrations:

1. `supabase/migrations/20260420_initial_schema.sql`
2. `supabase/migrations/20260420_01_scheduler_hardening.sql`
3. `supabase/migrations/20260420_02_post_role_safety.sql`

## Admin allowlist

Production access fails closed unless auth is configured and the user is in `admin_users`.

Role model:

- `owner` and `admin`: can approve, schedule, publish, price-verify, and manage admin access
- `editor`: can create and edit drafts only
- `viewer`: read-only

Do not upgrade editor accounts to owner/admin unless they are trusted to control live publishing.

Example owner seed:

```sql
insert into public.admin_users (email, role)
values ('owner@example.com', 'owner')
on conflict (email) do update set role = excluded.role;
```

If you already know the Supabase auth user id, add `user_id` too.

## Public asset URL requirement

Meta fetches media by URL. Every image or video must have a public HTTPS URL.

- R2/S3 objects must be reachable over HTTPS
- `ASSET_PUBLIC_BASE_URL` must point to the public asset domain
- do not attempt local-only URLs, signed URLs that expire too quickly, or HTTP URLs

## Meta setup requirements

Use official Meta and Instagram Graph API setup only.

- Connect the Facebook Page and Instagram business/professional account
- confirm `IG_USER_ID` matches the connected Instagram business account
- use a valid long-lived `PAGE_ACCESS_TOKEN`
- verify permissions before enabling live publishing
- never scrape Instagram
- never automate browser login
- never store Instagram passwords

Run the safe smoke test before any live publish:

```bash
npm run smoke:meta
```

Or call:

- `GET /api/meta/smoke-test`

The smoke test does not publish anything.

## Keep dry run on

Leave this in every environment until the owner approves the first live test:

```bash
DRY_RUN=true
LIVE_CRON_ENABLED=false
```

## Seed content

Seed the starter calendar:

```bash
npm run import:calendar
```

Import a custom CSV or JSON calendar:

```bash
npm run import:calendar -- ./path/to/calendar.csv
```

This CLI import path uses Supabase service-role credentials and should only be run by a trusted owner/admin operator.

Supported import columns:

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

## Upload asset safely

1. Open the post editor in `/admin/posts/[id]`
2. Upload the image or video
3. Confirm `usage_rights_confirmed`
4. Make sure the asset shows a public HTTPS URL
5. Attach the asset to the post

Do not upload before-and-after content, identifiable reviews, or intimate waxing content without explicit written consent.

## Approve one post

1. Open a post in the editor
2. Attach valid media
3. Check `Owner approval required`
4. If the post references a package price, also check `Requires price verification`
5. Only check `Price verified` after the owner confirms the price
6. Save the post as `approved` or `scheduled`

Editors can still prepare captions, hashtags, CTAs, assets, and draft schedule times, but only owner/admin can move a post into an approved or scheduled publishable state.

## Manual dry run

With `DRY_RUN=true`, use the post editor's publish button or call:

- `GET /api/cron/publish` with `Authorization: Bearer <CRON_SECRET>`

This validates the post and logs what would have been published without sending anything live.

## First live publish

Only after the owner approves one real post:

1. Keep `LIVE_CRON_ENABLED=false`
2. Change `DRY_RUN=false`
3. Use the manual publish button on one owner-approved post
4. Check the first-live confirmation box
5. Confirm the published permalink and media id are stored

Do not enable live cron until this succeeds.

## Enable live cron after the first manual live success

After one successful manual live publish:

1. Leave `DRY_RUN=false`
2. Set `LIVE_CRON_ENABLED=true`
3. Confirm cron requests include `CRON_SECRET`
4. Watch the next scheduled publish and metrics collection closely

## Rollback plan

If anything looks wrong:

1. Set `LIVE_CRON_ENABLED=false`
2. Set `DRY_RUN=true`
3. Pause external cron jobs
4. Review the failed post's stored error message
5. Fix media, auth, or permissions before retrying

## Common Meta errors

- `Unsupported post request`
  Check `IG_USER_ID`, permissions, and Page to Instagram linkage.
- `Invalid OAuth access token`
  Refresh the Page token and make sure the correct token is deployed.
- `URL is not publicly accessible`
  Fix asset storage and confirm the public URL is HTTPS and reachable.
- `Container did not finish processing in time`
  Re-check file type, dimensions, duration, and video size.
- `Object does not exist`
  Make sure the Instagram business account is connected to the same Page as the token.

## Pricing reminder

Do not publish Platinum Hydrafacial B3G1 package pricing until the owner confirms the correct price. Seeded package posts are intentionally blocked by `requires_price_verification=true`.
