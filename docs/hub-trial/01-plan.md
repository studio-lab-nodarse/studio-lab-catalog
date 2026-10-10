# Hub trial — Phase 1 plan

Status: **approved with owner answers** · 2026-10-10
Inputs: [00-brief](00-brief.md) · [reuse-inventory](research/reuse-inventory.md) · [hub-content](research/hub-content.md) · [market](research/market.md)

**Owner answers (2026-10-10):**
- **Q1 numbers:** all numbers (prices, proof, rules) are **environment variables**, so they can be changed later without a code change. See §6a.
- **Q2 box:** an assortment of product types, **always including magnets**. No counter display.
- **Q3 cap:** **one box per business**, no monthly cap.
- **Q4 terms:** go with the suggested defaults, stored as variables.
- **Q6:** drop the builder.
- **Q7:** reply within **2 business days**.

## 0. Decisions taken in this plan

| # | Decision | Why |
|---|---|---|
| D1 | Rebuild the hub as a normal Eleventy template. Delete `src/_vendor/hub.html`, `hubShell` and `hub-nav.js`. | The bundle can't be edited. Shared partials already cover the header, footer, cart and EN/ES (reuse-inventory §1). |
| D2 | The trial box is **free stock the shop keeps**, not consignment. The request is "Request", and it is reviewed by hand. | market §1. The owner vets every request. |
| D3 | The trial form is the primary CTA. It replaces the "Request wholesale pricing" modal; a "Just want pricing?" link goes to WhatsApp or email instead. | One clear action. Pricing requests still have a path. |
| D4 | The form has 2 steps on one page. Step 1: store, name, email, phone, ZIP. Step 2: street, city, optional Instagram or website. | market §3. Step 1 already gives a usable lead. |
| D5 | Out-of-area ZIPs are **still submitted**, flagged `area: outside` and shown "we're only shipping trial boxes in South Florida right now; we'll reply about wholesale". | Never lose a lead. Costs nothing. |
| D6 | The reorder page lives at **`/r/?box=CODE`** (short, stable, never linked, `noindex`). | market §4. The printed URL is permanent. |
| D7 | The reorder page shows the box code only, not the store name. The owner keeps code → store in his own sheet. | No backend. No store data in a public file. |
| D8 | `#crear` (linked from every cart drawer) becomes a "Custom collections" section with WhatsApp and email buttons. The React "version a design" builder is dropped in v1. | Keeps that link working without rebuilding a 3-step wizard. |
| D9 | Every number (proof, prices, rules, analytics code) comes from **environment variables**, read by `src/_data/trial.js` (§6a). **A block whose variable is empty is not rendered.** No placeholder numbers ship. | Owner answer Q1. Real numbers only (brief, market §3). |
| D13 | **One box per business.** Enforced by the owner's manual review (duplicates are easy to spot in the inbox). The page says so, and the browser remembers a sent request and shows "already requested" as a soft guard. | Owner answer Q3. No backend to dedupe. |
| D10 | Counts (designs, products) are computed from `src/_data/*.json`, never hard-coded. | The old hub drifted (69 shown vs 70 real). |
| D11 | Analytics: GoatCounter on every page, plus explicit events. | brief. Free, no cookies, publishes an SRI hash. |
| D12 | Two PRs: **A = groundwork** with no visual change, **B = new hub + trial + reorder**. | PR A is checked with the parity diff, so B's risk is only the new UI. |

## 1. Hub: sections (mobile-first, top to bottom)

1. **Hero.** Eyebrow "Wholesale · Made in Miami". Headline about selling, e.g. "Miami-made souvenirs that sell"; copy is final in phase 2. One-line sub. CTA **"Request a free trial box"** and a secondary link "See the collections". Three proof chips: real numbers if `trial.json` has them, otherwise product facts computed from data (e.g. "{n} original designs", "Handmade in Miami", "Ships from Miami").
2. **How it works**, 3 steps: Request (2 min) → We review by hand and reply within **`TRIAL_REPLY_DAYS`** business days → Your box arrives with a reorder card.
3. **What's in the box.** "A hand-picked assortment of our products, **always with our handmade wood magnets**", plus "free, yours to keep and sell" and "one box per business". The product types shown come from the data (magnets plus a sample of the others).
4. **Bestsellers.** 4–6 product cards from `magnets.json` etc., reusing the existing card macros and `flip.js`. Shows **wholesale / suggested retail / your profit** only when the `PRICE_*` variables for that product are set.
5. **Collections.** 3 cards (Cuban American, Miami Beach, Miami) with **real `<a>` links** to `colecciones/*.html` and counts from data. These replace the old pop-up windows.
6. **Shop by product.** 5 category tiles as real `<a>` links with counts from data. Drops the dead "See all · 14 types" tile and the search bar.
7. **Proof.** Numbers from the `PROOF_*` variables. Shelf photos and quotes come later (v1.1, once Jesús supplies them). Hidden while empty.
8. **Trial form** (`id="trial"`). §2.
9. **Custom collections** (`id="crear"`). Short pitch, then "Message us on WhatsApp" and "Email us" (both prefilled).
10. **FAQ.**
    - Who qualifies: South Florida shops, one box per business.
    - What it costs: "Free. No payment, no contract."
    - What happens after: reorders are wholesale, minimum **$`TRIAL_REORDER_MIN`**, paid on delivery or by card, with terms after the first paid order.
    - When the box arrives.
    - The FL resale certificate is needed at the first paid order.
