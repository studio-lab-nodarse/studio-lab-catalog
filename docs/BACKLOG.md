# Backlog

Outstanding items. The remediation phases (P1–P4) are done; see [REMEDIATION-PLAN.md](REMEDIATION-PLAN.md) for detail and [SITE-CONFIG.md](SITE-CONFIG.md) for constants.

## 🚦 Owner actions — required before go-live
- [ ] **Activate FormSubmit.** Orders POST to `formsubmit.co/ajax/jesusnodarse1823@gmail.com`, which needs a one-time confirmation. Submit one test order → click the activation link FormSubmit emails to that inbox. Until then, orders fall back to opening the mail client / WhatsApp (nothing lost, but not captured to inbox).
- [ ] **Branch protection on `main`.** Enable it and mark the "Verify site" check as required, so a red CI (`tools/verify_site.py`) actually blocks the merge/deploy. GitHub repo setting — cannot be done in a file.

## 🔜 Should do soon
- [ ] Push branch `cami/folder-structure-org-3f2f9f` and open a PR (12 commits, currently unpushed).
- [ ] Switch FormSubmit to its **hashed alias endpoint** so the order email isn't exposed in client JS (needs one-time FormSubmit setup).
- [ ] After go-live, submit a real test order end-to-end and confirm it lands in the inbox.

## ✅ Code stabilization (2026-07-16)
- [x] Shared order script extracted to `assets/order.js` (was copy-pasted, byte-identical, into all 8 app pages) → one place to change the FormSubmit endpoint. Pages dropped ~480 lines.
- [x] Storefront brand tokens + footer extracted to `assets/brand.css` (6 themed pages); normalized the stickers token drift. See [SITE-CONFIG.md](SITE-CONFIG.md).
- [x] Unified storefront masthead across the 6 themed pages — one lockup (heart logo + MIAMI **PECULIAR** + page-specific bilingual subtitle) + a Gorras/Magnets/Stickers nav (active state) + EN/ES; header CSS centralized in `brand.css`. Fixed the stickers outlier (was "STUDIO LAB", no logo, no nav) and the subtitle drift. Each page keeps its own toggle JS.
- [x] jsPDF (catalog) pinned with SRI `integrity` (sha512, verified against cdnjs) + `crossorigin` — closes the supply-chain risk of an unpinned CDN script.
- [x] `window.window.__slp` typo + duplicated mailto recipient fixed (catalog + stickers).
- [x] CLAUDE.md order-email drift fixed (was advertising the CI-banned old address).
- [x] CI (`verify_site.py`) hardened: order.js wired on every app page + endpoint matches order email; no page may re-inline a FormSubmit endpoint; WhatsApp number consistent; sitemap covers every canonical URL; footer + Organization JSON-LD identical across pages (drift guard); every external `<script>` must carry SRI.

## 🧊 Deferred / nice-to-have
- [ ] **Default language drift.** Storefront pages init to **EN** at runtime, but SITE-CONFIG says default `es`. Also the toggle wiring differs per page (`L()`+`be/bs` on gorras; `setLang()`+`b-es/b-en` elsewhere; `btEN/btES` on stickers). Unifying the i18n init/naming touches each page's inline JS — separate, riskier pass. (Header markup/toggle order already unified to EN|ES.)
- [ ] **Hub masthead** (`apps/storefront/index.html`) stays on its own React header (subtitle literal `"Studio Lab · Jesús Nodarse"` already matches the unified `Studio Lab · …` format). Re-tokenizing the hub onto `brand.css` is a larger, riskier change.
- [x] `loading="lazy"` + `decoding="async"` on images (2026-07-16). Static `<img>` tags rewritten directly; a tiny `createElement` hook covers React-created imgs. CLS already safe — cards use fixed-height image boxes (`.card-img{height:185px}`), so no `width`/`height` attrs needed. Fonts already use `display=swap` (storefront) or system fonts (catalog/root) — nothing to fix.
- [ ] Subset Google Fonts (Playfair Display, Archivo) — minor; `display=swap` already prevents FOIT.
- [ ] Visible breadcrumb `<a>` links (structured `BreadcrumbList` already shipped).
- [ ] Product-level `Product`/`ItemList` schema with `offers` — only if the store ever publishes prices (today it's order-to-quote, no prices).
- [ ] Descriptive image filenames for image SEO (currently content-hash names).
- [ ] Hub collection cards use CSS `background-image` (not `<img>`) → not covered by native lazy; low priority (few, above-ish the fold).

## 🌱 Post-MVP
- [ ] Real order backend / capture beyond email (dashboard, order records).
- [ ] Custom domain (no CNAME today; running on `*.github.io`).
- [ ] Source-of-truth pipeline: a re-apply step so SEO/order/asset work survives if the owner regenerates a page from the AI builder (currently the files are **frozen** — see CLAUDE.md).
