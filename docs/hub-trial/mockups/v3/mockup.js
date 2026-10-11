/* Miami Peculiar hub mockup v3 — demo behaviour only (no network).
   Forked from ../shared/mockup.js. Copy strings come from ../copy.md.
   Query strings (all combinable):
     ?lang=es                 open in Spanish
     ?proof=1                 proof "with numbers" version (default: "why shops say yes")
     ?prices=0                picks without price rows (default: price rows with placeholders)
     ?state=errors|outside|step2|sending|success|success-out|error|already
     ?fail=1                  make a real submit fail (network-error fallback) */
(function () {
  'use strict';

  var Q = new URLSearchParams(location.search);
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } }
  };

  /* ---------- Strings the script writes (copy.md §4.8) ---------- */
  var T = {
    en: {
      step1: 'Step 1 of 2 · Your shop', step2: 'Step 2 of 2 · Where to send it', outside: 'Outside Florida',
      zipHint: 'Where your shop is.', zipIn: '✓ In Florida. One more step.', zipOut: 'Outside Florida. We’ll still get back to you.',
      storeEmpty: 'Add your shop’s name.', nameEmpty: 'Add your name.',
      emailEmpty: 'Add your email.', emailBad: 'Check your email, e.g. you@yourshop.com.',
      phoneEmpty: 'Add a phone or WhatsApp number.', phoneBad: 'Check the number: 10 digits, area code first.',
      zipEmpty: 'Add your shop’s ZIP.', zipBad: 'Check the ZIP: 5 digits.',
      streetEmpty: 'Add your shop’s street address.', cityEmpty: 'Add your city.',
      summary: 'A couple of fields need a look.',
      sending: 'Sending…', sendingLive: 'Sending your request…',
      gotIt: 'Got it, {first}!', gotItNoName: 'Got it!',
      subject: 'Trial box request — {store} ({zip})',
      body: 'Trial box request\n\nStore: {store}\nName: {name}\nEmail: {email}\nPhone / WhatsApp: {phone}\nStreet: {street}\nCity: {city}\nZIP: {zip}\nInstagram / website: {social}\nArea: {area}\nLanguage: {lang}\n',
      wa: 'Hi Jesús! Trial box request: {store} · {name} · {email} · {phone} · {street}, {city} {zip}',
      sum: { store: 'Store', name: 'Name', email: 'Email', phone: 'Phone', addr: 'Address', social: 'Instagram' },
      sentFor: 'Sent for {store} · {date}', locale: 'en-US',
      proofOn: 'proof with numbers', proofOff: 'proof without numbers',
      pricesOn: 'picks without prices', pricesOff: 'picks with prices'
    },
    es: {
      step1: 'Paso 1 de 2 · Tu tienda', step2: 'Paso 2 de 2 · A dónde la mandamos', outside: 'Fuera de la Florida',
      zipHint: 'Donde está tu tienda.', zipIn: '✓ En la Florida. Un paso más.', zipOut: 'Fuera de la Florida. Igual te contestamos.',
      storeEmpty: 'Falta el nombre de la tienda.', nameEmpty: 'Falta tu nombre.',
      emailEmpty: 'Falta tu email.', emailBad: 'Revisa el email, ej. tu@tutienda.com.',
      phoneEmpty: 'Falta un teléfono o WhatsApp.', phoneBad: 'Revisa el número: 10 dígitos, con código de área.',
      zipEmpty: 'Falta el ZIP de la tienda.', zipBad: 'Revisa el ZIP: 5 dígitos.',
      streetEmpty: 'Falta la dirección de la tienda.', cityEmpty: 'Falta la ciudad.',
      summary: 'Revisa los campos marcados.',
      sending: 'Enviando…', sendingLive: 'Enviando tu solicitud…',
      gotIt: '¡Listo, {first}!', gotItNoName: '¡Listo!',
      subject: 'Solicitud de caja de prueba — {store} ({zip})',
      body: 'Solicitud de caja de prueba\n\nTienda: {store}\nNombre: {name}\nEmail: {email}\nTeléfono / WhatsApp: {phone}\nDirección: {street}\nCiudad: {city}\nZIP: {zip}\nInstagram / web: {social}\nZona: {area}\nIdioma: {lang}\n',
      wa: '¡Hola Jesús! Pido una caja de prueba: {store} · {name} · {email} · {phone} · {street}, {city} {zip}',
      sum: { store: 'Tienda', name: 'Nombre', email: 'Email', phone: 'Teléfono', addr: 'Dirección', social: 'Instagram' },
      sentFor: 'Enviada para {store} · {date}', locale: 'es-US',
      proofOn: 'prueba con números', proofOff: 'prueba sin números',
      pricesOn: 'favoritos sin precios', pricesOff: 'favoritos con precios'
    }
  };
  var lang = 'en';
  function t(k) { return (T[lang] && T[lang][k]) || T.en[k]; }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? '' : o[k]; }); }

  /* ---------- Language: EN inline, ES in data-es (innerHTML swap) ---------- */
  function setLang(l) {
    lang = l === 'es' ? 'es' : 'en';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-es]').forEach(function (el) {
      if (el.dataset.en == null) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
    document.querySelectorAll('[data-href-es]').forEach(function (el) {
      if (el.dataset.hrefEn == null) el.dataset.hrefEn = el.getAttribute('href');
      el.setAttribute('href', lang === 'es' ? el.dataset.hrefEs : el.dataset.hrefEn);
    });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    var li = document.querySelector('input[name=lang]');
    if (li) li.value = lang;
    document.dispatchEvent(new CustomEvent('mp:lang'));
  }
  document.querySelectorAll('.lang').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) setLang(b.dataset.lang);
    });
  });

  /* ---------- Variants: proof (reasons | numbers) and prices (prices | noprices) ---------- */
  function variant(name, on) {
    document.querySelectorAll('[data-variant="' + name + '"]').forEach(function (el) { el.hidden = !on; });
  }
  var proofOn = Q.get('proof') === '1';
  var pricesOn = Q.get('prices') !== '0';
  variant('numbers', proofOn); variant('reasons', !proofOn);
  variant('prices', pricesOn); variant('noprices', !pricesOn);
  function toggleLinks() {
    document.querySelectorAll('[data-toggle]').forEach(function (a) {
      var p = new URLSearchParams(location.search);
      if (a.dataset.toggle === 'proof') {
        proofOn ? p.delete('proof') : p.set('proof', '1');
        a.textContent = proofOn ? t('proofOff') : t('proofOn');
        a.href = '?' + p.toString() + '#proof';
      } else {
        pricesOn ? p.set('prices', '0') : p.delete('prices');
        a.textContent = pricesOn ? t('pricesOn') : t('pricesOff');
        a.href = '?' + p.toString() + '#bestsellers';
      }
    });
  }
  toggleLinks();
  document.addEventListener('mp:lang', toggleLinks);

  /* FAQ: first answer open on wide screens only (keeps the phone page short) */
  if (matchMedia('(min-width: 900px)').matches) document.querySelectorAll('details[data-open-wide]').forEach(function (d) { d.open = true; });

  /* ---------- Sticky phone CTA: shows after the hero, hides over the form ---------- */
  var sticky = document.querySelector('.sticky-cta');
  var watch = document.querySelectorAll('[data-hide-sticky]');
  if (sticky && watch.length && 'IntersectionObserver' in window) {
    var seen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? seen.add(en.target) : seen.delete(en.target); });
      sticky.classList.toggle('is-hidden', seen.size > 0);
    }, { threshold: 0 });
    watch.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2-step trial form ---------- */
  var form = document.getElementById('tform');
  if (!form) { if (Q.get('lang') === 'es') setLang('es'); return; }
  var KEY = 'mp-trial-request';
  var ZMIN = +form.dataset.zipMin, ZMAX = +form.dataset.zipMax; /* all of Florida: 32004–34997 */
  var P = {
    step1: form.querySelector('[data-step="1"]'),
    step2: form.querySelector('[data-step="2"]'),
    outside: form.querySelector('[data-outside]'),
    done: form.querySelector('[data-done]'),
    error: form.querySelector('[data-error]'),
    already: form.querySelector('[data-already]')
  };
  var head = form.querySelector('.fcard__head');
  var bars = form.querySelectorAll('.fbar span');
  var stepLabel = form.querySelector('[data-step-label]');
  var live = form.querySelector('[data-live]');
  var errsum = form.querySelector('[data-errsum]');
  var zip = form.elements.zip;
  var zipHint = form.querySelector('[data-zip-hint]');
  var submitBtn = form.querySelector('[data-submit]');
  var current = 'step1', zipState = '', lastErrs = {}, doneName = '', alreadyData = null;

  var rules = {
    store: function (v) { return v.trim().length > 1 || 'storeEmpty'; },
    name: function (v) { return v.trim().length > 1 || 'nameEmpty'; },
    email: function (v) { v = v.trim(); return !v ? 'emailEmpty' : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'emailBad'); },
    phone: function (v) { var d = v.replace(/\D/g, ''); return !d ? 'phoneEmpty' : (d.length >= 10 || 'phoneBad'); },
    zip: function (v) { v = v.trim(); return !v ? 'zipEmpty' : (/^\d{5}$/.test(v) || 'zipBad'); },
    street: function (v) { return v.trim().length > 3 || 'streetEmpty'; },
    city: function (v) { return v.trim().length > 1 || 'cityEmpty'; }
  };

  function setErr(n, key) {
    var el = form.elements[n], err = document.getElementById('e-' + n);
    if (key) { lastErrs[n] = key; el.setAttribute('aria-invalid', 'true'); err.querySelector('span').textContent = t(key); err.hidden = false; }
    else { delete lastErrs[n]; el.removeAttribute('aria-invalid'); err.hidden = true; }
  }
  function check(names, noFocus) {
    var first = null;
    names.forEach(function (n) {
      var res = rules[n](form.elements[n].value);
      setErr(n, res === true ? null : res);
      if (res !== true) first = first || form.elements[n];
    });
    var bad = !!first && names.indexOf('store') > -1;
    if (errsum) errsum.hidden = !bad;
    if (first) { live.textContent = t('summary'); if (!noFocus) first.focus(); }
    return !first;
  }

  function inArea(v) { var z = +v; return z >= ZMIN && z <= ZMAX; }
  function renderZip() {
    zipHint.classList.toggle('is-in', zipState === 'in');
    zipHint.classList.toggle('is-out', zipState === 'out');
    zipHint.textContent = zipState === 'in' ? t('zipIn') : zipState === 'out' ? t('zipOut') : t('zipHint');
  }
  zip.addEventListener('input', function () {
    var v = zip.value.replace(/\D/g, '').slice(0, 5);
    if (v !== zip.value) zip.value = v;
    zipState = v.length === 5 ? (inArea(v) ? 'in' : 'out') : '';
    renderZip();
  });
  form.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true' && rules[el.name] && rules[el.name](el.value) === true) setErr(el.name, null);
      if (errsum && !Object.keys(lastErrs).length) errsum.hidden = true;
    });
  });

  function renderHead() {
    stepLabel.textContent = current === 'step2' ? t('step2') : current === 'outside' ? t('outside') : t('step1');
    bars[1].classList.toggle('is-on', current === 'step2');
  }
  function show(name) {
    current = name;
    Object.keys(P).forEach(function (k) { P[k].hidden = k !== name; });
    head.hidden = ['done', 'error', 'already'].indexOf(name) > -1;
    renderHead();
  }

  function v(n) { return (form.elements[n].value || '').trim(); }
  function data() {
    return { store: v('store'), name: v('name'), email: v('email'), phone: v('phone'), zip: v('zip'), street: v('street'),
      city: v('city'), social: v('social') || '—', area: form.elements.area.value || (inArea(v('zip')) ? 'inside' : 'outside'), lang: lang };
  }

  var busyLabel = null;
  function busy(btn, on) {
    if (on) {
      busyLabel = btn.innerHTML;
      btn.classList.add('is-busy');
      btn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-spin"/></svg> ' + t('sending');
      live.textContent = t('sendingLive');
    } else if (busyLabel) { btn.classList.remove('is-busy'); btn.innerHTML = busyLabel; busyLabel = null; }
  }

  function renderDone() {
    var h = P.done.querySelector('[data-done-h]');
    h.textContent = doneName ? fill(t('gotIt'), { first: doneName }) : t('gotItNoName');
  }
  function finish(isOutside, remember) {
    doneName = v('name').split(' ')[0];
    form.elements.area.value = isOutside ? 'outside' : 'inside';
    P.done.querySelectorAll('[data-in]').forEach(function (el) { el.hidden = isOutside; });
    P.done.querySelector('[data-out]').hidden = !isOutside;
    renderDone();
    if (remember) store.set(KEY, { store: v('store'), date: new Date().toISOString() });
    show('done');
    P.done.focus({ preventScroll: true });
  }

  /* Network error → email fallback with every field (mailto) + WhatsApp prefill */
  function showError() {
    var d = data();
    var sum = P.error.querySelector('[data-summary]');
    var L = t('sum');
    var rows = [['store', d.store], ['name', d.name], ['email', d.email], ['phone', d.phone],
      ['addr', [d.street, [d.city, d.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ')]];
    if (d.social && d.social !== '—') rows.push(['social', d.social]);
    sum.textContent = '';
    rows.forEach(function (r) {
      var div = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = L[r[0]]; dd.textContent = r[1] || '—';
      div.appendChild(dt); div.appendChild(dd); sum.appendChild(div);
    });
    P.error.querySelector('[data-mailto]').href = 'mailto:jesusnodarse1823@gmail.com?subject=' +
      encodeURIComponent(fill(t('subject'), d)) + '&body=' + encodeURIComponent(fill(t('body'), d));
    P.error.querySelector('[data-wa]').href = 'https://wa.me/17864834268?text=' + encodeURIComponent(fill(t('wa'), d));
    show('error');
    P.error.focus({ preventScroll: true });
    /* Production: location.href = mailto (opens the user's email app), then this panel stays as the fallback. */
  }

  function showAlready(rec) {
    alreadyData = rec;
    var meta = P.already.querySelector('[data-already-meta]');
    if (rec && rec.store) {
      var dt = new Date(rec.date);
      meta.textContent = fill(t('sentFor'), { store: rec.store, date: isNaN(dt) ? '' : dt.toLocaleDateString(t('locale'), { month: 'short', day: 'numeric' }) });
      meta.hidden = false;
    } else meta.hidden = true;
    show('already');
  }

  function send(isOutside, btn) {
    if (form.elements._honey.value) { finish(isOutside, false); return; } /* spam trap: fake success */
    busy(btn, true);
    setTimeout(function () {
      busy(btn, false);
      if (Q.get('fail') === '1') showError(); else finish(isOutside, true);
    }, 900);
  }

  form.querySelector('[data-next]').addEventListener('click', function () {
    if (!check(['store', 'name', 'email', 'phone', 'zip'])) return;
    if (inArea(zip.value)) { show('step2'); form.elements.street.focus(); }
    else { show('outside'); P.outside.querySelector('[data-send-outside]').focus(); }
  });
  form.querySelector('[data-back]').addEventListener('click', function () { show('step1'); zip.focus(); });
  P.outside.querySelector('[data-change-zip]').addEventListener('click', function () { show('step1'); zip.select(); });
  P.outside.querySelector('[data-send-outside]').addEventListener('click', function (e) { send(true, e.currentTarget); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check(['street', 'city'])) return;
    send(false, submitBtn);
  });
  P.already.querySelector('[data-new-request]').addEventListener('click', function () {
    store.del(KEY); form.reset(); zipState = ''; renderZip(); show('step1'); form.elements.store.focus();
  });

  /* Re-render script-written strings when the language flips */
  document.addEventListener('mp:lang', function () {
    renderHead(); renderZip();
    Object.keys(lastErrs).forEach(function (n) { setErr(n, lastErrs[n]); });
    if (current === 'done') renderDone();
    if (current === 'error') showError();
    if (current === 'already') showAlready(alreadyData);
    if (busyLabel) { submitBtn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-spin"/></svg> ' + t('sending'); }
  });

  /* ---------- Demo states (?state=…) ---------- */
  var DEMO = { store: 'Sunny Isles Gifts', name: 'Maria Lopez', email: 'maria@sunnyislesgifts.com', phone: '(305) 555-0142',
    zip: '33160', street: '17070 Collins Ave', city: 'Sunny Isles Beach', social: '@sunnyislesgifts' };
  function fillDemo(over) {
    var d = Object.assign({}, DEMO, over || {});
    Object.keys(d).forEach(function (k) { form.elements[k].value = d[k]; });
    zipState = inArea(d.zip) ? 'in' : 'out'; renderZip();
  }
  var state = Q.get('state');
  if (Q.get('lang') === 'es') setLang('es');
  switch (state) {
    case 'errors': show('step1'); check(['store', 'name', 'email', 'phone', 'zip'], true); break;
    case 'step2': fillDemo(); show('step2'); break;
    case 'outside': fillDemo({ zip: '10001', city: '', street: '' }); show('outside'); break;
    case 'sending': fillDemo(); show('step2'); P.step2.disabled = true; busy(submitBtn, true); break;
    case 'success': fillDemo(); finish(false, false); break;
    case 'success-out': fillDemo({ zip: '10001' }); finish(true, false); break;
    case 'error': fillDemo(); showError(); break;
    case 'already': fillDemo(); showAlready({ store: DEMO.store, date: new Date().toISOString() }); break;
    default:
      var rec = store.get(KEY);
      if (rec) showAlready(rec); else { renderHead(); renderZip(); }
  }
  if (state && location.hash === '#trial') {
    requestAnimationFrame(function () { document.getElementById('trial').scrollIntoView(); });
  }
})();