11. **WhatsApp fallback line**, then the shared footer.
- A **sticky bottom CTA on mobile** scrolls to `#trial`, and hides while the form is in view.
- SEO: English title and description, `og:locale en_US`, JSON-LD `inLanguage: en`, **one H1**, and a 2-level breadcrumb.

## 2. Trial form

| Step | Field | `name` | Input | Required |
|---|---|---|---|---|
| 1 | Store name | `store` | text, `autocomplete=organization` | yes |
| 1 | Your name | `name` | text, `autocomplete=name` | yes |
| 1 | Email | `email` | email | yes |
| 1 | Phone / WhatsApp | `phone` | `tel` | yes |
| 1 | ZIP | `zip` | `inputmode=numeric`, `pattern=\d{5}`, `autocomplete=postal-code` | yes |
| 2 | Street address | `street` | `autocomplete=street-address` | yes (in-area) |
| 2 | City | `city` | `autocomplete=address-level2` | yes (in-area) |
| 2 | Instagram or website | `social` | text | no |
| — | spam trap | `_honey` | hidden | must be empty |
| — | auto | `lang`, `area`, `page` | hidden | — |

- **In-area ZIPs:** `TRIAL_ZIP_MIN`–`TRIAL_ZIP_MAX`, default 33001–33499 (Miami-Dade, Broward, Palm Beach, the Keys).
- **Out-of-area:** skip step 2, submit with `area=outside`, and show the wholesale message (D5).
- **Transport:** `window.__slSubmit(fields, opts)` in `order.js`.
  - Subject: `Trial box request — {store} ({zip})`.
  - Settings: `_replyto=email`, `_template=table`, `_honey`.
  - Fallback: a mailto with **every** field.
- **States:** step 1, step 2, field errors (bilingual, shown inline), sending, success (in-page panel: "Thanks, {name}. Jesús reviews every request by hand; we'll reply within N business days"), and network error (falls back to mailto).
- **Inputs** use a font size of at least 16px, so iOS doesn't zoom on focus. Labels are real `<label>` elements, not placeholders.
- A **privacy note** sits under the submit button: what we collect, why, and that it's used only to contact them.

## 3. Reorder page `/r/`

- Reads `?box=`, validates it against `^[A-Z]{2}-\d{3}$` (e.g. `MB-014`), and writes it only with `textContent`. An invalid or missing code still shows the page, just without a code.
- Content:
  - "Running low? Reorder in 30 seconds."
  - Box code shown.
  - **Email reorder** button: mailto prefilled with subject `Reorder — box {code}` and a body template (product / qty lines, store name line).
  - **WhatsApp reorder** button: `wa.me/{site.whatsapp}?text=…`, in the current language.
  - "Browse & build an order" link to the category pages, which use the existing cart.
  - Reorder minimum and terms (from the `TRIAL_*` variables).
  - "Have your FL resale certificate handy".
- Both buttons have **real static `href`s**; the JS only adds the box code. `noindex`. Not in the sitemap. No page links to it.
- Uses the lite layout: head, header, content, footer, no cart.

## 4. QR card (print)

- A design-phase deliverable: a card about 3.5×2 in (business-card size) or 4×6 in, with the benefit copy, a QR code about 2 in, and the WhatsApp number printed underneath.
- **Card generator:** `/r/print/` (`noindex`). The owner enters a code prefix and a count, then prints a sheet with one unique QR per box. The QR library comes from cdnjs with an SRI hash. This lets the owner make cards without help.
- **Blocker:** the final domain must be chosen before the first print run (open question Q5).

## 5. Analytics (GoatCounter)

