# Site Config — reusable constants

Single source of truth for the values that recur across the site (order channels, identity, URLs). When one changes, update it here **and** in the frozen HTML files that hardcode it (see "Where used"). Kept as docs because there is no build step yet (Phase 5 will turn this into an injected config).

## Identity

| Key | Value |
|-----|-------|
| Parent brand | Studio Lab |
| Storefront sub-brand | Miami Peculiar |
| Legal entity | Nodarse Arts LLC |
| Artist / founder | Jesús Nodarse |
| Pricing model | Order-to-quote — **no public prices shown anywhere** ("Pedido para cotizar") |
| Market / theme | Miami · Cuban-American |
| Languages | `en` + `es` (bilingual, runtime JS toggle — same URL) |
| Default `lang` | `es` (primary market) |
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
| Deploy | push to `main` → Pages serves repo root |

## Canonical page URLs

| Page | Path |
|------|------|
| Root landing | `/studio-lab-catalog/` → **redirects** to `/apps/storefront/` |
| ~~Catalog 2026~~ | **Deprecated** (2026-07-20). Moved to `deprecated/catalog/`, unlinked, stripped from deploy. |
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
