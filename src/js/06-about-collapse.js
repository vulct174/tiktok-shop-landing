/* ════════════════════════════════════════════════════════════
   SECTION 6 – Collapsible About section
   ════════════════════════════════════════════════════════════ */
(function initAboutCollapsible() {
  var toggle = document.querySelector('.about-toggle');
  var content = document.querySelector('.about-content');
  if (!toggle || !content) return;

  toggle.addEventListener('click', function() {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    content.classList.toggle('expanded', !expanded);
  });
})();

