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
ORDER_EMAIL = "jesusnodarse1823@gmail.com"   # live order destination (SITE-CONFIG.md)
WHATSAPP = "17864834268"                     # canonical WhatsApp number, digits only
ORDER_JS = "assets/order.js"                 # shared FormSubmit capture script
APP_PAGES = [p for p in PAGES if p != "index.html"]  # order-form pages (root landing has none)
BRAND_CSS = "assets/brand.css"               # shared Miami Peculiar tokens + footer
# category/collection pages that consume the shared brand stylesheet (the hub
# uses its own shadcn tokens; catalog/root are a separate surface)
THEMED_PAGES = [
    "apps/storefront/gorras.html", "apps/storefront/magnets.html",
    "apps/storefront/stickers.html", "apps/storefront/colecciones/miami.html",
    "apps/storefront/colecciones/cuban-american.html", "apps/storefront/colecciones/miami-beach.html",
]
BRAND_TOKENS = ["--bg", "--accent", "--text", "--card", "--border", "--mataqua"]  # must be defined in BRAND_CSS

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

# 5b. order-email regression: the old personal address must never reappear
OLD_ORDER_EMAIL = "nodarsesartsllc@gmail.com"
for p in present:
    if OLD_ORDER_EMAIL in read(p):
        err(f"[order-email] {p} still references {OLD_ORDER_EMAIL} (orders go to jesusnodarse1823@gmail.com)")

# 6. JSON-LD blocks parse
ld = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)
for p in present:
    for i, block in enumerate(ld.findall(read(p))):
        try:
            json.loads(block)
        except Exception as e:
            err(f"[jsonld] {p} block {i}: {e}")

# 6b. shared order-capture script: exists, wired on every app page, points at ORDER_EMAIL
if not os.path.isfile(ORDER_JS):
    err(f"[order-js] missing {ORDER_JS}")
else:
    ojs = read(ORDER_JS)
    if f"formsubmit.co/ajax/{ORDER_EMAIL}" not in ojs:
        err(f"[order-js] {ORDER_JS} FormSubmit endpoint != ORDER_EMAIL ({ORDER_EMAIL})")
src_ref = re.compile(r'<script src="((?:\.\./)+assets/order\.js)"></script>')
for p in APP_PAGES:
    if p not in present:
        continue
    d = os.path.dirname(p); s = read(p)
    refs = src_ref.findall(s)
    if not refs:
        err(f"[order-js] {p} does not load {ORDER_JS} (order capture broken)")
    for m in refs:
        if os.path.normpath(os.path.join(d, m)) != os.path.normpath(ORDER_JS):
            err(f"[order-js] {p} -> {m} does not resolve to {ORDER_JS}")
    # no re-inlined FormSubmit endpoint should remain in the page itself
    if "formsubmit.co/ajax/" in s:
        err(f"[order-js] {p} inlines a FormSubmit endpoint; it must live only in {ORDER_JS}")

# 6c. contact-channel drift: order email present, WhatsApp number consistent
for p in present:
    s = read(p)
    if ("mailto:" in s or "contactPoint" in s) and ORDER_EMAIL not in s and p != "index.html":
        err(f"[contact] {p} has a mailto/contactPoint but no {ORDER_EMAIL}")
    for m in set(re.findall(r"wa\.me/(\d+)", s)):
        if m != WHATSAPP:
            err(f"[contact] {p} -> wa.me/{m} (want {WHATSAPP})")

# 6d. sitemap covers every canonical page URL
if os.path.isfile("sitemap.xml"):
    sm = read("sitemap.xml")
    for p in PAGES:
        d = os.path.dirname(p)
        canon = BASE + ("" if p == "index.html" else (d + "/" if os.path.basename(p) == "index.html" else p))
        if canon not in sm:
            err(f"[sitemap] missing <loc> for {canon}")

# 6e. shared-block drift: the footer and the Organization JSON-LD node are
#     copy-pasted (identical) on every page; catch a one-page edit that skews them.
def footer_block(s):
    m = re.search(r'<footer class="sl-sitefooter".*?</footer>', s, re.S)
    if not m:
        return None
    # normalize: the footer CSS is inline on some pages (catalog/root/hub) and
    # externalized to brand.css on the themed pages — compare the nav/links only,
    # ignoring inline <style> and inter-tag whitespace.
    b = re.sub(r'<style>.*?</style>', '', m.group(0), flags=re.S)
    return re.sub(r'>\s+<', '><', b).strip()
def org_node(s):
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            data = json.loads(b)
        except Exception:
            continue
        graph = data.get("@graph", [data]) if isinstance(data, dict) else data
        for n in (graph if isinstance(graph, list) else [graph]):
            if isinstance(n, dict) and ("legalName" in n or str(n.get("@id", "")).endswith("#org")):
                return json.dumps(n, sort_keys=True)
    return None
