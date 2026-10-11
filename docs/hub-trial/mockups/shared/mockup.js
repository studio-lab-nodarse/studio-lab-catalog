/* Miami Peculiar hub mockups — demo behaviour only (no network). */
(function () {
  'use strict';

  /* EN/ES toggle — visual only in the mockup */
  document.querySelectorAll('.lang').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      document.documentElement.lang = b.dataset.lang || 'en';
    });
  });

  /* Sticky mobile CTA: hidden while the hero CTA or the form is on screen */
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
  if (!form) return;
  var ZMIN = +form.dataset.zipMin, ZMAX = +form.dataset.zipMax;
  var step1 = form.querySelector('[data-step="1"]');
  var step2 = form.querySelector('[data-step="2"]');
  var outside = form.querySelector('[data-outside]');
  var done = form.querySelector('[data-done]');
  var head = form.querySelector('.fcard__head');
  var bars = form.querySelectorAll('.fbar span');
  var stepNo = form.querySelector('[data-step-no]');
  var stepName = form.querySelector('[data-step-name]');
  var zip = form.elements.zip;
  var zipHint = form.querySelector('#h-zip');
  var zipHintDefault = zipHint.innerHTML;

  var rules = {
    store: function (v) { return v.trim().length > 1 || 'Please enter your store’s name.'; },
    name: function (v) { return v.trim().length > 1 || 'Please enter your name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email, like you@yourshop.com.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 10 || 'Please enter a 10-digit phone or WhatsApp number.'; },
    zip: function (v) { return /^\d{5}$/.test(v.trim()) || 'Please enter a 5-digit ZIP code.'; },
    street: function (v) { return v.trim().length > 3 || 'Please enter the street address for the box.'; },
    city: function (v) { return v.trim().length > 1 || 'Please enter your city.'; }
  };

  function check(names) {
    var first = null;
    names.forEach(function (n) {
      var el = form.elements[n];
      var res = rules[n](el.value);
      var err = document.getElementById('e-' + n);
      if (res === true) {
        el.removeAttribute('aria-invalid'); err.hidden = true;
      } else {
        el.setAttribute('aria-invalid', 'true');
        err.querySelector('span').textContent = res; err.hidden = false;
        first = first || el;
      }
    });
    if (first) first.focus();
    return !first;
  }

  function inArea(v) { var z = +v; return z >= ZMIN && z <= ZMAX; }

  zip.addEventListener('input', function () {
    var v = zip.value.replace(/\D/g, '').slice(0, 5);
    if (v !== zip.value) zip.value = v;
    zipHint.classList.remove('is-in', 'is-out');
    if (v.length === 5) {
      if (inArea(v)) { zipHint.classList.add('is-in'); zipHint.innerHTML = '✓ In our trial area — free box available.'; }
      else { zipHint.classList.add('is-out'); zipHint.innerHTML = 'Outside our trial area — we’ll still reply about wholesale.'; }
    } else { zipHint.innerHTML = zipHintDefault; }
  });

  form.querySelectorAll('input').forEach(function (el) {
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true' && rules[el.name] && rules[el.name](el.value) === true) {
        el.removeAttribute('aria-invalid'); document.getElementById('e-' + el.name).hidden = true;
      }
    });
  });

  function show(panel) {
    [step1, step2, outside, done].forEach(function (p) { p.hidden = p !== panel; });
    head.hidden = panel === done;
    var two = panel === step2;
    bars[1].classList.toggle('is-on', two);
    stepNo.textContent = two ? '2' : '1';
    stepName.textContent = two ? 'Where we ship the box' : (panel === outside ? 'Outside our trial area' : 'Your shop');
  }

  function busy(btn, ms, then) {
    var label = btn.innerHTML;
    btn.classList.add('is-busy');
    btn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-spin"/></svg> Sending…';
    setTimeout(function () { btn.classList.remove('is-busy'); btn.innerHTML = label; then(); }, ms);
  }

  function finish(isOutside) {
    var first = form.elements.name.value.trim().split(' ')[0] || 'there';
    done.querySelector('[data-first]').textContent = first;
    done.querySelector('[data-in]').hidden = isOutside;
    done.querySelector('[data-out]').hidden = !isOutside;
    form.elements.area.value = isOutside ? 'outside' : 'inside';
    show(done);
    done.focus();
  }

  form.querySelector('[data-next]').addEventListener('click', function () {
    if (!check(['store', 'name', 'email', 'phone', 'zip'])) return;
    if (inArea(zip.value)) { show(step2); form.elements.street.focus(); }
    else { show(outside); outside.querySelector('[data-send-outside]').focus(); }
  });
  form.querySelector('[data-back]').addEventListener('click', function () { show(step1); zip.focus(); });
  outside.querySelector('[data-change-zip]').addEventListener('click', function () { show(step1); zip.select(); });
  outside.querySelector('[data-send-outside]').addEventListener('click', function (e) {
    busy(e.currentTarget, 900, function () { finish(true); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check(['street', 'city'])) return;
    busy(form.querySelector('[type=submit]'), 900, function () { finish(false); });
  });
})();
