# Hub trial — reuse inventory

Status: research, read-only · 2026-10-10 · input to Phase 1 plan. Refs are `file:line` at commit `1daa74e`.

Verdict: shared partials, `brand.css`, `masthead.css`, `cart.js`, `flip.js` and the i18n transform all carry over. Remove `hubShell`, `hub-nav.js`, `src/_vendor/` and 3 hub-specific CI checks. Five things need **changing** first: `head.njk` (robots and breadcrumb are hard-coded), `order.js` (accepts only a mailto/wa URL and its strings are Spanish-only), `setLang` (never switches placeholders), and the verify lists (`THEMED_PAGES`/`APP_PAGES`, sitemap rule).

---

## 1. `src/_includes/*`

| Partial | Purpose | Params it reads | Reuse for hub / trial / reorder |
|---|---|---|---|
| `base.njk` | Default layout. Wraps every page except stickers | `pageStyles` (**required**: an undefined include throws), `pageStyles2`, `footerTagEs/En/Text`, `pageScripts` (default `scripts/lang-flip.njk`), `mpCol`, `extraScripts`, `assetsBase` | **Hub: yes**, but set `footerTag*`. The default tagline is "Presentation prototype" (`base.njk:13-16`), which is wrong copy for shop owners, and "2026" is hard-coded. It always bundles cart CSS+markup+`cart.js`, `mobile-center`, `order.js`, `flip.js` (`:17-26`). **Reorder: workable but heavy.** Better: a lite layout (head, header, content, lang-flip, `order.js`, site-footer) |
| `base-stickers.njk` | Stickers-only tail order | same minus footer/MP_COL | No |
| `head.njk` | Meta, SEO, OG, JSON-LD, fonts, `brand.css` + `masthead.css` | `title`, `description`, `pagePath`, `pageName`, `pageDescription`, `breadcrumbName`, `assetsBase`, `site.*` | **Needs params.** `:8` hard-codes `index,follow`, so reorder can't be noindex; add a `robots` var. `:47` hard-codes `@type CollectionPage` (wrong for reorder; WebPage is fine for the hub). `:52` `inLanguage:"es"` (English ships). `:57-64` is always a 3-level breadcrumb, so the hub would duplicate position 2 (the old hub had 2 levels); gate position 3 on `breadcrumbName`. `:2-3` is a createElement lazy-load monkeypatch "before the React bundle", dead once React is gone (harmless). The Org node `:27-45` must stay byte-identical (CI 6e) |
| `header.njk` | Shared masthead | `navBase`, `navActive`, `headerSubEs/En/Text`, `langFn` (default `setLang`), `langIdEn/Es` (default `b-en/b-es`), `langActive` (default en), `assetsBase`, `site.subBrand` | **Yes, as-is.** For the hub, drop `langFn: "slHubLang"` (`index.njk:8`) and use the defaults. Brand link `:19` → `{{navBase}}index.html` = hub. Nav `:21` has no hub/trial tab. Never add the reorder page here |
| `site-footer.njk` | Crawlable footer nav, absolute URLs | `site.base` | **Yes.** Adding a "Free trial" link means editing this **and** the root `index.html:515-529` in the same PR, or CI 6e (footer drift) fails. Never link reorder |
| `cart.njk` | Order bar + drawer + "Version" modal | `navBase` | Hub: yes if it keeps the cart. **`:11` links `{{navBase}}index.html#crear`**, which opens the old hub's React "Create your collection" wizard (`#crear` hash read in the bundle). The rebuilt hub must provide `#crear` or this link must be retargeted (e.g. to the trial form). Placeholders use `data-es-ph/data-en-ph` (`:7-9`), which **no script switches** (see §7) |
| `section-tabs.njk` | `{id,label,labelEs}` → pill jump links (`.tabs` in `brand.css`) | args | Yes (hub section nav) |
| `product-card` / `cap-card` / `tote-card` / `coaster-card` / `sticker-card.njk` | Product card macros | `(p, …, assetsBase[, opts])` | Yes if the hub shows sample products: import the macro + pass items from `_data/*.json`. Needs `styles/card-base.css` + `flip.js` |
| `stickers-cta.njk` + `scripts/stickers.njk` | Stickers "create your collection" modal form → **prefilled `mailto` `<a>`** (+ clipboard), *not* FormSubmit | — | **Pattern** for reorder's prefilled email (`scripts/stickers.njk:31-54`). Don't reuse as-is: it hard-codes the email (`:50`, bypasses `site.json`) and uses `alert()` validation |
| `scripts/lang-flip.njk` | `flip()`, `setLang()` (persists `sl_lang`), init from localStorage | needs `#b-en/#b-es` | **Yes** (hub/trial/reorder). Extend for placeholders (§7) |
| `scripts/mobile-center.njk`, `gorras-*.njk` | Card focus on mobile; gorras lang/CAPIMG | — | Only if cards are shown |
| `styles/card-base.css` | Page body bg, hero (`.hero-*`, `.hero-meta strong` = big gold stat numbers), `.cat-bar`, `.grid`, cards, `.btn-add`, `footer`, `.note` | `{{assetsBase}}` (Nunjucks-included inline) | Hub: yes (hero + proof numbers + cards). It is inlined per page, so not cached |
| `styles/stickers.css:45-79` | `.cta`, `.modal*`, **`.fld` form grid**, `.btn-send`, `.btn-cancel`, `.modal-ok` success panel | — | **Closest existing form styling for the trial form.** It is page-scoped, so promote it to `brand.css` or a shared `styles/form.css`. Gotcha: `.fld input{font-size:14px}` (`:63`) zooms iOS on focus; use ≥16px |

