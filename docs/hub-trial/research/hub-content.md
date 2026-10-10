# Hub content inventory: frozen React bundle

Source: `src/_vendor/hub.html` (316,592 B, 33 lines; the app is a Parcel/React 19.2.7 module script). Extracted 2026-10-10 by slicing the app code (offset ≈192 KB into the module, after the React/scheduler modules), formatting it with prettier and reading the `jsx()` tree. The steps are in Appendix B. The bundle was not modified.

Strings below are **verbatim**. `→`, `—`, `…`, `✓`, `✨`, `🧺` are the literal characters in the bundle. `{x}` = runtime value. The React default language is **`en`** (`useState("en")`).

Collection names (`Cuban American`, `Miami Beach`, `Miami`) are **never translated**.

---

## 0. Page anatomy, top to bottom

| # | Block | Visible today? | Source |
|---|---|---|---|
| 0 | Visually hidden SEO `<h1>` (first child of `<body>`) | screen readers / SEO only | bundle, static HTML |
| 1 | Shared masthead (`header.njk`) | yes | injected by `hubShell` right before `#root` |
| 2 | React's own header | **no**: `#root header{display:none!important}` | bundle |
| 3 | Hero: eyebrow, H1, sub, search bar, 2 CTAs | yes | bundle |
| 4 | "How it works" 4-step strip (one big button) | yes | bundle |
| 5 | Collections (`id="colecciones"`): 3 tall image cards | yes | bundle |
| 6 | Shop by product: 5 tiles + "See all" tile | yes | bundle |
| 7 | React footer ("… — Home concept") | yes | bundle |
| 8 | Static site footer `.sl-sitefooter` (Spanish-only) | yes | bundle, static HTML (= `site-footer.njk`) |
| — | Overlays: collection modal, wholesale modal, builder modal, toast | on demand | bundle |

---

## 1. Sections and copy (EN | ES)

### 1.0 Shared masthead (not in the bundle; from `src/_includes/header.njk`)
- Logo `assets/img/9281355fb13182af.png`, alt `Miami Peculiar`, links to `index.html` (the hub itself)
- Wordmark `MIAMI PECULIAR` (with `PECULIAR` bold), sub `Studio Lab · Miami Peculiar` (same in both languages)
- Nav: `Caps`|`Gorras` → `gorras.html` · `Magnets` → `magnets.html` · `Stickers` → `stickers.html` · `Totes` → `totes.html` · `Coasters`|`Posavasos` → `coasters.html`
- `EN` / `ES` buttons → `slHubLang('en'|'es')` (in `assets/hub-nav.js`), which clicks React's hidden toggle
- Mobile: `☰` checkbox menu, `aria-label="Abrir menú"` (Spanish-only)

### 1.1 React header (rendered but hidden)
| Element | EN | ES |
|---|---|---|
| Logo | `assets/img/ac1c39532a6ec220.png` alt `Miami Peculiar` (CSS-filtered to cream with a gold glow) | same |
| Wordmark | `MIAMI PECULIAR` | same |
| Sub | `Studio Lab · Jesús Nodarse` | same |
| Nav (no `href`) | `Products` · `Themes` · `New` | `Productos` · `Temas` · `Novedades` |
| Cart pill (only when `mp_order` qty > 0) | `🧺 {n}` → `colecciones/miami-beach.html#pedido` | same |
| Lang toggle | `en` / `es` (uppercased by CSS) | same |

So the hub currently shows **no cart count** anywhere, because the pill lived in the hidden header.

### 1.2 Hidden SEO H1 (static HTML, before `#root`)
`Miami Peculiar — Gorras, Magnets y Stickers de Miami | Studio Lab` (Spanish only). The React hero below also renders an `<h1>`, so the page has **two H1s**.

### 1.3 Hero
| Key | EN | ES |
|---|---|---|
| Eyebrow (gold rule + caps) | `Wholesale · Made in Miami` | `Mayorista · Hecho en Miami` |
| H1 line 1 | `Your shop,` | `Tu tienda,` |
| H1 line 2 (`<em>`, gold) | `your own collection.` | `tu propia colección.` |
| Sub | `Tell us about your business — its style, its space, its customers — and we design a souvenir collection just for it. You approve every design, and samples ship to you free.` | `Cuéntanos de tu negocio — su estilo, su espacio, sus clientes — y diseñamos una colección de souvenirs a su medida. Apruebas cada diseño y las muestras te llegan gratis.` |
| Search placeholder | `Search products or collections…` | `Busca productos o colecciones…` |
| Search button | `Search` | `Buscar` |
| Primary CTA (button) | `Create your collection →` | `Crea tu colección →` |
| Secondary CTA (`<a>`, underlined) | `Request wholesale pricing →` | `Solicitar precios mayoristas →` |

- The search input and button have **no handlers**, so search does nothing.
- The primary CTA opens the **builder modal** (§4.2).
- The secondary CTA opens the **wholesale modal** (§4.1); see also §3.3.

### 1.4 "How it works" strip
The whole strip is one `<button>` that opens the builder. Desktop shows all 4 steps inline (`01 … → 02 … → 03 … → 04 …`). Mobile shows an auto-sliding carousel: 2 steps at a time, every 3.5 s, with 2 dots.

| Step | EN title | ES title | EN description (**defined, never rendered**) | ES description (never rendered) |
|---|---|---|---|---|
| 01 | `Tell us about your shop` | `Cuéntanos tu negocio` | `Style, space, audience — two minutes.` | `Estilo, espacio, público — dos minutos.` |
| 02 | `We design your collection` | `Diseñamos tu colección` | `Original pieces made to match your world.` | `Piezas originales hechas para tu mundo.` |
| 03 | `You approve every design` | `Apruebas cada diseño` | `We refine until it feels yours.` | `Afinamos hasta que se sienta tuyo.` |
| 04 | `Free samples, then production` | `Muestras gratis, luego producción` | `Approved designs ship free to your door.` | `Los diseños aprobados llegan gratis a tu puerta.` |

The label `How it works` | `Cómo funciona` is defined but **never rendered**.

### 1.5 Collections (`<section id="colecciones">`)
- Heading: `Collections` | `Colecciones`, with a 3-bar underline
- Header action: `View all →` | `Ver todas →`. This is an `<a>` with no `href`, **hidden by `hub-nav.js`**.

Each card shows the name (Playfair) and a tag (caps). Below that is a tall image tile with a pill reading `{count} designs` | `{count} diseños`. Clicking a card opens the collection modal (§1.6).

