#!/usr/bin/env python3
"""Pre-deploy checks for the Studio Lab static site.

Enforces the invariants established during the production-readiness work
(see docs/REMEDIATION-PLAN.md). Run from the repo root:

    python3 tools/verify_site.py

Exits non-zero if any check fails. No third-party dependencies.
"""
import re, os, sys, json

BASE = "https://studio-lab-nodarse.github.io/studio-lab-catalog/"
PAGES = [
    "index.html",
    "apps/catalog/index.html",
    "apps/storefront/index.html",
    "apps/storefront/gorras.html",
    "apps/storefront/magnets.html",
    "apps/storefront/stickers.html",
    "apps/storefront/colecciones/miami.html",
    "apps/storefront/colecciones/cuban-american.html",
    "apps/storefront/colecciones/miami-beach.html",
]
BRAND_ASSETS = ["assets/favicon.png", "assets/apple-touch-icon.png", "assets/og/default.jpg"]
PAGE_SIZE_BUDGET = 800 * 1024  # bytes; catches a re-pasted export / re-inlined images

errors = []
def err(msg): errors.append(msg)

def read(p):
    with open(p, encoding="utf-8", errors="replace") as f:
        return f.read()

# 0. all expected pages present
for p in PAGES:
    if not os.path.isfile(p):
        err(f"[missing-page] {p}")
present = [p for p in PAGES if os.path.isfile(p)]

# 1. page size budget
for p in present:
    sz = os.path.getsize(p)
    if sz > PAGE_SIZE_BUDGET:
        err(f"[size] {p} = {sz//1024}KB exceeds {PAGE_SIZE_BUDGET//1024}KB budget (images re-inlined? fresh export pasted?)")

# 2. no inline raster base64 (must stay externalized in assets/img/)
raster = re.compile(r"data:image/(?:jpeg|jpg|png|webp|gif);base64,")
for p in present:
    n = len(raster.findall(read(p)))
    if n:
        err(f"[base64] {p} has {n} inline raster image(s); externalize to assets/img/")

# 3. relative internal links (.html) and relative asset refs resolve
rel_html = re.compile(r"""["']((?!https?:|mailto:|tel:|//|#)[A-Za-z0-9_.\-/]+?\.html)(?:#[^"']*)?["']""")
rel_asset = re.compile(r"((?:\.\./)+assets/[A-Za-z0-9_./\-]+)")
for p in present:
    d = os.path.dirname(p); s = read(p)
    for m in set(rel_html.findall(s)):
        if not os.path.isfile(os.path.normpath(os.path.join(d, m))):
            err(f"[link] {p} -> {m} (target file missing)")
    for m in set(rel_asset.findall(s)):
        if not os.path.isfile(os.path.normpath(os.path.join(d, m))):
            err(f"[asset] {p} -> {m} (missing)")

# 4. absolute site URLs (canonical, og:url, footer, breadcrumbs, sitemap) map to real files
abs_url = re.compile(re.escape(BASE) + r"[^\"'\s<>)]*")
def base_to_file(u):
    path = u[len(BASE):].split("#")[0].split("?")[0]
    if path == "" or path.endswith("/"):
        return os.path.join(path, "index.html")
    return path
for p in present + ["sitemap.xml", "robots.txt"]:
    if not os.path.isfile(p):
        continue
    for u in set(abs_url.findall(read(p))):
        f = base_to_file(u)
        if not os.path.isfile(f):
            err(f"[url] {p} -> {u} (no file {f})")

# 5. per-page SEO essentials
for p in present:
    s = read(p)
    if s.count("<title>") != 1:
        err(f"[seo] {p} has {s.count('<title>')} <title> tags (want 1)")
    for need, label in [('rel="canonical"', "canonical"), ("og:title", "og:title"),
                        ('lang="es"', 'lang=\"es\"')]:
        if need not in s:
            err(f"[seo] {p} missing {label}")

# 6. JSON-LD blocks parse
ld = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
for p in present:
    for i, block in enumerate(ld.findall(read(p))):
        try:
            json.loads(block)
        except Exception as e:
            err(f"[jsonld] {p} block {i}: {e}")

# 7. brand + ops assets exist
for a in BRAND_ASSETS:
    if not os.path.isfile(a):
        err(f"[assets] missing {a}")
for a in ["robots.txt", "sitemap.xml", "404.html", ".nojekyll"]:
    if not os.path.isfile(a):
        err(f"[ops] missing {a}")

if errors:
    print(f"FAIL — {len(errors)} issue(s):")
    for e in errors:
        print("  " + e)
    sys.exit(1)
print(f"OK — {len(present)} pages checked, all invariants hold.")