## 2. `eleventy.config.js`

| Item | Lines | After rebuild |
|---|---|---|
| `import fs` | 14 | **Dead** (only `hubShell` uses it) |
| `PASSTHROUGH` (`assets`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `404.html`, `index.html`) | 17-34 | Keep. Update the comments at 9-12 and 28-33 (hub/vendor) |
| `capimg` filter | 45-56 | Keep (gorras). Reusable if the hub renders caps |
| `ignores.add("src/_vendor/**")` | 60 | **Delete** with `src/_vendor/` |
| `addWatchTarget("src/_vendor/hub.html")` | 63 | **Delete** |
| `hubShell` filter (anchors `<body>`/`<div id=root>`, `lang="es"`→`en` rewrite, throws on miss) | 75-105 | **Delete**. Its only caller is `src/apps/storefront/index.njk:20-21` |
| `defaultLangEn` transform | 118-129 | **Keep.** It runs on every `.html` output. Limits: it rewrites only elements whose content is plain text (`[^<]*`) and that have both `data-es`/`data-en`; attributes (placeholder/aria/title) are untouched |
| dir config, `templateFormats: ["njk","html"]` | 131-141 | Keep. Note: any `.html` dropped into `src/` is parsed as Nunjucks, so don't stash extracted hub HTML there as `.html` |

No new filter is needed. Counts come from `magnets.items | length` etc.; inject the ZIP allow-list/config into JS with the built-in `dump`. **Count drift today:** the hub hard-codes magnets `69`, while `magnets.json` has **70** items (stickers 28, caps 6, totes 19, coasters 14 match). Derive counts from data.

## 3. `assets/` runtime

**`order.js` (58 lines): sink-based FormSubmit capture**
- Endpoint `https://formsubmit.co/ajax/jesusnodarse1823@gmail.com` (`:6`), the **only** place CI allows it (6b).
- API: `window.__slp.href = 'mailto:…?subject&body'` (`:55`) and `window.__slwa(waUrl)` (`:57`). `parse()` (`:7-21`) pulls subject+body out of the URL.
- Request (`:36-40`): `POST` JSON `{_subject, _template:"box", _captcha:"false", Pedido: body}`. Success = `d.success === "true"` (`:42`).
- Fallback (`:49-52`): any failure, including FormSubmit's "needs activation" `success:false`, reopens the original mailto/wa URL, so nothing is lost.
- Toast `toast(msg, kind)` (`:22-32`): inline-styled, **Spanish-only strings** (`:35`, `:43`), private.
- **Fit for the trial form:** poor as-is. It takes one free-text blob (`Pedido`), not named fields (name/store/address/ZIP give a nicer `box` table and `_replyto`), it has no `_honey`, and its strings aren't bilingual.
- **Recommend:** refactor inside `order.js` to expose `window.__slSubmit(fields, {fallbackUrl, msgs})` and make `send()` a thin wrapper, so the endpoint stays single-sourced. Trial-form logic goes in a sibling `assets/trial.js` that calls `__slSubmit`. A sibling holding **its own** endpoint would escape CI 6b.

