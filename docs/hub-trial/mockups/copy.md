# Hub copy deck: trial box landing page

Status: **draft for owner review** · 2026-10-11 · replaces all v2 mockup copy
Follows: [01-plan](../01-plan.md), with the "Owner feedback on mockup v2" block taking precedence · design base [v2](v2/index.html)

**Legend**
- `*word*` is the accent word (Instrument Serif italic in the v2 type system).
- `{70}` is a count computed from `src/_data` at build time and never hard-coded (D10).
- `[TRIAL_REPLY_DAYS]` and `$[TRIAL_REORDER_MIN]` are env vars (§6a). A block whose var is empty is not rendered.
- `[placeholder: …]` is a fact we don't have yet. It never ships as-is.
- Spanish uses Miami *tú*, written for the shop owner, and runs ≤ ~120% of the English length (a few 2–4-word strings run over in characters, not in reading time).

---

## 1. Voice

- **Shop owner to shop owner.** Write about *their* shelf, register, rack and customers. Say "you" and "your shop" in every section, keep sentences short enough for one-thumb reading, and speak with one person's voice (Jesús), not a company's.
- **Concrete beats clever.** Name the actual thing: the wood magnet, the Calle Ocho rooster, the leather patch, the cork back, the domino tables. If a line would fit any brand in any city, rewrite it.
- **Selling goes on top, rules go below.** Headlines, the marquee, chips and section titles sell an outcome: free stock, original art, a fuller rack, easy restock. Business rules (one box per business, reply time, minimums, ZIPs, paperwork) live in body copy, the FAQ and fine print, written warmly and never as a headline.
- **Honest by default.** Say "request", never "claim" or "get". No number, quote, price, timeline or "bestseller" label until Jesús confirms it. Anything unknown stays a placeholder, and we'd rather show a reason than a fake stat.
- **Words we use / avoid.** *Use:* shelf, rack, register, restock, original, made in Miami, by hand, yours to keep, on the house, Jesús. *Avoid:* elevate, curated, hand-picked, unlock, seamless, premium, unique, solutions, partner, journey, game-changer, "don't miss out", stacked exclamation marks.
- **Spanish is Miami Spanish, not a translation.** It should sound the way a Calle Ocho or Hialeah shop owner texts: *pide, tienda, al por mayor, la Florida, reponer, invita la casa, dale*. Use *tú* throughout, and keep Spanglish where people actually use it (*stickers, totes, ZIP, email*).

---

## 2. Hero

### Headline options

| # | EN | ES | Why |
|---|---|---|---|
| 1 ✅ | Put real Miami on your shelf. *Free.* | Miami de verdad, en tu tienda. *Gratis.* | It puts the buyer's own shelf in the picture. "Real" quietly sets it against imports, and "free" lands on the accent word. |
| 2 | Souvenirs made in Miami. Try them *free.* | Souvenirs hechos en Miami. Pruébalos *gratis.* | It is the clearest in a two-second skim (category, origin, offer), but it describes the product more than the result. |
| 3 | Original Miami art. Not another *import.* | Arte original de Miami. Nada de *importado.* | It is the sharpest difference from their current wholesaler, but "free" drops to the sub, so the hook sits lower. |

**Recommended: #1.** It answers the buyer's three questions in one line: what it is (real Miami), where it goes (your shelf) and what it costs (nothing). The CTA then answers "how do I start".

### Hero parts

| Element | EN | ES |
|---|---|---|
| Meta line (top) | For shops across Florida | Para tiendas de la Florida |
| Eyebrow / photo tag | ★ Wholesale · Made in Miami | ★ Al por mayor · Hecho en Miami |
| H1 | Put real Miami on your shelf. *Free.* | Miami de verdad, en tu tienda. *Gratis.* |
| Sub | Handmade wood magnets and original Miami art. Try a box on your shelf before you spend a dollar. | Imanes de madera hechos a mano y arte original de Miami. Pruébalos en tu tienda sin gastar un centavo. |
| Primary CTA | Request a free trial box | Pide tu caja de prueba gratis |
| Secondary link | See the designs | Mira los diseños |
| Chip 1 | Original art, not imports | Arte original, no importado |
| Chip 2 | {70} designs to choose from | {70} diseños para escoger |
| Chip 3 | Restock with one scan | Repón con un escaneo |
| Seal ring (spins) | Free trial box ★ Made in Miami ★ | Caja gratis ★ Hecho en Miami ★ |
| Postcard caption | greetings from Miami | saludos desde Miami |
| Hero foot line | Deal direct with the maker | Trato directo con el artista |

