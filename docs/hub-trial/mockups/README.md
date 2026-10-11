# Hub mockups: "Salt & Shelf" (pick one)

**Vision.** A clean store you'd trust with your shelf space, with Miami Beach light coming through it. Minimog-style structure (off-white space, tidy cards, trust signals, one loud yellow CTA) carries the sale, and coastal moments (ocean photos, cabana stripes, Art Deco arches, a marquee, a spinning seal) make it feel like Miami rather than a template. The product art is the colour: the page stays calm so the magnets can shout.

**Palette.** Paper `#FAF7F0` · Sand `#F2EBDD` · Seaglass `#DCEFEA` · Blush `#F8E2E3` (tiles) · Ocean teal `#0E6B6B` · Deep lagoon `#08454A` · **Sun `#FFD23F` (the CTA only, plus sunny bands)** · Ink `#0D2230` (text) · Muted `#4E5F69`. Used only as sharp accents: Cobalt `#2B45D8` (focus ring) and Bougainvillea `#C8285F` (★ and errors). All text pairs pass AA.

**Fonts (Google).** *Big Shoulders Display* 800/900 is the condensed display face, with an Art Deco signage feel, for headlines, numerals and the marquee. *Instrument Sans* is the UI and body face. *Instrument Serif* italic supplies the warm accent words. Inputs are 17px.

**Wordmark.** A faithful SVG redraw of the heart mark that takes the current colour: ink on light, paper on dark, with the outline thickened for small sizes. It sits beside **MIAMI** in condensed caps, *Peculiar* in italic serif and **BY STUDIO LAB** in tracked micro caps. Both H1s reuse the same caps + italic pairing ("…THAT *sell.*"). Note: the source PNG is actually dark ink (#000/#2b2b2b), not light.

**Signature moves.** ★ pill tags · a "stamped" yellow button (ink border + offset shadow) · Art Deco arch frames · cabana stripes · a marquee ribbon · a rotating "Free trial box ★ One per shop" seal · one wave-masked photo per page · 01/05 numbering with outline numerals.

**v1 "Store"** (`v1/`) is product-led and follows plan §1 in order. It has a trust bar, a sticky header, a seaglass hero panel (arch photo, sun disc, magnets) and proof chips. After that come cards for the box, 6 bestsellers with margin rows, collections and 5 category tiles, and the form sits on an ocean-photo band.
**v2 "Coastal editorial"** (`v2/`) opens on a full-bleed ocean hero with huge yellow type and a postcard pile. A Key West-style "MADE IN MIAMI" story and numbered chapters come before the products. The box sits on bold stripes, collections are big editorial panels, products are an index list, and the form is on a sunny band.

**Viewing.** Open `v*/index.html` directly. The form works: try ZIP `33139` (in area → step 2 → success) or `10001` (out-of-area message → success), or submit empty fields to see the errors. Screenshots: `phone.png` (390 CSS px, @2x, full page), `phone-fold.png`, `phone-sticky.png` (sticky CTA) and `desktop.png` (1440, full page). Counts come from `src/_data`: 70 magnets, 28 stickers, 6 caps × 6 colours, 19 totes and 14 coasters, 137 products in all. Miami Beach has 22 magnets / 46 products, Miami 27 / 53 and Cuban American 21 / 38. Every unknown is marked `[placeholder]`.

**Open questions**
- v1 or v2, or v1's structure with v2's hero?
- Bestseller picks + prices? Proof numbers (shops, units, reorder %, years)?
- Pieces per box? Ship time after approval? Custom-collection minimums and lead time?
- Magnets have no names in the data. Are the descriptive names ("Lifeguard Tower") OK?
- Keep the stock atmosphere photos (Oakland palms, a non-FL gift shop), or use your own shots?
