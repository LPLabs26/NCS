# Weekly Operating Schedule

Use this as the current operating rhythm for NCS social. The old three-post-per-day model is retired. Mission Control now supports a lighter review queue while the live scheduler publishes only posts that are approved, owner-approved, scheduled, and fully validated.

## Current automation rhythm

- `7:10 AM PT` daily research draft generator: creates 2 fresh draft ideas and Canva briefs for review.
- Every `15 minutes` live publish checker: skips unless a post is approved, owner-approved, scheduled, validated, and live mode is enabled.
- After `72 hours` with no owner action: fallback may select 1 safe research-generated draft only, then schedule it for the live checker.
- Daily metrics job: collects supported metrics for already-published posts.

## Approval rule

Nothing from Mission Control should be treated as automatically publishable just because it exists in the queue.

Before a post can publish, it must have:

- owner/admin approval in the scheduler dashboard
- valid scheduled date and time
- attached public HTTPS media
- confirmed usage rights
- no package-price blocker
- no Circadia service or brand-asset blocker
- claim-safe caption language

## Daily review workflow

Each day, review the 2 new draft ideas from the generator:

- approve and schedule only the strongest ready post or posts
- leave drafts unapproved if the asset, caption, timing, or compliance is not ready
- use the backlog only as inspiration, not as a required daily slot
- do not recreate the retired morning/midday/evening quota

## Suggested weekly content mix

The goal is steady, useful content without forcing three daily posts.

- Monday: skin reset, Hydrafacial education, or free consult CTA
- Tuesday: SPF, acne, barrier, peel, or Circadia education
- Wednesday: waxing prep, lash lift, brow lamination, or FAQ
- Thursday: service walkthrough, behind-the-scenes, or treatment-room trust
- Friday: openings, social proof, safe review graphic, or weekend booking CTA
- Saturday: event prep, vacation prep, bridal prep, or maintenance routine
- Sunday: next-week planning, homecare education, or consult reminder

## Preferred publish windows

Use these as scheduling suggestions, not fixed quotas:

- Morning education or reminder: `8:30 AM PT`
- Midday service consideration: `12:30 PM PT`
- Evening feature post when there is a truly strong asset: use an owner-approved after-work window

The scheduler can publish at any approved time. The live checker simply wakes up every 15 minutes and publishes due, validated posts.

## Backlog rule

The old evening Circadia hero lane is now backlog. Backlog posts are useful as source material, but they are not part of a three-post daily requirement.

Use backlog posts only when:

- the caption is still claim-safe
- Natalie confirms any specific Circadia service mentioned
- brand asset rights are confirmed
- there is no public Circadia retail pricing
- the post is intentionally approved and scheduled in the app

## Completion rule

Each day should end with:

- 2 fresh ideas reviewed or left safely in draft
- any approved post scheduled in the app, not just marked in the CSV
- blocked posts left unapproved with a clear note
- no accidental second post approved
- no live cron changes unless owner/admin intentionally approves them
