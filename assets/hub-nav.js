/* Studio Lab — hub nav shim.
   The compiled landing (apps/storefront/index.html) renders placeholder <a>
   with no href/handler. Wire them by their visible text — bilingual (en/es) —
   WITHOUT touching the React bundle. The catalog is deprecated, so its
   "Browse catalog" CTA is hidden rather than wired. Delegated on the capture
   phase so routing survives re-renders and runs first. */
(function () {
  function sectionByHeading(re) {
    // the heading itself — closest('section') can be a page-spanning wrapper
    // that's already at the top, which wouldn't scroll anywhere.
    return [].slice.call(document.querySelectorAll('h1,h2,h3'))
      .filter(function (e) { return re.test((e.textContent || '').trim()); })[0] || null;
  }
  function firstByText(sel, re) {
    return [].slice.call(document.querySelectorAll(sel))
      .filter(function (e) { return re.test((e.textContent || '').trim()); })[0];
  }
  // Hide placeholder CTAs that have nowhere to go: "Browse catalog" (the
  // catalog is deprecated) and the Collections "View all" (all collections are
  // already shown in that section — there's no separate listing page).
  function hideDeprecated() {
    [].slice.call(document.querySelectorAll('a')).forEach(function (a) {
      var h = a.getAttribute('href');
      if ((h === null || h === '' || h === '#') && /browse catalog|ver cat[aá]logo|view all|ver todo/i.test(a.textContent || '')) {
        a.style.display = 'none';
      }
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var h = a.getAttribute('href');
    if (!(h === null || h === '' || h === '#')) return;      // only unwired anchors
    var t = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var target = null;
    if (/^products\b|^productos\b/.test(t)) target = sectionByHeading(/shop by product|comprar por producto/i);
    else if (/^themes\b|^temas\b|^new\b|^nuevo\b/.test(t)) target = sectionByHeading(/^(collections|colecciones)$/i);
    else if (/request wholesale pricing|solicitar precios|precios mayoristas/.test(t)) target = firstByText('a,button', /create your collection|crea tu colecci[oó]n/i);
    else return;                                             // an unwired anchor we don't own — leave it
    e.preventDefault();
    if (target) target.scrollIntoView({ block: 'start' });
  }, true);
  /* ── Language shim ──────────────────────────────────────────────────
     The hub renders the SHARED masthead (injected at build time, outside the
     React mount) while React's own header is hidden by CSS. React's EN/ES
     buttons still own the app's language state, so forward to them.
     Hidden elements are still clickable programmatically. */
  function reactLangBtn(l) {
    var hdr = document.querySelector('#root header');
    if (!hdr) return null;
    return [].slice.call(hdr.querySelectorAll('button')).filter(function (b) {
      return new RegExp('^' + l + '$', 'i').test((b.textContent || '').trim());
    })[0] || null;
  }
  window.slHubLang = function (l) {
    var b = reactLangBtn(l);
    if (b) b.click();                       // React owns the page body's language
    // …but the shared masthead uses the same data-es/data-en mechanism as every
    // other page, so apply it here too. Without this the header would silently
    // ignore the toggle on the hub alone. Scoped outside #root so we never
    // fight React over its own subtree.
    document.documentElement.lang = l;
    var scope = document.querySelector('body > header');
    if (scope) {
      scope.querySelectorAll('[data-es]').forEach(function (n) {
        var v = n.getAttribute('data-' + l);
        if (v !== null) n.innerHTML = v;
      });
    }
    // mirror the active state onto the visible masthead toggle
    var en = document.getElementById('b-en'), es = document.getElementById('b-es');
    if (en) en.classList.toggle('active', l === 'en');
    if (es) es.classList.toggle('active', l === 'es');
    try { localStorage.setItem('sl_lang', l); } catch (e) {}
  };
  // Adopt the language the rest of the site is already using, once React has
  // mounted. Only acts if it differs from the hub's default (en).
  function syncLang() {
    var saved = null;
    try { saved = localStorage.getItem('sl_lang'); } catch (e) {}
    if (saved === 'es' && reactLangBtn('es')) window.slHubLang('es');
  }

  // the React landing may mount after load — hide a few times to catch it.
  function ready() {
    hideDeprecated();
    setTimeout(hideDeprecated, 300);
    setTimeout(hideDeprecated, 900);
    setTimeout(syncLang, 350);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
