#!/usr/bin/env python3
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

if len(sys.argv) != 3:
    print("usage: render_post_asset.py input.html output.png", file=sys.stderr)
    sys.exit(1)

input_path = Path(sys.argv[1]).expanduser().resolve()
output_path = Path(sys.argv[2]).expanduser().resolve()
output_path.parent.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=1)
    page.goto(input_path.as_uri(), wait_until="networkidle")
    page.screenshot(path=str(output_path))
    browser.close()

print(output_path)