| Order | Name | Tag EN | Tag ES | Pill count | Image |
|---|---|---|---|---|---|
| 1 | `Cuban American` | `Roots & flavor` | `Raíces y sabor` | `34` | `assets/img/d44aa4b9f402fc12.webp` |
| 2 | `Miami Beach` | `Sun, sand & sea` | `Sol, arena y mar` | `41` | `assets/img/0ee69ee2035ae39d.webp` |
| 3 | `Miami` | `The Magic City` | `La ciudad mágica` | `40` | `assets/img/cba92eaaedfaf211.webp` |

### 1.6 Collection modal (overlay; Esc or a click on the backdrop closes it)
The modal shows the collection name and tag, the image again, and then `Choose a product` | `Elige un producto` above a 2-column grid of product chips (icon, label, count badge).

| Collection | Chips in order (key: count) |
|---|---|
| cuban | magnets 21 · stickers 7 · totes 4 · coasters 3 · postcards 3 · hats 3 · tshirts 1 |
| beach | magnets 21 · stickers 8 · totes 7 · coasters 7 · hats 2 · prints 2 · postcards 1 |
| miami | magnets 27 · stickers 13 · totes 8 · coasters 4 · placas 4 · hats 1 · pouches 1 · tshirts 1 |

Product labels (`F` map):

| Key | EN | ES |
|---|---|---|
| magnets | `Magnets` | `Imanes` |
| stickers | `Stickers` | `Stickers` |
| coasters | `Coasters` | `Posavasos` |
| hats | `Hats` | `Gorras` |
| prints | `Prints` | `Cuadros` |
| postcards | `Postcards` | `Postales` |
| totes | `Tote Bags` | `Tote Bags` |
| placas | `Plaques` | `Placas` |
| pouches | `Pouches` | `Pouches` |
| tshirts | `T-Shirts` | `Camisetas` |
| mugs | `Mugs` | `Tazas` |

The chip targets are listed in §3. Chips without a page (postcards, prints, tshirts, placas, pouches) show the toast `Coming soon — {label}` | `Próximamente — {label}`.

### 1.7 Shop by product
- Heading: `Shop by product` | `Explora por producto`
- Header action: `Browse catalog →` | `Ver catálogo →`. This is an `<a>` with no `href`, **hidden by `hub-nav.js`**.
- Grid: 2 columns on mobile, 4 at ≥640px. Each tile is a `<div onClick>` (**not an anchor**) with a gold icon square, the label and a count.

| Tile | EN | ES | Count shown | Goes to |
|---|---|---|---|---|
| magnets | `Magnets` | `Imanes` | `69` | `magnets.html` |
| stickers | `Stickers` | `Stickers` | `28` | `stickers.html` |
| hats | `Hats` | `Gorras` | `6` | `gorras.html` |
| totes | `Tote Bags` | `Tote Bags` | `19` | `totes.html` |
| coasters | `Coasters` | `Posavasos` | `14` | `coasters.html` |
| gold tile | `See all` | `Ver todo` | `14 types` / `14 tipos` | **nothing: dead `<div>`, no handler** |

### 1.8 React footer
- Line 1: `MIAMI PECULIAR · Studio Lab` (same in both languages)
- Line 2: `Jesús Nodarse · Miami, FL · 2026 — Home concept` | `Jesús Nodarse · Miami, FL · 2026 — Concepto de home`. "Home concept" is AI-builder placeholder text that is **live in production**.

### 1.9 Static site footer (`.sl-sitefooter`, `aria-label="Navegación Studio Lab"`)
Spanish-only labels with absolute URLs. It is identical to `src/_includes/site-footer.njk`, and CI's footer drift check enforces that.

Links: `Inicio` · `Miami Peculiar` · `Gorras` · `Magnets` · `Stickers` · `Totes` · `Posavasos` · `Colección Miami` · `Colección Cuban American` · `Colección Miami Beach`. Copyright line: `© Studio Lab · Nodarse Arts LLC · Miami`.

---

## 2. Images

All images are relative `../../assets/...`. **None are inlined**; the only data URI is an SVG noise texture. All 79 `assets/img` files in the bundle are **used only by the hub**: no template, data file or root page references them. Together they are ≈1.5 MB on disk.

| Path | Where | Size | Depicts |
|---|---|---|---|
| `assets/img/9281355fb13182af.png` | shared masthead logo (from `header.njk`, not the bundle) | 467×431 | Brand mark: outline heart with a solid heart/leaf shape inside |
| `assets/img/ac1c39532a6ec220.png` | hidden React header logo | 160×148 | Same heart mark, smaller |
| `assets/img/d44aa4b9f402fc12.webp` | Cuban American card + modal (`background-size:165% auto`) | 700×705 | Round ceramic-tile mural: "Calle 8 · Little Havana · Miami", flowers, dominoes, tropical fruit. Same art as magnet Cuban #31 |
| `assets/img/0ee69ee2035ae39d.webp` | Miami Beach card + modal (`100% auto`, `center bottom`) | 700×700 | Art Deco hotel poster "MIAMI BEACH": palms, vintage cars, woman in a sun hat |
| `assets/img/cba92eaaedfaf211.webp` | Miami card + modal (default `125% auto`) | 700×700 | Maximalist "MIAMI" collage: Art Deco towers, flamingos, vintage cars and bus, cocktails, sunglasses, hibiscus |
| `assets/img/25129ef8d7d4df47.webp` | builder flip-card back, `std` | 212×320 | Back of a portrait wooden magnet: dark magnet sheet plus a "MIAMI PECULIAR ♥ HANDMADE" wood-burn stamp |
| `assets/img/3af55a56a5030c15.webp` | builder flip-card back, `rnd` | 320×318 | Back of a round wooden magnet, same stamp |
| `assets/img/2f6815b45dc5233d.webp` | builder flip-card back, `hz` | 320×212 | Back of a landscape wooden magnet, same stamp |
| `assets/img/8fc3dc2e6c71d2bb.webp` / `c4e9b1c5c142190f.webp` / `53766f59d4f2a591.webp` | custom backs for MB #173, Miami #171, Miami #172 | ~320×208 | Landscape wood back with postage-stamp perforated edge, same stamp |
| 69 magnet thumbnails (Appendix A) | builder pick grid, flip-card front, version form | 213×320 (~15 KB each) | Individual magnet designs. These are **different files** from `src/_data/magnets.json`, which uses 420×630 jpg/webp |
| `https://…/assets/og/default.jpg` | `og:image`, `twitter:image`, JSON-LD `image` / `primaryImageOfPage` | 1200×630 | Heart mark, white on dark navy |
| `https://…/assets/favicon.png` | `<link rel=icon>`, JSON-LD `logo` | 512×512 | Heart mark, white on navy |
| `https://…/assets/apple-touch-icon.png` | apple-touch-icon | — | Heart mark |
| SVG data URI (`feTurbulence`) | full-page noise overlay at 5.5% opacity | — | Film-grain texture |

