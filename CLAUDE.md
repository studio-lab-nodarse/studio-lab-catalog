# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static site hosting **the "Miami Peculiar" storefront**, built with **Eleventy** (`src/` → `_site/`) and deployed to GitHub Pages. `_site/` is the deploy artifact and is gitignored — never commit it.

- **`src/`** — the source for the six templated storefront pages: templates (`src/apps/storefront/*.njk`), content data (`src/_data/*.json`), and shared partials (`src/_includes/`). **This is where you edit.**
- **`apps/storefront/index.html`** — the hub, the one remaining pre-built page, passed through verbatim (see "Two kinds of page" below).
- **`assets/`** — shared runtime code + images, passed through verbatim: `order.js`, `cart.js`, `flip.js`, `brand.css`, `hub-nav.js`, and content-hashed images in `assets/img/`.
- **`index.html`** (root) — a thin **redirect** to `apps/storefront/` (meta-refresh + JS), so opening `/` lands you in the storefront. Keeps GitHub Pages `/` working + retains site-level SEO/JSON-LD.
- **`deprecated/catalog/`** — the retired "Catálogo 2026" app. **Deprecated 2026-07-20**: unlinked and not part of the build (it is simply never copied into `_site/`). Kept for reference only — do not link to it or treat it as live.

The live page set is: the hub, `gorras`, `magnets`, `stickers`, and `colecciones/{miami,cuban-american,miami-beach}`.

## Two kinds of page — know which one you're editing

Not all pages are the same shape. Check before you edit.

**1. Templated pages (Eleventy) — edit the source, not the HTML.**
All six hand-authored storefront pages are now generated. Never edit their built HTML in `_site/`.

| Page | Template | Data |
|---|---|---|
| magnets | `src/apps/storefront/magnets.njk` | `src/_data/magnets.json` |
| colecciones/{miami,cuban-american,miami-beach} | `src/apps/storefront/colecciones/*.njk` | **same** `magnets.json`, filtered by `col` |
| gorras | `src/apps/storefront/gorras.njk` | `src/_data/gorras.json` |
| stickers | `src/apps/storefront/stickers.njk` | `src/_data/stickers.json` |