- Script tag in `head.njk` (all pages) with `integrity` and `crossorigin`. The site code comes from `GOATCOUNTER_CODE`. If that is empty, no script is rendered, so local and PR builds stay clean.
- Events:
  - `trial-start` (first field focused)
  - `trial-step2`
  - `trial-submit` / `trial-submit-outside`
  - `reorder-view` (path `r/{code}`, sent explicitly)
  - `reorder-email`, `reorder-whatsapp`
  - `custom-whatsapp`

## 6a. Environment variables

These are **GitHub repo Variables** (Settings → Secrets and variables → Actions → Variables), not Secrets, because every value ends up public on the page. Locally they live in a `.env` file, which is git-ignored; `.env.example` is committed. **To change a number:** edit the Variable in GitHub, then re-run "Deploy static content to Pages" (Actions → Run workflow).

| Variable | Default | Empty means |
|---|---|---|
| `TRIAL_REPLY_DAYS` | `2` | — |
| `TRIAL_REORDER_MIN` | `150` (USD) | the minimum line is hidden |
| `TRIAL_ZIP_MIN` / `TRIAL_ZIP_MAX` | `33001` / `33499` | — |
| `PRICE_{MAGNET,STICKER,CAP,TOTE,COASTER}_WHOLESALE` | empty | that product's margin row is hidden |
| `PRICE_{…}_RETAIL` | empty | same |
| `PROOF_STORES` | empty | that proof chip is hidden |
| `PROOF_UNITS_SOLD` | empty | same |
| `PROOF_REORDER_RATE` | empty | same |
| `PROOF_YEARS` | empty | same |
| `GOATCOUNTER_CODE` | empty | no analytics script |

- `src/_data/trial.js` is the **only** reader of `process.env`. It parses the values and validates them (a non-number makes the build **fail** rather than ship `NaN`), and exposes clean values to the templates and to the inline JS config.

## 6. Code changes

### PR A — groundwork (no visual change; parity diff must match)
0. Environment plumbing:
   - **New** `src/_data/trial.js` (§6a).
   - `eleventy.config.js` loads `.env` when it exists (`process.loadEnvFile`).
   - **New** `.env.example`; add `.env` to `.gitignore`.
   - `.github/workflows/static.yml` + `ci.yml`: bump Node 20 → 22 and add an `env:` block mapping `${{ vars.X }}` for every variable.
   - `docs/SITE-CONFIG.md`: a variables table.
1. `src/_includes/head.njk`
   - add a `robots` var (default `index,follow`) and a `schemaType` var (default `CollectionPage`);
   - show the 3rd breadcrumb level only when `breadcrumbName` is set;
   - add the GoatCounter tag, rendered only when the site code is set;
   - leave the Org node byte-identical.
2. `src/_includes/scripts/lang-flip.njk`: `setLang` also swaps the `placeholder` attribute from `data-es-ph`/`data-en-ph`, and `aria-label` from `data-es-aria`/`data-en-aria`. This also fixes the broken cart placeholders.
3. `assets/order.js`
   - add `window.__slSubmit(fields, {subject, fallbackUrl, msgs})`;
   - make `send()` a thin wrapper around it;
   - toasts become bilingual, chosen from `<html lang>`.
5. `tools/verify_site.py`
   - §6b scans **all** `assets/*.js` and allows the FormSubmit endpoint only in `order.js`;
   - add a `NOINDEX_PAGES` list (empty for now);
   - §6d skips noindex pages and asserts they are absent from the sitemap;
   - split a `CART_PAGES` list out of `THEMED_PAGES`.
6. Parity gate: whitespace-collapsed diff of every built page against `main`. The only allowed differences are the breadcrumb gating and the lang-flip script.