The pick grid has **no product photos of the other categories** (stickers, totes, caps, coasters). Only magnets have imagery in the hub.

---

## 3. Links and CTAs

### 3.1 Every target

| Element | Kind | Target |
|---|---|---|
| Masthead logo / nav / EN-ES | static `href` | `index.html`, `gorras.html`, `magnets.html`, `stickers.html`, `totes.html`, `coasters.html` / `slHubLang()` |
| React header `Products`/`Themes`/`New` | `<a>` with no `href` (hidden) | none (see §3.2) |
| React header cart pill | static `href` (hidden) | `colecciones/miami-beach.html#pedido` |
| Hero `Create your collection →` | `<button onClick>` | opens builder (fork step) |
| Hero `Request wholesale pricing →` | `<a onClick>`, no `href` | opens wholesale modal (+ hub-nav scroll, §3.3) |
| How-it-works strip | `<button onClick>` | opens builder |
| `View all →` / `Browse catalog →` | `<a>` with no `href` | hidden by hub-nav |
| Collection card | `<button onClick>` | opens collection modal |
| Modal chip `magnets` | `<a href>` via map `q` | `{beach:"colecciones/miami-beach.html", miami:"colecciones/miami.html", cuban:"colecciones/cuban-american.html"}` |
| Modal chip `stickers` | JS-built `href` | `"stickers.html#sec-"+key` (`sec-beach`/`sec-miami`/`sec-cuban`) |
| Modal chip `totes` | JS-built `href` | `"totes.html#sec-"+key` |
| Modal chip `coasters` | JS-built `href` | `"coasters.html#sec-"+key` |
| Modal chip `hats` | `href` via map `K` | `{beach:"gorras.html#sec-beach", miami:"gorras.html#sec-miami", cuban:"gorras.html#sec-cuban"}` (fallback `gorras.html`) |
| Modal chip postcards/prints/tshirts/placas/pouches | `<button>` | toast `Coming soon — …` |
| Shop-by-product tiles | `<div onClick>` → `window.location.href=` | `magnets.html`, `stickers.html`, `gorras.html`, `totes.html`, `coasters.html` (other keys would toast "Coming soon") |
| `See all · 14 types` | `<div>` | **dead** |
| Builder "done" `🧺 Review & send order →` | static `href` | `colecciones/miami-beach.html#pedido` (opens the cart drawer there) |
| Site footer | absolute `href`s | the 10 URLs in §1.9 |

All `#sec-*` anchors exist (in `gorras.njk`, `totes.njk`, `coasters.njk`, and `stickers.json` section ids).

Inbound: `src/_includes/cart.njk:11` (every cart drawer) links to `{{navBase}}index.html#crear` with the text `✨ Want something made just for you? Create your collection from scratch →` | `✨ ¿Algo hecho solo para ti? Crea tu coleccion desde cero →`. On load, `#crear` opens the builder at the fork step. **The rebuild must keep or redirect that hash.**

### 3.2 `assets/hub-nav.js`: what it rewires
It runs a capture-phase click listener on `document`, only for anchors whose `href` is null, `''` or `#`. It matches on text:

| Visible text (regex) | Action | Status today |
|---|---|---|
| `^products\b` / `^productos\b` | scroll to the heading matching `/shop by product\|comprar por producto/` | Moot: the link is in the hidden React header. The ES heading is `Explora por producto`, so the regex would miss in ES anyway |
| `^themes\b` / `^temas\b` / `^new\b` / `^nuevo\b` | scroll to the `Collections`/`Colecciones` heading | Moot (hidden). `Novedades` doesn't match `^nuevo` |
| `request wholesale pricing` / `solicitar precios` / `precios mayoristas` | `preventDefault` + scroll to the `Create your collection` button | See §3.3 |

`hideDeprecated()` (runs at 0, 300 and 900 ms) sets `display:none` on anchors with no `href` whose text matches `browse catalog|ver cat[aá]logo|view all|ver todo`. Its comment says the catalog is "deprecated", but the catalog has since been restored at `/`.

### 3.3 Wholesale CTA double behavior
hub-nav calls only `preventDefault()`, not `stopPropagation()`, so React's `onClick` still fires. One click **both opens the wholesale modal and scrolls the page** to the "Create your collection" button. The hub-nav comment assumes these anchors are handler-less placeholders, which is no longer true for this one.

---

## 4. Forms and interactive flows

Both forms build a `mailto:` string and assign it to `window.__slp.href`. `__slp` is defined in **`assets/order.js`** (loaded after `#root`), which intercepts it (§4.3). Nothing in the hub uses WhatsApp.

### 4.1 Wholesale pricing modal (component `p`)
| Key | EN | ES |
|---|---|---|
| Eyebrow | `Studio Lab · Miami Peculiar` | same |
| Title | `Request wholesale pricing` | `Solicitar precios mayoristas` |
| Sub | `Tell us who you are and we reply with our wholesale catalog and prices within 1 business day.` | `Dinos quién eres y te respondemos con el catálogo mayorista y los precios en 1 día hábil.` |
| Field 1 | `Business name *` | `Nombre del negocio *` |
| Field 2 | `Your name *` | `Tu nombre *` |
| Field 3 (`type=email`) | `Email *` | `Email *` |
| Field 4 (textarea) | `Anything specific you're looking for? (optional)` | `¿Buscas algo en particular? (opcional)` |
| Send | `Request pricing →` | `Solicitar precios →` |
| Close (`aria-label`, shown as `×`) | `Close` | `Cerrar` |

- **Placeholders only, no `<label>`s, no `<form>` element.**
- Validation: business and name must be non-blank and the email must match `/.+@.+\..+/`. Until then the button is greyed out and does nothing; it is not `disabled`.
- Subject: `Wholesale pricing request — {business}` | `Solicitud de precios mayoristas — {business}`
- Body (lines joined with `\n`; the message block is added only if non-empty):
  ```
  Business name: {business}        | Nombre del negocio: {business}
  Your name: {name}                | Tu nombre: {name}
  Email: {email}                   | Email: {email}

  {message}
  ```
