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
    if (starChipLabel) starChipLabel.textContent = state.star === 'all' ? 'Tất cả' : state.star;
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

