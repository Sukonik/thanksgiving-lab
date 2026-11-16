from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
required = [
    "index.html", "404.html", "css/site.css", "js/app.js", "js/weather.js",
    "assets/favicon.svg", "site.webmanifest", "robots.txt", "sitemap.xml"
]
missing = [name for name in required if not (root / name).is_file()]
if missing:
    raise SystemExit(f"Missing required files: {', '.join(missing)}")

html = (root / "index.html").read_text(encoding="utf-8")
ids = re.findall(r'\bid="([^"]+)"', html)
duplicates = sorted({item for item in ids if ids.count(item) > 1})
if duplicates:
    raise SystemExit(f"Duplicate IDs: {', '.join(duplicates)}")

for target in re.findall(r'(?:href|src)="([^"]+)"', html):
    if target.startswith(("http", "#", "data:")):
        continue
    path = target.split("?", 1)[0]
    if not (root / path).exists():
        raise SystemExit(f"Broken local reference: {target}")

for text in ["Thanksgiving Lab", "No signup", "Food Lab", "Turkey Weather"]:
    if text not in html:
        raise SystemExit(f"Expected copy missing: {text}")

print(f"Thanksgiving Lab static checks passed: {len(required)} required files, {len(ids)} IDs")