- After sending: the modal **stays open** with its fields filled. There is no React success state; the only feedback is order.js's toast.

### 4.2 Collection builder (component `D`), "Your shop, your own collection"
It opens at the **fork** step from the hero CTA, the how-it-works strip, or `#crear`.

**Shared chrome:**
- Eyebrow is `Studio Lab · Miami Peculiar`. In the wizard it becomes `Step {i} of 3 — {k}` | `Paso {i} de 3 — {k}`, with 3 progress bars.
- Footer buttons: `← Back`|`← Atrás` (shows `Close`|`Cerrar` on the fork step), `Next →`|`Siguiente →`, `Send →`|`Enviar →`.

**Fork**, title `How do you want to start?` | `¿Cómo quieres empezar?`:
| Option | EN | ES |
|---|---|---|
| A (outlined) | `✨ Start from our designs`, then `Pick any design and we adapt it to your business — your name, your colors, your area.` | `✨ Partir de nuestros diseños`, then `Elige cualquier diseño y lo adaptamos a tu negocio — tu nombre, tus colores, tu zona.` |
| B (gold) | `Create from scratch →`, then `Tell us about your business and we design something new, just for you.` | `Crear desde cero →`, then `Cuéntanos de tu negocio y diseñamos algo nuevo, solo para ti.` |

**Path B: "from scratch" wizard (3 steps), sent by email**
| Step | Header `k` / title (EN \| ES) | Inputs | Required |
|---|---|---|---|
| 1 | `Products` / `What would you like in your collection?` \| `Productos` / `¿Qué te gustaría en tu colección?` | Hint `Pick all that apply` \| `Marca todos los que apliquen`. Multi-select chips: `Magnets, Stickers, Coasters, Tote Bags, T-Shirts, Hats, Postcards, Prints, Mugs, Other` \| `Imanes, Stickers, Posavasos, Tote Bags, Camisetas, Gorras, Postales, Cuadros, Tazas, Otros` | ≥1 chip |
| 2 | `Your business` / `Tell us where your collection will live.` \| `Tu negocio` / `Cuéntanos dónde vivirá tu colección.` | Single-select chips: `Souvenir / gift shop, Hotel / resort, Restaurant / café, Museum / attraction, Events / corporate, Something different` \| `Tienda de souvenirs / regalos, Hotel / resort, Restaurante / café, Museo / atracción, Eventos / corporativo, Otra cosa`. Inputs `Business name *` \| `Nombre del negocio *` and `Address (street & city) *` \| `Dirección (calle y ciudad) *`. Hint `We study your area and design with it in mind.` \| `Estudiamos tu zona y diseñamos con eso en mente.` | chip + name + address |
| 3 | `Contact` / `How do we reach you?` \| `Contacto` / `¿Cómo te contactamos?` | `Your name *` \| `Tu nombre *`; `Email *`; `Phone (optional)` \| `Teléfono (opcional)`; textarea `Notes — anything that helps: your style, your customers, an upcoming celebration… (optional)` \| `Notas — todo lo que ayude: tu estilo, tus clientes, alguna celebración próxima… (opcional)`. Gold banner `You approve every design — samples ship to you FREE before production.` \| `Apruebas cada diseño — las muestras te llegan GRATIS antes de producir.` | name + email regex |

- Subject: `Custom collection — {business}` | `Colección personalizada — {business}`
- Body (blank or optional lines are dropped):
  ```
  Products: {chips joined ", "}             | Productos: …
  Your business: {business type}            | Tu negocio: …
  Business name: {business}                 | Nombre del negocio: …
  Address (street & city): {address}        | Dirección (calle y ciudad): …
  Your name: {name}                         | Tu nombre: …
  Email: {email}
  Tel: {phone}                              ← only if given; "Tel:" hardcoded
  
  Notas:                                    ← only if notes; "Notas:" is Spanish in BOTH languages
  {notes}
  ```
- The modal stays open after send, as in §4.1.

**Path A: "start from our designs" (version a magnet), which adds to the cart and sends nothing by itself**
1. **pick**, `Pick a design to make yours` | `Elige un diseño para hacerlo tuyo`. Filter pills: `All`|`Todos`, `Miami Beach`, `Miami`, `Cuban American` (defaults to Miami Beach). Grid of **69 magnet thumbnails** (4 columns, 5 at ≥640px); hovering shows `#{n}`.
2. **card**: 3D flip card. Title is `{name}` (e.g. `Miami Beach Magnet #1`).
   - Front: image, collection, name, button `✨ Version this design` | `✨ Versionar este diseño`.
   - Back (`↻` / `↺` toggles) shows a spec table: `Type`|`Tipo` = `Fridge magnet`|`Imán de nevera`; `Size`|`Tamaño` = `75 x 50 mm` or `⌀ 75 mm`; `Material` = `Wood`|`Madera`; `Collection`|`Colección` = `{col}`.
3. **form**, title `Version this design` | `Versionar este diseño`, prompt `What should change?` | `¿Qué cambiamos?`.
   - Multi-select chips: `My business name`, `A local landmark`, `Change text / language`, `Back stamp: your logo or short message` | `Nombre de mi negocio`, `Referencia de mi zona`, `Cambiar texto / idioma`, `Marca trasera: tu logo o mensaje corto`.
   - Textarea `Details (optional): exact name, colors, a landmark…` | `Detalles (opcional): nombre exacto, colores, una referencia…`.
   - Button `Add version to order →` | `Agregar versión al pedido →`. It pushes this object to `localStorage.mp_order`: `{key:"{n}|c{Date.now()}", n, name, col, qty:1, custom:true, note:"{chips joined ', '}{' — '+details}"}`.
4. **done**, title `Added to your order ✓` | `Agregado a tu pedido ✓`.
   - Gold banner with the same "samples ship FREE" line.
   - `✨ Version another design` | `✨ Versionar otro diseño` returns to **pick**.
   - `🧺 Review & send order →` | `🧺 Revisar y enviar pedido →` links to `colecciones/miami-beach.html#pedido`. There, `cart.js` `mpSend()` sends the subject `Order — {biz}` | `Pedido — {biz}`, a body starting `Order for quote` | `Pedido para cotizar`, and lines formatted `- {name} [{col}] x{qty}  << CUSTOM VERSION: {note}`.

**Dead code in the builder:**
- A second builder instance, `startAt:"pick"`, is never opened: its state setter is only ever called with `false`.
- `onVersion` is passed to `D` but `D` ignores it. Its toast `Pick a collection and tap ✨ on any design you want to adapt` | `Elige una colección y toca ✨ en el diseño que quieras adaptar` can never appear.

