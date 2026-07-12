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

  // ── Modal action buttons ─────────────────────────────────
  var btnCart = modal.querySelector('.modal-btn-cart');
  var btnBuy = modal.querySelector('.modal-btn-buy');

  function openCheckoutAfterClose() {
    closeModal();
    setTimeout(function() {
      var checkoutSheet = document.getElementById('checkout-sheet');
      if (checkoutSheet && checkoutSheet._open) {
        checkoutSheet._open();
      }
    }, 300);
  }

  if (btnCart) {
    btnCart.addEventListener('click', openCheckoutAfterClose);
  }

  if (btnBuy) {
    btnBuy.addEventListener('click', openCheckoutAfterClose);
  }
})();