### PR B — new hub, trial, reorder
7. **Delete** `src/_vendor/hub.html` and `assets/hub-nav.js`.
8. `eleventy.config.js`: remove `hubShell`, the `fs` import, the `_vendor` ignore and the watch target; fix the stale comments.
9. **Rewrite** `src/apps/storefront/index.njk`: layout `base.njk`, English SEO front matter, and the sections from §1, using `section-tabs`, the card macros and data-driven counts.
10. **New** `src/_includes/styles/hub.css` (page CSS). **New** `src/_includes/styles/form.css`, which promotes the stickers `.fld`/`.btn-send` styles with 16px inputs.
11. The hub template reads `trial` (from PR A). Bilingual copy (box, FAQ, terms) lives in the template, and the numbers are inserted from the variables. The page passes the ZIP range and box regex to the browser JS as an inline JSON config.
12. **New** `assets/trial.js`: steps, validation, ZIP check, `__slSubmit`, success and error states, analytics events, and the "already requested" soft guard (D13).
13. **New** `src/_includes/base-lite.njk` (no cart). **New** `src/r.njk` (permalink `r/index.html`) and `assets/reorder.js`.
14. **New** `src/r-print.njk` (permalink `r/print/index.html`), noindex, the QR sheet generator. May be split into a PR C if PR B grows too large.
15. `src/_includes/cart.njk:11`: keep the `#crear` link (the hub now has `id="crear"`); make its copy match the custom-collections section.
16. `sitemap.xml`: bump the hub's `lastmod`. Do **not** add `/r/`.
17. `tools/verify_site.py`
    - delete the React-header check (`:293-295`) and the hub-nav check (`:385-388`);
    - add the hub to `THEMED_PAGES`, and `r/` and `r/print/` to `PAGES` + `NOINDEX_PAGES`;
    - new checks: trial-form wiring (fields, `_honey`, ZIP pattern, privacy marker, `order.js` + `trial.js`); reorder static hrefs; noindex pages unlinked; hub parity (3 collections, 5 categories, `#crear`, `#trial`); guard that fails if `parcelRequire` or `<div id=root>` ever reappears; no orphan files in `assets/img/`.
18. **Delete orphaned hub images.** Of the 79 hub-only files, keep the 3 collection hero images and drop the rest. The orphan check enforces this.
19. Docs:
    - `CLAUDE.md`: rewrite the hub section, the two-stylesheet rationale and the cross-page-links sweep;
    - `docs/SITE-CONFIG.md`: stale lines 76/80, add rows for the trial form, reorder page and GoatCounter;
    - `docs/BACKLOG.md`: tick off done items, add the launch checklist.

## 7. Pass/fail criteria (the phase 4 test loop runs against these)

**Automated (CI and local):**
- [ ] `npm run verify` is green, including all the new checks in step 17.
- [ ] The PR A parity diff shows only the allowed differences.
- [ ] Playwright, on a phone viewport (375×812) and desktop (1280×800), in both EN and ES:
  - hub renders with no console errors;
  - every hub link resolves;
  - sticky CTA scrolls to `#trial`;
  - trial happy path: FormSubmit is mocked, and the payload contains every field plus `_honey` empty;
  - out-of-area path skips step 2 and sends `area=outside`;
  - validation errors show inline;
  - a network failure falls back to a mailto containing every field;
  - `/r/?box=MB-014` builds email and WhatsApp hrefs containing `MB-014`;
  - `/r/?box=<script>` renders as inert text;
  - `/r/` with no code still works.
- [ ] Screenshots at 375, 768 and 1280, in EN and ES, for: hub, each form state, the reorder page and the print sheet. These are kept for a visual diff in the next loop.
- [ ] Lighthouse mobile on the hub: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- [ ] The hub page weighs less than the old one (316 KB HTML).
- [ ] The build passes **with every variable empty**: price, proof and minimum blocks are absent, and the output has no `undefined`, `NaN` or `$ ` with no number.
- [ ] The build passes **with every variable set**: blocks render with the values.
- [ ] A non-numeric variable fails the build.

**Manual (human):**
- [ ] One real trial request reaches the owner's inbox (after FormSubmit is activated).
- [ ] The printed QR card scans on 3 phones (iPhone and Android) in shop lighting.
- [ ] The owner reads the page in Spanish and English and approves the copy.

## 8. Phase 2 (design) brief — what the design agent gets
- **Inputs:** this plan, hub-content §7 (current visual system: navy/gold, Playfair + Archivo, glass panels, grain), and the brand tokens in `brand.css`.
- **Output:** 2–3 directions as static HTML mockups in `docs/hub-trial/design/` (not deployed), for the hub on phone and desktop. **After a direction is picked:** every form state, the reorder page and the QR card. Screenshots go in the same folder.
- **Rules:**
  - real product images from `assets/img/` only;
  - no fake numbers (use visibly marked `[placeholder]` blocks);
  - phone-first;
  - honours `prefers-reduced-motion`;
  - may evolve the current look, must not discard the brand.

## 9. Launch checklist (owner actions)
- [ ] Activate FormSubmit and switch to the hashed endpoint (BACKLOG).
- [ ] Create a GoatCounter account and set the `GOATCOUNTER_CODE` variable.
- [ ] Choose the final domain **before** printing the cards.
- [ ] Jesús supplies, then sets as variables: prices and suggested retail prices, proof numbers, and confirms the reorder minimum. Later: shelf photos and quotes.
- [ ] Timing: boxes ship **late Oct–early Dec 2026**, before the Jan–Mar season (market §5).

## Open questions
- Q5. Custom domain before printing cards? Which one? (Blocks printing only, not design or build.)
