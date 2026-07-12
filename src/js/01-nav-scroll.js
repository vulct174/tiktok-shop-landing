/**
 * main.js – TikTok Shop Landing Page client interactivity
 * Vanilla JS, no framework, no runtime dependencies.
 */

/* ════════════════════════════════════════════════════════════
   SECTION 1 – Sticky nav shadow on scroll
   ════════════════════════════════════════════════════════════ */
(function initNavScroll() {
  var nav = document.querySelector('.top-nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 4) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

