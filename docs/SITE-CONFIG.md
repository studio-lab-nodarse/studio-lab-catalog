# Site Config — reusable constants

Human-readable reference for the values that recur across the site (order channels, identity, URLs).

**As of 2026-07-21 these are injected at build time from [`src/_data/site.json`](../src/_data/site.json)** for the six templated storefront pages — change them there first, then update this doc to match. Two places `site.json` does *not* reach and that still hardcode values: `assets/order.js` (the FormSubmit endpoint) and the pre-built hub `apps/storefront/index.html`. See "Where used" below; CI guards both.

## Identity

| Key | Value |
|-----|-------|
| Parent brand | Studio Lab |
| Storefront sub-brand | Miami Peculiar |
| Legal entity | Nodarse Arts LLC |
| Artist / founder | Jesús Nodarse |
| Pricing model | Order-to-quote — **no public prices shown anywhere** ("Pedido para cotizar") |
| Market / theme | Miami · Cuban-American (English-first audience; content is bilingual) |
| Languages | `en` + `es` (bilingual, runtime JS toggle — same URL) |
| Default `lang` | **`en`** (primary market, decided 2026-07-21). Pages must SHIP English so `setLang()` is a no-op on load — the build's `defaultLangEn` transform enforces this, and CI fails on any element shipping `es`. `og:locale` is `en_US`, alternate `es_US`. |
| Socials | none yet |

## Contact / order channels

| Key | Value | Notes |
|-----|-------|-------|
| **Order email** | **`jesusnodarse1823@gmail.com`** | Live destination. Wired via FormSubmit (Phase 1). Old `nodarsesartsllc@gmail.com` fully removed; CI blocks its return. |
| Order transport | FormSubmit AJAX → `https://formsubmit.co/ajax/jesusnodarse1823@gmail.com` | Added script (`__slp`/`__slwa`) intercepts the order sinks and POSTs. Fallback = original mailto/WhatsApp. **Needs one-time FormSubmit activation** (owner clicks the confirm email on first order). |
| WhatsApp / phone | `+1 786 483 4268` → `https://wa.me/17864834268` | catalog primary today; becomes secondary after Phase 1 |

## URLs / hosting

| Key | Value |
|-----|-------|
| GitHub repo | `studio-lab-nodarse/studio-lab-catalog` |
| Pages base URL | `https://studio-lab-nodarse.github.io/studio-lab-catalog/` |
| Custom domain | none (no CNAME) |
| Deploy | push to `main` → Actions builds with Eleventy → Pages serves `_site/` |

## Canonical page URLs

| Page | Path |
|------|------|
| **Catálogo 2026** | `/studio-lab-catalog/` — the root page (restored 2026-07-23) |

| Storefront hub (Miami Peculiar) | `/apps/storefront/` |
| Caps / Magnets / Stickers | `/apps/storefront/{gorras,magnets,stickers}.html` |
| Collections | `/apps/storefront/colecciones/{miami,cuban-american,miami-beach}.html` |

## Brand assets

Under `assets/` — derived from the storefront header logo (a cream double-heart mark on navy `#081420`):

| File | Use | Size |
|------|-----|------|
| `assets/brand-logo.png` | source mark (cream, transparent) | 500×461 |
| `assets/favicon.png` | favicon (`rel=icon`) | 512×512 |
| `assets/apple-touch-icon.png` | iOS home-screen icon | 180×180 |
| `assets/og/default.jpg` | Open Graph / Twitter share card (all pages) | 1200×630 |

## Brand design tokens (Miami Peculiar storefront)

Single source of truth: **`assets/brand.css`** (`:root`), linked by the category/collection pages (gorras, magnets, stickers, colecciones/*). Change a color here once. The hub (`apps/storefront/index.html`) uses its own shadcn token set and paints brand colors as literals; the catalog is a separate red/white surface.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#081420` | navy page background |
| `--surface` | `rgba(8,20,32,.72)` | translucent panel |
| `--card` | `#0f2337` | raised card navy |
| `--mataqua` | `#16304a` | mid-navy accent |
| `--border` | `rgba(243,234,214,.14)` | cream hairline |
| `--accent` | `#f0b429` | primary gold (CTAs) |
| `--accent2` | `#d9b25a` | muted gold (secondary) |
| `--text` | `#f3ead6` | cream body text |
| `--muted` | `#a8b8c8` | muted slate text |
| `--tag-bg` | `rgba(240,180,41,.14)` | gold tag/pill wash |

`assets/brand.css` also holds the shared **masthead** styles (`header`-scoped: brand lockup, `.hdr-nav` category nav, `.lang-toggle`, and a pure-CSS mobile hamburger `.mnav-btn`/`.mnav-toggle` checkbox) and the site **footer** (`.sl-sitefooter`). At **≤760px** the nav collapses into the hamburger dropdown, the subtitle hides, the wordmark shrinks, and tap targets grow to ≥44px. The 6 themed pages share one header structure — heart logo + "MIAMI **PECULIAR**" + a page-specific bilingual `Studio Lab · …` subtitle + a Gorras/Magnets/Stickers nav (current page highlighted) + EN/ES toggle. Each page keeps its own toggle JS (`L()` vs `setLang()`); only the lockup/nav/CSS are unified. CI (`tools/verify_site.py`) fails if a themed page stops linking `brand.css`, re-inlines the token block, if the footer nav diverges, or if a page's masthead loses the shared lockup/nav.

## Where used (update these when a value changes)

- **Order email** — the FormSubmit endpoint now lives in **one shared file, `assets/order.js`** (loaded by all 8 app pages via `<script src>`); change it there once. Also in the fallback `mailto:` strings + `MP_EMAIL` and the JSON-LD `contactPoint.email` (per page). CI (`tools/verify_site.py`) fails if the old address reappears, if a page inlines a FormSubmit endpoint, if `order.js`'s endpoint drifts from the order email, or if any app page stops loading `order.js`.
- **WhatsApp number** — storefront order flow (`wa.me/17864834268`). (Also in the deprecated `deprecated/catalog/index.html`, no longer live.)
- **Legal name / brand** — SEO JSON-LD (Phase 2), footers.
- **Base URL** — canonical / OG / sitemap / robots (Phase 2).
