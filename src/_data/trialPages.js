// View models for the trial page: one per language (/ and /es/). All copy lives
// here; every number comes from trial.js, so a block whose value is empty is
// hidden rather than shipped with a placeholder.

import fs from "node:fs";
import trialData from "./trial.js";

const json = (name) => JSON.parse(fs.readFileSync(new URL(`./${name}.json`, import.meta.url), "utf8"));

// Products across the storefront pages (every entry that carries a `num`).
const countProducts = (node) => {
  if (Array.isArray(node)) return node.reduce((n, x) => n + countProducts(x), 0);
  if (node && typeof node === "object") {
    return ("num" in node ? 1 : 0) + Object.values(node).reduce((n, x) => n + countProducts(x), 0);
  }
  return 0;
};

const IMG = {
  heroPhone: "a100ef72f0ff9d0a.webp",
  heroDesktop: "c963b926224d5bb1.webp",
  jesus: "059c5d1263d9d75d.webp",
  lifeguard: "47f0ab36ab5535bc.jpg",
  domino: "3d7a5d7f8f8aeaa7.jpg",
  magnet3: "656597aea3465b45.jpg",
  coaster: "8551650fbdb8f778.webp",
  cadillac: "dcf4c584283b66b6.webp",
  cap: "40b385e5adb4c466.webp",
};

