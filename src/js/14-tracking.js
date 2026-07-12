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