**Header** (shared): nav reads Our story · Collections · How it works · FAQ | Nuestra historia · Colecciones · Cómo funciona · Preguntas. Header button: Request a box | Pide tu caja.

---

## 3. Marquee

| EN | ES |
|---|---|
| Try it on your shelf, free | Pruébalo en tu tienda, gratis |
| Original Miami art | Arte original de Miami |
| Handmade wood magnets | Imanes hechos a mano |
| Not another import | Nada de importado |
| Calle Ocho to Ocean Drive | De la Calle Ocho a Ocean Drive |
| Restock in one scan | Repón con un escaneo |

---

## 4. Sections, in v2 order

### 4.1 Story

| Element | EN | ES |
|---|---|---|
| Places (side list) | Miami Beach · Miami · Little Havana | Miami Beach · Miami · La Pequeña Habana |
| H2 | Made in *Miami* | Hecho en *Miami* |
| P1 | Art Deco hotels, lifeguard towers, the domino tables on Calle Ocho. The Miami your customers came to see, ready for the suitcase. | Hoteles Art Deco, torres de salvavidas, las mesas de dominó de la Calle Ocho. El Miami que vinieron a ver, listo para la maleta. |
| P2 | Every design is original and produced in our Miami studio. The wood magnets are made by hand. | Cada diseño es original y se produce en nuestro estudio en Miami. Los imanes de madera son hechos a mano. |
| P3 (punch) | You won't find this art at the import wholesaler. | Este arte no lo vas a encontrar con el importador. |
| Link | See the three collections | Mira las tres colecciones |
| Seal ring | Handmade ★ Miami, Florida ★ | Hecho a mano ★ Miami, Florida ★ |

### 4.2 How it works

| Element | EN | ES |
|---|---|---|
| Eyebrow | How it works | Cómo funciona |
| H2 | Three steps to a *stocked shelf.* | Tres pasos a una tienda *surtida.* |
| Step 1 title | Tell us about your shop | Cuéntanos de tu tienda |
| Step 1 body | About two minutes on your phone. No card, no contract. | Unos dos minutos desde el celular. Sin tarjeta, sin contrato. |
| Step 2 title | Jesús reads it himself | Jesús la lee en persona |
| Step 2 body | Every request gets a real look. You'll hear back by email or WhatsApp within [TRIAL_REPLY_DAYS] business days. | Cada solicitud se revisa a mano. Te contestamos por email o WhatsApp en [TRIAL_REPLY_DAYS] días hábiles. |
| Step 3 title | Sell it. Restock in a scan. | Véndelo. Repón con un escaneo. |
| Step 3 body | Your box comes with a reorder card. When the rack runs low, scan it and the order is half written. | La caja trae una tarjeta para reponer. Cuando se vacíe el exhibidor, la escaneas y el pedido está casi hecho. |

### 4.3 What's in the box

| Element | EN | ES |
|---|---|---|
| Band tag | ★ On the house | ★ Invita la casa |
| Polaroid caption | shipped from Miami | sale de Miami |
| H2 | A starter shelf, *on the house.* | Tu primer surtido, *invita la casa.* |
| Sub | Put it by the register and see what moves. | Ponlo en el mostrador y mira qué se vende. |
| Check 1 (sun) | **Handmade wood magnets,** the heart of every box. | **Imanes de madera hechos a mano,** el alma de la caja. |
| Check 2 | **A taste of the rest:** stickers, caps, totes or coasters. | **Y un poco de todo:** stickers, gorras, totes o posavasos. |
| Check 3 | **Yours to keep.** Every sale is yours. | **Es tuya.** Lo que vendas, te lo quedas. |
| Check 4 | **A reorder card.** Scan it when you run low. | **Tarjeta para reponer.** Escanéala cuando se acabe. |
| Value line (only when prices set) | Worth $[placeholder: box value at suggested retail] at suggested retail. | Vale $[placeholder] a precio sugerido. |
| Fine print | [placeholder: pieces per box] pieces · ships from Miami | [placeholder] piezas · sale de Miami |
| CTA | Request a free trial box | Pide tu caja de prueba gratis |

### 4.4 Bestsellers

