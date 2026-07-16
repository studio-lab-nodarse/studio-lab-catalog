# Production-Readiness Remediation Plan

Goal: make the store **SEO-ready and reliably able to take orders**, on GitHub Pages, maintainable by a non-technical owner. Sequenced by impact/risk. Phases 0–2 alone deliver the goal; Phase 3 is the meaningful-effort one.

## Decision log (2026-07-16)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Order destination email | **PENDING** — owner to provide business inbox. Replaces personal `nodarsesartsllc@gmail.com` currently hardcoded in storefront pages. |
| 2 | Order transport | **Form-to-email service** (Web3Forms / Formspree / FormSubmit). Static-site friendly, reliable capture + auto-confirmation. Not raw `mailto:`. |
| 3 | Catalog order channel | **Unify to email**; keep **WhatsApp as a secondary** button (`wa.me/17864834268`). |
| 4 | Artifact policy | **FREEZE** — the committed HTML files are the source. No wholesale re-pasting of fresh AI-builder exports (it erases SEO + order wiring). Changes are surgical edits via git. |
| 5 | Brand assets | No logo/favicon/OG file exists. **Extract the logo from the page headers** (base64) → save under `assets/` for favicon + OG. |
| 6 | Languages | **en + es**, bilingual via runtime JS toggle (one URL). Default `lang="es"`; no hreflang (needs distinct URLs). |
| 7 | Socials | None for now → omit `sameAs` from schema. |
| 8 | Product prices | **None exist** — rendered-DOM check (catalog, gorras, magnets, collection) found no prices; store is order-to-quote. Product schema ships without `offers`. |
| 9 | Brand logo | Extracted `.logo-mark` heart PNG from storefront header, recolored cream (site CSS filter via canvas) → `assets/` favicon/apple-touch/og. |
| — | Artist / founder | **Jesús Nodarse** (Miami). Personal email `jesusnodarse1823@gmail.com` (the "stray" one — it's legitimately his); `nodarsesartsllc@gmail.com` is the business/order alias. |
| — | Host | GitHub Pages (for now). No custom domain yet. |
| — | Order backend | Email-only MVP. No real backend/checkout. |

## Phase 0 — Freeze (DONE as decision)
Committed HTML = source. Documented in `CLAUDE.md` + `README.md`. Re-applying a fresh export over these files is a regression, not an update.

## Phase 1 — Reliable order capture (email MVP)  ·  do first
- [ ] Confirm the order-destination email (decision #1).
- [ ] Replace `mailto:` order actions with a form-to-email service (decision #2).
- [ ] Unify catalog to the email flow; keep WhatsApp as secondary (decision #3).
- [ ] On-screen order-summary fallback so a failed submit never loses an order.
- [ ] Minimal validation (name + contact required) before submit.
- [ ] Put the destination email in one obvious place per app (kill the duplicated hardcoded address).

## Phase 2 — SEO foundation  ·  stated goal, low risk (head is editable despite minified body)

Decisions (2026-07-16): bilingual **en/es** via runtime JS toggle on one URL → hreflang N/A; set `lang="es"` default + `og:locale es_US` / `og:locale:alternate en_US`. No socials → omit `sameAs`. Legal name **Nodarse Arts LLC**. Prices for Product schema → **extract from the live rendered pages** during execution. Favicon/OG image → **extract the logo from the page headers** (base64) → save under `assets/`. Constants in [SITE-CONFIG.md](SITE-CONFIG.md).

Per page `<head>` — DONE 2026-07-16 (all 9 pages):
- [x] Unique meta description
- [x] Canonical URL (clean dir URLs per SITE-CONFIG)
- [x] Open Graph + Twitter card + `og:locale` es_US / alternate en_US
- [x] Refined `<title>`s (keyword + brand)
- [x] `lang="es"` on all 9 `<html>` tags
- [x] Favicon + `og:image` — asset files created (2026-07-16). Extracted the `.logo-mark` heart PNG from the storefront header, re-colored it to cream via the site's own CSS filter (rendered through a canvas), padded onto navy `#081420` → `assets/favicon.png` (512), `assets/apple-touch-icon.png` (180), `assets/og/default.jpg` (1200×630). Source logo kept at `assets/brand-logo.png`.
- viewport: already present on all pages (the earlier "missing on hub" was a false negative — hub uses unquoted `name=viewport`).
JSON-LD — DONE 2026-07-16 (all 9 pages, validated as parseable JSON):
- [x] `Organization`+`Store` on every page (`@id #org`; legalName Nodarse Arts LLC, founder Jesús Nodarse, contactPoint = order email + WhatsApp, areaServed Miami; no `sameAs`)
- [x] Page node: `WebSite` on root; `CollectionPage` on the other 8 (linked to `#org`/`#website`)
- [x] `BreadcrumbList` on all non-home pages
- Product-level `ItemList`/`Product` intentionally **skipped**: no prices (order-to-quote) and product lists are client-rendered. Add later if a product/price feed appears.
Crawlability — DONE 2026-07-16 (verified in-browser: footer survives JS render, content still mounts):
- [x] Static `<footer>` nav (scoped styles, absolute links to all 9 pages) appended before `</body>` — de-orphans the 3 collection pages. On catalog (`#cont`) and hub (`#root`) it sits outside the mount so JS doesn't wipe it.
- [x] Static sr-only `<h1>` on catalog (its only h1) + hub (adds a keyword h1; hub's React h1 is "Your shop, your own collection." — 2 h1s total, HTML5-valid).
- [x] Breadcrumbs covered by JSON-LD `BreadcrumbList`; visible breadcrumb `<a>` deferred (footer nav already gives crawlable internal links).
Site-level:
- [x] `robots.txt`, `sitemap.xml`, `404.html` (2026-07-16). Note: on a GitHub Pages **project** site, `robots.txt`/`sitemap.xml` live at the project subpath, not the domain root — submit the sitemap URL directly in Google Search Console for it to take effect.
- [ ] Refine `<title>`s; verify one `<h1>` per page

## Phase 3 — Performance / Core Web Vitals  ·  SEO + conversion
- [x] Externalize base64 images → `assets/img/` (2026-07-16). 383 unique files (content-hash names → immutable/cacheable), decoded from 509 refs. **HTML 29.9 MB → 1.0 MB** (catalog 8.6 MB → 116 KB, biggest page now 308 KB). Verified in-browser: all images load, pages render, footer/JSON-LD intact, 0 base64 left, every ref resolves. A few tiny inline SVG icons left as-is.
- [ ] `width`/`height` + `loading="lazy"` on offscreen images — deferred: imgs are JS-rendered (would mean editing the React data/factory), higher risk, smaller win now that payload is external.
- [ ] `preconnect` + subset Google Fonts (Playfair Display, Archivo) — `preconnect` already present in most pages; subsetting deferred.
- [x] Target hit: catalog 8.6 MB → 116 KB initial HTML.

## Phase 4 — Deploy safety (fits Pages)
- [ ] CI on PRs: link-integrity sweep (static `href=`, JS `href:`, `location.href=`, collections map), HTML validation, per-page size budget
- [ ] Drop manual cache-busting once real asset URLs exist
- [ ] Document: merge-to-`main` = release; work on branches

## Phase 5 — Maintainability (post-MVP)
- [ ] Config/data file for order email + social handles (single source of truth)
- [ ] Optional re-apply script so SEO/order wiring survives a regeneration (only if owner insists on re-exporting)
