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
- [x] Order cart unified + made consistent. Root cause of "cart lost on navigate" locally: the footer's absolute production URLs cross origin on `localhost` (localStorage is per-origin) — added a dev-only shim in `assets/cart.js` that rewrites same-site absolute links to the current origin when off production (no-op in prod). Extracted the drifted per-page cart JS into one `assets/cart.js` (polymorphic `addToOrder`/`mpVersion` handle both the element- and number-based call styles; unified item key `n|col|std`); order-bar/drawer CSS moved to `brand.css`. Wired **stickers** into the same cart — "Order pack" now adds a pack line to the shared cart/drawer instead of going straight to mailto. Verified: cross-page persistence, version/qty/drawer/send, and footer nav all work.
- [x] Flip cards (gorras/magnets/colecciones): fixed the flip-back desync (now a single container backface rotation — removed the independent staggered image/back rotations); removed the on-image measurement overlays (`.dim-w/.dim-h`) so the magnet back reads as the real item; replaced the corner flip button with **tap-the-image-to-flip** (shared `assets/flip.js` delegation) + a persistent bilingual "Tap to flip" hint. Order buttons + colour swatches excluded from the tap target.
- [x] Mobile masthead (≤760px): pure-CSS hamburger menu (no JS) exposing the category nav, subtitle hidden + wordmark shrunk to compact the header, EN/ES + footer tap targets grown to ≥44px, opaque dropdown. Verified on-device (375px); desktop unchanged.
- [x] Unified storefront masthead across the 6 themed pages — one lockup (heart logo + MIAMI **PECULIAR** + page-specific bilingual subtitle) + a Gorras/Magnets/Stickers nav (active state) + EN/ES; header CSS centralized in `brand.css`. Fixed the stickers outlier (was "STUDIO LAB", no logo, no nav) and the subtitle drift. Each page keeps its own toggle JS.
- [x] jsPDF (catalog) pinned with SRI `integrity` (sha512, verified against cdnjs) + `crossorigin` — closes the supply-chain risk of an unpinned CDN script.
- [x] `window.window.__slp` typo + duplicated mailto recipient fixed (catalog + stickers).
- [x] CLAUDE.md order-email drift fixed (was advertising the CI-banned old address).
- [x] CI (`verify_site.py`) hardened: order.js wired on every app page + endpoint matches order email; no page may re-inline a FormSubmit endpoint; WhatsApp number consistent; sitemap covers every canonical URL; footer + Organization JSON-LD identical across pages (drift guard); every external `<script>` must carry SRI.

## 🧊 Deferred / nice-to-have
- [ ] **Cart CSS duplication.** The order-bar/drawer CSS now lives in `brand.css`, but the 5 category/collection pages still carry an identical inline copy (harmless — same values). Remove the inline copies for full DRY.
- [ ] **Default language drift.** Storefront pages init to **EN** at runtime, but SITE-CONFIG says default `es`. Also the toggle wiring differs per page (`L()`+`be/bs` on gorras; `setLang()`+`b-es/b-en` elsewhere; `btEN/btES` on stickers). Unifying the i18n init/naming touches each page's inline JS — separate, riskier pass. (Header markup/toggle order already unified to EN|ES.)
- [ ] **Page-internal breakpoint drift.** Shared chrome (masthead/nav/footer) is now unified at 760px, but page content still reflows at per-page breakpoints (stickers 560, gorras 600, others 760). Aligning them means editing each page's tuned content media queries — low priority.
- [ ] **Mobile menu a11y polish.** Hamburger is a CSS checkbox-hack: keyboard-operable via the focusable (sr-only) checkbox, but a fuller pass would add a visible focus ring on ☰ and `aria-expanded`. Also the hub's mobile nav (Products/Themes/New) still has no menu.
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