| Element | EN | ES |
|---|---|---|
| Eyebrow (**only if Jesús confirms these are top sellers**) | ★ Bestsellers | ★ Los más vendidos |
| Eyebrow (otherwise) | ★ Jesús's picks | ★ Favoritos de Jesús |
| H2 (prices set) | Your profit, *piece by piece.* | Tu ganancia, *pieza por pieza.* |
| H2 (no prices) | Bright, bold, *hard to miss.* | Coloridos y *bien llamativos.* |
| Sub (prices set) | What you pay, the suggested price, what you keep. | Lo que pagas, el precio sugerido y lo que te queda. |
| Sub (no prices) | Six pieces from across the line. Tap one to see the back. | Seis piezas de toda la línea. Toca una para ver el reverso. |
| Type tags | Magnet · Sticker · Cap · Tote · Coaster | Imán · Sticker · Gorra · Tote · Posavasos |
| Card meta | {Collection} · #{num} | {Colección} · #{num} |
| Card name | from data; magnets need names ([placeholder: OK to use descriptive names like "Lifeguard Tower"?]) | igual |
| Flip hint | Tap to flip | Toca para voltear |
| Back specs | Size · Material | Tamaño · Material |
| Margin row 1 | You pay | Pagas |
| Margin row 2 | Suggested retail | Precio sugerido |
| Margin row 3 (highlight) | You keep | Te queda |
| Optional markup chip | {x}× markup | {x}× sobre costo |
| Footnote (prices set) | Suggested retail is a guide. You set your prices. | El precio sugerido es una guía. Tú pones tus precios. |
| Card link (aria) | See all {magnets} | Ver todos los {imanes} |

### 4.5 Collections

| Element | EN | ES |
|---|---|---|
| Eyebrow | Collections | Colecciones |
| H2 | Three ways to *sell Miami.* | Tres maneras de *vender Miami.* |
| Miami Beach | The postcard: Art Deco, lifeguard towers, Ocean Drive. | La postal: Art Deco, torres de salvavidas, Ocean Drive. |
| Miami | Skyline, Wynwood walls and palms at sunset. | Skyline, murales de Wynwood, palmas al atardecer. |
| Cuban American | Calle Ocho, dominoes, the rooster. Pure Little Havana. | Calle Ocho, dominó y el gallo. Pura Pequeña Habana. |
| Count line | {22} magnet designs · {46} products | {22} diseños de imanes · {46} productos |
| Link (aria) | See the {Miami Beach} collection | Ver la colección {Miami Beach} |

### 4.6 Shop by product

| Element | EN | ES |
|---|---|---|
| Eyebrow | Shop by product | Por producto |
| H2 | Five things *tourists take home.* | Cinco cosas que *el turista se lleva.* |
| Magnets · {70} designs | Handmade wood, on their fridge every day. | Madera hecha a mano, en su refrigerador a diario. |
| Stickers · {28} designs | Weatherproof vinyl. The easy add-on at the register. | Vinilo resistente. El extra fácil en el mostrador. |
| Caps · 6 designs · 6 colors | Vintage caps, leather patch. Packs of 15. | Gorras vintage, parche de cuero. Paquetes de 15. |
| Totes · {19} designs | Cotton canvas. Carries the rest of the trip. | Lona de algodón. Para cargar el resto del viaje. |
| Coasters · {14} designs | Glazed ceramic, cork back. The gift for back home. | Cerámica con corcho. El regalito para los de casa. |

The spec facts come from the live product pages (`gorras.njk`, `stickers.njk`, `totes.njk`, `coasters.njk`).

### 4.7 Proof

**Rule for the build:** show version A only when **at least 2** `PROOF_*` vars are set. Otherwise show version B. A lone stat looks thin.

**A. With numbers**

| Element | EN | ES |
|---|---|---|
| Eyebrow | In numbers | En números |
| H2 | Real shelves, *real numbers.* | Tiendas reales, *números reales.* |
| `PROOF_STORES` | {n} shops already carry us | {n} tiendas ya nos venden |
| `PROOF_UNITS_SOLD` | {n} pieces sold | {n} piezas vendidas |
| `PROOF_REORDER_RATE` | {n}% of shops come back for more | {n}% de las tiendas vuelve a pedir |
| `PROOF_YEARS` | {n} years making Miami souvenirs | {n} años haciendo souvenirs de Miami |
| Source line | From Studio Lab's records, [placeholder: month year]. | Datos de Studio Lab, [placeholder: mes año]. |
| Photo caption | [placeholder: real stockist shelf photo · shop name, city] | igual |