const COPY = {
  en: {
    title: "Free trial box of Miami souvenirs for Florida shops | Miami Peculiar",
    description: "Wood magnets and original Miami art, handmade in Little Havana. Request a free trial box for your shop. No card, no contract.",
    menu: "Menu", close: "Close menu", navDesigns: "Designs", navBox: "Free trial box", navHow: "How it works", navFaq: "FAQ", navCatalog: "Catalog",
    h1a: "The Miami souvenirs tourists actually buy.", h1b: "Try a box free.",
    sub: "Wood magnets and original Miami art, handmade in Little Havana. Keep what sells, reorder what sells out.",
    cta: "Request a free trial box", seeLink: "See what sells", seal: "FREE TRIAL BOX ★ MADE IN MIAMI ★ ",
    proofLabel: "Proof", bestTitle: "Shop favorites", bestSub: "A few of our pieces, and what they sell for.", catalog: "Try them free in your shop",
    magnet: "Magnet", sticker: "Sticker", cap: "Cap", capName: "Lifeguard Tower cap",
    altLifeguard: "Lifeguard Tower wood magnet", altDomino: "Domino Park wood magnet", altCadillac: "Pink Cadillac sticker", altCap: "Pink cap with a Lifeguard Tower patch",
    boxAlt: "What comes in a trial box: wood magnets, a sticker, a coaster, a cap and a reorder card", reorderTag: "Reorder",
    boxTitle: "Your free trial box", boxSub: "A hand-picked mix for your counter, chosen for your shop.",
    boxMix: "A few stickers, caps, totes or coasters", boxCard: "A reorder card with your shop’s own QR code", boxCustom: "Ask for designs made just for your shop: your town, beach or landmark", fCustom: "I’d like designs made just for my shop",
    shelvesTitle: "On real shelves, selling for real", whyTitle: "Why it sells",
    howTitle: "How it works", s1t: "Request your box", s1d: "One minute on your phone. No card.", s2t: "Jesús reviews it personally", s3t: "Sell it, then reorder in a scan", s3d: "The card in your box starts the next order. No minimum on your first one.",
    formTitle: "Request your free trial box", noteBy: "Jesús, Miami Peculiar · Little Havana", oneStep: "Your shop", about1: "About 1 min",
    fStore: "Store name", fName: "Your name", fEmail: "Email", fPhone: "WhatsApp or phone", fZip: "Shop ZIP", zipHint: "For gift, souvenir and tourist shops anywhere in Florida.",
    optional: "(optional)", send: "Send my request", sending: "Sending…", addrHint: "No address needed yet. Jesús confirms where to ship once your box is approved.",
    small: "A request, not an order. One free box per business. We use your details only to reply to you.", rather: "Rather talk? WhatsApp Jesús",
    errOne: "1 field needs a look.", errMany: "{n} fields need a look.",
    errStore: "Add your store’s name.", errName: "Add your name so Jesús knows who to answer.", errPhone: "Add a number Jesús can reply to.", errEmail: "Check the part after the @, or leave it empty.", errZip: "5 digits.",
    outTitle: "Outside Florida? Let’s still talk.", outText: "Free trial boxes stay in Florida for now. Send your details and Jesús will reply about wholesale.", outSend: "Send my details", outZip: "Change ZIP",
    netTitle: "Almost there.", netText: "The form didn’t go through, so we opened an email with your details filled in. Just hit send.", dStore: "Store", dPhone: "WhatsApp", dZip: "ZIP", netEmail: "Open the email again", netWa: "Send on WhatsApp instead",
    alTitle: "Your request is already in.", alSent: "sent", alWa: "WhatsApp Jesús", alNew: "Different shop? Start over",
    doneTitle: "Got it, thank you!", meanwhile: "Meanwhile, see what sells", noscript: "The form needs JavaScript. Message Jesús on WhatsApp instead and he’ll set it up for you.",
    faqTitle: "Questions", closeContact: "Questions? WhatsApp Jesús · +1\u00a0(786)\u00a0483\u20114268",
    footer: "Original souvenirs, made in Little Havana by Studio Lab. Wholesale for shops across Florida.", footTrial: "Free trial box", footCatalog: "Catalog",
    mailSubject: "Trial box request", mailYes: "yes", mailCustom: "Custom designs",
  },
  es: {
    title: "Caja de prueba gratis de souvenirs de Miami para tiendas de la Florida | Miami Peculiar",
    description: "Imanes de madera y arte original de Miami, hechos a mano en la Pequeña Habana. Pide una caja de prueba gratis para tu tienda. Sin tarjeta, sin contrato.",
    menu: "Menú", close: "Cerrar menú", navDesigns: "Diseños", navBox: "Caja de prueba gratis", navHow: "Cómo funciona", navFaq: "Preguntas", navCatalog: "Catálogo",
    h1a: "Los souvenirs de Miami que los turistas sí compran.", h1b: "Prueba una caja gratis.",
    sub: "Imanes de madera y arte original de Miami, hechos a mano en la Pequeña Habana. Quédate con lo que se vende y repón lo que se agota.",
    cta: "Pide tu caja de prueba gratis", seeLink: "Mira lo que se vende", seal: "CAJA GRATIS ★ HECHO EN MIAMI ★ ",
    proofLabel: "Pruebas", bestTitle: "Favoritos de las tiendas", bestSub: "Algunas de nuestras piezas, y a cuánto se venden.", catalog: "Pruébalos gratis en tu tienda",
    magnet: "Imán", sticker: "Sticker", cap: "Gorra", capName: "Gorra Lifeguard Tower",
    altLifeguard: "Imán de madera Lifeguard Tower", altDomino: "Imán de madera Domino Park", altCadillac: "Sticker Pink Cadillac", altCap: "Gorra rosada con parche Lifeguard Tower",
    boxAlt: "Lo que trae una caja de prueba: imanes de madera, un sticker, un posavasos, una gorra y una tarjeta para reponer", reorderTag: "Repón",
    boxTitle: "Tu caja de prueba gratis", boxSub: "Una selección hecha a mano para tu mostrador, escogida para tu tienda.",
    boxMix: "Algunos stickers, gorras, bolsas o posavasos", boxCard: "Una tarjeta para reponer, con el código QR de tu tienda", boxCustom: "Pide diseños hechos solo para tu tienda: tu ciudad, tu playa o tu lugar", fCustom: "Quiero diseños hechos solo para mi tienda",
    shelvesTitle: "En tiendas de verdad, vendiéndose de verdad", whyTitle: "Por qué se vende",
    howTitle: "Cómo funciona", s1t: "Pide tu caja", s1d: "Un minuto desde el celular. Sin tarjeta.", s2t: "Jesús la revisa en persona", s3t: "Véndela y repón con un escaneo", s3d: "La tarjeta de tu caja empieza el próximo pedido. El primero no tiene mínimo.",
    formTitle: "Pide tu caja de prueba gratis", noteBy: "Jesús, Miami Peculiar · Pequeña Habana", oneStep: "Tu tienda", about1: "Como 1 min",
    fStore: "Nombre de la tienda", fName: "Tu nombre", fEmail: "Email", fPhone: "WhatsApp o teléfono", fZip: "ZIP de la tienda", zipHint: "Para tiendas de regalos, souvenirs y turismo en toda la Florida.",
    optional: "(opcional)", send: "Enviar solicitud", sending: "Enviando…", addrHint: "Todavía no hace falta la dirección. Jesús la confirma cuando se apruebe tu caja.",
    small: "Es una solicitud, no un pedido. Una caja gratis por negocio. Usamos tus datos solo para contestarte.", rather: "¿Prefieres hablar? WhatsApp a Jesús",
    errOne: "Revisa 1 campo.", errMany: "Revisa {n} campos.",
    errStore: "Pon el nombre de tu tienda.", errName: "Pon tu nombre para que Jesús sepa a quién contestar.", errPhone: "Pon un número donde Jesús te pueda contestar.", errEmail: "Revisa lo que va después de la @, o déjalo vacío.", errZip: "5 dígitos.",
    outTitle: "¿Fuera de la Florida? Hablemos igual.", outText: "Por ahora las cajas de prueba son solo para la Florida. Manda tus datos y Jesús te contesta sobre precios al por mayor.", outSend: "Mandar mis datos", outZip: "Cambiar el ZIP",
    netTitle: "Ya casi.", netText: "El formulario no pasó, así que te abrimos un email con tus datos. Solo dale a enviar.", dStore: "Tienda", dPhone: "WhatsApp", dZip: "ZIP", netEmail: "Abrir el email otra vez", netWa: "Mejor por WhatsApp",
    alTitle: "Tu solicitud ya llegó.", alSent: "enviada el", alWa: "WhatsApp a Jesús", alNew: "¿Otra tienda? Empieza de nuevo",
    doneTitle: "¡Listo, gracias!", meanwhile: "Mientras, mira lo que se vende", noscript: "El formulario necesita JavaScript. Escríbele a Jesús por WhatsApp y él te ayuda.",
    faqTitle: "Preguntas", closeContact: "¿Preguntas? WhatsApp a Jesús · +1\u00a0(786)\u00a0483\u20114268",
    footer: "Souvenirs originales, hechos en la Pequeña Habana por Studio Lab. Al por mayor para tiendas de toda la Florida.", footTrial: "Caja de prueba gratis", footCatalog: "Catálogo",
    mailSubject: "Solicitud de caja de prueba", mailYes: "sí", mailCustom: "Diseños propios",
  },
};

