#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from instagrapi import Client
from instagrapi.exceptions import ChallengeRequired, TwoFactorRequired, LoginRequired, BadPassword, PleaseWaitFewMinutes

if len(sys.argv) != 4:
    print("usage: instagram_api_post.py <username> <password> <photo_path>", file=sys.stderr)
    sys.exit(1)

username = sys.argv[1]
password = sys.argv[2]
photo_path = str(Path(sys.argv[3]).expanduser().resolve())
caption = os.environ.get("INSTAGRAM_CAPTION", "").strip()
code = os.environ.get("INSTAGRAM_CODE", "").strip()
settings_path = Path("/Volumes/Patrice/workspaces/NCS/instagram-session/instagrapi-settings.json")
settings_path.parent.mkdir(parents=True, exist_ok=True)

cl = Client()
cl.delay_range = [1, 3]

if settings_path.exists():
    try:
        cl.load_settings(str(settings_path))
    except Exception:
        pass


def challenge_code_handler(username, choice):
    if code:
        return code
    raise RuntimeError("CODE_REQUIRED")

cl.challenge_code_handler = challenge_code_handler

try:
    logged_in = False
    if settings_path.exists():
        try:
            logged_in = cl.login(username, password)
        except LoginRequired:
            logged_in = False
    if not logged_in:
        cl = Client()
        cl.delay_range = [1, 3]
        cl.challenge_code_handler = challenge_code_handler
        logged_in = cl.login(username, password)

    if not logged_in:
        print("ERROR=login_failed")
        sys.exit(1)

    cl.dump_settings(str(settings_path))
    media = cl.photo_upload(photo_path, caption)
    print(f"POST_SUCCESS=1")
    print(f"MEDIA_ID={media.id}")
    print(f"MEDIA_CODE={media.code}")
    print(f"MEDIA_URL=https://www.instagram.com/p/{media.code}/")
except RuntimeError as e:
    if str(e) == "CODE_REQUIRED":
        print("CODE_REQUIRED=1")
        sys.exit(2)
    raise
except (ChallengeRequired, TwoFactorRequired) as e:
    print(f"CODE_REQUIRED=1")
    print(f"DETAIL={type(e).__name__}")
    sys.exit(2)
except BadPassword:
    print("ERROR=bad_password")
    sys.exit(1)
except PleaseWaitFewMinutes:
    print("ERROR=rate_limited")
    sys.exit(1)
except Exception as e:
    print(f"ERROR={type(e).__name__}:{e}")
    sys.exit(1)
