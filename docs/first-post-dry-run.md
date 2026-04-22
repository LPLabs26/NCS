# First Post Dry Run

Use this guide for the first safe scheduler test after merge. Nothing in this guide should publish a live Instagram post.

## Step 1

Confirm env values:

- `DRY_RUN=true`
- `LIVE_CRON_ENABLED=false`

## Step 2

Run:

```bash
npm run social:check
```

Review the PASS, WARN, and FAIL lines. Fix the FAIL items before moving on.

## Step 3

Add the first owner/admin:

```bash
npm run social:add-admin -- --email OWNER_EMAIL --role owner
```

Only owner/admin can approve, schedule, price-verify, or publish.

## Step 4

Seed content:

```bash
npm run social:seed
```

This keeps the imported calendar in safe draft mode.

## Step 5

Upload one approved asset in the admin UI.

## Step 6

Confirm usage rights on that asset before attaching it to a post.

## Step 7

Choose one safe test post.

Recommended first tests:

- `What is Circadia?`
- `Not sure what to book? Start here.`

Avoid first test posts with:

- package pricing
- before/after photos
- intimate waxing content
- Circadia service claims requiring owner confirmation
- client reviews without permission

## Step 8

Owner/admin approves exactly one post.

Editors can still prepare drafts, but they cannot move a post into a publishable state.

## Step 9

Run:

```bash
npm run social:dry-run
```

Expected result:

`DRY RUN COMPLETE — NO POSTS WERE PUBLISHED`

## Step 10

Do not set `DRY_RUN=false` until the owner intentionally approves one manual live test.

Keep cron disabled until after that manual live publish succeeds.

## Roll back quickly

If anything feels off:

1. Set `LIVE_CRON_ENABLED=false`
2. Set `DRY_RUN=true`
3. Remove owner approval from the test post or return it to `draft`
4. Pause any external cron job
5. Fix the blocker before retrying

## Troubleshooting

### Missing assets

- Make sure the post has attached media
- confirm the asset `public_url` starts with `https://`
- confirm `usage_rights_confirmed=true`
- run `npm run social:check-assets`

### Meta token or account issues

- run `npm run social:meta-smoke`
- confirm the Instagram account is Professional
- confirm it is connected to the correct Facebook Page
- confirm the token has the required permissions
- confirm the token is not expired
- confirm `IG_USER_ID` matches the connected account

## Pricing reminders

- Confirm the Platinum Hydrafacial B3G1 price before any package-price post goes live
- Do not show public Circadia product pricing
