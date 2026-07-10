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
   SECTION 2 – Hero Swipe Carousel: counter, arrows, dots, autoplay
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
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // New elements (may be null for total > 8 case where dots aren't rendered)
  var prevBtn = carousel.querySelector('.hero-arrow-prev');
  var nextBtn = carousel.querySelector('.hero-arrow-next');
  var dots = Array.from(carousel.querySelectorAll('.hero-dot'));

  // Autoplay state
  var autoplayTimer = null;
  var autoplayStopped = false;

  function goTo(index) {
    // Wrap-around
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    isProgrammatic = true;
    slidesEl.scrollTo({ left: index * slidesEl.offsetWidth, behavior: prefersReduced ? 'auto' : 'smooth' });
    // Clear programmatic flag after scroll settles (smooth scroll takes ~300ms max)
    clearTimeout(programmaticTimer);
    programmaticTimer = setTimeout(function() { isProgrammatic = false; }, 400);
    updateUI(index);
  }

  var isProgrammatic = false;
  var programmaticTimer = null;

  function updateUI(index) {
    currentIndex = index;
    if (counterEl) {
      counterEl.textContent = (index + 1) + ' / ' + total;
    }
    // Update dots
    if (dots.length) {
      dots.forEach(function(dot, i) {
        var isActive = i === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
  }

  function stopAutoplay() {
    autoplayStopped = true;
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function pauseAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resumeAutoplay() {
    if (autoplayStopped) return;
    if (autoplayTimer) return; // already running
    autoplayTimer = setInterval(function() {
      goTo(currentIndex + 1);
    }, 4000);
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

  // Arrow button clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      stopAutoplay();
      goTo(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      stopAutoplay();
      goTo(currentIndex + 1);
    });
  }

  // Dot clicks
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      stopAutoplay();
      goTo(i);
    });
  });

  // Stop autoplay on user-initiated touch/pointer (not programmatic scroll)
  slidesEl.addEventListener('pointerdown', function() {
    stopAutoplay();
  }, { passive: true });
  slidesEl.addEventListener('touchstart', function() {
    stopAutoplay();
  }, { passive: true });

  // Pause on mouse hover, resume on leave
  carousel.addEventListener('mouseenter', function() {
    pauseAutoplay();
  });
  carousel.addEventListener('mouseleave', function() {
    resumeAutoplay();
  });

  // Pause when page hidden, resume when visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      pauseAutoplay();
    } else {
      resumeAutoplay();
    }
  });

  // ── Mouse drag-to-swipe ──────────────────────────────────
  // Only engages for mouse pointerType; touch/pen keep native scroll-snap.
  if (slidesEl.setPointerCapture) {
    var isDragging = false;
    var dragStartX = 0;
    var dragStartScrollLeft = 0;
    var dragMoved = false;

    slidesEl.addEventListener('pointerdown', function(e) {
      if (e.pointerType !== 'mouse') return;
      isDragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScrollLeft = slidesEl.scrollLeft;
      // Disable scroll-snap so manual scroll isn't fought by the browser
      slidesEl.style.scrollSnapType = 'none';
      slidesEl.setPointerCapture(e.pointerId);
      slidesEl.classList.add('is-grabbing');
    });

    slidesEl.addEventListener('pointermove', function(e) {
      if (!isDragging || e.pointerType !== 'mouse') return;
      var dx = e.clientX - dragStartX;
      slidesEl.scrollLeft = dragStartScrollLeft - dx;
      if (Math.abs(dx) > 5) {
        dragMoved = true;
        e.preventDefault();
      }
    }, { passive: false });

    function endDrag(e) {
      if (!isDragging || e.pointerType !== 'mouse') return;
      isDragging = false;
      slidesEl.classList.remove('is-grabbing');
      // Restore scroll-snap
      slidesEl.style.scrollSnapType = '';
      // Release pointer capture if still held
      if (slidesEl.hasPointerCapture && slidesEl.hasPointerCapture(e.pointerId)) {
        slidesEl.releasePointerCapture(e.pointerId);
      }
      // Snap to nearest slide
      var slideWidth = slidesEl.offsetWidth;
      if (slideWidth > 0) {
        var idx = Math.round(slidesEl.scrollLeft / slideWidth);
        idx = Math.max(0, Math.min(total - 1, idx));
        goTo(idx);
      }
    }

    slidesEl.addEventListener('pointerup', endDrag);
    slidesEl.addEventListener('pointercancel', endDrag);
  }
  // ── End mouse drag-to-swipe ──────────────────────────────

  // Start autoplay
  if (!prefersReduced) {
    autoplayTimer = setInterval(function() {
      goTo(currentIndex + 1);
    }, 4000);
  }

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
(function initReviewControls() {
  var section = document.querySelector('.reviews-section');
  if (!section) return;

  var controls = section.querySelector('.reviews-controls');
  var cards = Array.from(section.querySelectorAll('.review-card'));
  if (!controls || !cards.length) return;

  // Filter state
  var state = { sort: 'recommended', star: 'all', visuals: false, verified: false };

  var sortTabs = Array.from(controls.querySelectorAll('.reviews-sort-tab'));
  var starFilterWrap = controls.querySelector('.review-star-filter');
  var starChip = controls.querySelector('.review-filter-chip--dropdown');
  var starChipLabel = controls.querySelector('.review-filter-chip-label');
  var starMenu = controls.querySelector('.review-star-menu');
  var starOptions = Array.from(controls.querySelectorAll('.review-star-option'));
  var visualsChip = controls.querySelector('[data-filter-visuals]');
  var verifiedChip = controls.querySelector('[data-filter-verified]');
  var resetBtn = controls.querySelector('.reviews-reset');
  var shownCount = controls.querySelector('.reviews-shown-count');

  var cardsParent = cards[0].parentNode;
  // Preserve original order for the "recommended" sort
  var originalOrder = cards.slice();

  // Pagination: reveal `pageSize` matching cards per "View more" click
  var moreBtn = section.querySelector('.reviews-more-btn');
  var endMsg = section.querySelector('.reviews-end');
  var pageSize = parseInt(cardsParent.dataset.pageSize, 10) || 5;
  var visibleCount = pageSize;

  function cardMatches(card) {
    if (state.star !== 'all' && parseInt(card.dataset.stars, 10) !== parseInt(state.star, 10)) return false;
    if (state.visuals && card.dataset.photo !== '1') return false;
    if (state.verified && card.dataset.verified !== '1') return false;
    return true;
  }

  function applyFilters() {
    var matched = 0;
    cards.forEach(function(card) {
      var matches = cardMatches(card);
      // Hide matching cards beyond the current visible window
      var visible = matches && matched < visibleCount;
      card.hidden = !visible;
      if (matches) matched++;
    });
    if (shownCount) shownCount.textContent = Math.min(visibleCount, matched);

    // Button when there's more to load; end message once fully loaded
    var hasMore = matched > visibleCount;
    if (moreBtn) moreBtn.hidden = !hasMore;
    if (endMsg) endMsg.hidden = hasMore || matched === 0;
  }

  function applySort() {
    var sorted;
    if (state.sort === 'recent') {
      sorted = originalOrder.slice().sort(function(a, b) {
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      });
    } else {
      sorted = originalOrder.slice();
    }
    sorted.forEach(function(card) { cardsParent.appendChild(card); });
  }

  // Sort segmented control
  sortTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      sortTabs.forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      state.sort = tab.dataset.sort || 'recommended';
      applySort();
    });
  });

  // Star dropdown open/close
  function closeStarMenu() {
    if (!starMenu) return;
    starMenu.hidden = true;
    if (starChip) starChip.setAttribute('aria-expanded', 'false');
  }
  function openStarMenu() {
    if (!starMenu) return;
    starMenu.hidden = false;
    if (starChip) starChip.setAttribute('aria-expanded', 'true');
  }
  if (starChip && starMenu) {
    starChip.addEventListener('click', function(e) {
      e.stopPropagation();
      if (starMenu.hidden) openStarMenu(); else closeStarMenu();
    });
    document.addEventListener('click', function(e) {
      if (starFilterWrap && !starFilterWrap.contains(e.target)) closeStarMenu();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeStarMenu();
    });
  }

  function selectStar(option) {
    starOptions.forEach(function(o) {
      o.classList.remove('active');
      o.setAttribute('aria-selected', 'false');
    });
    option.classList.add('active');
    option.setAttribute('aria-selected', 'true');
    state.star = option.dataset.star || 'all';
    if (starChipLabel) starChipLabel.textContent = state.star === 'all' ? 'All' : state.star;
    visibleCount = pageSize; // changing a filter re-collapses to the first page
    applyFilters();
    closeStarMenu();
  }
  starOptions.forEach(function(option) {
    option.addEventListener('click', function() { selectStar(option); });
    option.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectStar(option);
      }
    });
  });

  // Toggle chips
  function toggleChip(chip, key) {
    if (!chip) return;
    chip.addEventListener('click', function() {
      state[key] = !state[key];
      chip.classList.toggle('active', state[key]);
      chip.setAttribute('aria-pressed', state[key] ? 'true' : 'false');
      visibleCount = pageSize; // changing a filter re-collapses to the first page
      applyFilters();
    });
  }
  toggleChip(visualsChip, 'visuals');
  toggleChip(verifiedChip, 'verified');

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      state = { sort: state.sort, star: 'all', visuals: false, verified: false };
      if (visualsChip) { visualsChip.classList.remove('active'); visualsChip.setAttribute('aria-pressed', 'false'); }
      if (verifiedChip) { verifiedChip.classList.remove('active'); verifiedChip.setAttribute('aria-pressed', 'false'); }
      var allOption = starOptions.find(function(o) { return o.dataset.star === 'all'; });
      if (allOption) selectStar(allOption); else applyFilters();
    });
  }

  // "View more" reveals the next page of matching reviews
  if (moreBtn) {
    moreBtn.addEventListener('click', function() {
      visibleCount += pageSize;
      applyFilters();
    });
  }

  applyFilters();
})();

