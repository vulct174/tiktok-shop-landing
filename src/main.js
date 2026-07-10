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

/* ════════════════════════════════════════════════════════════
   SECTION 2 – Hero Swipe Carousel: counter
   ════════════════════════════════════════════════════════════ */
(function initCarousel() {
  var carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  var slidesEl = carousel.querySelector('.hero-slides');
  if (!slidesEl) return;

  var slides = Array.from(slidesEl.querySelectorAll('.hero-slide'));
  var total = slides.length;

  var counterEl = carousel.querySelector('.hero-counter');

  if (total <= 1) {
    if (counterEl) counterEl.classList.add('hidden');
    return;
  }

  var currentIndex = 0;
  var scrollTimer = null;

  function updateUI(index) {
    currentIndex = index;
    if (counterEl) {
      counterEl.textContent = (index + 1) + ' / ' + total;
    }
  }

  function onScroll() {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var slideWidth = slidesEl.offsetWidth;
      if (slideWidth === 0) return;
      var idx = Math.round(slidesEl.scrollLeft / slideWidth);
      idx = Math.max(0, Math.min(total - 1, idx));
      if (idx !== currentIndex) {
        updateUI(idx);
      }
    }, 80);
  }

  slidesEl.addEventListener('scroll', onScroll, { passive: true });
  updateUI(0);
})();

/* ════════════════════════════════════════════════════════════
   SECTION 4 – Select-options bottom-sheet modal
   ════════════════════════════════════════════════════════════ */
(function initVariantModal() {
  var openBtn = document.querySelector('.select-options-row');
  var modal = document.getElementById('variant-modal');
  var backdrop = document.getElementById('modal-backdrop');
  var closeBtn = modal ? modal.querySelector('.modal-close') : null;

  if (!openBtn || !modal || !backdrop) return;

  // Portal: move modal and backdrop to document.body so they are OUTSIDE
  // .page-wrapper. This ensures that setting wrapper.inert = true (done in
  // openModal) only inerts the background content, not the modal itself.
  // Idempotent: skip if already a direct child of body.
  if (backdrop.parentElement !== document.body) {
    document.body.appendChild(backdrop);
  }
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  var lastFocused = null;

  // All focusable elements within modal
  function getFocusable() {
    return Array.from(modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function(el) {
      return !el.closest('[hidden]') && el.offsetParent !== null;
    });
  }

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('open');
    backdrop.classList.add('open');
    modal.removeAttribute('hidden');
    backdrop.removeAttribute('hidden');
    // Inert background
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.inert = true;
    }
    // Move focus to first focusable
    var focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    backdrop.classList.remove('open');
    modal.setAttribute('hidden', '');
    backdrop.setAttribute('hidden', '');
    // Un-inert background
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.removeAttribute('aria-hidden');
      wrapper.inert = false;
    }
    // Restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', closeModal);

  // ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Focus trap
  modal.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Variant chip selection in modal
  var modalChipGroups = modal.querySelectorAll('.modal-variant-chips');
  modalChipGroups.forEach(function(group) {
    var chips = group.querySelectorAll('.chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        // Update label
        var labelEl = group.closest('.modal-variant-group');
        if (labelEl) {
          var labelSpan = labelEl.querySelector('.modal-variant-label span');
          if (labelSpan) labelSpan.textContent = chip.textContent.trim();
        }
      });
    });
  });

  // Quantity stepper in modal
  var qtyInput = modal.querySelector('.qty-input');
  var btnDec = modal.querySelector('.qty-btn[data-action="dec"]');
  var btnInc = modal.querySelector('.qty-btn[data-action="inc"]');

  if (qtyInput && btnDec && btnInc) {
    function getQty() {
      return Math.max(1, parseInt(qtyInput.value, 10) || 1);
    }
    function setQty(val) {
      var v = Math.max(1, val);
      qtyInput.value = v;
      btnDec.disabled = v <= 1;
    }
    btnDec.addEventListener('click', function() { setQty(getQty() - 1); });
    btnInc.addEventListener('click', function() { setQty(getQty() + 1); });
    qtyInput.addEventListener('change', function() { setQty(getQty()); });
    qtyInput.addEventListener('blur', function() { setQty(getQty()); });
    setQty(1);
  }
})();

/* ════════════════════════════════════════════════════════════
   SECTION 5 – Review filter tabs
   ════════════════════════════════════════════════════════════ */
(function initReviewTabs() {
  var tabsContainer = document.querySelector('.reviews-filter-tabs');
  if (!tabsContainer) return;

  var tabs = Array.from(tabsContainer.querySelectorAll('.review-tab'));
  var cards = Array.from(document.querySelectorAll('.review-card'));

  if (!tabs.length || !cards.length) return;

  function filterCards(filter) {
    cards.forEach(function(card) {
      if (filter === 'all') {
        card.hidden = false;
        return;
      }
      if (filter === 'photo') {
        var hasPhoto = card.querySelector('.review-photo') !== null;
        card.hidden = !hasPhoto;
        return;
      }
      // star filter: '5', '4', etc.
      var stars = parseInt(card.dataset.stars, 10);
      card.hidden = stars !== parseInt(filter, 10);
    });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      filterCards(tab.dataset.filter || 'all');
    });
  });
})();

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

/* ════════════════════════════════════════════════════════════
   Ad Tracking
   ════════════════════════════════════════════════════════════ */

/**
 * trackEvent(name, params)
 * Fans out to Meta fbq, TikTok ttq, and GTM/gtag dataLayer.
 * Each provider is guarded by a typeof check — missing globals
 * are silently skipped; this function never throws.
 *
 * @param {string} name   – Standard event name, e.g. 'ViewContent'
 * @param {Object} params – Event parameters (id, name, price, currency …)
 */
function trackEvent(name, params) {
  try {
    if (typeof fbq === 'function') {
      fbq('track', name, params);
    }
  } catch (e) { /* skip */ }

  try {
    if (typeof ttq !== 'undefined' && ttq && typeof ttq.track === 'function') {
      ttq.track(name, params);
    }
  } catch (e) { /* skip */ }

  try {
    if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
      dataLayer.push({ event: name, ecommerce: params });
    }
  } catch (e) { /* skip */ }

  try {
    if (typeof gtag === 'function') {
      gtag('event', name, params);
    }
  } catch (e) { /* skip */ }
}

// Expose globally so inline onclick handlers can call it
window.trackEvent = trackEvent;

/* ── Fire ViewContent on page load ── */
(function fireViewContent() {
  var product = window.__PRODUCT__;
  if (!product) return;
  setTimeout(function() {
    trackEvent('ViewContent', {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: product.currency || 'VND',
    });
  }, 500);
})();

/* ── CTA buttons: fire InitiateCheckout / AddToCart ── */
(function initCtaTracking() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-track]');
    if (!btn) return;

    var eventName = btn.dataset.track;
    var productId = btn.dataset.productId || '';
    var productName = btn.dataset.productName || '';
    var price = parseFloat(btn.dataset.price) || 0;
    var currency = btn.dataset.currency || 'VND';

    trackEvent(eventName, {
      content_ids: [productId],
      content_name: productName,
      value: price,
      currency: currency,
      num_items: 1,
    });
  });
})();