**B. No numbers: "why shops say yes"**

| Element | EN | ES |
|---|---|---|
| H2 | Why shops *say yes.* | Por qué *dicen que sí.* |
| Reason 1 | **Art nobody else prints.** Original designs from a Miami studio, not a catalog import. | **Arte que nadie más imprime.** Diseños originales de un estudio en Miami, no de catálogo. |
| Reason 2 | **Trying costs nothing.** The first box is free and yours. So is every sale. | **Probar no cuesta nada.** La primera caja es gratis y es tuya. Lo que vendas, también. |
| Reason 3 | **Restocking is one scan.** The card in your box starts the order for you. | **Reponer es un escaneo.** La tarjeta de tu caja te empieza el pedido. |
| Reason 4 | **You deal with the maker.** Jesús answers your WhatsApp himself. | **Tratas con el artista.** Jesús te contesta el WhatsApp en persona. |

### 4.8 Trial form (`#trial`)

**Left column**

| Element | EN | ES |
|---|---|---|
| Tag | ★ Free trial box | ★ Caja gratis |
| H2 | Try it on your shelf, *free.* | Pruébalo en tu tienda, *gratis.* |
| Sub | Two quick steps. Jesús reads every request himself. | Dos pasos rápidos. Jesús lee cada solicitud en persona. |
| Check 1 | **Free.** No card, no contract. | **Gratis.** Sin tarjeta, sin contrato. |
| Check 2 | **Yours to keep** and sell. | **Es tuya** para vender. |
| Check 3 | **Anywhere in Florida,** from the Keys up. | **En toda la Florida,** desde los Cayos. |
| Alt link | Just want prices? WhatsApp Jesús | ¿Solo los precios? WhatsApp a Jesús |

**Form head and steps**

| Element | EN | ES |
|---|---|---|
| Step 1 label | Step 1 of 2 · Your shop | Paso 1 de 2 · Tu tienda |
| Step 2 label | Step 2 of 2 · Where to send it | Paso 2 de 2 · A dónde la mandamos |
| Outside label | Outside Florida | Fuera de la Florida |
| Time hint | ~2 min | ~2 min |
| Legend 1 (sr-only) | Your shop and how to reach you | Tu tienda y cómo contactarte |
| Legend 2 (sr-only) | Where we send your box | A dónde mandamos tu caja |

**Fields** (helper text sits under the field)

| Field | Label EN | Label ES | Helper EN | Helper ES |
|---|---|---|---|---|
| `store` | Store name | Nombre de la tienda | — | — |
| `name` | Your name | Tu nombre | — | — |
| `email` | Email | Email | — | — |
| `phone` | Phone / WhatsApp | Teléfono / WhatsApp | — | — |
| `zip` | Shop ZIP code | ZIP de la tienda | Where your shop is. | Donde está tu tienda. |
| `zip` live: in FL | — | — | ✓ In Florida. One more step. | ✓ En la Florida. Un paso más. |
| `zip` live: outside | — | — | Outside Florida. We'll still get back to you. | Fuera de la Florida. Igual te contestamos. |
| `street` | Street address | Dirección | Your shop's address. That's where the box goes. | La de la tienda. Ahí llega la caja. |
| `city` | City | Ciudad | — | — |
| `social` | Instagram or website (optional) | Instagram o página web (opcional) | Lets Jesús see your shop and reply faster. | Así Jesús ve tu tienda y te contesta más rápido. |

**Buttons and fine print**

| Element | EN | ES |
|---|---|---|
| Step 1 button | Continue | Continuar |
| Under step 1 | Free · No card · No contract | Gratis · Sin tarjeta · Sin contrato |
| Back | Back | Atrás |
| Submit | Send my request | Enviar solicitud |
| Under submit (fine print, **rules live here**) | A request, not an order. One trial box per business. | Es una solicitud, no un pedido. Una caja por negocio. |
| Privacy note | We use your details only to review this request and reply to you. No newsletter. Never sold or shared. | Usamos tus datos solo para revisar tu solicitud y contestarte. Sin boletines. Nunca se venden ni se comparten. |

**Errors** (pattern: *Add…* / *Falta…* when empty, *Check…* / *Revisa…* when wrong)

