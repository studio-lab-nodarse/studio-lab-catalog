# Production-Readiness Remediation Plan

Goal: make the store **SEO-ready and reliably able to take orders**, on GitHub Pages, maintainable by a non-technical owner. Sequenced by impact/risk. Phases 0–2 alone deliver the goal; Phase 3 is the meaningful-effort one.

## Decision log (2026-07-16)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Order destination email | **PENDING** — owner to provide business inbox. Replaces personal `nodarsesartsllc@gmail.com` currently hardcoded in storefront pages. |
| 2 | Order transport | **Form-to-email service** (Web3Forms / Formspree / FormSubmit). Static-site friendly, reliable capture + auto-confirmation. Not raw `mailto:`. |
| 3 | Catalog order channel | **Unify to email**; keep **WhatsApp as a secondary** button (`wa.me/17864834268`). |
| 4 | Artifact policy | **FREEZE** — the committed HTML files are the source. No wholesale re-pasting of fresh AI-builder exports (it erases SEO + order wiring). Changes are surgical edits via git. |
| 5 | Brand assets | Product photos exist only as base64 inside the HTML. **No logo/favicon/OG image file exists.** Need a dedicated brand image (extract from embedded photos or owner provides). |
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
Per page `<head>`:
- [ ] Unique meta description
- [ ] Canonical URL
- [ ] Open Graph + Twitter card (needs the brand/OG image from decision #5)
- [ ] Favicon / apple-touch-icon
- [ ] Add missing `viewport` on the storefront hub
- [ ] JSON-LD structured data — `Store`/`Organization` on homes, `Product`/`ItemList` on catalog + category pages
Site-level:
- [ ] `robots.txt`, `sitemap.xml`, `404.html`
- [ ] Link the orphaned collection pages from the storefront hub/nav; add breadcrumbs
- [ ] Refine `<title>`s; verify one `<h1>` + sane heading order per page

## Phase 3 — Performance / Core Web Vitals  ·  SEO + conversion; needs a build step
- [ ] Externalize base64 images → files under `assets/` (enables caching, compression, lazy-load, reusable OG image)
- [ ] `width`/`height` + `loading="lazy"` on offscreen images
- [ ] `preconnect` + subset Google Fonts (Playfair Display, Archivo)
- [ ] Target: catalog home 8.6 MB → <1 MB initial load

## Phase 4 — Deploy safety (fits Pages)
- [ ] CI on PRs: link-integrity sweep (static `href=`, JS `href:`, `location.href=`, collections map), HTML validation, per-page size budget
- [ ] Drop manual cache-busting once real asset URLs exist
- [ ] Document: merge-to-`main` = release; work on branches

## Phase 5 — Maintainability (post-MVP)
- [ ] Config/data file for order email + social handles (single source of truth)
- [ ] Optional re-apply script so SEO/order wiring survives a regeneration (only if owner insists on re-exporting)