/* ════════════════════════════════════════════════════════════
   SECTION 5b – Review image lightbox
   Clicking any review photo (strip card or in-card side photo)
   opens a full-screen viewer. Dismiss via close button, backdrop, or ESC.
   ════════════════════════════════════════════════════════════ */
(function initReviewLightbox() {
  var section = document.querySelector('.reviews-section');
  if (!section) return;

  // Collect all clickable review images
  var images = Array.from(section.querySelectorAll('.review-photo-card-img, .review-side-photo img'));
  if (!images.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastFocused = null;

  // Build lightbox once, portal to body (outside .page-wrapper)
  var lightbox = document.createElement('div');
  lightbox.className = 'review-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Xem ảnh đánh giá');
  lightbox.hidden = true;

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'review-lightbox-close';
  closeBtn.setAttribute('aria-label', 'Đóng');
  closeBtn.innerHTML = '&times;';

  var bigImg = document.createElement('img');
  bigImg.className = 'review-lightbox-img';
  bigImg.alt = '';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(bigImg);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lastFocused = document.activeElement;
    bigImg.src = src;
    bigImg.alt = alt || 'Ảnh đánh giá';
    lightbox.hidden = false;
    // Force reflow so the opacity transition runs
    void lightbox.offsetWidth;
    lightbox.classList.add('open');
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.inert = true;
    }
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) {
      wrapper.removeAttribute('aria-hidden');
      wrapper.inert = false;
    }
    function finish() {
      lightbox.hidden = true;
      bigImg.src = '';
    }
    if (prefersReduced) {
      finish();
    } else {
      setTimeout(finish, 200);
    }
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  images.forEach(function(img) {
    img.addEventListener('click', function() {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Backdrop click (but not on the image itself)
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Keep focus inside the lightbox while open (only two focusable spots)
  lightbox.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    closeBtn.focus();
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