| Case | EN | ES |
|---|---|---|
| `store` empty | Add your shop's name. | Falta el nombre de la tienda. |
| `name` empty | Add your name. | Falta tu nombre. |
| `email` empty | Add your email. | Falta tu email. |
| `email` invalid | Check your email, e.g. you@yourshop.com. | Revisa el email, ej. tu@tutienda.com. |
| `phone` empty | Add a phone or WhatsApp number. | Falta un teléfono o WhatsApp. |
| `phone` < 10 digits | Check the number: 10 digits, area code first. | Revisa el número: 10 dígitos, con código de área. |
| `zip` empty | Add your shop's ZIP. | Falta el ZIP de la tienda. |
| `zip` not 5 digits | Check the ZIP: 5 digits. | Revisa el ZIP: 5 dígitos. |
| `street` empty | Add your shop's street address. | Falta la dirección de la tienda. |
| `city` empty | Add your city. | Falta la ciudad. |
| Summary (aria-live) | A couple of fields need a look. | Revisa los campos marcados. |
| `_honey` filled | *(silent: fake success, nothing sent)* | — |

**Out-of-Florida panel**

| Element | EN | ES |
|---|---|---|
| Title | Outside Florida? Let's still talk. | ¿Fuera de la Florida? Hablemos igual. |
| Body | Free trial boxes stay in Florida for now. Send your details and Jesús will reply about wholesale. | Por ahora las cajas de prueba son solo en la Florida. Manda tus datos y Jesús te contesta sobre precios al por mayor. |
| Primary | Send my details | Mandar mis datos |
| Secondary | Change ZIP | Cambiar el ZIP |

**States**

| State | Element | EN | ES |
|---|---|---|---|
| Sending | Button | Sending… | Enviando… |
| Sending | aria-live | Sending your request… | Enviando tu solicitud… |
| Success (FL) | Heading | Got it, {first}! *(no name: "Got it!")* | ¡Listo, {first}! *(sin nombre: "¡Listo!")* |
| Success (FL) | Body | Jesús reads every request himself. Expect a reply by email or WhatsApp within [TRIAL_REPLY_DAYS] business days. | Jesús lee cada solicitud en persona. Te contesta por email o WhatsApp en [TRIAL_REPLY_DAYS] días hábiles. |
| Success (FL) | Next steps | 1. Jesús looks at your shop. 2. He replies by email or WhatsApp. 3. Once approved, your box ships from Miami. | 1. Jesús mira tu tienda. 2. Te contesta por email o WhatsApp. 3. Si se aprueba, tu caja sale de Miami. |
| Success (FL) | Link | Meanwhile, see the designs | Mientras, mira los diseños |
| Success (outside) | Body | Your details are in. Jesús will reply about wholesale within [TRIAL_REPLY_DAYS] business days. | Ya tenemos tus datos. Jesús te contesta sobre precios al por mayor en [TRIAL_REPLY_DAYS] días hábiles. |
| Network error | Heading | Almost there. | Ya casi. |
| Network error | Body | The form didn't go through, so we opened an email with your details filled in. Just hit send. | El formulario no pasó, así que te abrimos un email con tus datos. Solo dale a enviar. |
| Network error | Buttons | Open the email again · Send on WhatsApp instead | Abrir el email otra vez · Mejor por WhatsApp |
| Network error | Help line | No email app on this phone? WhatsApp works too. | ¿Sin app de correo? Por WhatsApp también sirve. |
| Network error | WhatsApp prefill | Hi Jesús! Trial box request: {store} · {name} · {email} · {phone} · {street}, {city} {zip} | ¡Hola Jesús! Pido una caja de prueba: {store} · {name} · {email} · {phone} · {street}, {city} {zip} |
| Already requested | Heading | Your request is already in. | Tu solicitud ya llegó. |
| Already requested | Body | Jesús has it and will reply within [TRIAL_REPLY_DAYS] business days. Need to change something? Message him. | Jesús ya la tiene y te contesta en [TRIAL_REPLY_DAYS] días hábiles. ¿Quieres cambiar algo? Escríbele. |
| Already requested | Button | WhatsApp Jesús | WhatsApp a Jesús |
| Already requested | Link | Different shop? Start over | ¿Otra tienda? Empieza de nuevo |

### 4.9 Custom collections (`#crear`)