### 4.3 Transport: `assets/order.js`
- `__slp.href = "mailto:…"` triggers `POST https://formsubmit.co/ajax/jesusnodarse1823@gmail.com` with JSON `{_subject: <subject>, _template:"box", _captcha:"false", Pedido: <body>}`. The single field is named **`Pedido`** even for wholesale and builder requests.
- Toasts are **Spanish-only**: `Enviando pedido…`, then on success `✓ ¡Pedido enviado! Te contactaremos pronto.` (green, 6 s).
- On an HTTP error or `success !== true` it falls back to `window.location.href = <mailto>`, which opens the mail client. FormSubmit **is still not activated** (`docs/BACKLOG.md`), so today every hub request most likely ends in the mailto fallback.

### 4.4 Other interactions
- Collection modal: Esc or a backdrop click closes it; body scroll is locked while it is open.
- The wholesale and builder modals close on a backdrop click or `×` only (no Esc, no scroll lock).
- Toasts disappear after 2.2 s.
- Images that React creates get `loading="lazy" decoding="async"` from a `document.createElement` monkey-patch at the very top of the file.

---

## 5. Hardcoded constants and claims

| What | Value (verbatim) | Where |
|---|---|---|
| Order email | `jesusnodarse1823@gmail.com` | 2× `mailto:` in the bundle; JSON-LD `contactPoint.email`; order.js endpoint |
| Phone | `+17864834268` | JSON-LD `contactPoint.telephone` only (no visible phone, **no WhatsApp link on the hub**) |
| Site base | `https://studio-lab-nodarse.github.io/studio-lab-catalog/` | head, JSON-LD, footer |
| Response time | `within 1 business day` / `en 1 día hábil` | wholesale modal |
| Effort claim | `two minutes` / `dos minutos` | how-it-works description (not rendered) |
| Samples | `samples ship to you free` / `samples ship to you FREE before production` / `Approved designs ship free to your door.` | hero, builder, how-it-works |
| Origin | `Made in Miami` / `Hecho en Miami`; `Miami, FL · 2026` | eyebrow, footer |
| Design counts | Cuban American `34`, Miami Beach `41`, Miami `40` `designs` | collection pills |
| Category counts | Magnets `69`, Stickers `28`, Hats `6`, Tote Bags `19`, Coasters `14`; `14 types` | shop by product |
| Per-collection counts | table in §1.6 | collection modal |
| Magnet spec | `75 x 50 mm` (61 designs), `⌀ 75 mm` (8 round), `Wood`, `Fridge magnet` | flip-card back |
| Brand strings | `Studio Lab · Jesús Nodarse`, `MIAMI PECULIAR · Studio Lab`, `Studio Lab · Miami Peculiar` | header, footer, modal eyebrows |
| Prices, minimums, lead times, MOQ | **none anywhere** | — |
| Social proof / stats / testimonials | **none** | — |

**Count drift against `src/_data/` (2026-10-10):**
- Magnets: the hub has 69 but `magnets.json` has **70**. Miami Beach **#32 is missing** from the hub (and MB is 21 vs 22).
- Stickers 28, hats 6, totes 19 and coasters 14 match the data, and so do the per-collection counts for those categories.
- The design pills (34/41/40) match nothing. The sums of the modal chips are 42/48/59, and the magnet counts are 21/22/27.
- `14 types`: only 11 product types are defined, and 5 have pages.
- The hub still lists Miami #171/#172 and MB #173. The recent "remove #172, #173" commit touched only the root catalog.

---

## 6. `<head>`

- `<html lang="es">` is rewritten to `en` at build time by `hubShell`. React also sets `documentElement.lang`.
- `<meta charset=UTF-8>`, viewport `width=device-width, initial-scale=1.0`.
- **Title:** `Miami Peculiar — Gorras, Magnets, Stickers | Studio Lab`
- **Description:** `Miami Peculiar by Studio Lab: gorras, magnets y stickers con alma de Miami. Explora las colecciones Miami, Miami Beach y Cuban American.` (Spanish; the page ships EN)
- Canonical: `https://studio-lab-nodarse.github.io/studio-lab-catalog/apps/storefront/`
- Robots: `index,follow`
- OG:
  - `og:type=website`, `og:site_name=Studio Lab`
  - **`og:locale=es_US`**, `og:locale:alternate=en_US` (the templated pages use `en_US`)
  - `og:url` = canonical
  - `og:title` and `og:description` = the title and description above
  - `og:image=…/assets/og/default.jpg`
- Twitter: `summary_large_image`, with the same title, description and image.
- Icons: `…/assets/favicon.png` (`sizes="any"`), apple-touch-icon `…/assets/apple-touch-icon.png`.
- Fonts: preconnect to `fonts.googleapis.com`, plus the stylesheet `Playfair Display` (ital, wght 0,600;0,800;1,600) and `Archivo` (400;600;700;800), `display=swap`.
- Inline `<style>` ≈56 KB: compiled Tailwind with the shadcn `:root` tokens.
- `hubShell` injects `masthead.css`, the rule `#root header{display:none!important}` and the missing `</head>`.
- **JSON-LD** is one `@graph`:
  1. `["Organization","Store"]` `#org`:
     - `name` `Studio Lab`, `legalName` `Nodarse Arts LLC`, `brand` `Miami Peculiar`, `founder` Person `Jesús Nodarse`
     - `url` = site base, `logo` = favicon, `image` = og
     - `areaServed` City `Miami`
     - `contactPoint` sales `+17864834268` / `jesusnodarse1823@gmail.com`, `availableLanguage` `["es","en"]`
     - CI requires this node to be identical on every page.
  2. `CollectionPage` `#webpage`:
     - `name` `Miami Peculiar`
     - `description` `Tienda Miami Peculiar de Studio Lab: gorras, magnets, stickers y colecciones inspiradas en Miami.`
     - **`inLanguage":"es"`**
     - `isPartOf` `#website`: no `WebSite` node exists anywhere on the site, so this reference dangles site-wide.
     - `about` `#org`, `primaryImageOfPage` og
  3. `BreadcrumbList`: `Inicio` → site base; `Miami Peculiar` → hub.

---

## 7. Visual system

**Type**
- Display: `Playfair Display` (`.font-display`), used for the H1, section titles, collection names, step numbers `01–04` and modal titles. The H1's second line is italic (`<em>`) in gold.
- Body: `Archivo` (`.font-body`). Weights run heavy: 700 and 800 for buttons and labels.
- Small caps-style eyebrows: 10–10.5px, uppercase, tracking `.24–.28em`.

