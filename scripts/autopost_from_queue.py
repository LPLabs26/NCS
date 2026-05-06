#!/usr/bin/env python3
import csv
import json
import os
import re
import sys
import tempfile
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from instagrapi import Client
from instagrapi.exceptions import ChallengeRequired, TwoFactorRequired, LoginRequired, BadPassword, PleaseWaitFewMinutes
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
QUEUE_PATH = ROOT / 'docs/ops/instagram-phase-1/content-queue.csv'
CAPTIONS_FALLBACK = ROOT / 'exports/ready-post-queue-week-01/captions.md'
POSTS_JSON = ROOT / 'mission-control/data/approval-posts.json'
SESSION_DIR = Path('/Volumes/Patrice/workspaces/NCS/instagram-session')
RENDER_DIR = Path('/Volumes/Patrice/workspaces/NCS/rendered-assets')
HISTORY_PATH = ROOT / 'logs/instagram-post-history.json'
TZ = ZoneInfo('America/Los_Angeles')
ALLOWED_QUEUE = {'ready_to_post', 'mission_control_ready'}
ALLOWED_APPROVAL = {'approved'}


def load_csv(path: Path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def load_history():
    if not HISTORY_PATH.exists():
        return []
    with open(HISTORY_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_history(items):
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(HISTORY_PATH, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2)


def key_for_row(row):
    return f"{row['publish_date']}|{row['daypart']}|{row['title']}"


def parse_target_dt(row):
    return datetime.strptime(f"{row['publish_date']} {row['target_time_pt']}", '%Y-%m-%d %H:%M').replace(tzinfo=TZ)


def due_rows(rows, history):
    posted_keys = {item['queue_key'] for item in history if 'queue_key' in item}
    now = datetime.now(TZ)
    due = []
    for row in rows:
        if row.get('approval_status') not in ALLOWED_APPROVAL:
            continue
        if row.get('queue_status') not in ALLOWED_QUEUE:
            continue
        queue_key = key_for_row(row)
        if queue_key in posted_keys:
            continue
        target_dt = parse_target_dt(row)
        if target_dt <= now:
            due.append((target_dt, row))
    due.sort(key=lambda x: x[0])
    return [row for _, row in due]


def extract_caption_from_md(path: Path, title: str):
    if not path.exists():
        return ''
    text = path.read_text(encoding='utf-8')
    pattern = re.compile(rf"##\s+\d+\s+{re.escape(title)}\n(?:.|\n)*?(?=\n---\n|\Z)")
    match = pattern.search(text)
    if not match:
        return ''
    block = match.group(0).splitlines()
    lines = []
    for line in block:
        stripped = line.strip()
        if not stripped:
            lines.append('')
            continue
        if stripped.startswith('## ') or stripped.startswith('**Category:**'):
            continue
        lines.append(stripped)
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    return '\n'.join(lines).strip()


def extract_post_json(post_id: str):
    posts = json.loads(POSTS_JSON.read_text(encoding='utf-8'))
    for post in posts:
        if post.get('id') == post_id:
            return post
    return None


def caption_for_row(row):
    source = row.get('caption_source', '')
    if '#' in source and source.split('#', 1)[0].endswith('captions.md'):
        md_path = ROOT / source.split('#', 1)[0]
        caption = extract_caption_from_md(md_path, row['title'])
        if caption:
            return caption
    if source.endswith('.md'):
        caption = extract_caption_from_md(ROOT / source, row['title'])
        if caption:
            return caption
    if 'approval-posts.json#' in source:
        post_id = source.split('#', 1)[1]
        post = extract_post_json(post_id)
        if post and post.get('caption'):
            return post['caption']
    caption = extract_caption_from_md(CAPTIONS_FALLBACK, row['title'])
    if caption:
        return caption
    if 'post.html?id=' in row.get('asset_path', ''):
        post_id = row['asset_path'].split('post.html?id=', 1)[1]
        post = extract_post_json(post_id)
        if post and post.get('caption'):
            return post['caption']
    return ''


def build_post_html(post):
    title = post.get('title', 'NCS Aesthetics')
    category = post.get('category', 'NCS')
    hook = post.get('hook') or title
    body = post.get('body') or post.get('caption') or ''
    cta = post.get('cta') or 'Book now'
    gradient = 'linear-gradient(180deg,#f6efe7 0%,#e9d8cc 100%)'
    combo = f"{post.get('daypart', '')} {category}".lower()
    if 'circadia' in combo or 'evening' in combo:
        gradient = 'linear-gradient(180deg,#efe7f3 0%,#d8c4da 100%)'
    elif 'hydrafacial' in combo or 'midday' in combo:
        gradient = 'linear-gradient(180deg,#fff7f1 0%,#ecd7cc 100%)'
    return f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{{margin:0;background:#ddd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}}
.frame{{width:1080px;height:1350px;position:relative;overflow:hidden;background:{gradient};color:#2e251f}}
.glow{{position:absolute;border-radius:999px;background:rgba(255,255,255,.28)}}
.g1{{width:320px;height:320px;right:-60px;top:80px}}.g2{{width:200px;height:200px;left:120px;top:510px;background:rgba(255,255,255,.18)}}.g3{{width:540px;height:540px;left:-160px;bottom:-160px;background:rgba(255,255,255,.15)}}
.badge{{position:absolute;top:78px;left:78px;background:rgba(255,255,255,.74);padding:12px 22px;border-radius:999px;font-size:28px;letter-spacing:.12em;text-transform:uppercase;font-weight:700}}
.headline{{position:absolute;left:78px;right:100px;top:220px;font-size:104px;line-height:.9;font-weight:700}}
.body{{position:absolute;left:84px;right:120px;top:650px;font-size:42px;line-height:1.22;color:rgba(0,0,0,.72)}}
.cta{{position:absolute;left:78px;bottom:100px;background:#2e251f;color:#fff;padding:28px 42px;border-radius:999px;font-size:34px;font-weight:700}}
.brand{{position:absolute;right:72px;bottom:112px;font-size:28px;color:rgba(0,0,0,.48)}}
</style></head><body><div class="frame"><div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div><div class="badge">{category}</div><div class="headline">{hook}</div><div class="body">{body}</div><div class="cta">{cta}</div><div class="brand">NCS Aesthetics-La Dama Salon</div></div></body></html>'''


def render_html_to_png(html_path: Path, png_path: Path):
    png_path.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1350}, device_scale_factor=1)
        page.goto(html_path.resolve().as_uri(), wait_until='networkidle')
        page.screenshot(path=str(png_path))
        browser.close()


def asset_for_row(row):
    asset_path = row.get('asset_path', '')
    slug = re.sub(r'[^a-z0-9]+', '-', row['title'].lower()).strip('-')
    out_png = RENDER_DIR / f"{row['publish_date']}-{row['daypart'].lower()}-{slug}.png"

    if asset_path.endswith('.html'):
        html_path = ROOT / asset_path
        render_html_to_png(html_path, out_png)
        return out_png

    if 'post.html?id=' in asset_path:
        post_id = asset_path.split('post.html?id=', 1)[1]
        post = extract_post_json(post_id)
        if not post:
            raise RuntimeError(f'Missing post data for {post_id}')
        with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as tmp:
            tmp.write(build_post_html(post))
            tmp_path = Path(tmp.name)
        try:
            render_html_to_png(tmp_path, out_png)
        finally:
            tmp_path.unlink(missing_ok=True)
        return out_png

    raise RuntimeError(f'Unsupported asset path: {asset_path}')


def login_client(username, password):
    cl = Client()
    cl.delay_range = [1, 3]
    settings_path = SESSION_DIR / 'instagrapi-settings.json'
    if settings_path.exists():
        try:
            cl.load_settings(str(settings_path))
        except Exception:
            pass
    logged_in = cl.login(username, password)
    if not logged_in:
        raise RuntimeError('login_failed')
    cl.dump_settings(str(settings_path))
    return cl


def post_row(row, username, password):
    caption = caption_for_row(row)
    if not caption:
        raise RuntimeError(f'No caption found for {row["title"]}')
    photo_path = asset_for_row(row)
    cl = login_client(username, password)
    media = cl.photo_upload(str(photo_path), caption)
    return {
        'queue_key': key_for_row(row),
        'posted_at': datetime.now(TZ).isoformat(),
        'publish_date': row['publish_date'],
        'daypart': row['daypart'],
        'title': row['title'],
        'asset_path': row['asset_path'],
        'rendered_asset': str(photo_path),
        'caption_source': row.get('caption_source', ''),
        'instagram_media_id': str(media.id),
        'instagram_code': media.code,
        'instagram_url': f'https://www.instagram.com/p/{media.code}/',
    }


def main():
    username = os.environ.get('INSTAGRAM_USERNAME', '').strip()
    password = os.environ.get('INSTAGRAM_PASSWORD', '').strip()
    if not username or not password:
        print('ERROR=missing_credentials')
        return 1

    rows = load_csv(QUEUE_PATH)
    history = load_history()
    due = due_rows(rows, history)
    if not due:
        print('NO_DUE_POST=1')
        return 0

    row = due[0]
    print(f"QUEUE_PICK={row['publish_date']} {row['daypart']} {row['title']}")
    try:
        entry = post_row(row, username, password)
    except (ChallengeRequired, TwoFactorRequired):
        print('CODE_REQUIRED=1')
        return 2
    except (BadPassword, PleaseWaitFewMinutes, LoginRequired) as e:
        print(f'ERROR={type(e).__name__}:{e}')
        return 1
    except Exception as e:
        print(f'ERROR={type(e).__name__}:{e}')
        return 1

    history.append(entry)
    save_history(history)
    print('POST_SUCCESS=1')
    print(f"MEDIA_URL={entry['instagram_url']}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