Shared markup lives in `src/_includes/`: `base.njk` (layout), `base-stickers.njk` (stickers' different tail order), `head.njk` (SEO + JSON-LD), `header.njk`, `cart.njk`, `site-footer.njk`, and the card macros `product-card.njk` / `cap-card.njk` / `sticker-card.njk`. Page copy + SEO/meta live in each page's front matter.

**2. Frozen pre-built page — surgical edits only.**
- **`apps/storefront/index.html` (the hub)** is the *only* remaining frozen page: compiled, minified React (~195 KB on a *single line*; JSX already transpiled to `createElement`). **No source exists in this repo.** It is passthrough-copied — never parsed, never reformatted. Treat it as a vendored binary; do not "clean it up". Its dead nav anchors are wired externally by `assets/hub-nav.js`.

Images are **not** inlined: they live as content-hashed files in `assets/img/` and are referenced by relative path. Do not re-inline base64 (CI fails on it).

### FROZEN — do not re-paste AI-builder exports

The committed sources are **frozen** (2026-07-16). The pages were originally produced by an AI site builder, but the repo does not treat them as disposable exports. **Do not re-paste a fresh export over a page** — it erases the SEO metadata, order-form wiring, and other hand-made production changes. All updates are git-tracked edits: to `src/` for the six templated pages, surgical for the hub. See [docs/REMEDIATION-PLAN.md](docs/REMEDIATION-PLAN.md) for the roadmap and decision log.

## Project constants (single source of truth)

For the templated pages these are **injected from `src/_data/site.json`** — change them there. [docs/SITE-CONFIG.md](docs/SITE-CONFIG.md) remains the human-readable reference and lists every "Where used" spot; keep the two in step. Quick reference: brand **Studio Lab** (storefront sub-brand **Miami Peculiar**), legal entity **Nodarse Arts LLC**, order email `jesusnodarse1823@gmail.com` (via FormSubmit; CI blocks the old `nodarsesartsllc@gmail.com`), WhatsApp `wa.me/17864834268`, bilingual **en/es** (runtime toggle), Pages base `https://studio-lab-nodarse.github.io/studio-lab-catalog/`.

Note: the order email also lives in `assets/order.js` (the FormSubmit endpoint) and the **hub** still hardcodes its own copies — `site.json` does not reach either. CI guards both.

## Cross-page links

For the six templated pages, the nav and footer links now come from **one partial each** (`header.njk`, `site-footer.njk`), so renaming a page is a single edit plus its `permalink`. Relative depth is handled by each page's `navBase` (`""` at `apps/storefront/`, `"../"` for `colecciones/`) and `assetsBase`.

The **hub** is the exception — it still hardcodes links in several forms a plain `grep href=` will miss:

- static HTML: `href="magnets.html"`
- JS-constructed: `href:"stickers.html#sec-"+key`
- imperative nav: `location.href="gorras.html"`
- its collections map: `{beach:"colecciones/miami-beach.html", miami:"...", cuban:"..."}`

After renaming any page, sweep the hub for the old filename across all four forms. `verify_site.py` checks that every link resolves in the built output.

## Build / develop / preview

There **is** a build step now (Eleventy). Input `src/`, output `_site/`. The output tree mirrors the old repo layout exactly, so every existing relative link and `tools/verify_site.py` still work unchanged.

```
npm install          # once
npm run dev          # eleventy --serve --incremental, http://localhost:8080
npm run build        # -> _site/
npm run verify       # build, then run verify_site.py against _site/
```

`_site/` and `node_modules/` are gitignored — never commit build output.

**Common tasks:**
- *Add / edit / reorder a magnet* → edit `src/_data/magnets.json`. Each product is ~5 fields: `num`, `col`, `img`, `tint`, `tint2`, plus optional `cut` (image modifier), `shape` (`round` | `hz`), `backImg`, or explicit `nameEs`/`nameEn`/`desc` overrides. **This one file also drives the three collection pages**, which filter it by `col` — add a magnet once and it appears on both.
- *Add / edit a cap* → `src/_data/gorras.json`. Per cap: `num`, `col`, `labelEs`/`labelEn`, `back`, and `imgs` (one image per colourway). The shared `colors` array defines the swatches, and the runtime `CAPIMG` lookup is **generated** from this data by the `capimg` filter — no hand-maintained inline JSON.
- *Add / edit a sticker* → `src/_data/stickers.json`, grouped into `sections`. Per sticker: `num`, `r` (rotation), `img`, `size`, `title`, `sub`.
- *Change the header / footer / cart / SEO* → edit the one partial in `src/_includes/`. It applies to every templated page.
- *Change a shared constant* (order email, WhatsApp, base URL) → `src/_data/site.json`, and keep [docs/SITE-CONFIG.md](docs/SITE-CONFIG.md) in step.

**Known per-page quirks kept deliberately** (they preserve byte-parity with the frozen originals; unify only as a separate, deliberate pass):
- gorras uses `L()` + button ids `be`/`bs`; stickers uses `setLang()` + `btEN`/`btES`; the rest use `setLang()` + `b-en`/`b-es`. Parameterised in `header.njk`.
- gorras and stickers default their EN/ES toggle to **EN**; page CSS also drifts between pages (e.g. `border-radius` 13px vs 3px), so each page keeps its own CSS partial.
- stickers has no small `<footer>`, no `MP_COL`, and loads its scripts in a different order — hence `base-stickers.njk`.

**How the migration was validated (2026-07-21):** each generated page was compared against its frozen original with inter-tag whitespace collapsed (`re.sub(r'>\s+<','><',s)`) and had to match exactly. That parity gate caught four things a visual skim would have missed: a per-card back-photo variant, a missing `</head>` in gorras (fixed, not reproduced), per-page footer taglines, and gorras' extra cart CSS. Use the same technique for any future template change against a known-good build.

## Deploy

`.github/workflows/static.yml` **builds with Eleventy and publishes `_site/`** on every push to `main` (or manual dispatch): `npm ci` → `npm run build` → `verify_site.py` → `upload-pages-artifact` → `deploy-pages`. The build runs the invariant checks too, so a bad build never ships. `deprecated/` and `src/` are simply never copied into `_site`, so no strip step is needed. `.nojekyll` is passed through to force raw file serving.

Pushing to `main` publishes — so **work on a branch and open a PR**; the user controls merges to `main`.

**CI gate:** `.github/workflows/ci.yml` builds and runs `tools/verify_site.py` against `_site/` on every PR and on `main`. It enforces the invariants (links resolve, images stay externalized, SEO tags + JSON-LD intact, page-size budget, order-form wiring, shared-block drift). Run it locally before pushing: `npm run verify`. Keep it green. (Making it *block* merges requires branch protection on `main` — a repo setting the owner enables.)