| Element | EN | ES |
|---|---|---|
| Tag | ★ Made for your shop | ★ Hecho para tu tienda |
| Eyebrow | Custom collections | Colecciones a medida |
| H2 | Your beach, *on a magnet.* | Tu playa, *en un imán.* |
| Sub | Your town's name, your pier, your lighthouse. Tell Jesús what your customers keep asking for. | El nombre de tu ciudad, tu muelle, tu faro. Cuéntale a Jesús lo que tus clientes siempre piden. |
| Button 1 | WhatsApp Jesús | WhatsApp a Jesús |
| Button 2 | Email us | Mándanos un email |
| WhatsApp prefill | Hi Jesús! I'd like a custom collection for my shop. We're in [city]. | ¡Hola Jesús! Me interesa una colección a medida para mi tienda. Estamos en [ciudad]. |
| Email subject | Custom collection | Colección a medida |
| Fine print | Minimums and lead times: [placeholder: custom minimum + lead time] | Mínimos y tiempos: [placeholder] |

### 4.10 FAQ (the rules live here)

| Element | EN | ES |
|---|---|---|
| H2 | Good *questions.* | Buenas *preguntas.* |
| Intro | Anything else? Jesús answers himself. | ¿Algo más? Jesús te contesta en persona. |
| Link | Ask on WhatsApp | Pregunta por WhatsApp |

| # | Q EN | A EN | Q ES | A ES |
|---|---|---|---|---|
| 1 | Who can request a trial box? | Gift, souvenir and tourist shops anywhere in Florida, from the Keys to the Panhandle. It's one box per business, so there's enough to go around. | ¿Quién puede pedir la caja? | Tiendas de regalos, souvenirs y turismo en toda la Florida, de los Cayos al Panhandle. Es una caja por negocio, para que alcance para todos. |
| 2 | What does it cost? | Nothing. No card, no contract, no catch. The box is yours to keep, and whatever it sells is yours too. | ¿Cuánto cuesta? | Nada. Sin tarjeta, sin contrato, sin trampa. La caja es tuya, y lo que vendas también. |
| 3 | What comes in the box? | Our handmade wood magnets, always, plus a mix of stickers, caps, totes or coasters. About [placeholder: pieces per box] pieces, and a reorder card. | ¿Qué trae la caja? | Siempre nuestros imanes de madera hechos a mano, más una mezcla de stickers, gorras, totes o posavasos. Unas [placeholder] piezas y una tarjeta para reponer. |
| 4 | Why does Jesús review every request? | Every box is free, so he makes sure each one lands in a real shop. He reads each request himself and replies within [TRIAL_REPLY_DAYS] business days. It's a request, not an order; if it's not a fit, he'll tell you straight. | ¿Por qué Jesús revisa cada solicitud? | Cada caja es gratis, así que se asegura de que llegue a una tienda de verdad. Lee cada solicitud en persona y te contesta en [TRIAL_REPLY_DAYS] días hábiles. Es una solicitud, no un pedido; si no encaja, te lo dice claro. |
| 5 | When will my box arrive? | Once your request is approved, your box ships from Miami in [placeholder: days from approval to ship]. | ¿Cuándo llega la caja? | Cuando se aprueba la solicitud, tu caja sale de Miami en [placeholder]. |
| 6 | How do I reorder? | Scan the QR card in your box, or just WhatsApp Jesús. Reorders are wholesale, with a $[TRIAL_REORDER_MIN] minimum, paid on delivery or by card. Payment terms open up after your first paid order. | ¿Cómo vuelvo a pedir? | Escanea la tarjeta QR de tu caja o escríbele a Jesús por WhatsApp. Los pedidos son al por mayor, con mínimo de $[TRIAL_REORDER_MIN], contra entrega o con tarjeta. Después del primer pedido pagado hay plazos de pago. |
| 7 | Do I need a resale certificate? | Not for the trial. For your first paid order, have your Florida Annual Resale Certificate handy so we can sell to you tax-free. | ¿Necesito certificado de reventa? | Para la prueba, no. Para el primer pedido pagado, ten a mano tu Certificado Anual de Reventa de la Florida y te vendemos sin impuesto. |
| 8 | My shop is outside Florida. | Send the form anyway. Free trial boxes stay in Florida for now, but Jesús will reply about wholesale. | Mi tienda no está en la Florida. | Mándalo igual. Las cajas de prueba son solo en la Florida por ahora, pero Jesús te contesta sobre precios al por mayor. |
| 9 | Can I get designs with my town's name? | Ask Jesús. That's what custom collections are for: your town, your beach, your landmark. Minimums and lead times: [placeholder]. | ¿Hacen diseños con el nombre de mi ciudad? | Pregúntale a Jesús. Para eso son las colecciones a medida: tu ciudad, tu playa, tu lugar. Mínimos y tiempos: [placeholder]. |

