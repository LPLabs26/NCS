# NCS

Operating system for NCS Aesthetics.

This repo is structured to support:
- brand strategy
- content planning
- daily pulse checks
- booking gap-fill marketing
- autonomous Instagram team operations
- approval and scheduling workflows
- competitive research
- SOPs for a luxury, high-touch esthetics business

## Core content system

The repo now follows one exact daily publishing model:
- **Morning:** Daily Tips
- **Midday:** Hydrafacial
- **Evening:** Circadia

Operating rule:
- morning and midday are lighter touches
- evening is the hero post

That model should be reflected in docs, templates, and Mission Control seeded data.

## Structure

- `docs/brand/` — positioning, offer strategy, voice, audience
- `docs/content/` — content pillars, hooks, calendar, caption systems
- `docs/automation/` — pulse checks, workflows, recurring tasks
- `docs/ops/` — SOPs and operating procedures
- `research/competitors/` — competitor notes and tracking
- `research/trends/` — skincare trend notes and briefs
- `templates/` — reusable post, story, and brief templates
- `mission-control/` — lightweight content dashboard demo

## Initial objective

Build a lightweight but scalable executive assistant + social media operating system for Natalie Sanchez and NCS Aesthetics.

## Mission Control

A lightweight internal web app lives in `mission-control/`.

- Uses plain HTML/CSS/JS
- Uses browser `localStorage` for temporary persistence
- Supports an approval-first Instagram content pipeline
- Seeds demo data that follows the Daily Tips / Hydrafacial / Circadia daypart system
- Intended for phone/PC access once hosted
- A real backend can be added later

## Internal site

A clearer front door lives in `site/`.

- Explains the publishing model and approval workflow
- Links directly into Mission Control and supporting docs
- Summarizes the daily operating rhythm and key repo references

## Run locally

Because this repo is static, the quickest way to view it is to open the HTML files directly in a browser:

- `site/index.html`
- `mission-control/index.html`

Or serve the repo root with any tiny local web server, for example:

```bash
cd /Users/jorgesanchez/Desktop/NCS
python3 -m http.server 8080
```

Then visit:

- `http://localhost:8080/site/`
- `http://localhost:8080/mission-control/`
