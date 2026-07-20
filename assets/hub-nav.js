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
  // the React landing may mount after load — hide a few times to catch it.
  function ready() { hideDeprecated(); setTimeout(hideDeprecated, 300); setTimeout(hideDeprecated, 900); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
