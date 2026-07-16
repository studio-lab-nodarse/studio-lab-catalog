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
| **Order email (decided)** | **`jesusnodarse1823@gmail.com`** | Chosen 2026-07-16 as the order destination. NOT yet wired into pages — Phase 1 replaces the `mailto:` flow with a form-to-email service pointing here. |
| Order email (still in code) | `nodarsesartsllc@gmail.com` | `MP_EMAIL` constant in storefront + hardcoded `mailto:` (~10 spots). To be replaced in Phase 1. |
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
| Root landing | `/studio-lab-catalog/` |
| Catalog 2026 | `/apps/catalog/` |
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

## Where used (update these when a value changes)

- **Order email** — storefront `MP_EMAIL` constant + hardcoded `mailto:` in `gorras/magnets/stickers.html` and `colecciones/*.html`; catalog order action.
- **WhatsApp number** — `apps/catalog/index.html` (`wa.me/17864834268`).
- **Legal name / brand** — SEO JSON-LD (Phase 2), footers.
- **Base URL** — canonical / OG / sitemap / robots (Phase 2).
