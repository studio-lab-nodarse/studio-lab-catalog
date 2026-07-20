# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static site (no build system) hosting **the "Miami Peculiar" storefront**, deployed to GitHub Pages. There is no `package.json`, no bundler, no lint/test tooling — the repo is the deploy artifact.

- **`apps/storefront/`** — the storefront, and the only live app. Multi-page: `index.html` is the hub linking to `gorras.html`, `magnets.html`, `stickers.html`, and `colecciones/{miami,cuban-american,miami-beach}.html`. Category/collection pages link back to the hub. Shared code lives in `assets/` (`order.js`, `cart.js`, `flip.js`, `brand.css`, `hub-nav.js`).
- **`index.html`** (root) — a thin **redirect** to `apps/storefront/` (meta-refresh + JS), so opening `/` lands you in the storefront. Keeps GitHub Pages `/` working + retains site-level SEO/JSON-LD.
- **`deprecated/catalog/`** — the retired "Catálogo 2026" app (was `apps/catalog/`). **Deprecated 2026-07-20**: unlinked from the storefront and **stripped from the GitHub Pages deploy** (see `.github/workflows/static.yml`), but kept in the repo for reference. Do not link to it or treat it as live.

## The critical constraint: pages are pre-built artifacts

Each app page is a **self-contained, pre-bundled HTML file** (1–8 MB):

- One inline `<style>` block, all CSS inlined.
- The app is compiled React inside inline `<script>` / `<script type="module">` blocks — JSX already transpiled to `jsxs`/`createElement`, often **minified onto very few lines** (e.g. the storefront hub is ~12 lines). There is no separate JS/JSX source in this repo.
- Images are embedded as **base64 `data:` URIs** (80–180 per file) — the reason files are large.

Implication: you are editing generated/minified output, not source. Prefer **surgical, targeted string edits** over refactoring. Do not attempt to reformat or "clean up" a minified bundle.

### FROZEN — these files are the source of truth

As of 2026-07-16 the committed HTML files are **frozen as source**. They were originally produced by an AI site builder, but the repo no longer treats them as disposable exports. **Do not re-paste a fresh export over an existing page** — doing so erases the SEO metadata, order-form wiring, and other hand-made production changes. All updates are surgical, git-tracked edits. See [docs/REMEDIATION-PLAN.md](docs/REMEDIATION-PLAN.md) for the production roadmap and decision log.

## Project constants (single source of truth)

Recurring values — brand, legal name, order email, WhatsApp, base URL, canonical paths — live in [docs/SITE-CONFIG.md](docs/SITE-CONFIG.md). Quick reference: brand **Studio Lab** (storefront sub-brand **Miami Peculiar**), legal entity **Nodarse Arts LLC**, order email `jesusnodarse1823@gmail.com` (via FormSubmit; CI blocks the old `nodarsesartsllc@gmail.com`), WhatsApp `wa.me/17864834268`, bilingual **en/es** (runtime toggle, default `es`), Pages base `https://studio-lab-nodarse.github.io/studio-lab-catalog/`. Any of these is hardcoded across the frozen HTML — when one changes, update `SITE-CONFIG.md` and every "Where used" spot it lists.

## Cross-page links are hand-maintained and appear in multiple forms

Links between pages are plain relative paths, and moving/renaming a page means updating **all** of these forms (a plain `grep href=` will miss most of them):

- static HTML: `href="magnets.html"`
- JS-constructed: `href:"stickers.html#sec-"+key`
- imperative nav: `location.href="gorras.html"`
- the storefront hub's collections map: `{beach:"colecciones/miami-beach.html", miami:"...", cuban:"..."}`

Relative depth matters: category pages sit at `apps/storefront/` and link to the hub as `index.html`; collection pages sit one level deeper and link back as `../index.html`. After any move, sweep every page for the old filename across all four link forms before trusting it's done.

## Develop / preview

No build step. Preview by serving the repo root (needed so the root landing's `apps/...` links resolve):

```
python3 -m http.server 8000    # then open http://localhost:8000
```

Opening a single app page directly as a `file://` URL also works for that page in isolation.

## Deploy

`.github/workflows/static.yml` uploads the **entire repo root** to GitHub Pages on every push to `main` (or manual dispatch). `.nojekyll` forces raw file serving. Pushing to `main` publishes — so **work on a branch and open a PR**; the user controls merges to `main`.

**CI gate:** `.github/workflows/ci.yml` runs `python3 tools/verify_site.py` on every PR and on `main`. It enforces the invariants (links resolve, images stay externalized, SEO tags + JSON-LD intact, page-size budget). Run it locally before pushing: `python3 tools/verify_site.py`. Keep it green. (Making it *block* merges requires branch protection on `main` — a repo setting the owner enables.)
