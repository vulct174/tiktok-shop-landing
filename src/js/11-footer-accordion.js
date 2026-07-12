/* ════════════════════════════════════════════════════════════
   SECTION 11 – Accordion footer groups
   ════════════════════════════════════════════════════════════ */
(function initFooterAccordion() {
  var toggles = document.querySelectorAll('.footer-group-toggle');

  toggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      var contentId = toggle.getAttribute('aria-controls');
      var content = contentId ? document.getElementById(contentId) : null;
      if (!content) {
        // fallback: find next sibling with .footer-group-content
        content = toggle.parentElement.querySelector('.footer-group-content');
      }
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (content) content.classList.toggle('expanded', !expanded);
    });
  });
})();

