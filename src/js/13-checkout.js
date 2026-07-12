/* ════════════════════════════════════════════════════════════
   SECTION 13a – Checkout Order-summary sheet
   Opens when .cta-buy-now is clicked. Mirrors initVariantModal pattern:
   portal to body, backdrop, focus trap, ESC, inert, restore focus,
   prefers-reduced-motion.
   ════════════════════════════════════════════════════════════ */
(function initCheckoutSheet() {
  var sheet = document.getElementById('checkout-sheet');
  var backdrop = document.getElementById('checkout-backdrop');
  if (!sheet || !backdrop) return;

  var openBtns = document.querySelectorAll('.cta-buy-now');
  var closeBtns = sheet.querySelectorAll('.checkout-close-btn');

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastFocused = null;

  // ── Portal: move to document.body ──────────────────────────
  if (backdrop.parentElement !== document.body) document.body.appendChild(backdrop);
  if (sheet.parentElement !== document.body) document.body.appendChild(sheet);

  // ── Focusable helper ───────────────────────────────────────
  function getFocusable() {
    return Array.from(sheet.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function(el) {
      return !el.closest('[hidden]') && el.offsetParent !== null;
    });
  }

  // ── Open / close ───────────────────────────────────────────
  function openSheet() {
    lastFocused = document.activeElement;
    loadProvinces();
    sheet.removeAttribute('hidden');
    backdrop.removeAttribute('hidden');
    // Force reflow for transition
    void sheet.offsetWidth;
    sheet.classList.add('open');
    backdrop.classList.add('open');
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) { wrapper.setAttribute('aria-hidden', 'true'); wrapper.inert = true; }
    var focusable = getFocusable();
    if (focusable.length) focusable[0].focus();
  }

  function closeSheet() {
    sheet.classList.remove('open');
    backdrop.classList.remove('open');
    var wrapper = document.querySelector('.page-wrapper');
    if (wrapper) { wrapper.removeAttribute('aria-hidden'); wrapper.inert = false; }
    function finish() {
      sheet.setAttribute('hidden', '');
      backdrop.setAttribute('hidden', '');
    }
    if (prefersReduced) {
      finish();
    } else {
      setTimeout(finish, 300);
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // ── Expose open/close ─────────────────────────────────────
  sheet._open = openSheet;
  sheet._close = closeSheet;

  // ── Wire open triggers ─────────────────────────────────────
  openBtns.forEach(function(btn) {
    btn.addEventListener('click', openSheet);
  });

  // ── Wire close triggers ────────────────────────────────────
  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', closeSheet);
  });
  backdrop.addEventListener('click', function() {
    closeSheet();
    setTimeout(resetSheet, 350);
  });

  // ── ESC ────────────────────────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    if (sheet.classList.contains('open')) { closeSheet(); setTimeout(resetSheet, 350); }
  });

  // ── Focus trap ─────────────────────────────────────────────
  sheet.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ── Quantity stepper ───────────────────────────────────────
  var lineEl = document.getElementById('checkout-line-total');
  var footerTotalEl = document.getElementById('checkout-footer-total');
  var mainTotalEl = document.getElementById('checkout-total-display');
  var origDisplayEl = document.getElementById('checkout-orig-display');
  var couponDisplayEl = document.getElementById('checkout-coupon-display');
  var discountDisplayEl = document.getElementById('checkout-discount-display');
  var qtyInput = sheet.querySelector('.checkout-qty-input');
  var btnDec = sheet.querySelector('.checkout-qty-btn[data-action="dec"]');
  var btnInc = sheet.querySelector('.checkout-qty-btn[data-action="inc"]');

  function getQty() { return Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1); }

  function updateTotals(qty) {
    if (!lineEl) return;
    var unitPrice = parseFloat(lineEl.dataset.unitPrice) || 0;
    var origPrice = parseFloat(lineEl.dataset.origPrice) || unitPrice;
    var discAmt = parseFloat(lineEl.dataset.discountAmt) || 0;
    var currency = lineEl.dataset.currency || '₫';

    var lineTotal = unitPrice * qty;
    var origTotal = origPrice * qty;
    var discTotal = discAmt * qty;

    function fmt(n) { return Number(n).toLocaleString('vi-VN') + currency; }

    if (lineEl) lineEl.textContent = fmt(lineTotal);
    if (footerTotalEl) footerTotalEl.textContent = fmt(lineTotal);
    if (mainTotalEl) mainTotalEl.textContent = fmt(lineTotal);
    if (origDisplayEl) origDisplayEl.textContent = fmt(origTotal);
    if (couponDisplayEl) couponDisplayEl.textContent = '−' + fmt(discTotal);
    if (discountDisplayEl) discountDisplayEl.textContent = '−' + fmt(discTotal);
  }

  function setQty(val) {
    var v = Math.max(1, val);
    if (qtyInput) qtyInput.value = v;
    if (btnDec) btnDec.disabled = v <= 1;
    updateTotals(v);
  }

  if (qtyInput && btnDec && btnInc) {
    btnDec.addEventListener('click', function() { setQty(getQty() - 1); });
    btnInc.addEventListener('click', function() { setQty(getQty() + 1); });
    qtyInput.addEventListener('change', function() { setQty(getQty()); });
    setQty(1);
  }

  // ── Place order ────────────────────────────────────────────
  var placeOrderBtn = document.getElementById('checkout-place-order-btn');

  var footerEl = document.getElementById('checkout-footer');
  var nameInput = document.getElementById('checkout-name');
  var phoneInput = document.getElementById('checkout-phone');
  var phoneError = document.getElementById('checkout-phone-error');
  var provinceSelect = document.getElementById('checkout-province');
  var wardSelect = document.getElementById('checkout-ward');
  var addressDetailInput = document.getElementById('checkout-address-detail');
  var bodyEl = sheet.querySelector('.checkout-body');

  // ── Province/Ward data (lazy loaded) ───────────────────────
  var provincesData = null;
  var provincesLoading = false;

  function loadProvinces() {
    if (provincesData || provincesLoading) return;
    provincesLoading = true;
    fetch('assets/data/provinces.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        provincesData = data;
        populateProvinces();
      })
      .catch(function() { provincesLoading = false; });
  }

  function populateProvinces() {
    if (!provinceSelect || !provincesData) return;
    provincesData.forEach(function(p) {
      var opt = document.createElement('option');
      opt.value = p.Code;
      opt.textContent = p.FullName;
      provinceSelect.appendChild(opt);
    });
  }

  function populateWards(provinceCode) {
    if (!wardSelect || !provincesData) return;
    // Clear existing options
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';
    wardSelect.disabled = true;
    if (!provinceCode) return;
    var province = provincesData.find(function(p) { return p.Code === provinceCode; });
    if (!province || !province.Wards) return;
    province.Wards.forEach(function(w) {
      var opt = document.createElement('option');
      opt.value = w.Code;
      opt.textContent = w.FullName;
      wardSelect.appendChild(opt);
    });
    wardSelect.disabled = false;
  }

  if (provinceSelect) {
    provinceSelect.addEventListener('change', function() {
      populateWards(provinceSelect.value);
      updatePlaceOrderBtn();
    });
  }
  if (wardSelect) {
    wardSelect.addEventListener('change', updatePlaceOrderBtn);
  }

  // ── Inline validation: enable button when name + phone valid ──
  function isValidVNPhone(value) {
    var digits = value.replace(/\D/g, '');
    return /^[35789]\d{8,9}$/.test(digits);
  }

  function updatePlaceOrderBtn() {
    if (!placeOrderBtn) return;
    var nameOk = nameInput && nameInput.value.trim() !== '';
    var phoneOk = phoneInput && isValidVNPhone(phoneInput.value);
    var provinceOk = provinceSelect && provinceSelect.value !== '';
    var wardOk = wardSelect && wardSelect.value !== '';
    var enabled = nameOk && phoneOk && provinceOk && wardOk;
    placeOrderBtn.disabled = !enabled;
    if (enabled) {
      placeOrderBtn.removeAttribute('aria-disabled');
    } else {
      placeOrderBtn.setAttribute('aria-disabled', 'true');
    }
  }

  function validatePhone() {
    if (!phoneInput || !phoneError) return;
    var val = phoneInput.value.trim();
    if (val === '') {
      phoneError.setAttribute('hidden', '');
      return;
    }
    if (!isValidVNPhone(val)) {
      phoneError.removeAttribute('hidden');
    } else {
      phoneError.setAttribute('hidden', '');
    }
  }

  if (nameInput) {
    nameInput.addEventListener('input', updatePlaceOrderBtn);
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', function() { validatePhone(); updatePlaceOrderBtn(); });
    phoneInput.addEventListener('blur', function() { validatePhone(); updatePlaceOrderBtn(); });
  }

  // Initial state: button disabled
  updatePlaceOrderBtn();

  // ── Order submission helpers ─────────────────────────────
  function getPaymentMethodLabel() {
    return 'COD';
  }

  function buildOrderData() {
    var qty = getQty();
    var unitPrice = lineEl ? (parseFloat(lineEl.dataset.unitPrice) || 0) : 0;
    var total = unitPrice * qty;
    var currency = (lineEl && lineEl.dataset.currency) || '₫';

    // Read name, phone, address from inline fields
    var customerName = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? ('+84 ' + phoneInput.value.replace(/\D/g, '')) : '';
    // Build address from dropdowns + detail
    var provinceName = provinceSelect ? provinceSelect.options[provinceSelect.selectedIndex].text : '';
    var wardName = wardSelect ? wardSelect.options[wardSelect.selectedIndex].text : '';
    var detail = addressDetailInput ? addressDetailInput.value.trim() : '';
    var address = [detail, wardName, provinceName].filter(Boolean).join(', ');

    // Product info
    var productName = (lineEl && lineEl.dataset.productName) || '';
    var variantEl = sheet.querySelector('.checkout-product-variant');
    var variant = variantEl ? variantEl.textContent.trim() : 'Mặc định';

    var now = new Date();
    var timestamp = now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    return {
      name: customerName,
      phone: phone,
      address: address,
      product: productName,
      variant: variant,
      quantity: qty,
      total: Number(total).toLocaleString('vi-VN') + currency,
      totalRaw: total,
      payment: getPaymentMethodLabel(),
      timestamp: timestamp,
      pageUrl: window.location.href
    };
  }

  // ── Order Queue + Retry + Log System ────────────────────────
  var ORDER_QUEUE_KEY = 'tts_order_queue';
  var ORDER_LOG_KEY = 'tts_order_log';
  var MAX_RETRIES = 3;
  var RETRY_DELAYS = [2000, 5000, 10000]; // 2s, 5s, 10s

  function getOrderQueue() {
    try { return JSON.parse(localStorage.getItem(ORDER_QUEUE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveOrderQueue(queue) {
    try { localStorage.setItem(ORDER_QUEUE_KEY, JSON.stringify(queue)); } catch (e) {}
  }
  function getOrderLog() {
    try { return JSON.parse(localStorage.getItem(ORDER_LOG_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveOrderLog(log) {
    try {
      // Keep last 100 entries
      if (log.length > 100) log = log.slice(-100);
      localStorage.setItem(ORDER_LOG_KEY, JSON.stringify(log));
    } catch (e) {}
  }
  function logOrder(orderId, status, details) {
    var log = getOrderLog();
    log.push({
      id: orderId,
      status: status, // 'queued' | 'sending' | 'sent_sheets' | 'sent_telegram' | 'done' | 'failed'
      details: details || '',
      time: new Date().toISOString()
    });
    saveOrderLog(log);
  }

  function sendToGoogleSheets(data) {
    var config = window.__CHECKOUT_CONFIG__;
    if (!config || !config.googleSheetWebhook || config.googleSheetWebhook.indexOf('YOUR_SCRIPT_ID') !== -1) {
      return Promise.resolve('skipped');
    }
    return fetch(config.googleSheetWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'no-cors'
    }).then(function() { return 'ok'; })
      .catch(function(e) { return Promise.reject(e); });
  }

  function sendToTelegram(data) {
    var config = window.__CHECKOUT_CONFIG__;
    if (!config || !config.telegramBotToken || config.telegramBotToken.indexOf('YOUR_BOT_TOKEN') !== -1) {
      return Promise.resolve('skipped');
    }
    var text = '\ud83d\uded2 \u0110\u01a0N H\u00c0NG M\u1edaI\n\n' +
      '\ud83d\udc64 T\u00ean: ' + data.name + '\n' +
      '\ud83d\udcf1 S\u0110T: ' + data.phone + '\n' +
      '\ud83d\udccd \u0110\u1ecba ch\u1ec9: ' + data.address + '\n\n' +
      '\ud83d\udce6 S\u1ea3n ph\u1ea9m: ' + data.product + '\n' +
      '\ud83c\udff7\ufe0f Ph\u00e2n lo\u1ea1i: ' + data.variant + '\n' +
      '\ud83d\udd22 S\u1ed1 l\u01b0\u1ee3ng: ' + data.quantity + '\n' +
      '\ud83d\udcb0 T\u1ed5ng ti\u1ec1n: ' + data.total + '\n' +
      '\ud83d\udcb3 Thanh to\u00e1n: ' + data.payment + '\n\n' +
      '\u23f0 Th\u1eddi gian: ' + data.timestamp + '\n' +
      '\ud83d\udd17 Trang: ' + data.pageUrl;
    var url = 'https://api.telegram.org/bot' + config.telegramBotToken + '/sendMessage';
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: config.telegramChatId, text: text })
    }).then(function(res) {
      if (!res.ok) return Promise.reject(new Error('Telegram HTTP ' + res.status));
      return 'ok';
    });
  }

  function processOrderItem(item, attempt) {
    if (!attempt) attempt = 0;
    var orderId = item.id;

    logOrder(orderId, 'sending', 'attempt ' + (attempt + 1));

    var sheetsOk = false, telegramOk = false;

    var sheetsPromise = item.sheetsDone
      ? Promise.resolve('already')
      : sendToGoogleSheets(item.data).then(function(r) { sheetsOk = true; return r; }).catch(function() { return 'fail'; });

    var telegramPromise = item.telegramDone
      ? Promise.resolve('already')
      : sendToTelegram(item.data).then(function(r) { telegramOk = true; return r; }).catch(function() { return 'fail'; });

    return Promise.all([sheetsPromise, telegramPromise]).then(function(results) {
      // Update item status
      if (sheetsOk || results[0] === 'already' || results[0] === 'skipped') item.sheetsDone = true;
      if (telegramOk || results[1] === 'already' || results[1] === 'skipped') item.telegramDone = true;

      if (item.sheetsDone && item.telegramDone) {
        // Success - remove from queue
        logOrder(orderId, 'done', 'sheets=' + results[0] + ' telegram=' + results[1]);
        var queue = getOrderQueue();
        queue = queue.filter(function(q) { return q.id !== orderId; });
        saveOrderQueue(queue);
        return 'done';
      }

      // Partial failure - retry
      if (attempt < MAX_RETRIES - 1) {
        logOrder(orderId, 'sending', 'partial fail, retrying in ' + RETRY_DELAYS[attempt] + 'ms');
        // Update queue with partial progress
        var queue = getOrderQueue();
        for (var i = 0; i < queue.length; i++) {
          if (queue[i].id === orderId) { queue[i] = item; break; }
        }
        saveOrderQueue(queue);
        return new Promise(function(resolve) {
          setTimeout(function() { resolve(processOrderItem(item, attempt + 1)); }, RETRY_DELAYS[attempt]);
        });
      }

      // Max retries exhausted - keep in queue for next page load
      item.retries = (item.retries || 0) + MAX_RETRIES;
      var queue = getOrderQueue();
      for (var i = 0; i < queue.length; i++) {
        if (queue[i].id === orderId) { queue[i] = item; break; }
      }
      saveOrderQueue(queue);
      logOrder(orderId, 'failed', 'max retries reached, kept in queue');
      return 'queued';
    });
  }

  function submitOrder(orderData) {
    var orderId = Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    var queueItem = {
      id: orderId,
      data: orderData,
      sheetsDone: false,
      telegramDone: false,
      retries: 0,
      createdAt: new Date().toISOString()
    };

    // Save to queue immediately (data is safe even if page closes)
    var queue = getOrderQueue();
    queue.push(queueItem);
    saveOrderQueue(queue);
    logOrder(orderId, 'queued', 'order saved to local queue');

    // Process immediately
    processOrderItem(queueItem, 0);
  }

  // ── Process pending orders on page load ──────────────────────
  (function retryPendingOrders() {
    var queue = getOrderQueue();
    if (queue.length === 0) return;
    // Process each pending item with a small stagger
    queue.forEach(function(item, idx) {
      setTimeout(function() { processOrderItem(item, 0); }, idx * 1500);
    });
  })();

  // Expose for admin panel retry
  window.__processOrderItem = processOrderItem;

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function() {
      var qty = getQty();

      // Loading state
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = '\u0110ang x\u1EED l\u00FD...';

      // Build and submit order (queued with retry)
      var orderData = buildOrderData();
      submitOrder(orderData);

      // Close checkout sheet, then show success popup
      setTimeout(function() {
        closeSheet();

        // Populate and show success popup after sheet closes
        setTimeout(function() {
          resetSheet();

          var successPopup = document.getElementById('success-popup');
          var successBackdrop = document.getElementById('success-popup-backdrop');
          var successQtyEl = document.getElementById('success-qty');
          var successTotalEl = document.getElementById('success-total');

          if (successQtyEl) successQtyEl.textContent = qty;
          if (successTotalEl && lineEl) {
            var up = parseFloat(lineEl.dataset.unitPrice) || 0;
            var cur = lineEl.dataset.currency || '₫';
            successTotalEl.textContent = Number(up * qty).toLocaleString('vi-VN') + cur;
          }

          if (successBackdrop) { successBackdrop.removeAttribute('hidden'); }
          if (successPopup) {
            successPopup.removeAttribute('hidden');
            void successPopup.offsetWidth;
            successPopup.classList.add('open');
            if (successBackdrop) successBackdrop.classList.add('open');
          }

          // Fire Purchase tracking event
          if (lineEl) {
            var productId = lineEl.dataset.productId || '';
            var productName = lineEl.dataset.productName || '';
            var unitPrice = parseFloat(lineEl.dataset.unitPrice) || 0;
            var currency = lineEl.dataset.currency || 'VND';
            var value = unitPrice * qty;
            if (typeof trackEvent === 'function') {
              trackEvent('Purchase', {
                content_ids: [productId],
                content_name: productName,
                value: value,
                currency: currency,
                num_items: qty,
              });
            }
          }
        }, 350);
      }, 600);
    });
  }

  // ── Reset on close (so re-opening shows fresh state) ──────
  function resetSheet() {
    if (footerEl) footerEl.style.display = '';
    // Clear form inputs
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (provinceSelect) provinceSelect.value = '';
    if (wardSelect) { wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>'; wardSelect.disabled = true; }
    if (addressDetailInput) addressDetailInput.value = '';
    if (phoneError) phoneError.setAttribute('hidden', '');
    setQty(1);
    updatePlaceOrderBtn();
    if (placeOrderBtn) placeOrderBtn.textContent = '\u0110\u1EB7t h\u00E0ng';
  }

  var originalClose = closeSheet;
  sheet._closeAndReset = function() {
    originalClose();
    setTimeout(resetSheet, 350);
  };

  // Patch close to reset
  closeBtns.forEach(function(btn) {
    btn.removeEventListener('click', closeSheet);
    btn.addEventListener('click', function() { originalClose(); setTimeout(resetSheet, 350); });
  });

  // Success popup close button
  var successCloseBtn = document.getElementById('success-close-btn');
  var successPopup = document.getElementById('success-popup');
  var successBackdrop = document.getElementById('success-popup-backdrop');

  function closeSuccessPopup() {
    if (successPopup) successPopup.classList.remove('open');
    if (successBackdrop) successBackdrop.classList.remove('open');
    setTimeout(function() {
      if (successPopup) successPopup.setAttribute('hidden', '');
      if (successBackdrop) successBackdrop.setAttribute('hidden', '');
    }, 300);
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', closeSuccessPopup);
  }
  if (successBackdrop) {
    successBackdrop.addEventListener('click', closeSuccessPopup);
  }
})();

