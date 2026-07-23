# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static site hosting **the "Miami Peculiar" storefront**, built with **Eleventy** (`src/` → `_site/`) and deployed to GitHub Pages. `_site/` is the deploy artifact and is gitignored — never commit it.

- **`src/`** — the source for all seven storefront pages: templates (`src/apps/storefront/*.njk`), content data (`src/_data/*.json`), shared partials (`src/_includes/`), and the vendored hub bundle (`src/_vendor/hub.html`). **This is where you edit.**
- **`assets/`** — shared runtime code + images, passed through verbatim: `order.js`, `cart.js`, `flip.js`, `hub-nav.js`, `brand.css`, `masthead.css`, and content-hashed images in `assets/img/`.

**Two stylesheets, deliberately split:** `masthead.css` holds the site header and is loaded by **every** page including the hub; its tokens are declared on `header`, *not* `:root`. `brand.css` holds everything else (page tokens, cards, cart, footer) and is loaded only by the six templated pages. They are separate because the hub can't take `brand.css`: its `:root` block collides with the hub's shadcn tokens (`--card`, `--accent`), and its `body .grid` rule collides with Tailwind's `.grid` utility, which the hub uses. CI enforces both halves of this.
- **`index.html`** (root) — the **"Catálogo 2026" app**, restored to its original home at `/` on 2026-07-23 (it was the root page until the 2026-07-16 reorg, then briefly retired). Hand-authored, passed through verbatim — *not* templated, so edit it directly and surgically. It is Spanish-only (no `data-es`/`data-en` mechanism) and its category tabs are onclick-driven, so `verify_site.py` exempts it from the shipped-language and dead-anchor checks.

The live page set is: the **catalog at `/`**, the storefront hub at `/apps/storefront/`, plus `gorras`, `magnets`, `stickers`, and `colecciones/{miami,cuban-american,miami-beach}`.

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

**`header.njk` is used by all seven pages, including the hub** — change the masthead once, everywhere. It is parameterised by `navBase` (link depth), `navActive`, `headerSubEs`/`headerSubEn`/`headerSubText`, and the language-toggle wiring (`langFn`, `langIdEn`/`langIdEs`, `langActive`).

**2. The hub — a frozen bundle with the masthead injected around it.**
The hub's body is compiled, minified React (~195 KB on a *single line*, JSX already transpiled to `createElement`). **No source exists in this repo.** It lives untouched at **`src/_vendor/hub.html`** and is never parsed as a template (`eleventyConfig.ignores`). Treat it as a vendored binary — do not reformat or "clean it up".

`src/apps/storefront/index.njk` renders the **shared `header.njk`** and hands it to the `hubShell` filter, which does two explicit string injections and nothing else:
1. before `<body>` — the `masthead.css` link, a rule hiding React's own header, and the `</head>` the bundle never had;
2. before `<div id=root>` — the shared `<header>`, **outside** the React mount so re-renders can't wipe it.

The filter throws if either anchor is missing, so a bad injection fails the build rather than shipping a hub with no masthead.

React's header stays in the DOM (hidden) because its EN/ES buttons still own the app's language state — the hub's bilingual content is React state, *not* the `data-es` mechanism the other pages use. `assets/hub-nav.js` defines `slHubLang()`, which forwards clicks from the shared toggle to those hidden buttons and mirrors the active state. It also still wires the bundle's dead placeholder anchors.

Images are **not** inlined: they live as content-hashed files in `assets/img/` and are referenced by relative path. Do not re-inline base64 (CI fails on it).

### FROZEN — do not re-paste AI-builder exports

The committed sources are **frozen** (2026-07-16). The pages were originally produced by an AI site builder, but the repo does not treat them as disposable exports. **Do not re-paste a fresh export over a page** — it erases the SEO metadata, order-form wiring, and other hand-made production changes. All updates are git-tracked edits: to `src/` for the six templated pages, surgical for the hub. See [docs/REMEDIATION-PLAN.md](docs/REMEDIATION-PLAN.md) for the roadmap and decision log.

## Project constants (single source of truth)

For the templated pages these are **injected from `src/_data/site.json`** — change them there. [docs/SITE-CONFIG.md](docs/SITE-CONFIG.md) remains the human-readable reference and lists every "Where used" spot; keep the two in step. Quick reference: brand **Studio Lab** (storefront sub-brand **Miami Peculiar**), legal entity **Nodarse Arts LLC**, order email `jesusnodarse1823@gmail.com` (via FormSubmit; CI blocks the old `nodarsesartsllc@gmail.com`), WhatsApp `wa.me/17864834268`, bilingual **en/es** (runtime toggle, ships **`en`**), Pages base `https://studio-lab-nodarse.github.io/studio-lab-catalog/`.

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

**Language.** English is the primary market. Every page must **ship** English so the runtime `setLang()` is a no-op on first paint — the `defaultLangEn` transform in `eleventy.config.js` rewrites each bilingual element's default text to its `data-en` value at build time, and `verify_site.py` fails the build if any element ships `es`. Before this, ~1260 elements per build shipped Spanish and visibly repainted to English after first paint. Write whichever default reads naturally in a template; the transform normalises it.

**Navigation.** `masthead.css` declares `@view-transition { navigation: auto }` and gives the header `view-transition-name: site-header`, so the masthead is carried across page loads instead of repainting. Pure CSS, no JS; unsupported browsers just navigate normally, and it is disabled under `prefers-reduced-motion`.

**Known per-page quirks kept deliberately** (they preserve byte-parity with the frozen originals; unify only as a separate, deliberate pass):
- gorras uses `L()` + button ids `be`/`bs`; stickers uses `setLang()` + `btEN`/`btES`; the rest use `setLang()` + `b-en`/`b-es`. Parameterised in `header.njk`.
- gorras and stickers default their EN/ES toggle to **EN**; page CSS also drifts between pages (e.g. `border-radius` 13px vs 3px), so each page keeps its own CSS partial.
- stickers has no small `<footer>`, no `MP_COL`, and loads its scripts in a different order — hence `base-stickers.njk`.

**How the migration was validated (2026-07-21):** each generated page was compared against its frozen original with inter-tag whitespace collapsed (`re.sub(r'>\s+<','><',s)`) and had to match exactly. That parity gate caught four things a visual skim would have missed: a per-card back-photo variant, a missing `</head>` in gorras (fixed, not reproduced), per-page footer taglines, and gorras' extra cart CSS. Use the same technique for any future template change against a known-good build.

## Deploy

`.github/workflows/static.yml` **builds with Eleventy and publishes `_site/`** on every push to `main` (or manual dispatch): `npm ci` → `npm run build` → `verify_site.py` → `upload-pages-artifact` → `deploy-pages`. The build runs the invariant checks too, so a bad build never ships. `src/` is never copied into `_site` (only its rendered output is), so no strip step is needed. `.nojekyll` is passed through to force raw file serving.

Pushing to `main` publishes — so **work on a branch and open a PR**; the user controls merges to `main`.

**CI gate:** `.github/workflows/ci.yml` builds and runs `tools/verify_site.py` against `_site/` on every PR and on `main`. It enforces the invariants (links resolve, images stay externalized, SEO tags + JSON-LD intact, page-size budget, order-form wiring, shared-block drift). Run it locally before pushing: `npm run verify`. Keep it green. (Making it *block* merges requires branch protection on `main` — a repo setting the owner enables.)