### 4.11 WhatsApp line, footer, sticky CTA

| Element | EN | ES |
|---|---|---|
| WhatsApp line | Rather just text? Jesús answers. | ¿Prefieres escribir? Jesús contesta. |
| WhatsApp link | WhatsApp Jesús · +1 (786) 483-4268 | WhatsApp a Jesús · +1 (786) 483-4268 |
| Footer tagline | Original souvenirs, made in Miami. Wholesale for gift shops across Florida. | Souvenirs originales, hechos en Miami. Al por mayor para tiendas de toda la Florida. |
| Footer columns | Collections · Products · Wholesale | Colecciones · Productos · Al por mayor |
| Footer wholesale links | Free trial box · Custom collections · WhatsApp · Email | Caja de prueba gratis · Colecciones a medida · WhatsApp · Email |
| Footer base | © 2026 Nodarse Arts LLC · Miami Peculiar is a Studio Lab brand · Made in Miami, FL | © 2026 Nodarse Arts LLC · Miami Peculiar es una marca de Studio Lab · Hecho en Miami, FL |
| **Sticky mobile CTA** | Request your free box | Pide tu caja gratis |

---

## 5. Reorder page (`/r/?box=CODE`, opened from the QR)

| Element | EN | ES |
|---|---|---|
| H1 | Running low? Restock in *a few taps.* | ¿Se te acaba? Repón en *dos toques.* |
| Sub (code present) | Your box code is already in the order. Pick email or WhatsApp, add what you need, send. | El código de tu caja ya va en el pedido. Escoge email o WhatsApp, pon lo que necesitas y envía. |
| Sub (no code) | Pick email or WhatsApp, add what you need, send. | Escoge email o WhatsApp, pon lo que necesitas y envía. |
| Code pill | Box {MB-014} | Caja {MB-014} |
| Button 1 | Reorder by email | Pedir por email |
| Button 2 | Reorder on WhatsApp | Pedir por WhatsApp |
| Link | Browse all designs | Ver todos los diseños |
| Terms line | Wholesale · $[TRIAL_REORDER_MIN] minimum · Pay on delivery or by card | Al por mayor · Mínimo $[TRIAL_REORDER_MIN] · Contra entrega o con tarjeta |
| Terms line 2 | Payment terms open up after your first paid order. | Después del primer pedido pagado hay plazos de pago. |
| Resale note | First paid order? Have your Florida Annual Resale Certificate handy. [placeholder: how to send it — photo on WhatsApp OK?] | ¿Primer pedido pagado? Ten a mano tu Certificado Anual de Reventa de la Florida. [placeholder] |
| Help line | Stuck? WhatsApp Jesús · +1 (786) 483-4268 | ¿Dudas? WhatsApp a Jesús · +1 (786) 483-4268 |
| `<title>` (noindex) | Reorder · Miami Peculiar | Reponer · Miami Peculiar |

**Email subject:** `Reorder — box {MB-014}` | `Nuevo pedido — caja {MB-014}`. With no code: `Reorder from my shop` | `Nuevo pedido de mi tienda`.

**Email body (EN)**
```
Hi Jesús,

I'd like to reorder.

Box code: {MB-014}
Store name:
My name:

What I need (product · design # · qty):
- Magnets · # ·
-
-

Payment (on delivery or card):
FL resale certificate # (first paid order only):
Notes:

Thanks!
```

**Email body (ES)**
```
Hola Jesús:

Quiero volver a pedir.

Código de la caja: {MB-014}
Tienda:
Mi nombre:

Lo que necesito (producto · diseño # · cantidad):
- Imanes · # ·
-
-

Pago (contra entrega o tarjeta):
Certificado de reventa FL # (solo el primer pedido pagado):
Notas:

¡Gracias!
```
With no code, drop the `Box code` line.

**WhatsApp text:** `Hi Jesús! Reorder for box {MB-014}. Here's what I need:` | `¡Hola Jesús! Pedido para la caja {MB-014}. Esto es lo que necesito:`. With no code: `Hi Jesús! I'd like to reorder. Here's what I need:` | `¡Hola Jesús! Quiero volver a pedir. Esto es lo que necesito:`

---

## 6. QR card (3.5 × 2 in)

