/* Studio Lab — shared order cart (Miami Peculiar storefront).
   One implementation for gorras / magnets / colecciones / stickers, replacing
   the per-page copies that had drifted. Persists to localStorage 'mp_order'
   (shared across every page on the same origin), renders the floating order
   bar + drawer, and submits via the order.js __slp sink.

   Functions are intentionally GLOBAL: the order-bar HTML and card buttons call
   them from inline onclick handlers (addToOrder, mpVersion, mpQty, mpSend…). */
var MP_KEY = 'mp_order';
var MP_EMAIL = 'jesusnodarse1823@gmail.com';

function mpLang() { return document.documentElement.lang || 'en'; }
function mpGet() { try { var v = JSON.parse(localStorage.getItem(MP_KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function mpSet(v) { localStorage.setItem(MP_KEY, JSON.stringify(v)); mpRender(); }
function mpClose(id) { var el = document.getElementById(id); if (el) el.classList.remove('open'); document.body.style.overflow = ''; }
function mpOpen(id) { var el = document.getElementById(id); if (el) el.classList.add('open'); document.body.style.overflow = 'hidden'; }
function mpOpenPanel() { mpRenderItems(); mpOpen('mpPanelOv'); }

/* Resolve an add/version argument — a DOM element (magnets/gorras pass `this`)
   OR a data-num (colecciones pass the number) — to its .p-card, then its info.
   col falls back to window.MP_COL for pages whose cards omit data-col. */
function mpCard(arg) {
  if (arg && arg.nodeType) return arg.closest ? arg.closest('.p-card') : null;
  return document.querySelector('.p-card[data-num="' + arg + '"]');
}
function mpInfo(card) {
  if (!card) return null;
  var n = card.getAttribute('data-num');
  var nameEl = card.querySelector('.p-name');
  return { n: String(n), name: nameEl ? nameEl.textContent.trim() : ('#' + n), col: card.getAttribute('data-col') || window.MP_COL || '' };
}

function addToOrder(arg) {
  var inf = mpInfo(mpCard(arg)); if (!inf) return;
  var o = mpGet(), key = inf.n + '|' + inf.col + '|std';
  var it = o.find(function (x) { return x.key === key; });
  if (it) { it.qty++; } else { o.push({ key: key, n: inf.n, name: inf.name, col: inf.col, qty: 1, custom: false, note: '' }); }
  mpSet(o); mpFlash();
}

/* Add a whole pack (array of {n, name, col}) to the cart — used by stickers'
   "Order pack" action so packs land in the same shared cart/drawer. */
function addPackToOrder(items) {
  var o = mpGet();
  (items || []).forEach(function (p) {
    var key = String(p.n) + '|' + (p.col || '') + '|std';
    var it = o.find(function (x) { return x.key === key; });
    if (it) { it.qty++; } else { o.push({ key: key, n: String(p.n), name: p.name, col: p.col || '', qty: 1, custom: false, note: '' }); }
  });
  mpSet(o); mpFlash(); mpOpenPanel();
}

var MP_CHIPS = {
  es: ['Nombre de mi negocio', 'Referencia de mi zona', 'Cambiar texto / idioma', 'Marca trasera: tu logo o mensaje corto'],
  en: ['My business name', 'A local landmark', 'Change text / language', 'Back stamp: your logo or short message']
};
var mpVerCard = null;
function mpVersion(arg) {
  var card = mpCard(arg); var inf = mpInfo(card); if (!inf) return;
  mpVerCard = card;
  document.getElementById('mpVerTitle').textContent = (mpLang() === 'es' ? 'Versionar ' : 'Version ') + inf.name;
  var box = document.getElementById('mpVerChips'); box.innerHTML = '';
  MP_CHIPS[mpLang()].forEach(function (c) {
    var d = document.createElement('div'); d.className = 'mp-chip'; d.textContent = c;
    d.onclick = function () { d.classList.toggle('on'); }; box.appendChild(d);
  });
  document.getElementById('mpVerNote').value = '';
  mpOpen('mpVerOv');
}
function mpVerAdd() {
  var chips = [].slice.call(document.querySelectorAll('#mpVerChips .mp-chip.on')).map(function (d) { return d.textContent; });
  var note = document.getElementById('mpVerNote').value.trim();
  var inf = mpInfo(mpVerCard); if (!inf) return;
  var o = mpGet();
  var full = (chips.join(', ') + (note ? ((chips.length ? ' — ' : '') + note) : ''));
  o.push({ key: inf.n + '|' + inf.col + '|c' + Date.now(), n: inf.n, name: inf.name, col: inf.col, qty: 1, custom: true, note: full });
  mpSet(o); mpClose('mpVerOv'); mpFlash();
}

function mpQty(k, d) { var o = mpGet(); var it = o.find(function (x) { return x.key === k; }); if (!it) return; it.qty += d; if (it.qty < 1) o = o.filter(function (x) { return x.key !== k; }); mpSet(o); mpRenderItems(); }
function mpDel(k) { mpSet(mpGet().filter(function (x) { return x.key !== k; })); mpRenderItems(); }
function mpNoteEdit(k, v) { var o = mpGet(); var it = o.find(function (x) { return x.key === k; }); if (it) { it.note = v; localStorage.setItem(MP_KEY, JSON.stringify(o)); } }

function mpRender() {
  var o = mpGet(), total = o.reduce(function (a, x) { return a + x.qty; }, 0);
  var c = document.getElementById('mpCount'); if (c) c.textContent = total;
  var b = document.getElementById('mpBar'); if (b) b.classList.toggle('on', total > 0);
}
function mpRenderItems() {
  var o = mpGet(), el = document.getElementById('mpItems'), es = mpLang() === 'es'; if (!el) return;
  if (!o.length) { el.innerHTML = '<div class="mp-empty">' + (es ? 'Tu pedido esta vacio. Agrega o versiona disenos de las colecciones.' : 'Your order is empty. Add or version designs from the collections.') + '</div>'; return; }
  el.innerHTML = o.map(function (x) {
    return '<div class="mp-item"><div class="mp-item-top">' +
      '<div style="flex:1"><div class="mp-item-col">' + x.col + '</div><div class="mp-item-name">' + x.name + '</div></div>' +
      '<div class="mp-qty"><button onclick="mpQty(\'' + x.key + '\',-1)">&minus;</button><span>' + x.qty + '</span><button onclick="mpQty(\'' + x.key + '\',1)">+</button></div>' +
      '<button class="mp-del" onclick="mpDel(\'' + x.key + '\')">&times;</button></div>' +
      (x.custom ? ('<span class="mp-badge">&#10024; ' + (es ? 'Version personalizada' : 'Custom version') + '</span>' +
        '<textarea class="mp-note" rows="2" onblur="mpNoteEdit(\'' + x.key + '\',this.value)" placeholder="' + (es ? 'Que adaptamos...' : 'What to adapt...') + '">' + (x.note || '') + '</textarea>') : '') +
      '</div>';
  }).join('');
}
function mpSend() {
  var es = mpLang() === 'es';
  var biz = document.getElementById('mpBizName').value.trim();
  var nm = document.getElementById('mpName').value.trim();
  var em = document.getElementById('mpMail').value.trim();
  if (!biz || !nm || !/.+@.+\..+/.test(em)) { alert(es ? 'Completa negocio, nombre y email.' : 'Please fill business, name and email.'); return; }
  var o = mpGet(); if (!o.length) return;
  var lines = o.map(function (x) { return '- ' + x.name + ' [' + x.col + '] x' + x.qty + (x.custom ? (es ? '  << VERSION PERSONALIZADA: ' : '  << CUSTOM VERSION: ') + x.note : ''); });
  var body = (es ? 'Pedido para cotizar' : 'Order for quote') + '\n\n' + lines.join('\n') +
    '\n\n' + (es ? 'Negocio' : 'Business') + ': ' + biz + '\n' + (es ? 'Contacto' : 'Contact') + ': ' + nm + '\nEmail: ' + em;
  window.__slp.href = 'mailto:' + MP_EMAIL + '?subject=' + encodeURIComponent((es ? 'Pedido — ' : 'Order — ') + biz) + '&body=' + encodeURIComponent(body);
}
function mpFlash() { var b = document.getElementById('mpBar'); if (!b) return; b.style.transform = 'scale(1.08)'; setTimeout(function () { b.style.transform = ''; }, 180); }

/* Init: inject a "Version" button into each card's actions (guarded against
   double-injection), render the saved cart, and open the drawer on #pedido. */
/* Keep local previews same-origin: the footer/nav use absolute production
   URLs (for SEO). When NOT on the production host, rewrite those same-site
   links to the current origin so the cart (localStorage is per-origin)
   survives cross-page navigation during local development. No-op in prod. */
function mpFixLocalNav() {
  var PROD = 'https://studio-lab-nodarse.github.io/studio-lab-catalog';
  if (location.origin === 'https://studio-lab-nodarse.github.io') return;
  document.querySelectorAll('a[href^="' + PROD + '"]').forEach(function (a) {
    a.setAttribute('href', a.getAttribute('href').replace(PROD, location.origin));
  });
}

(function mpInit() {
  function run() {
    mpFixLocalNav();
    document.querySelectorAll('.p-card').forEach(function (c) {
      var acts = c.querySelector('.p-actions');
      if (!acts || c.querySelector('.mp-ver')) return;
      var b = document.createElement('button');
      b.className = 'mp-ver';
      b.innerHTML = '&#10024; ' + (mpLang() === 'es' ? 'Versionar' : 'Version');
      b.title = (mpLang() === 'es' ? 'Versionar este diseno para tu negocio' : 'Version this design for your business');
      b.onclick = function (e) { e.stopPropagation(); mpVersion(c); };
      acts.appendChild(b);
    });
    mpRender();
    if (location.hash === '#pedido') mpOpenPanel();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