**Palette** (hub JS constants; these match `brand.css` tokens exactly, so the rebuild can use `brand.css` directly)

| Role | Value | brand.css |
|---|---|---|
| Page background | `#081420` | `--bg` |
| Text (cream) | `#f3ead6` | `--text` |
| Muted | `#a8b8c8` | `--muted` |
| Antique gold (labels, eyebrows) | `#d9b25a` | `--accent2` |
| Gold (accent, `em`, underline bars) | `#f0b429` | `--accent` |
| Bright yellow (lang pill, search btn) | `#FFD447` | — |
| Ink on gold | `#0d1f33` (also `#083d52` in builder) | — |
| Card / flip-card navy | `#16304a → #0f2337 → #0b1a2c` | `--mataqua` / `--card` |
| Modal panel | `linear-gradient(180deg,#132c46,#0a1c30)` | — |
| Primary CTA | `linear-gradient(140deg,#FFD447,#c98f2e)` + glow `0 14px 34px rgba(240,180,41,.3)` | — |
| Card labels | `#eccb74` / name `#fdf8ec` / photo mat `#e9d7b6` | — |

**Atmosphere**
- Three fixed radial gradients: navy `#1a3a58` at the top, a 10% gold glow top-right, a teal `rgba(23,81,107,.35)` glow bottom-left.
- An inset vignette `inset 0 0 180px 40px rgba(2,6,12,.75)`.
- An SVG fractal-noise grain at 5.5% opacity with `mix-blend-mode: overlay`.

**Surfaces:** "glass" panels:
- Background `rgba(255,255,255,.05–.08)`, 1px inset borders `rgba(243,234,214,.12–.16)`, `backdrop-blur`, deep drop shadows.
- Gold-tinted hairlines `rgba(240,180,41,.18–.35)`.

**Layout**
- Container `max-w-6xl` (1152px) with `px-5` (20px). Single breakpoint `sm` = 640px.
- Hero: centered `max-w-2xl`. H1 is 34px, 46px at ≥640px, line-height 1.04.
- Section titles are 25/27px Playfair, with a signature **3-bar underline**: 36px gold, 8px antique, 4px cream.
- Collections:
  - 3 tall cards, stacked on mobile and in a row on desktop; min-height 240px mobile, 360px desktop.
  - Radius `20px 20px 11px 11px`.
  - **Feathered edges** via a dual linear `mask-image` (26px).
  - Hover: lift `-6px`, zoom the image `1.045`.
- Product tiles: 2 or 4 columns. Each tile has an icon in a 36px gold-gradient square (`#f7e7bd → #dfae4a`). Icons are lucide (magnet, sticker, shopping-bag = totes, circle-dot = coasters, a custom cap SVG, shirt, coffee, image, mail, frame, wallet, layout-grid).

**Motion**
- `mpFade` 0.2s for the backdrop.
- `mpUp` 0.28s, `cubic-bezier(.2,.9,.3,1.2)` (springy rise plus scale .97).
- Hover lifts of `-2px`.
- 3D flip card (perspective 1200px, 0.7s).
- Mobile step carousel (0.5s slide every 3.5s).
- None of these honor `prefers-reduced-motion`; only the masthead view transition does.

**Masthead** (`masthead.css`): same palette, scoped to `header` (`--surface: rgba(8,20,32,.72)`), `position: sticky`, `backdrop-filter: blur(6px)`.

---

## 8. Surprises and gotchas for the rebuild

1. **The hub is a "design-your-own-collection" pitch, not a catalog.** It has no prices, minimums, lead times or proof numbers. The only commitments are "reply within 1 business day" and "free samples before production".
2. **"Wholesale pricing" is a 4-field email**, and the builder is a separate 3-step email (or a cart add). Both POST to FormSubmit, which isn't activated, so in practice the visitor lands in their mail client. Feedback toasts are Spanish-only, and the JSON field is called `Pedido`.
3. Visible placeholder copy: `— Home concept` in the footer.
4. Dead UI:
   - the search bar
   - the `See all · 14 types` tile
   - hidden `View all` / `Browse catalog`
   - 4 step descriptions defined but never shown
   - the unreachable builder instance and toast
