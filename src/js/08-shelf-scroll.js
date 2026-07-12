/* ════════════════════════════════════════════════════════════
   SECTION 8 – Seller shelf smooth scroll
   Adds wheel→horizontal and mouse drag-to-scroll to .shelf-cards.
   Touch/pen keep native momentum scrolling unmodified.
   ════════════════════════════════════════════════════════════ */
(function initShelfScroll() {
  var el = document.querySelector('.shelf-cards');
  if (!el) return;

  /* Keep matchMedia result available for any future motion-sensitive
     additions; wheel/drag write scrollLeft directly so they are fine. */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // eslint-disable-line no-unused-vars

  // ── Wheel → horizontal ──────────────────────────────────
  // Translate vertical wheel delta into horizontal scroll.
  // Only calls preventDefault when the strip can actually consume the scroll
  // so the page still scrolls vertically once the strip hits its edges.
  el.addEventListener('wheel', function(e) {
    // If the user is using a trackpad with genuine horizontal delta, leave it alone.
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    var delta = e.deltaY;
    var atStart = el.scrollLeft <= 0;
    var atEnd   = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;

    // Can the strip absorb this scroll direction?
    var canScroll = (delta > 0 && !atEnd) || (delta < 0 && !atStart);
    if (canScroll) {
      e.preventDefault();
      el.scrollLeft += delta;
    }
  }, { passive: false });

  // ── Mouse drag-to-scroll ─────────────────────────────────
  // Guard: skip browsers that do not support pointer capture.
  if (!el.setPointerCapture) return;

  var isDragging  = false;
  var dragMoved   = false;
  var startX      = 0;
  var startScroll = 0;

  el.addEventListener('pointerdown', function(e) {
    if (e.pointerType !== 'mouse') return;
    isDragging  = true;
    dragMoved   = false;
    startX      = e.clientX;
    startScroll = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-grabbing');
  });

  el.addEventListener('pointermove', function(e) {
    if (!isDragging || e.pointerType !== 'mouse') return;
    var dx = e.clientX - startX;
    el.scrollLeft = startScroll - dx;
    if (Math.abs(dx) > 5) {
      dragMoved = true;
      e.preventDefault();
    }
  }, { passive: false });

  function endDrag(e) {
    if (!isDragging || e.pointerType !== 'mouse') return;
    isDragging = false;
    el.classList.remove('is-grabbing');
    if (el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  }

  el.addEventListener('pointerup',     endDrag);
  el.addEventListener('pointercancel', endDrag);

  // Suppress card-link clicks after a real drag so <a href> cards do not
  // navigate when the user just wanted to scroll.
  // The handler lives on the capture phase so it intercepts before the link's
  // own click handler fires. It fires once and resets the flag.
  el.addEventListener('click', function(e) {
    if (dragMoved) {
      dragMoved = false;
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();