function buildPage(lang, d, productCount, photos) {
  const es = lang === "es";
  const t = COPY[lang];
  const L = (en, esText) => (es ? esText : en);
  const has = (k) => d[k] !== "";
  const reply = d.TRIAL_REPLY_DAYS;

  const shops = d.PROOF_SHOPS.split(";").map((x) => x.trim()).filter(Boolean).map((x) => {
    const [name, area = ""] = x.split("|").map((p) => p.trim());
    return area ? `${name}, ${area}` : name;
  });

  // Proof. Under 10 shops a bare count reads small and "100%" reads fake, so a
  // full reorder rate becomes "every shop" / "6 of 6".
  const stores = Number(d.PROOF_STORES || 0);
  const rate = Number(d.PROOF_REORDER_RATE || 0);
  const allReorder = rate === 100 && stores > 0;
  const eyebrow = stores >= 10
    ? L(`Already on ${stores} South Florida shelves`, `Ya en ${stores} tiendas del sur de la Florida`)
    : rate === 100
      ? L("Every shop that carries us has reordered", "Todas las tiendas que nos venden han vuelto a pedir")
      : L("Sold from Ocean Drive to Calle Ocho", "Se vende de Ocean Drive a la Calle Ocho");
  const unitsLine = L("pieces sold this past year", "piezas vendidas en el último año");
  const proof = [
    stores && !allReorder && { n: d.PROOF_STORES, l: L("shops carry us", "tiendas nos venden") },
    has("PROOF_UNITS_SOLD") && { n: d.PROOF_UNITS_SOLD, l: unitsLine },
    allReorder
      ? { n: L(`${stores} of ${stores}`, `${stores} de ${stores}`), l: L("shops reordered", "tiendas volvieron a pedir") }
      : rate > 0 && { n: `${rate}%`, l: L("of shops reorder", "de las tiendas vuelve a pedir") },
    has("PROOF_YEARS") && { n: d.PROOF_YEARS, l: L("years in Miami", "años en Miami") },
  ].filter(Boolean);
  // The product count only fills out a strip that already has real proof in it.
  const stats = proof.length && proof.length < 4
    ? [...proof, { n: String(productCount), l: L("products to choose from", "productos para escoger") }]
    : proof;
  const formProof = has("PROOF_UNITS_SOLD")
    ? `${d.PROOF_UNITS_SOLD} ${unitsLine}`
    : allReorder
      ? L(`All ${stores} shops that carry us have reordered`, `Las ${stores} tiendas que nos venden han vuelto a pedir`)
      : stores ? L(`${stores} shops carry us`, `${stores} tiendas nos venden`) : "";

  const price = (k) => (has(k) ? L("Sells for $", "Se vende a $") + d[k] : "");
  const best = [
    { name: "Lifeguard Tower", type: t.magnet, img: IMG.lifeguard, w: 420, h: 630, alt: t.altLifeguard, kind: "magnet", price: price("PRICE_MAGNET_RETAIL") },
    { name: "Domino Park", type: t.magnet, img: IMG.domino, w: 420, h: 630, alt: t.altDomino, kind: "magnet", price: price("PRICE_MAGNET_RETAIL") },
    { name: "Pink Cadillac", type: t.sticker, img: IMG.cadillac, w: 480, h: 478, alt: t.altCadillac, kind: "sticker", price: price("PRICE_STICKER_RETAIL") },
    { name: t.capName, type: t.cap, img: IMG.cap, w: 430, h: 344, alt: t.altCap, kind: "cap", price: price("PRICE_CAP_RETAIL") },
  ];

  const boxMagnets = has("BOX_MAGNETS")
    ? L(`${d.BOX_MAGNETS} handmade wood magnets, our best sellers`, `${d.BOX_MAGNETS} imanes de madera hechos a mano, los más vendidos`)
    : L("Handmade wood magnets, our best sellers", "Imanes de madera hechos a mano, los más vendidos");
  const extras = [
    ["BOX_STICKERS", L("sticker", "sticker"), L("stickers", "stickers")],
    ["BOX_COASTERS", L("coaster", "posavasos"), L("coasters", "posavasos")],
    ["BOX_CAPS", L("cap", "gorra"), L("caps", "gorras")],
    ["BOX_TOTES", L("tote bag", "bolsa"), L("tote bags", "bolsas")],
  ].filter(([k]) => has(k)).map(([k, one, many]) => `${d[k]} ${d[k] === "1" ? one : many}`);
  const boxMix = extras.length < 2
    ? extras[0] || t.boxMix
    : extras.slice(0, -1).join(", ") + L(" and ", " y ") + extras[extras.length - 1];
  const valueLine = has("BOX_VALUE_RETAIL")
    ? L(`Worth $${d.BOX_VALUE_RETAIL} at suggested retail. It’s free, and every dollar it makes is yours.`, `Vale $${d.BOX_VALUE_RETAIL} a precio sugerido. Es gratis, y cada dólar que deje es tuyo.`)
    : L("It’s free, and every dollar it makes is yours.", "Es gratis, y cada dólar que deje es tuyo.");

  const lo = d.MARGIN_FLOOR_PCT;
  const hi = d.MARGIN_TOP_PCT;
  const keep = !lo ? "" : hi
    ? L(`${lo}–${hi}% of every sale, depending on the piece`, `entre el ${lo} y el ${hi}% de cada venta, según la pieza`)
    : L(`at least ${lo}% of every sale`, `al menos el ${lo}% de cada venta`);
  const sheet = L("Your price sheet comes with Jesús’s reply.", "Tu lista de precios llega con la respuesta de Jesús.");
  const marginLine = keep
    ? L(`After that, on reorders you keep ${keep}. ${sheet}`, `Después, al volver a pedir, te quedas con ${keep}. ${sheet}`)
    : sheet;

  const prices = ["PRICE_STICKER_RETAIL", "PRICE_MAGNET_RETAIL", "PRICE_COASTER_RETAIL", "PRICE_TOTE_RETAIL", "PRICE_CAP_RETAIL"]
    .filter(has).flatMap((k) => d[k].split(/[–-]/).map(Number));
  const retailRange = prices.length ? `$${Math.min(...prices)}–$${Math.max(...prices)}` : "";

  const why = [
    L("Art they can’t find at the import stand", "Arte que no van a encontrar con el importador"),
    has("REORDER_DAYS")
      ? L(`Restocked from Little Havana in ${d.REORDER_DAYS} days`, `Lo reponemos desde la Pequeña Habana en ${d.REORDER_DAYS} días`)
      : L("Restocked straight from our studio in Little Havana", "Lo reponemos directo desde nuestro taller en la Pequeña Habana"),
  ];

  const customTerms = has("CUSTOM_MIN") && has("CUSTOM_LEAD_DAYS");
  const customMin = `$${d.CUSTOM_MIN.replace("$", "")}`;
  const faq = [
    { q: L("Who can request a box?", "¿Quién puede pedir una caja?"),
      a: L("Gift, souvenir and tourist shops anywhere in Florida. One box per business, so there’s enough to go around.", "Tiendas de regalos, souvenirs y turismo en toda la Florida. Una caja por negocio, para que alcance para todos.") },
    { q: L("What does it cost?", "¿Cuánto cuesta?"),
      a: L("Nothing. No card, no contract. The box is yours, and so is everything it earns.", "Nada. Sin tarjeta, sin contrato. La caja es tuya, y todo lo que gane también.") },
    { q: L("Can I get designs made just for my shop?", "¿Pueden hacer diseños solo para mi tienda?"),
      a: L("Yes. We design pieces with your town, beach or landmark, and Jesús can put some in your trial box. Tick the box in the form, or ask on WhatsApp.", "Sí. Diseñamos piezas con tu ciudad, tu playa o tu lugar, y Jesús puede incluir algunas en tu caja de prueba. Marca la casilla en el formulario o pregúntale por WhatsApp.")
        + (customTerms ? L(` Custom orders start at ${customMin} and take ${d.CUSTOM_LEAD_DAYS} days.`, ` Los pedidos a medida empiezan en ${customMin} y tardan ${d.CUSTOM_LEAD_DAYS} días.`) : "") },
    { q: L("How much will I make?", "¿Cuánto voy a ganar?"),
      a: [retailRange && L(`Our pieces sell for ${retailRange}.`, `Nuestras piezas se venden de ${retailRange}.`),
        keep && L(`On reorders you keep ${keep}.`, `Cuando vuelvas a pedir, te quedas con ${keep}.`),
        L("Jesús sends your exact price sheet.", "Jesús te manda tu lista de precios.")].filter(Boolean).join(" ") },
    { q: L("When will my box arrive?", "¿Cuándo llega mi caja?"),
      a: has("TRIAL_SHIP_DAYS")
        ? L(`Once approved, it ships from Miami within ${d.TRIAL_SHIP_DAYS} business days.`, `Cuando se aprueba, sale de Miami en ${d.TRIAL_SHIP_DAYS} días hábiles.`)
        : L("Once approved, your box ships from Miami.", "Cuando se aprueba, tu caja sale de Miami.") },
    { q: L("What happens after the trial?", "¿Qué pasa después de la prueba?"),
      a: L("Your first reorder has no minimum, so you restock just what sold. Reorders are wholesale", "Tu primera reposición no tiene mínimo: pides solo lo que se vendió. Los pedidos son al por mayor")
        + (has("TRIAL_REORDER_MIN") ? L(`, from $${d.TRIAL_REORDER_MIN} after the first`, `, con un mínimo de $${d.TRIAL_REORDER_MIN} desde el segundo`) : "")
        + L(", paid on delivery or by card. Payment terms open up after your first paid order.", ", contra entrega o con tarjeta. Después de tu primer pedido pagado hay plazos de pago.") },
    has("REORDER_DAYS") && { q: L("How fast do reorders arrive?", "¿Qué tan rápido llegan los pedidos?"),
      a: L(`${d.REORDER_DAYS} days from Miami.`, `En ${d.REORDER_DAYS} días desde Miami.`) },
    { q: L("Do I need a resale certificate?", "¿Necesito certificado de reventa?"),
      a: L("Not for the trial. Have your Florida Annual Resale Certificate ready for your first paid order.", "Para la prueba, no. Para tu primer pedido pagado, ten a mano tu Certificado Anual de Reventa de la Florida.") },
    { q: L("My shop isn’t in Florida.", "Mi tienda no está en la Florida."),
      a: L("Send the form anyway. Trial boxes stay in Florida for now, but we’ll reply about wholesale.", "Manda el formulario igual. Por ahora las cajas de prueba son solo para la Florida, pero te contestamos sobre precios al por mayor.") },
  ].filter(Boolean);

  const chars = Array.from(t.seal);
  const ring = chars.map((ch, i) => ({ ch: ch === " " ? " " : ch, deg: ((i * 360) / chars.length).toFixed(2) }));

  const hasQuote = has("PROOF_QUOTE") && has("PROOF_QUOTE_BY") && (!es || has("PROOF_QUOTE_ES"));

  return {
    lang, es, t, img: IMG,
    path: es ? "es/" : "",
    root: es ? "../" : "",
    enHref: es ? "../" : "./",
    esHref: es ? "./" : "es/",
    eyebrow, stats, formProof, best, boxMagnets, boxMix, valueLine, marginLine, why, faq, ring,
    shopLine: shops.length ? L("In shops like ", "En tiendas como ") + shops.join(" · ") : "",
    under: L(`No card · No contract · Reply within ${reply} business days`, `Sin tarjeta · Sin contrato · Te contestamos en ${reply} días hábiles`),
    photos: photos.slice(0, 4).map((p) => ({
      img: p.img,
      alt: L(p.altEn, p.altEs),
      caption: p.area ? `${p.shop} · ${p.area}` : p.shop,
    })),
    s2d: L(`You’ll get a reply within ${reply} business days, with your price sheet.`, `Te contesta en ${reply} días hábiles, con tu lista de precios.`),
    note: L(`“Every box goes to a real shop, so I read each request myself. You’ll hear from me within ${reply} business days.”`, `“Cada caja va a una tienda de verdad, por eso leo cada solicitud yo mismo. Te contesto en ${reply} días hábiles.”`),
    quote: hasQuote ? { text: es ? d.PROOF_QUOTE_ES : d.PROOF_QUOTE, by: d.PROOF_QUOTE_BY } : null,
    doneText: L(`Jesús will look at your shop and reply within ${reply} business days, on WhatsApp or by phone. Once approved, he confirms the address and your box ships from Miami.`, `Jesús va a ver tu tienda y te contesta en ${reply} días hábiles, por WhatsApp o por teléfono. Cuando se apruebe, confirma la dirección y tu caja sale de Miami.`),
    outDone: L(`Your details are in. Jesús will reply about wholesale within ${reply} business days.`, `Ya tenemos tus datos. Jesús te contesta sobre precios al por mayor en ${reply} días hábiles.`),
    alText: L(`Jesús has it and will reply within ${reply} business days. Need to change something? Send a message.`, `Jesús ya la tiene y te contesta en ${reply} días hábiles. ¿Quieres cambiar algo? Escríbele.`),
    browseAll: L(`Want to see everything first? Browse all ${productCount} products`, `¿Quieres ver todo primero? Mira los ${productCount} productos`),
  };
}

export default () => {
  const d = trialData();
  const products = ["magnets", "gorras", "stickers", "coasters", "totes"].reduce((n, f) => n + countProducts(json(f)), 0);
  const photos = json("shelfPhotos");
  for (const p of photos) {
    for (const k of ["img", "shop", "altEn", "altEs"]) {
      if (!p[k]) throw new Error(`[shelfPhotos] entry is missing "${k}": ${JSON.stringify(p)}`);
    }
    if (!fs.existsSync(new URL(`../../assets/img/${p.img}`, import.meta.url))) {
      throw new Error(`[shelfPhotos] assets/img/${p.img} does not exist`);
    }
  }
  return ["en", "es"].map((lang) => buildPage(lang, d, products, photos));
};