5. Category tiles are `div`+`location.href`, so crawlers see **no links** to the category pages. Only the masthead and footer link them.
6. The SEO head is Spanish (`og:locale es_US`, JSON-LD `inLanguage es`, Spanish description and hidden H1) while the page ships EN. There are two H1s.
7. The masthead's `☰` `aria-label` is Spanish-only (site-wide, not hub-specific).
8. Counts are stale or inconsistent (§5). Pull the real counts from `src/_data/*.json` at build time.
9. The hub holds its own copy of 69 magnet thumbnails plus 6 backs, 3 hero art pieces and 1 logo (79 files, ≈1.5 MB). The rebuild can reuse `magnets.json` images instead. Orphaned files can then be dropped; note that magnet back templates are only in the hub.
10. `#crear` is an inbound contract (`cart.njk:11` on every page's cart drawer). `colecciones/miami-beach.html#pedido` is used as the de-facto "cart page".
11. **No WhatsApp on the hub** at all, even though `site.json` carries one. The brief wants it on the reorder page.
12. If the rebuild keeps "Version this design", it writes the same `mp_order` shape that `cart.js` reads (`custom:true`, `note`).

---

## Appendix A: the 69 magnets embedded in the builder

Shape codes: `std` = portrait rectangle with wood mat; `cut` = die-cut, no mat; `rnd` = round; `hz` = landscape. Depictions are inferred from the thumbnails. "Twin" means a design that also exists in another collection with different title text.

**Miami Beach** (21; `magnets.json` also has #32)

| # | Shape / size | Back | Image | Depicts |
|---|---|---|---|---|
| 1 | std · 75 x 50 mm | std | `assets/img/ac9459e0a3b8a608.webp` | Art Deco street at sunset, pink classic car: "MIAMI BEACH · ART DECO DISTRICT" |
| 6 | std · 75 x 50 mm | std | `assets/img/0e9ac34e2dcb5044.webp` | Lifeguard tower on beach at sunset: "MIAMI BEACH" |
| 13 | std · 75 x 50 mm | std | `assets/img/d14ff0cdafc343c1.webp` | Lifeguard stand, sunset shoreline: "Miami Beach" |
| 15 | std · 75 x 50 mm | std | `assets/img/3dcc06aef07bb504.webp` | Pastel Art Deco facade: "ART DECO MIAMI BEACH" |
| 16 | cut · 75 x 50 mm | std | `assets/img/cff86d48c64c4035.webp` | Lifeguard tower: "ART DECO MIAMI" |
| 22 | std · 75 x 50 mm | std | `assets/img/9782c0b88b2bf6be.webp` | Yellow Art Deco hotel, classic cars: "MIAMI BEACH ART DECO" |
| 33 | std · 75 x 50 mm | std | `assets/img/07d797015a7c63ae.webp` | Aerial beach + hotels: "MIAMI BEACH" |
| 38 | std · 75 x 50 mm | std | `assets/img/6dbd68eda2e41998.webp` | Art Deco hotel, woman in sun hat: "MIAMI BEACH" |
| 57 | std · 75 x 50 mm | std | `assets/img/2551e71b220be9e9.webp` | Pink lifeguard hut: "MIAMI BEACH" |
| 100 | cut · 75 x 50 mm | std | `assets/img/a490bf3d1894f27e.webp` | Pink/violet Art Deco facade: "MIAMI BEACH ART DECO" |
| 106 | std · 75 x 50 mm | std | `assets/img/ae1f9a36cd942307.webp` | Breakwater hotel: "MIAMI BEACH · OCEAN DRIVE" |
| 107 | std · 75 x 50 mm | std | `assets/img/09feabb0ab3c6933.webp` | Ocean Drive hotel, café: "MIAMI BEACH · OCEAN DRIVE" |
| 42 | std · 75 x 50 mm | std | `assets/img/5c7d1c6caf25cc1e.webp` | Vintage convertible, palms, flowers: "MIAMI BEACH" |
| 23 | std · 75 x 50 mm | std | `assets/img/0e6fa0eb2aa3a72f.webp` | Art Deco facades, red classic car: "MIAMI BEACH" |
| 24 | std · 75 x 50 mm | std | `assets/img/ac25b6679024b0ac.webp` | Pastel lifeguard stand + skyline: "MIAMI BEACH FLORIDA" |
| 26 | std · 75 x 50 mm | std | `assets/img/8a15825e0aba42fa.webp` | Retro poster, sunbather silhouette: "MIAMI BEACH" |
| 35 | std · 75 x 50 mm | std | `assets/img/d5617674e20ff042.webp` | Avalon hotel, yellow classic car: "MIAMI BEACH ART DECO DISTRICT" |
| 36 | std · 75 x 50 mm | std | `assets/img/d9dcedbbf99a9e99.webp` | Orange hotel, classic car: "SOUTH BEACH · MIAMI BEACH, FL" |
| 53 | std · 75 x 50 mm | std | `assets/img/ba2cc61b445c7d28.webp` | Pink house, palms, pink car: "MIAMI BEACH" |
| 92 | rnd · ⌀ 75 mm | rnd | `assets/img/7bf8129642c75e70.webp` | Round B/W stamp, lifeguard tower: "MIAMI BEACH · OCEAN DRIVE · FLORIDA U.S.A." |
| 173 | cut hz · 75 x 50 mm | custom → `assets/img/8fc3dc2e6c71d2bb.webp` | `assets/img/e98b7995987bb604.webp` | Landscape postage stamp, beach + lifeguard tower: "Miami Beach" |

**Miami** (27)

| # | Shape / size | Back | Image | Depicts |
|---|---|---|---|---|
| 3 | std · 75 x 50 mm | std | `assets/img/ef53fcff9741ea84.webp` | Skyline over water at sunset: "MIAMI Florida" |
| 4 | std · 75 x 50 mm | std | `assets/img/1320862d982b891c.webp` | Downtown skyline at sunset: "MIAMI" |
| 20 | std · 75 x 50 mm | std | `assets/img/ee8844b77b829a99.webp` | Brickell canal + towers: "MIAMI" |
| 23 | std · 75 x 50 mm | std | `assets/img/6149c11d7a395b55.webp` | Art Deco facades, red classic car: "MIAMI" (twin of MB #23) |
| 25 | std · 75 x 50 mm | std | `assets/img/80c9407d574b1a92.webp` | Pink jeep on beach: "FLORIDA" |
| 27 | std · 75 x 50 mm | std | `assets/img/1a3c8f90443a8e14.webp` | Yellow classic car, palms: "South Florida" |
| 28 | rnd · ⌀ 75 mm | rnd | `assets/img/b47a29cc4c424007.webp` | Round, red classic car: "Little Havana · Miami" |
| 30 | rnd · ⌀ 75 mm | rnd | `assets/img/56f3bd23fecff078.webp` | Round, yellow car on Little Havana street: "Miami" |
| 54 | hz · 75 x 50 mm | hz | `assets/img/6b4013086eb06cb2.webp` | Landscape graffiti-style collage: "MIAMI" |
| 80 | cut · 75 x 50 mm | std | `assets/img/a878837adf4a149e.webp` | Oval floral pattern on wood: "MIAMI" |
| 92 | rnd · ⌀ 75 mm | rnd | `assets/img/765b8aac32487710.webp` | Round B/W stamp, skyline + palms: "MIAMI · FLORIDA U.S.A." |
| 104 | std · 75 x 50 mm | std | `assets/img/172121a95047fef7.webp` | Wynwood mural poster: "WYNWOOD WALLS · MIAMI" |
| 171 | cut hz · 75 x 50 mm | custom → `assets/img/c4e9b1c5c142190f.webp` | `assets/img/ca5f1d0107af7da6.webp` | Landscape postage stamp, skyline + yacht: "Miami Florida" |
| 172 | cut hz · 75 x 50 mm | custom → `assets/img/53766f59d4f2a591.webp` | `assets/img/6d11c3c31866f08e.webp` | Landscape postage stamp, skyline + sailboat: "Miami Florida" |
| 178 | cut · 75 x 50 mm | std | `assets/img/e0c3b5451ba13126.webp` | Sunset skyline, heart corner: "Greetings from MIAMI" |
| 1 | hz · 75 x 50 mm | hz | `assets/img/5542af7eca0ef2c5.webp` | Landscape Art Deco street: "MIAMI · ART DECO DISTRICT" (twin of MB #1) |
| 6 | std · 75 x 50 mm | std | `assets/img/b9875024c3551e88.webp` | Lifeguard tower at sunset: "MIAMI Florida" (twin of MB #6) |
| 9 | cut · 75 x 50 mm | std | `assets/img/217254a3509162cc.webp` | Skyline + yacht at dusk: "MIAMI" |
| 15 | std · 75 x 50 mm | std | `assets/img/a162a1dfb609209c.webp` | Pastel Art Deco facade: "ART DECO MIAMI" (twin of MB #15) |
| 22 | std · 75 x 50 mm | std | `assets/img/f52c0af340576414.webp` | Yellow Art Deco hotel: "MIAMI ART DECO" (twin of MB #22) |
| 38 | std · 75 x 50 mm | std | `assets/img/76a07c19170e0673.webp` | Art Deco hotel, woman in hat: "MIAMI" (twin of MB #38) |
| 42 | std · 75 x 50 mm | std | `assets/img/0f0f64858f10e90b.webp` | Vintage convertible, flowers: "MIAMI" (twin of MB #42) |
| 43 | std · 75 x 50 mm | std | `assets/img/bb1e887751e27395.webp` | Art Deco hotel + marina: "miami" |
| 44 | cut · 75 x 50 mm | std | `assets/img/d87221a5e3cc720a.webp` | Pink skyline, red car: "MIAMI" |
| 53 | std · 75 x 50 mm | std | `assets/img/ecad6e089675482c.webp` | Pink house, pink car: "MIAMI" (twin of MB #53) |
| 57 | std · 75 x 50 mm | std | `assets/img/e4de54945713c7d9.webp` | Lifeguard hut: "MIAMI South Beach" (twin of MB #57) |
| 100 | cut · 75 x 50 mm | std | `assets/img/5923c5e34e88338c.webp` | Art Deco facade: "MIAMI ART DECO" (twin of MB #100) |

**Cuban American** (21)

| # | Shape / size | Back | Image | Depicts |
|---|---|---|---|---|
| 2 | cut · 75 x 50 mm | std | `assets/img/6b9184cea51ace77.webp` | Rumba dancer, Cuban-flag skirt: "CUBA · Little Havana Miami" |
| 5 | std · 75 x 50 mm | std | `assets/img/8d3b5d5c55cf0317.webp` | Salsa dancers: "Miami · Little Havana" |
| 7 | cut · 75 x 50 mm | std | `assets/img/35aa53b627621bda.webp` | Domino tile with rooster: "Little Havana" |
| 10 | std · 75 x 50 mm | std | `assets/img/45b47e4ef1a2421b.webp` | Photo of painted rooster statue: "Little Havana Miami Florida" |
| 11 | std · 75 x 50 mm | std | `assets/img/0be39d0675f510e6.webp` | Little Havana street corner: "Little Havana" |
| 12 | std · 75 x 50 mm | std | `assets/img/65e4a303ff311a8b.webp` | Malecón, classic car: "HAVANA Cuba" |
| 14 | cut hz · 75 x 50 mm | hz | `assets/img/32acbf219db1125d.webp` | Landscape big-letter postcard: "Little HAVANA" |
| 17 | std · 75 x 50 mm | std | `assets/img/ebf5a02ccf8d841a.webp` | Rooster in US-flag colors: "Little Havana · Calle 8" |
| 19 | std · 75 x 50 mm | std | `assets/img/b05d7e60a72d0899.webp` | Cartoon rooster: "Miami · Little Havana" |
| 21 | std · 75 x 50 mm | std | `assets/img/b9f1a3afa858b66c.webp` | Woman with fruit headwrap: "Calle 8 Miami" |
| 31 | rnd · ⌀ 75 mm | rnd | `assets/img/0643d9dc73b2c0ee.webp` | Round Calle 8 tile mural (same art as the collection hero): "Calle 8 · Little Havana · Miami" |
| 37 | std · 75 x 50 mm | std | `assets/img/520bd88feaba35a4.webp` | Tower Theater: "LITTLE HAVANA MIAMI" |
| 50 | cut · 75 x 50 mm | std | `assets/img/77cfcb518147f2ae.webp` | Woman with cigar + flowers: "Miami · Little Havana" |
| 95 | rnd · ⌀ 75 mm | rnd | `assets/img/8fefd2dd6f37faeb.webp` | Round stamp, rooster: "Little Havana · Miami Florida" |
| 98 | std · 75 x 50 mm | std | `assets/img/797945dc1fd750d5.webp` | Street scene, classic cars: "MIAMI · Calle 8 – Little Havana" |
| 101 | std · 75 x 50 mm | std | `assets/img/f5829375bbc677e6.webp` | Domino Park pavilion: "LITTLE HAVANA MIAMI" |
| 102 | std · 75 x 50 mm | std | `assets/img/43f1ac8717dd9689.webp` | Rooster + street: "LITTLE HAVANA MIAMI" |
| 103 | std · 75 x 50 mm | std | `assets/img/0272df4f5d2fde45.webp` | Singer portrait (Celia Cruz homage): "¡AZÚCAR! LITTLE HAVANA MIAMI" |
| 130 | cut · 75 x 50 mm | std | `assets/img/c331959611aa243e.webp` | Woodcut rooster, coffee, cigar: "LITTLE HAVANA · CALLE OCHO · MIAMI, FL" |
| 179 | rnd · ⌀ 75 mm | rnd | `assets/img/f4ba3357e62f8057.webp` | Round woodcut stamp: "LITTLE HAVANA · CALLE 8 · MIAMI U.S.A." |
| 180 | rnd · ⌀ 75 mm | rnd | `assets/img/24dbe8f1a2f8538f.webp` | Round woodcut rooster: "LITTLE HAVANA · CALLE 8 · MIAMI, FL" |

Each entry's `name` field is `"{Collection} Magnet #{n}"`, e.g. `Miami Beach Magnet #1` or `Cuban American Magnet #31`.

---

## Appendix B: reproducing the extraction

```sh
sed -n '4,11p' src/_vendor/hub.html > script.js        # the module script spans lines 4–11
node -e 'const s=require("fs").readFileSync("script.js","utf8");
         require("fs").writeFileSync("app.js", s.slice(s.indexOf("var i={};i=a(\"6mwK0\")")))'
sed -i '' 's#</script>$##' app.js
npx prettier@3 --parser babel --print-width 140 app.js > app.pretty.js   # ~2.6k readable lines
```

Landmarks in `app.pretty.js`:

| Lines (approx.) | Contents |
|---|---|
| 15–144 | wholesale modal (`c`, `p`) |
| 146–841 | magnet data (`m` backs, `g` 69 items) |
| 849–1491 | builder copy and component (`k`, `D`) |
| 1659–1795 | page copy (`Y`), product labels (`F`), per-collection counts (`Q`), maps `K`/`q`, collections (`Z`) |
| 1843–end | page tree |