for label, extract in [("footer", footer_block), ("org-jsonld", org_node)]:
    seen = {}
    for p in present:
        v = extract(read(p))
        if v is None:
            err(f"[{label}] {p} has no {label} block")
        else:
            seen.setdefault(v, []).append(p)
    if len(seen) > 1:
        variants = " | ".join(f"{len(ps)}×[{ps[0]}…]" for ps in seen.values())
        err(f"[{label}] block diverged across pages: {variants}")

# 6f. every cross-origin <script src="https://…"> must be pinned with SRI (integrity)
ext_script = re.compile(r'<script\b[^>]*\bsrc="https?://[^"]+"[^>]*>')
for p in present:
    for tag in ext_script.findall(read(p)):
        if "integrity=" not in tag:
            err(f"[sri] {p} loads an external script without integrity: {tag[:90]}…")

# 6g. shared brand stylesheet: exists, defines the tokens + footer, wired on themed pages
if not os.path.isfile(BRAND_CSS):
    err(f"[brand-css] missing {BRAND_CSS}")
else:
    bc = read(BRAND_CSS)
    for tok in BRAND_TOKENS:
        if f"{tok}:" not in bc:
            err(f"[brand-css] {BRAND_CSS} does not define {tok}")
    if ".sl-sitefooter" not in bc:
        err(f"[brand-css] {BRAND_CSS} missing shared .sl-sitefooter footer styles")
brand_ref = re.compile(r'<link[^>]+href="((?:\.\./)+assets/brand\.css)"')
for p in THEMED_PAGES:
    if p not in present:
        continue
    d = os.path.dirname(p); s = read(p)
    refs = brand_ref.findall(s)
    if not refs:
        err(f"[brand-css] {p} does not link {BRAND_CSS} (tokens/footer would be undefined)")
    for m in refs:
        if os.path.normpath(os.path.join(d, m)) != os.path.normpath(BRAND_CSS):
            err(f"[brand-css] {p} -> {m} does not resolve to {BRAND_CSS}")
    # the token block must no longer be re-inlined (single source of truth)
    if re.search(r':root\{[^}]*--bg:#081420', s):
        err(f"[brand-css] {p} still inlines the Miami :root token block; it lives in {BRAND_CSS}")

# 6h. unified masthead: every themed page shares the same header lockup + nav
hdr_re = re.compile(r'<header>.*?</header>', re.S)
for p in THEMED_PAGES:
    if p not in present:
        continue
    m = hdr_re.search(read(p))
    if not m:
        err(f"[header] {p} has no <header> block"); continue
    h = m.group(0)
    need = ['class="logo-mark"', 'MIAMI <b>PECULIAR</b>', 'class="logo-sub"',
            'class="hdr-nav"', 'class="lang-toggle"', 'brand-home',
            'class="mnav-toggle"', 'class="mnav-btn"']
    for token in need:
        if token not in h:
            err(f"[header] {p} masthead missing `{token}`")
    for label in ("Gorras", "Magnets", "Stickers"):
        if f">{label}</a>" not in h:
            err(f"[header] {p} masthead nav missing {label} link")

# 6i. bilingual attrs must hold valid HTML: a data-es/data-en value that contains
#     a double-quoted tag (e.g. <span class="em">) terminates the attribute early
#     and renders as garbage. The correct form uses single quotes inside.
broken_i18n = re.compile(r'data-(?:es|en)="[^"]*<[a-zA-Z]+[^>]*\sclass="')
for p in present:
    n = len(broken_i18n.findall(read(p)))
    if n:
        err(f"[i18n-attr] {p} has {n} data-es/en attribute(s) with unescaped double-quotes (use single quotes inside)")

# 6j. flip cards: pages with .p-card load flip.js; brand.css carries the flip fixes
if os.path.isfile("assets/flip.js"):
    for p in THEMED_PAGES:
        if p in present and 'class="p-card"' in read(p) and "assets/flip.js" not in read(p):
            err(f"[flip] {p} has flip cards but does not load assets/flip.js (tap-to-flip broken)")
    if os.path.isfile(BRAND_CSS):
        bcss = read(BRAND_CSS)
        for tok in [".dim-w", ".p-imgwrap::after", "p-card.flipped .p-front .p-img"]:
            if tok not in bcss:
                err(f"[flip] {BRAND_CSS} missing flip-card rule `{tok}`")
else:
    err("[flip] missing assets/flip.js")

# 6k. shared cart: every themed page loads cart.js (single source); no page
#     re-inlines the cart code; brand.css carries the order-bar styles.
if not os.path.isfile("assets/cart.js"):
    err("[cart] missing assets/cart.js")
else:
    for p in THEMED_PAGES:
        if p not in present:
            continue
        s = read(p)
        if "assets/cart.js" not in s:
            err(f"[cart] {p} does not load assets/cart.js (cart broken / inconsistent)")
        if "function mpGet(" in s:
            err(f"[cart] {p} still inlines the cart code; it lives in assets/cart.js")
    if os.path.isfile(BRAND_CSS) and ".mp-order-bar" not in read(BRAND_CSS):
        err(f"[cart] {BRAND_CSS} missing shared .mp-order-bar / drawer styles")

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