**`cart.js` (147)**: global functions, `localStorage mp_order` shared across pages, `MP_EMAIL` **hard-coded** (`:10`; `site.json` doesn't reach it), sends via `__slp` (`:112`), `mpFixLocalNav` (`:122-128`) rewrites prod links for local dev, opens the drawer on `#pedido`. Reusable on the hub as-is. Not wanted on reorder.

**`flip.js` (13)**: delegated tap-to-flip for `.p-card`. Reuse wherever cards appear.

**`hub-nav.js` (92)**: **entirely dead** after the rebuild. It wires bundle placeholder anchors by text (`:29-42`), hides "Browse catalog"/"View all" (`:21-28`), `slHubLang` forwards to React's hidden buttons (`:55-75`), `syncLang` (`:78-82`). Delete the file; it is referenced only by the bundle, `verify_site.py:385-388` and docs.

**`brand.css` (135)**: `:root` tokens `:8-19` (`--bg --surface --card --mataqua --border --accent --accent2 --text --muted --tag-bg`). `.sl-sitefooter` `:23-39`. Layout container `body .cat-bar/.grid/.stage` 1180px `:46-53`. Flip-card fixes `:61-83`. **Cart/drawer `.mp-*` `:88-124`** (`.mp-in` input and `.mp-send` gold full-width button are reusable as generic form styling; `font-size:16px` is iOS-safe). `.tabs` + `[id^="sec-"]{scroll-margin-top}` `:132-135`. No generic `.btn`/hero/form classes: those live in page CSS (§1). Header comment `:1-6` and `:29-32` cite the hub's shadcn collision, now obsolete.

**`masthead.css` (95)**: view transitions `:16-23`, tokens scoped on `header` `:25-33` (because of hub shadcn `:root`), full masthead + mobile hamburger. Reuse as-is. The `header`-scoping and the brand/masthead split stop being *necessary* once React is gone. Keep them anyway (zero churn) and only fix the comments (`:1-8`, `:34-38`).

Images: the bundle references **79 `assets/img/*.webp`, all hub-only** (no template/data uses them, ~1.37 MB). Reuse them by hash. Any not reused become orphans (no CI check for orphans).

## 4. `src/_data/site.json` + `docs/SITE-CONFIG.md`

`site.json` fields: `brand, subBrand, legalName, founder, orderEmail, whatsapp, phone, base, areaServed`. Usage: `head.njk` uses all but `whatsapp`; `header.njk` uses `subBrand`; `site-footer.njk` uses `base`. **`site.whatsapp` is unused today**, so reorder is its first consumer (`wa.me/{{site.whatsapp}}`). Contact constants `site.json` does **not** reach: `order.js:6`, `cart.js:10`, `scripts/stickers.njk:50`, root `index.html` and (until deleted) the hub bundle. Candidate new keys: `trial` block (ZIP prefixes/allow-list, box-code regex, reorder path) or a `_data/trial.json`; GoatCounter site code.

SITE-CONFIG.md edits: `:5` and `:61` (hub hard-codes values / own shadcn tokens) → remove. `:76` is **already stale** (it says the masthead lives in `brand.css`; it moved to `masthead.css`; it says "6 themed pages"/3-link nav, but there are 8 pages and 5 links). `:80` "all 8 app pages" → recount. `:44-46` canonical table lacks totes/coasters/trial/reorder. `:81` WhatsApp "where used" → add reorder. Add a FormSubmit row for trial-form fields + `_honey`.

## 5. `tools/verify_site.py`: checks touching hub / order / SEO

| § / name | Lines | Touches | After rebuild |
|---|---|---|---|
| `PAGES` | 25-36 | page list (hub at :27) | **Modify**: add trial page if standalone, add reorder (see 6d) |
| `PAGE_SIZE_BUDGET` 800 KB | 38 | catches re-pasted bundle | Keep. Hub drops from ~316 KB, so the budget could tighten |
| `ORDER_EMAIL`/`WHATSAPP`/`ORDER_JS` | 39-41 | FormSubmit + wa | Keep |
| `APP_PAGES` = PAGES − root | 42 | must load `order.js` | Keep. Reorder/trial join automatically, so they **must** load `order.js` or be exempted |
| `THEMED_PAGES` + comment "hub uses its own shadcn tokens" | 44-51 | brand.css, flip, cart lists | **Modify**: add hub (+trial/reorder). Then 6k forces `cart.js` on them, so split a `CART_PAGES` list |
| `HUB`, `MASTHEAD_PAGES = THEMED+[HUB]` + comment | 53-58 | masthead | **Modify**: fold hub into themed list; drop the injection comment |
| §0 missing-page | 79-83 | | Keep |
| §1 size, §2 base64 | 85-96 | | Keep |
| §3 relative links | 98-108 | | Keep. Gap: `rel_html` (`:99`) won't match `x.html?box=…` (no `?` allowed), so such a link is never checked |
| §4 absolute URLs | 110-123 | canonical/og/sitemap | Keep (strips `?`/`#`) |
| §5 SEO title/canonical/og/`lang="en"` | 125-135 | | Keep. No robots/noindex check exists anywhere |
| §5b old email | 137-141 | | Keep |
| §6 JSON-LD parses | 143-150 | | Keep |
| §6b order.js wiring | 152-172 | endpoint, `<script src="(../)+assets/order.js">`, no inline `formsubmit.co/ajax/` in pages | Keep. **Modify** if any other `assets/*.js` gets an endpoint: scan all `assets/*.js`, allow only `order.js` |
| §6c contact drift | 174-181 | `mailto:`→must contain ORDER_EMAIL; `wa.me/N`==WHATSAPP | Keep. Reorder passes if built from `site.*` |
| §6d sitemap covers PAGES | 183-190 | | **Modify**: skip `NOINDEX_PAGES`, and assert they are **absent** from the sitemap |
| §6e footer + Org JSON-LD identical on all pages | 192-224 | comment `:198-199` mentions hub inline style | Keep (comment fix). New pages must use `head.njk` + `site-footer.njk` |
| §6f SRI on external scripts | 226-231 | | Keep. GoatCounter `<script src=https://…>` needs `integrity` (+`crossorigin`) |
| §6g brand.css wired on THEMED | 233-256 | | Keep (list change) |
| §6h masthead.css: `:root` ban | 264-268 | rationale = hub shadcn | Optional delete/keep as hygiene |
| §6h referenced ⊆ declared tokens | 272-281 | rationale = hub `:root` | Optional; harmless |
| §6h masthead link on MASTHEAD_PAGES | 282-292 | | Keep |
| §6h **`#root header{display:none`** | 293-295 | React header hiding | **Delete** |
| header lockup/nav tokens | 297-316 | | Keep |
| §6i quotes inside `data-es/en` | 318-325 | | Keep |
| §6m lang-flash (ships EN) | 327-344 | | Keep. Now covers hub copy (React state before, so it was invisible to CI) |
| §6j flip.js on card pages | 346-357 | | Keep |
| §6k cart.js on THEMED | 359-373 | | Keep. Scope to `CART_PAGES` |
| §6l dead anchors | 375-384 | comment `:376-377` re React | Keep (comment fix). Reorder's mailto/wa need **real static hrefs** (not `#`), with JS only augmenting |
| §6l **hub loads hub-nav.js** | 385-388 | | **Delete** |
| "6m" catalog assets (duplicate label) | 390-395 | | Keep. Rename to 6n |
| §7 brand/ops assets | 397-403 | | Keep |

**New checks needed**
1. `noindex`: each `NOINDEX_PAGES` page has `<meta name="robots" content="noindex…">`; every other page has `index,follow`; noindex pages are not in the sitemap; **no page links to them** (grep the path in all other pages' HTML); `robots.txt` doesn't `Disallow` them (a crawler must fetch the page to see noindex).
2. Trial form wiring (hub or trial page): `<form id="trial-form">` exists; required `name`s present (contact, store, email, phone, street, city, zip); honeypot `name="_honey"` present and hidden; ZIP `pattern`/`inputmode="numeric"`; privacy-note marker; loads `order.js` (+`trial.js`); no inline endpoint (already §6b).
3. Reorder: loads its script; static fallback `mailto:` contains ORDER_EMAIL and `wa.me/WHATSAPP` (§6c covers drift); box regex constant present.
4. Hub parity (brief: "must still deliver"): links to all 3 `colecciones/*.html` + 5 category pages; a wholesale contact (form or mailto); if `cart.njk` keeps `index.html#crear`, the hub has `id="crear"`.
5. No React re-paste guard: fail if any page contains `parcelRequire` or `<div id=root>`. Keeps the FROZEN rule's intent once `_vendor` is gone.

## 6. `sitemap.xml`, `robots.txt`, `404.html`, workflows
- `sitemap.xml:9-14`: hub entry stays (same URL), bump `lastmod`. Add a standalone trial page if one is created. **Never add reorder.**
- `robots.txt`: **no change**. Do *not* Disallow reorder (it would hide the noindex meta; the URL could still be indexed from links).
- `404.html`: not in `PAGES` (unchecked). Spanish-first `lang="es"`, single link to hub (`:40`). No required change; optional EN-first + trial CTA.
- `.github/workflows/ci.yml`, `static.yml`: generic `npm ci → build → verify`. **No change.**

## 7. Bilingual authoring on templated pages
- Mechanism: an element carries `data-es="…" data-en="…"`, and `setLang(l)` sets `innerHTML = data-l` for every `[data-es]` (`scripts/lang-flip.njk:4-10`), toggles `#b-en/#b-es`, sets `<html lang>` and persists `sl_lang`. On load it reads `sl_lang` (default en) (`:11`).
- Authoring rule: write either default text; `defaultLangEn` swaps plain-text elements to EN at build. **Elements with child tags** (`<b>`, `<span class='em'>`) are skipped by both the transform and CI 6m, so ship EN by hand. Inner markup in attributes must use **single quotes** (CI 6i).
- **Gaps for a form page:** (a) placeholders: `data-es-ph/data-en-ph` exist in `cart.njk:7-9` but **nothing switches them**; extend `setLang` to `[data-es-ph]` → `placeholder`, plus `aria-label`/`title` if used. (b) JS-generated strings (validation, success, toast) need an `es/en` dict keyed on `document.documentElement.lang` (pattern: `cart.js:12`, `MP_CHIPS :53-56`). (c) Native `required` bubbles follow the browser locale, not the page.
- **XSS:** `setLang` uses `innerHTML` from attributes. Never put `?box=` into `data-es/en`. Validate it (e.g. `^[A-Z]{2,3}-\d{2,4}$`), write it with `textContent`, and `encodeURIComponent` it into mailto/wa.
- Gorras `L()`/stickers `btEN/btES` toggles don't persist `sl_lang`. Irrelevant to new pages if they use defaults.

## 8. Risks / gotchas
1. **`#crear` inbound link** (`cart.njk:11`, on every cart drawer) targets the old hub's React wizard. Silently breaks (file still exists, so CI §3 passes) unless retargeted or rebuilt.
2. **Feature parity list** of old hub (from bundle): category tiles with counts → 5 pages; collections section `id="colecciones"` + map `{beach,miami,cuban}` → `colecciones/*.html`; deep links `stickers|totes|coasters.html#sec-<key>`; **"Request wholesale pricing" modal** (biz, name, email, msg → `__slp` mailto → FormSubmit) = today's wholesale contact; "Create your collection" wizard (`#crear`); cart count from `mp_order` + link `colecciones/miami-beach.html#pedido`; sr-only `<h1>`. Existing copy already promises "Free samples, then production… ship free to your door" (aligns with the trial box; reconcile wording: "request", not a promise).
3. **JSON-LD drift guard (6e)**: the Org node must stay identical on all pages. Safe via `head.njk`; never hand-write it on reorder.
4. **Footer drift guard (6e)**: any footer link change → `site-footer.njk` **and** root `index.html` together.
5. `head.njk` breadcrumb is always 3-level; using it for the hub as-is yields a duplicate crumb. Hub canonical `pagePath` must be `apps/storefront/` (sitemap form), not `…/index.html`.
6. Old CSS collisions vanish (`brand.css :root` vs shadcn, `body .grid` vs Tailwind). The hub can load `brand.css`, which removes the reason for the split; the CI checks guarding it become optional.
7. FormSubmit **not activated** (BACKLOG:9): until then every submit falls back to mailto. The trial fallback must carry all fields. Public free-goods form = spam magnet: `_honey` + client ZIP check only (static); consider the hashed alias endpoint (BACKLOG:14) before launch.
8. QR permanence: the printed URL can't change. Pick a short, stable path now (e.g. `r/?box=` vs `apps/storefront/reorder.html?box=`). A future custom domain (BACKLOG:64) relies on GitHub's github.io→domain redirect; decide before printing.
9. Analytics: confirm whether GoatCounter keeps `?box=` in the counted path. If not, count `path:'reorder/'+box` manually. Track mailto clicks as events.
10. Hub drops from ~316 KB single-line bundle to a normal template. The `_vendor` "never reformat" rule and CLAUDE.md hub sections (two-stylesheet rationale, hub section, cross-page-links "four forms" sweep) need rewriting in the same PR.
11. `templateFormats` includes `html` (see §2).
