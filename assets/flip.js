/* Studio Lab — tap-to-flip.
   Click/tap a product's image (front .p-imgwrap or back .ph) to flip the card.
   The info panel (.p-body) and any links/buttons inside it are excluded so the
   order actions still work. Reuses the card's own `.flipped` class. */
(function () {
  document.addEventListener('click', function (e) {
    if (e.target.closest('.p-body') || e.target.closest('a') || e.target.closest('button')) return;
    var face = e.target.closest('.p-imgwrap, .ph');
    if (!face) return;
    var card = face.closest('.p-card');
    if (card) card.classList.toggle('flipped');
  });
})();
