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

