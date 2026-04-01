# Instagram Autopost (Local Mac Mini)

This setup posts approved NCS Instagram queue items directly from the Mac Mini using the saved Instagram session.

## Source of truth
- Queue: `docs/ops/instagram-phase-1/content-queue.csv`
- Approved states used for autopost:
  - `approval_status = approved`
  - `queue_status = ready_to_post` or `mission_control_ready`

## Local scripts
- `scripts/render_post_asset.py` — renders standalone HTML post assets to PNG
- `scripts/instagram_api_post.py` — uploads one rendered image post to Instagram using the saved session
- `scripts/autopost_from_queue.py` — picks the next due approved queue item, renders it if needed, uploads it, and logs the result
- `scripts/run_instagram_autopost.sh` — shell wrapper that loads the Hermes venv plus local Instagram credentials and runs the autopost script

## Local machine files
- Credentials env: `/Volumes/Patrice/workspaces/NCS/instagram-session/credentials.env`
- Saved Instagram session: `/Volumes/Patrice/workspaces/NCS/instagram-session/instagrapi-settings.json`
- Rendered assets: `/Volumes/Patrice/workspaces/NCS/rendered-assets/`
- Post history log: `logs/instagram-post-history.json`
- Runtime log: `logs/instagram-autopost.log`

## Schedule
LaunchAgent:
- `~/Library/LaunchAgents/com.ncs.instagram-autopost.plist`

Run times:
- 8:30 AM PT
- 12:30 PM PT
- 7:30 PM PT

## Important behavior
- The autopost flow skips anything already recorded in `instagram-post-history.json`
- The posting session should reduce repeated SMS codes, but Instagram can still invalidate the session and require fresh verification
- This is a practical local automation path, not the official Meta publishing API

## Better long-term option
Meta Business Suite is usually the better official long-term scheduler for a professional Instagram account, and the core suite is free.
