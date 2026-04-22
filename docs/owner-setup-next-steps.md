# Owner Setup Next Steps

This guide is for the first safe setup of the NCS Instagram scheduler.

## 1. Current safety status

- `DRY_RUN` must stay `true`
- `LIVE_CRON_ENABLED` must stay `false`
- Nothing publishes until an owner/admin approves a post and live mode is intentionally enabled later

## 2. Exact setup order

Run these commands in this order:

```bash
npm ci
npm run social:check
npm run social:add-admin -- --email OWNER_EMAIL --role owner
npm run social:seed
npm run social:meta-smoke
npm run social:check-assets
npm run social:dry-run
```

Run these commands from the repo root. The `social:*` commands automatically load `.env.local` when it is present.

## 3. What the owner still needs to provide

- Supabase project URL
- Supabase service role key
- Supabase anon key
- Owner/admin email
- R2 or S3 storage credentials
- Public HTTPS asset base URL
- Meta app ID
- Meta app secret
- Facebook Page ID
- Instagram User ID
- Page access token
- Confirmation that `ncs.aesthetics` is an Instagram Professional account
- Confirmation that Instagram is connected to a Facebook Page

If the owner is logging in from a different computer during local testing, also set:

- `NEXT_PUBLIC_APP_URL=http://YOUR_MACBOOK_IP:PORT`

Example:

- `NEXT_PUBLIC_APP_URL=http://10.0.0.224:3001`

This makes the magic-link email point back to the MacBook instead of the sender's `localhost`.

## 4. First safe test post recommendation

Recommended first post:

- `Not sure what to book? Start here.`
- `What is Circadia?`

Avoid first test posts with:

- package pricing
- Hydrafacial B3G1 pricing
- before/after photos
- intimate waxing content
- client reviews without permission
- Circadia services requiring confirmation

## 5. First dry-run instructions

1. Upload one owner-approved asset.
2. Confirm asset usage rights.
3. Attach it to one safe draft post.
4. Owner/admin approves exactly one post.
5. Run `npm run social:dry-run`.
6. Confirm no post published.

The expected dry-run ending is:

`DRY RUN COMPLETE — NO POSTS WERE PUBLISHED`

## 6. First live-post instructions for later

- Keep cron disabled.
- Only after owner approval, set `DRY_RUN=false` for one manual live post.
- Publish one owner-approved post manually.
- Confirm it appears correctly.
- Re-enable `DRY_RUN` if anything looks wrong.
- Enable cron only after a successful manual live publish.

## 7. Warnings

- Do not publish Platinum Hydrafacial B3G1 package pricing until the owner confirms the correct price.
- Do not show public Circadia retail product pricing.
- Do not use client before/after photos without consent.
- Do not publish Circadia service claims unless the owner confirms that service is offered.
- Do not give editor accounts publish/admin permissions.

## Owner/admin command once the owner email is known

```bash
npm run social:add-admin -- --email OWNER_EMAIL --role owner
```

Notes:

- The default role is not `owner` unless `--role owner` is passed explicitly.
- Existing allowlist updates require `--confirm-update`.
- Only `owner` and `admin` can approve, schedule, publish, and price-verify.
- `editor` can only create and edit drafts.
- `viewer` cannot edit.
