/* Studio Lab — hub nav shim.
   The compiled landing (apps/storefront/index.html) renders several
   placeholder <a> with no href and no handler: Products, Themes, New,
   View all, Browse catalog, Request wholesale pricing. Wire them by their
   visible text — bilingual (en/es) — WITHOUT touching the React bundle.
   Delegated on the capture phase so it survives re-renders and runs first. */
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
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var h = a.getAttribute('href');
    if (!(h === null || h === '' || h === '#')) return;      // only unwired anchors
    var t = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var nav = null, target = null;
    if (/browse catalog|ver cat[aá]logo/.test(t)) nav = '../catalog/';
    else if (/^products\b|^productos\b/.test(t)) target = sectionByHeading(/shop by product|comprar por producto/i);
    else if (/^themes\b|^temas\b|view all|ver todo|^new\b|^nuevo\b/.test(t)) target = sectionByHeading(/^(collections|colecciones)$/i);
    else if (/request wholesale pricing|solicitar precios|precios mayoristas/.test(t)) target = firstByText('a,button', /create your collection|crea tu colecci[oó]n/i);
    else return;                                             // an unwired anchor we don't own — leave it
    e.preventDefault();
    if (nav) location.href = nav;
    else if (target) target.scrollIntoView({ block: 'start' });
  }, true);
})();
