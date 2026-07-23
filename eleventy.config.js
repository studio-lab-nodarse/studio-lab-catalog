// Eleventy build for the Miami Peculiar storefront.
//
// Model: templates + data in `src/` are generated into `_site/`; everything else
// is copied through verbatim. The output tree mirrors the old repo layout exactly,
// so every existing relative link/asset path (and tools/verify_site.py) still holds.
//
// PASSTHROUGH = never parsed, never reformatted.
//
// The hub is a special case: its compiled-React bundle (no source exists) lives
// untouched at src/_vendor/hub.html and is never parsed as a template. The
// `hubShell` filter below does a few explicit string injections on it at build
// time so it can share the site masthead. See src/apps/storefront/index.njk.

import fs from "node:fs";

// Copied verbatim from the repo root into _site/ at the same path.
const PASSTHROUGH = [
  "assets",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "404.html",
  // The root page IS the "Catálogo 2026" app — its original home, restored
  // 2026-07-23. Hand-authored (not templated), so it is copied verbatim.
  // The storefront remains at apps/storefront/, linked from the catalog's footer.
  "index.html",

  // NOTE: the hub is NOT here. Its compiled-React bundle lives untouched at
  // src/_vendor/hub.html and is assembled by src/apps/storefront/index.njk,
  // which injects the shared masthead into it at build time.
  // All hand-authored storefront pages are now templated under src/.
  // Migrated already (generated from src/, so NOT listed here):
  //   magnets, gorras, stickers, colecciones/{miami,cuban-american,miami-beach}
];

export default function (eleventyConfig) {
  for (const p of PASSTHROUGH) {
    eleventyConfig.addPassthroughCopy({ [p]: p });
  }


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

  // The vendored hub bundle must never be treated as a template — it is
  // minified JS/JSX output full of `{` and `{{` that Nunjucks would choke on.
  eleventyConfig.ignores.add("src/_vendor/**");
  // ignores + a raw fs read put the bundle outside Eleventy's dep graph,
  // so the dev server would not rebuild the hub when it changes.
  eleventyConfig.addWatchTarget("src/_vendor/hub.html");

  // Assemble the hub: take the frozen compiled-React bundle and inject the
  // shared masthead into it, without touching the bundle on disk.
  //
  //   1. before <body>  -> masthead stylesheet + a rule hiding React's own
  //                        header, plus the </head> the bundle never had
  //   2. before #root   -> the shared <header> markup, OUTSIDE the React mount
  //                        so React re-renders can't wipe it
  //
  // React's header stays in the DOM (hidden) because its EN/ES buttons still
  // drive the app's language state — assets/hub-nav.js forwards clicks to them.
  eleventyConfig.addFilter("hubShell", (vendorPath, headerHtml, assetsBase) => {
    const src = fs.readFileSync(vendorPath, "utf8");
    const bodyAt = src.indexOf("<body>");
    const rootAt = src.indexOf("<div id=root>");
    // Fail loudly: a missed anchor must break the build, not silently ship a
    // hub with no masthead.
    if (bodyAt === -1) throw new Error(`hubShell: no <body> in ${vendorPath}`);
    if (rootAt === -1) throw new Error(`hubShell: no <div id=root> in ${vendorPath}`);

    const headInject =
      `<link rel="stylesheet" href="${assetsBase}/masthead.css">\n` +
      `<style>#root header{display:none!important}</style>\n` +
      `</head>\n`;

    // The bundle ships lang="es"; English is the primary market and React sets
    // documentElement.lang at runtime anyway. Rewritten here rather than in the
    // vendored file so the bundle on disk stays byte-for-byte frozen.
    const head = src.slice(0, bodyAt).replace('<html lang="es">', '<html lang="en">');
    if (head === src.slice(0, bodyAt)) {
      throw new Error("hubShell: expected <html lang=\"es\"> to rewrite");
    }

    return (
      head +
      headInject +
      src.slice(bodyAt, rootAt) +
      headerHtml.trim() +
      "\n    " +
      src.slice(rootAt)
    );
  });

  // ── Ship the default language, don't repaint into it ──────────────────
  // Bilingual elements carry data-es/data-en and are rewritten at runtime by
  // setLang(). The markup used to ship the Spanish string while the runtime
  // initialised to English, so ~1260 elements per build visibly flipped
  // ES -> EN after first paint. English is the primary market, so emit the
  // English string as the default text and let setLang() be a no-op on load.
  //
  // Done as a transform rather than by hand-editing ~26 strings across the
  // partials: it is provably exhaustive, and a newly-added bilingual element
  // can't silently reintroduce the flash. Authors keep writing whichever
  // default reads naturally in the template.
  const BILINGUAL = /<([a-z0-9]+)([^>]*\sdata-(?:es|en)="[^>]*)>([^<]*)</gi;
  eleventyConfig.addTransform("defaultLangEn", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) return content;
    return content.replace(BILINGUAL, (m, tag, attrs, text) => {
      const es = (attrs.match(/\sdata-es="([^"]*)"/) || [])[1];
      const en = (attrs.match(/\sdata-en="([^"]*)"/) || [])[1];
      if (es === undefined || en === undefined) return m;   // not a bilingual pair
      if (es.trim() === en.trim()) return m;                // nothing to switch
      if (text.trim() !== es.trim()) return m;              // already ships EN
      return `<${tag}${attrs}>${en}<`;
    });
  });

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
