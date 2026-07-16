# Studio Lab

Static site (GitHub Pages) hosting two self-contained apps. Each `.html` file inlines its own CSS/JS/images.

## Structure

```
index.html                 Root landing → links to both apps
apps/
  catalog/
    index.html             App A — "Catálogo 2026". Standalone catalog w/ cart.
  storefront/
    index.html             App B home — "Miami Peculiar". Hub for the storefront.
    gorras.html            Caps
    magnets.html           Magnets
    stickers.html          Stickers
    colecciones/
      miami.html
      cuban-american.html
      miami-beach.html
```

## Links between pages

- storefront `index.html` → `gorras.html`, `magnets.html`, `stickers.html`, `colecciones/*.html`
- storefront category pages → back to `index.html`
- collections → `../index.html`
- catalog app is fully standalone (no cross-links)

## Deploy

GitHub Pages deploys the whole repo root (`.github/workflows/static.yml`) on push to `main`. Root `/` serves the landing page.
