# Instagram Phase 1 Strategy

## Goal

Increase posting consistency and engagement without adding a heavy system.

Phase 1 does that by making the repo the control layer:

- plan the week in-repo
- approve content before scheduling
- post manually from approved assets
- log what happened
- adjust only when the numbers justify it

## What Phase 1 is and is not

Phase 1 is:

- a repo-native queue
- a fixed weekly operating rhythm
- an approval-first posting workflow
- a lightweight review loop

Phase 1 is not:

- direct Instagram API publishing
- a promise of full auto-posting
- a replacement for Natalie approval

## Source of truth

- `docs/content/daily-content-cadence.md` defines the three-lane model
- `docs/automation/approval-workflow.md` defines approval rules
- `docs/ops/instagram-phase-1/content-queue.csv` is the live weekly queue
- `mission-control/` is the approval wall and post viewer

## Posting windows

Start with the existing repo windows and tune only after review:

- Morning Daily Tips: `8:30 AM PT`
- Midday Hydrafacial: `12:30 PM PT`
- Evening Circadia hero: `7:30 PM PT`

Adjustment rule:

- do not move a window after one weak day
- move a window by at most 30 minutes
- only change a window after two straight weeks of weak completion or weak engagement

## Cadence design

Every day still has three slots:

1. Morning: Daily Tips
2. Midday: Hydrafacial
3. Evening: Circadia hero

The load is intentionally uneven:

- Morning is story-first or quick-static-first
- Midday is the service consideration slot
- Evening gets the strongest packaging of the day

That means the system stays consistent without forcing every slot to be a high-production feed post.

## Engagement rules by lane

### Morning: Daily Tips

Primary job:

- create a fast value touch
- earn replies saves or story taps

Best formats:

- 1 to 3 story frames
- simple talking story
- single-slide static

Keep:

- one idea only
- one soft CTA
- low-friction approval

Avoid:

- dense captions
- hard selling
- vague inspiration with no skincare value

### Midday: Hydrafacial

Primary job:

- reduce hesitation
- clarify who the service is for
- create booking intent

Best formats:

- short carousel
- FAQ story
- short reel
- comparison graphic

Keep:

- one Hydrafacial angle at a time
- one objection answered per post
- a calm but clear CTA

Avoid:

- repeating the same glow promise daily
- turning every post into a price sheet

### Evening: Circadia hero

Primary job:

- drive the strongest engagement of the day
- deepen trust
- support homecare and retention

Best formats:

- reel
- premium carousel
- richer story-led education post

Keep:

- the best hook of the day
- stronger visual direction
- save-worthy or share-worthy utility

Avoid:

- product pushing
- abstract luxury language
- weak captions on the hero slot

## Approval-first automation loop

Phase 1 automation is operational, not technical:

1. Fill next week's slots in `content-queue.csv`.
2. Batch approvals using the existing approval workflow.
3. Schedule or manually post only approved items.
4. Confirm what actually went live.
5. Log results in `performance-log.csv`.
6. Tune next week based on what repeated, stalled, or converted.

This keeps automation real:

- the queue removes guesswork
- approvals stay controlled
- posting stays reliable
- the team learns weekly

## Minimum weekly operating standard

Each week should hit:

- 7 filled morning slots
- 7 filled midday slots
- 7 filled evening slots
- at least 3 evening hero assets approved 48 hours early
- at least 1 interaction prompt per day

Interaction prompts can be:

- reply prompts
- question stickers
- save-this reminders
- DM keyword prompts

## Fallback rules

If the ideal asset is not ready:

- morning falls back to a story tip
- midday falls back to a Hydrafacial FAQ story
- evening falls back to the best approved Circadia backlog post

Never leave the evening slot empty if an approved Circadia backlog asset exists.

## Queue rules

Every row in `content-queue.csv` should answer:

- when it should publish
- what lane it belongs to
- whether it is approved
- whether an asset exists
- where the asset lives
- what result matters most

Use two explicit status fields:

Approval status:

- `draft_ready`
- `needs_review`
- `approved`

Queue status:

- `backlog`
- `needs_approval`
- `mission_control_ready`
- `ready_to_post`
- `posted`

## What to optimize first

Do not optimize everything at once. In Phase 1, review these first:

1. Completion rate by lane
2. Which evening hook generated the strongest saves or replies
3. Which midday Hydrafacial angle drove DMs or booking taps
4. Which morning tips earned real interaction instead of passive views

## Exit condition for Phase 2

Phase 1 is working when:

- the queue stays at least 7 days ahead
- approvals happen in batches instead of random pings
- Patrice can post without hunting for assets
- weekly review ends with one clear timing or content adjustment
