# Instagram Operations Strategy

## Goal

Keep NCS Aesthetics visible, useful, and booking-focused without turning the account into a noisy three-post-per-day machine.

The current system is:

- plan content in the scheduler
- generate 2 fresh draft ideas daily for review
- approve only posts that are actually ready
- publish only approved, owner-approved, scheduled, validated posts
- collect metrics and adjust weekly

## What this system is and is not

This system is:

- an approval-first social operating system
- a dry-run-tested official Instagram Graph API publisher
- a scheduler for owner-approved posts
- a daily idea generator and Canva brief workflow
- a lightweight review loop for Natalie and the operator

This system is not:

- a requirement to publish three times per day
- a license to publish drafts without owner/admin approval
- a scraping or password-login Instagram tool
- a replacement for claim, consent, price, or brand-rights review

## Source of truth

- The live app dashboard is the source of truth for publishable status.
- `docs/ops/instagram-phase-1/content-queue.csv` is legacy Mission Control queue context.
- `mission-control/` is an approval wall and backlog viewer, not the live publishing authority.
- Patrice automation creates drafts, checks due approved posts, collects metrics, and runs fallback rules.

## Operating rhythm

- `7:10 AM PT`: create 2 fresh research-based draft posts and Canva briefs.
- Every `15 minutes`: live publish checker scans for due approved posts.
- After `72 hours` with no future owner-approved scheduled posts: fallback may pick 1 safe research-generated draft only.
- Daily metrics: collect supported insights for published posts.

The live checker is a gate, not a quota. If no approved post is due, it skips.

## Scheduling windows

Use these as preferred scheduling windows, not mandatory slots:

- `8:30 AM PT`: quick education, SPF, skin habit, or story-style tip
- `12:30 PM PT`: service consideration, Hydrafacial, facial, waxing, lashes, or brows
- after-work feature window: stronger post only when the asset and caption deserve it

Do not move timing because of one weak day. Review at least two weeks of performance before making a timing change.

## Content pillars

### Hydrafacial authority

Purpose:

- make Natalie the obvious local Hydrafacial expert
- explain treatment levels without sounding salesy
- support maintenance bookings and event-prep bookings

Use:

- Express vs Hydrafacial vs Platinum
- extractions and hydration education
- Fresno heat, SPF, congestion, and texture
- maintenance schedule education

Avoid:

- guaranteed glow claims
- package pricing until verified
- turning every post into a price sheet

### Fresno skin education

Purpose:

- become the local skincare voice for Fresno, Clovis, North Fresno, River Park, and Woodward Park
- connect sun, heat, SPF, sweat, smoke, and dust to practical skincare

Use:

- SPF reapplication
- barrier support
- summer congestion
- pigment prevention language
- consult-first recommendations

### Circadia Pro Skin Systems

Purpose:

- position Natalie as educated, custom-treatment focused, and product-plan oriented
- support custom facials, peels, barrier support, acne support, pigmentation education, and homecare planning

Use:

- protect by day, repair by night
- professional skincare education
- homecare planning
- chemical peel consult requirements
- barrier support and calming language

Guardrails:

- do not publicly show Circadia retail product pricing
- use official Circadia marketing assets only with Natalie-approved usage rights
- require owner confirmation before promoting specific Circadia services such as SWiCH, Oxygen Rx, MandeliClear, DermaFrost, or Calming Facial
- avoid medical or guaranteed-result claims

### Waxing comfort and prep

Purpose:

- reduce anxiety and drive waxing bookings
- keep language comfort-first and consent-aware

Use:

- first-wax expectations
- prep and aftercare checklists
- vacation and event timing
- ingrown prevention education

Avoid:

- intimate details without explicit consent
- before/after intimate waxing content

### Lashes and brows

Purpose:

- convert low-maintenance beauty clients
- keep lashes and brows visible beside skincare

Use:

- lash lift with tint
- brow lamination
- aftercare
- who is a good candidate

### Proof and personality

Purpose:

- build trust in Natalie and the NCS experience
- show comfort, education, and care

Use:

- treatment-room clips
- meet Natalie
- safe client review graphics with permission
- sanitized behind-the-scenes

Avoid:

- identifiable client reviews without permission
- before/after photos without written consent
- minors without guardian consent

## Approval-first publishing loop

1. Draft ideas are created by the daily generator or manually in the app.
2. Assets are made in Canva or generated as NCS-owned originals.
3. Media is uploaded to storage with public HTTPS URLs.
4. Usage rights are confirmed.
5. Natalie or an owner/admin approves and schedules the post.
6. The live checker publishes only if every safety gate passes.
7. Metrics are collected and reviewed.

## Minimum weekly operating standard

A healthy week should aim for:

- 14 fresh draft ideas generated
- 3 to 5 strong owner-approved feed posts scheduled
- daily stories or lightweight manual touches when practical
- at least 1 Hydrafacial education post
- at least 1 Circadia/homecare education post
- at least 1 lashes, brows, waxing, or proof/personality post

This is a quality target, not a forced publishing quota.

## Fallback rules

If there is no owner action for 72 hours:

- fallback may select 1 safe research-generated draft only
- fallback must avoid package pricing, client permission issues, sensitive waxing content, and unresolved Circadia blockers
- fallback still requires valid public HTTPS media and usage rights
- fallback does not approve arbitrary legacy seed posts

If no safe fallback exists, the system should skip.

## Queue rules

Every publishable post in the live app should answer:

- what is the caption and CTA?
- what asset is attached?
- are usage rights confirmed?
- has owner/admin approved it?
- when is it scheduled?
- does it have any price, service-confirmation, or brand-rights blocker?

Legacy Mission Control rows may still be useful for content ideas, but only the app's approved/scheduled state controls live publishing.

## What to optimize first

Review these first:

1. Which hooks create saves, replies, and booking-intent taps
2. Which Hydrafacial posts drive consult or booking behavior
3. Which Circadia posts improve trust without sounding product-pushy
4. Which timing windows actually perform for the local audience
5. Whether the 72-hour fallback is helping or should stay conservative

## Operating principle

The system should feel active, not frantic. Two good daily drafts plus selective approval is stronger than filling an old quota.
