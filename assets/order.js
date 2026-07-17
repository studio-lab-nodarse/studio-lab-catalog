/* Studio Lab — captura fiable de pedidos (Phase 1).
   Intercepta los "sinks" de pedido (mailto / WhatsApp) y los envía por
   formulario-a-email (FormSubmit). Si el POST falla, cae al mailto/WhatsApp
   original para no perder ningún pedido. */
(function () {
  var ENDPOINT = "https://formsubmit.co/ajax/jesusnodarse1823@gmail.com";
  function parse(url) {
    var subject = "Pedido — Studio Lab", body = "", wa = url.indexOf("wa.me") > -1;
    try {
      if (url.indexOf("mailto:") === 0) {
        var q = url.indexOf("?") > -1 ? url.slice(url.indexOf("?") + 1) : "";
        var p = new URLSearchParams(q);
        subject = p.get("subject") || subject;
        body = p.get("body") || "";
      } else {
        body = new URL(url).searchParams.get("text") || "";
        subject = "Pedido — Studio Lab (WhatsApp)";
      }
    } catch (e) {}
    return { subject: subject, body: body, wa: wa };
  }
  function toast(msg, kind) {
    var t = document.getElementById("__sl_toast") || document.createElement("div");
    t.id = "__sl_toast";
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;" +
      "max-width:90vw;padding:12px 18px;border-radius:12px;font:14px/1.4 system-ui,-apple-system,sans-serif;" +
      "color:#fff;box-shadow:0 8px 30px rgba(0,0,0,.35);background:" +
      (kind === "ok" ? "#15803d" : kind === "err" ? "#b91c1c" : "#111827");
    if (!t.parentNode) document.body.appendChild(t);
    if (kind) setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
  }
  function send(url) {
    var o = parse(url);
    toast("Enviando pedido…");
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ _subject: o.subject, _template: "box", _captcha: "false", Pedido: o.body })
    }).then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (d) {
        if (d && (d.success === "true" || d.success === true)) {
          toast("✓ ¡Pedido enviado! Te contactaremos pronto.", "ok");
        } else {
          throw new Error("pending");
        }
        if (o.wa) window.open(url, "_blank"); // WhatsApp queda como canal secundario
      })
      .catch(function () {
        // nunca perder un pedido: cae al canal original
        if (o.wa) window.open(url, "_blank"); else window.location.href = url;
      });
  }
  // sink de mailto: el código de la app hace  window.__slp.href = 'mailto:...'
  window.__slp = { set href(v) { send(String(v)); }, get href() { return ""; } };
  // sink de WhatsApp: el código hace  window.__slwa('https://wa.me/...')
  window.__slwa = function (u) { send(String(u)); };
})();
