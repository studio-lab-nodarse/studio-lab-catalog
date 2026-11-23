/* Trial-box page: menu sheet, request form, analytics events.
   The FormSubmit endpoint lives in order.js (window.__slSubmit). A request that
   cannot be confirmed falls back to a prefilled email, so no lead is lost. */
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function track(name) {
    try {
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-track]");
    if (a) track(a.getAttribute("data-track"));
  });

  // Keep the section when switching language.
  $all("a[data-lang]").forEach(function (a) {
    a.addEventListener("click", function () { if (location.hash) a.hash = location.hash; });
  });

  // ── Menu sheet ───────────────────────────────────────────────────────
  var menu = $("#menu");
  var opener = $("[data-menu-open]");
  if (menu && opener && menu.showModal) {
    opener.addEventListener("click", function () { menu.showModal(); });
    $("[data-menu-close]", menu).addEventListener("click", function () { menu.close(); });
    $all("a[href^='#']", menu).forEach(function (a) { a.addEventListener("click", function () { menu.close(); }); });
    window.matchMedia("(min-width:960px)").addEventListener("change", function (m) { if (m.matches && menu.open) menu.close(); });
  }

  // ── Form ─────────────────────────────────────────────────────────────
  var form = $("#trial-form");
  if (!form) return;
  var cfg = form.dataset;
  var KEY = "mp_trial_sent";
  var TIMEOUT = 20000;
  var fields = $("[data-fields]", form);
  var busy = false;

  function store(value) {
    try {
      if (value === null) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(value));
    } catch (e) {}
  }
  function stored() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }

  function show(name, focus) {
    $all("[data-panel]", form).forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== name; });
    if (!focus) return;
    var panel = $('[data-panel="' + name + '"]', form);
    if (name !== "form") panel.focus({ preventScroll: true });
    form.scrollIntoView({ block: "nearest" });
  }

  function read() {
    var el = form.elements;
    return {
      store: el.store.value.trim(),
      name: el.name.value.trim(),
      phone: el.phone.value.trim(),
      zip: el.zip.value.trim(),
      email: el.email.value.trim(),
      custom: el.custom.checked
    };
  }

  var RULES = {
    store: function (v) { return v.store !== ""; },
    name: function (v) { return v.name !== ""; },
    phone: function (v) { var n = v.phone.replace(/\D/g, "").length; return n >= 10 && n <= 15; },
    zip: function (v) { return /^\d{5}$/.test(v.zip); },
    email: function (v) { return v.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email); }
  };

  function mark(name, ok) {
    var input = form.elements[name];
    if (ok) input.removeAttribute("aria-invalid"); else input.setAttribute("aria-invalid", "true");
    $("#e-" + name).hidden = ok;
  }

  function validate(v) {
    var bad = Object.keys(RULES).filter(function (k) {
      var ok = RULES[k](v);
      mark(k, ok);
      return !ok;
    });
    var sum = $("[data-errsum]", form);
    sum.hidden = bad.length === 0;
    $("span", sum).textContent = bad.length === 1 ? cfg.errOne : cfg.errMany.replace("{n}", bad.length);
    if (bad.length) form.elements[bad[0]].focus();
    return bad.length === 0;
  }

  // Clear an error as soon as it is fixed; never nag before the first submit.
  form.addEventListener("input", function (e) {
    var k = e.target.name;
    if (!RULES[k] || e.target.getAttribute("aria-invalid") !== "true") return;
    if (RULES[k](read())) mark(k, true);
    if (!$('[aria-invalid="true"]', form)) $("[data-errsum]", form).hidden = true;
  });

  var started = false;
  form.addEventListener("focusin", function (e) {
    if (started || !e.target.name) return;
    started = true;
    track("trial-start");
  });

  function inFlorida(zip) {
    var n = Number(zip);
    return n >= Number(cfg.zipMin) && n <= Number(cfg.zipMax);
  }

  function lines(v) {
    var out = ["store", "name", "phone", "zip", "email"].filter(function (k) { return v[k]; })
      .map(function (k) { return form.elements[k].getAttribute("data-label") + ": " + v[k]; });
    if (v.custom) out.push(form.elements.custom.getAttribute("data-label") + ": " + cfg.yes);
    return out.join("\n");
  }
  function subject(v) { return cfg.subject + " — " + v.store + " (" + v.zip + ")"; }

  function fill(v) {
    $all("[data-fill]", form).forEach(function (el) { el.textContent = v[el.getAttribute("data-fill")] || ""; });
    var row = $('[data-row="email"]', form);
    if (row) row.hidden = !v.email;
  }

  function setBusy(on) {
    busy = on;
    fields.disabled = on;
    form.setAttribute("aria-busy", on ? "true" : "false");
    $all("[data-send],[data-out-send],[data-out-zip]", form).forEach(function (b) {
      b.disabled = on;
      var idle = $("[data-idle]", b), wait = $("[data-busy]", b);
      if (idle) { idle.hidden = on; wait.hidden = !on; }
    });
  }

  function post(payload) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error("timeout")); }, TIMEOUT);
      window.__slSubmit(payload).then(
        function (d) { clearTimeout(timer); resolve(d); },
        function (e) { clearTimeout(timer); reject(e); }
      );
    });
  }

  function send(v, outside) {
    if (busy) return;
    // Spam trap: people never see this field. Look done, send nothing.
    if (form.elements._honey.value) { show("done", true); return; }

    var payload = {
      _subject: "Trial box request — " + v.store + " (" + v.zip + ")" + (outside ? " — outside Florida" : ""),
      _template: "table",
      _captcha: "false",
      Store: v.store, Name: v.name, Phone: v.phone, ZIP: v.zip,
      Email: v.email || "-",
      "Custom designs": v.custom ? "yes" : "no",
      Area: outside ? "outside Florida" : "Florida",
      Language: cfg.lang,
      Page: location.href.split("#")[0]
    };
    if (v.email) payload._replyto = v.email;

    setBusy(true);
    var sent;
    try { sent = post(payload); } catch (e) { sent = Promise.reject(e); }
    sent.then(function () {
      setBusy(false);
      store({ store: v.store, at: Date.now() });
      track(outside ? "trial-submit-outside" : "trial-submit");
      show(outside ? "doneout" : "done", true);
    }, function () {
      setBusy(false);
      fill(v);
      var body = lines(v);
      var mail = "mailto:" + cfg.email + "?subject=" + encodeURIComponent(subject(v)) + "&body=" + encodeURIComponent(body);
      $("[data-mail]", form).href = mail;
      $("[data-wa-link]", form).href = "https://wa.me/" + cfg.wa + "?text=" + encodeURIComponent(subject(v) + "\n" + body);
      track("trial-error");
      show("net", true);
      location.href = mail;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy) return;
    var v = read();
    if (!validate(v)) return;
    fill(v);
    if (inFlorida(v.zip)) send(v, false); else show("outside", true);
  });
  $("[data-out-send]", form).addEventListener("click", function () { send(read(), true); });
  $("[data-out-zip]", form).addEventListener("click", function () {
    show("form");
    form.elements.zip.focus();
    form.elements.zip.select();
  });
  $("[data-restart]", form).addEventListener("click", function () {
    store(null);
    form.reset();
    show("form");
    form.elements.store.focus();
  });

  var prev = stored();
  if (prev && prev.store) {
    var when = "";
    try { when = new Date(prev.at).toLocaleDateString(cfg.lang, { month: "short", day: "numeric" }); } catch (e) {}
    $("[data-already-meta]", form).textContent = prev.store + (when ? " · " + cfg.sent + " " + when : "");
    show("already");
  }
})();
