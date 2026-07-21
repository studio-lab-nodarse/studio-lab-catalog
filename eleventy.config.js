// Eleventy build for the Miami Peculiar storefront.
//
// Model: templates + data in `src/` are generated into `_site/`; everything else
// is copied through verbatim. The output tree mirrors the old repo layout exactly,
// so every existing relative link/asset path (and tools/verify_site.py) still holds.
//
// PASSTHROUGH = never parsed, never reformatted. This is how the hub page
// (apps/storefront/index.html — minified compiled React, no source exists) stays
// frozen while the hand-authored pages around it become templated.

// Copied verbatim from the repo root into _site/ at the same path.
const PASSTHROUGH = [
  "assets",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "404.html",
  "index.html", // root redirect -> apps/storefront/

  // --- Storefront pages not yet migrated to templates ---
  // The hub is an opaque compiled-React bundle: vendored, never edited.
  "apps/storefront/index.html",
  // All hand-authored storefront pages are now templated under src/.
  // Migrated already (generated from src/, so NOT listed here):
  //   magnets, gorras, stickers, colecciones/{miami,cuban-american,miami-beach}
];

export default function (eleventyConfig) {
  for (const p of PASSTHROUGH) {
    eleventyConfig.addPassthroughCopy({ [p]: p });
  }

  // Inline a file's raw contents (used to inline CSS partials into <style>).
  eleventyConfig.addFilter("raw", (s) => s);

  // Build the gorras CAPIMG lookup (num -> colour -> image path) from the data
  // file, so the colourway map is no longer a hand-maintained inline JSON blob.
  // Separators match the original output exactly (`": "` / `", "`).
  eleventyConfig.addFilter("capimg", (items, assetsBase) =>
    "{" +
    items
      .map((it) => {
        const inner = Object.entries(it.imgs)
          .map(([slug, file]) => `"${slug}": "${assetsBase}/img/${file}"`)
          .join(", ");
        return `"${it.num}": {${inner}}`;
      })
      .join(", ") +
    "}"
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html"],
  };
}