Print each card in the language the shop used on the form (the form sends `lang`).

| Side | Element | EN | ES |
|---|---|---|---|
| Front (QR side, seen first) | Headline | Running low? *Scan to restock.* | ¿Se acaba? *Escanea y repón.* |
| Front | One line | Your box code is already in the order. | El código de tu caja ya va en el pedido. |
| Front | CTA under QR | Scan: your reorder, already started | Escanea: tu pedido ya empezado |
| Front | Code | Box MB-014 | Caja MB-014 |
| Front | WhatsApp fallback | Can't scan? WhatsApp +1 (786) 483-4268 and say "MB-014". | ¿No escanea? WhatsApp al +1 (786) 483-4268 y di "MB-014". |
| Back (brand side) | Thank-you | Thanks for giving Miami a spot on your shelf. | Gracias por darle un lugarcito a Miami en tu tienda. |
| Back | Tip | Tip: keep the magnets by the register, at eye level. | Consejo: pon los imanes en el mostrador, a la vista. |
| Back | Sign-off | Jesús · Studio Lab, Miami | Jesús · Studio Lab, Miami |
| Optional rack sticker | Line | Running low? Scan to restock. | ¿Se acaba? Escanea y repón. |

---

## 7. Meta

| | EN | ES |
|---|---|---|
| Title (≤60) | Wholesale Miami Souvenirs \| Free Trial Box \| Miami Peculiar | Souvenirs de Miami al por mayor \| Caja de prueba gratis |
| Description (≤155) | Handmade wood magnets, stickers, caps, totes and coasters with original Miami art. Florida gift shops: request a free trial box, yours to keep. | Imanes de madera hechos a mano, stickers, gorras, totes y posavasos con arte original de Miami. Tiendas de la Florida: pide tu caja de prueba gratis. |

Lengths: EN title 59, ES title 55, EN description 143, ES description 150.

---

## 8. Rules ledger

| Rule (v2 location) | Now lives |
|---|---|
| One box per business (marquee, hero seal, box checklist, trial checks, step-1 fine print) | Fine print under **Send my request**, and FAQ 1 ("so there's enough to go around") |
| Always with magnets (marquee, box tag, box sub) | Recast as selling: box check 1 "the heart of every box", and stated plainly in FAQ 3 |
| Reply in 2 business days (marquee, hero foot, trial checks, step 2 in bold) | Step 2 body, success state, "already requested" state and FAQ 4, as `[TRIAL_REPLY_DAYS]`, never bold and never in a headline |
| ZIP ranges 33001–33499 (ZIP hint, trial checks, FAQ) | **Removed.** The copy says "anywhere in Florida". Validation silently uses 32004–34997 |
| South Florida only (meta line, trial checks, outside panel, FAQ, footer) | Becomes "all of Florida": trial check 3, FAQ 1, FAQ 8, out-of-Florida panel, footer |
| A request, not an order (trial sub) | Fine print under submit, and FAQ 4 |
| Reorder minimum, payment, terms | FAQ 6 and the reorder-page terms line |
| FL resale certificate | FAQ 7 and the reorder-page note |
| Pieces per box | Box fine print and FAQ 3 (placeholder) |
| Ship time after approval | FAQ 5 (placeholder) |
| Custom minimums and lead times | Custom-collections fine print and FAQ 9 (placeholder) |
| Section numbers 01/05 | Dropped (owner feedback) |

**Not rules, so kept up top:** "Free. No card, no contract." is risk reversal, the strongest selling line we have.

**Claims deliberately not made:** "Florida's most-photographed city" (no source; replaced by "the Miami your customers came to see"), "souvenirs that sell", "tourists grab them first", any delivery time, any "bestseller" label until Jesús confirms it.

---

## Open facts for the owner
- Pieces per box, and the ship time after approval?
- Are the 6 bestseller picks real top sellers? (If not, the eyebrow becomes "Jesús's picks".)
- Wholesale and suggested retail prices per product (these drive "You keep" and the box value line)?
- Proof numbers (shops, units, reorder %, years) and the "as of" date?
- Custom collections: minimum and lead time?
- Resale certificate: is a WhatsApp photo OK?
- Does Jesús answer in English as well as Spanish? (If yes, add "in English or Spanish" to proof reason 4.)
- Are the caps' "packs of 15" a wholesale pack too?
- OK to give magnets descriptive names ("Lifeguard Tower")?
