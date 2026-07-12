import { esc, formatPrice } from '../helpers.js';
import { iconCOD, iconCheck } from '../icons.js';

/**
 * renderCheckoutSheet(product, currency)
 * Section 13: mock Order-summary bottom sheet.
 * Rendered into <!-- SECTION_CHECKOUT --> via assemblePage.
 */
export function renderCheckoutSheet(product, currency) {
  const thumbSrc = esc(`${product._imgBaseDir || 'assets/products'}/${product.thumb || (Array.isArray(product.images) && product.images[0]) || ''}`);
  const altBase = esc(product.name);
  const unitPrice = product.price;
  // Mock seller discount: 10% off the original (or 5% off unit if no original)
  const origPrice = product.originalPrice && product.originalPrice > unitPrice
    ? product.originalPrice
    : Math.round(unitPrice * 1.1);
  const discountAmt = origPrice - unitPrice;
  // Default variant label
  const variants = product.variants || {};
  const colors = Array.isArray(variants.color) ? variants.color : [];
  const variantLabel = colors.length ? esc(colors[0]) : 'Mặc định';

  return `<!-- Order-summary backdrop -->
<div id="checkout-backdrop" class="modal-backdrop checkout-backdrop" hidden aria-hidden="true"></div>

<!-- Order-summary bottom sheet -->
<div id="checkout-sheet" class="checkout-sheet"
  role="dialog" aria-modal="true" aria-labelledby="checkout-sheet-title"
  hidden>
  <div class="modal-drag-indicator" aria-hidden="true"></div>

  <!-- Header -->
  <div class="checkout-header">
    <button class="modal-close checkout-close-btn" type="button" aria-label="Đóng đơn hàng">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <span class="checkout-title" id="checkout-sheet-title">Đơn hàng</span>
    <span class="checkout-subtitle">Mua hàng nhanh · Miễn phí vận chuyển</span>
  </div>

  <!-- Scrollable body -->
  <div class="checkout-body">

    <!-- Customer info (inline) -->
    <div class="checkout-customer-fields">
      <div class="checkout-field-group">
        <label class="checkout-field-label" for="checkout-name">Họ và tên <span class="checkout-required">*</span></label>
        <input class="checkout-field-input" id="checkout-name" name="name"
          type="text" autocomplete="name" required
          placeholder="Nguyễn Văn A" aria-required="true">
      </div>
      <div class="checkout-field-group">
        <label class="checkout-field-label" for="checkout-phone">Số điện thoại <span class="checkout-required">*</span></label>
        <div class="checkout-phone-row">
          <span class="checkout-phone-prefix">+84</span>
          <input class="checkout-field-input checkout-phone-input" id="checkout-phone" name="phone"
            type="tel" autocomplete="tel-national" required
            placeholder="9xx xxx xxx" aria-required="true"
            aria-describedby="checkout-phone-error"
            inputmode="numeric">
        </div>
        <div class="checkout-field-error" id="checkout-phone-error" role="alert" aria-live="polite" hidden>
          Số điện thoại không hợp lệ
        </div>
      </div>
      <div class="checkout-field-group">
        <label class="checkout-field-label" for="checkout-province">Tỉnh / Thành phố <span class="checkout-required">*</span></label>
        <select class="checkout-field-input checkout-select" id="checkout-province" name="province" required aria-required="true">
          <option value="">Chọn tỉnh/TP</option>
        </select>
      </div>
      <div class="checkout-field-group">
        <label class="checkout-field-label" for="checkout-ward">Phường / Xã <span class="checkout-required">*</span></label>
        <select class="checkout-field-input checkout-select" id="checkout-ward" name="ward" required aria-required="true" disabled>
          <option value="">Chọn phường/xã</option>
        </select>
      </div>
      <div class="checkout-field-group checkout-field-group--full">
        <label class="checkout-field-label" for="checkout-address-detail">Địa chỉ chi tiết</label>
        <input class="checkout-field-input" id="checkout-address-detail" name="address_detail"
          type="text" placeholder="Số nhà, tên đường" autocomplete="street-address">
      </div>
    </div>

    <!-- Product line -->
    <div class="checkout-product-line">
      <img class="checkout-product-thumb" src="${thumbSrc}" alt="${altBase}" loading="lazy">
      <div class="checkout-product-info">
        <div class="checkout-product-name">${esc(product.name)}</div>
        <div class="checkout-product-variant">${variantLabel}</div>
        <div class="checkout-product-price-row">
          <span class="checkout-product-price"
            id="checkout-line-total"
            data-unit-price="${esc(String(unitPrice))}"
            data-orig-price="${esc(String(origPrice))}"
            data-discount-amt="${esc(String(discountAmt))}"
            data-product-id="${esc(String(product.id))}"
            data-product-name="${esc(product.name)}"
            data-currency="VND"
          >${formatPrice(unitPrice)}${esc(currency)}</span>
          <div class="checkout-qty-stepper">
            <button class="qty-btn checkout-qty-btn" data-action="dec" type="button"
              aria-label="Giảm số lượng" disabled>−</button>
            <input class="qty-input checkout-qty-input" type="number"
              value="1" min="1" aria-label="Số lượng" readonly>
            <button class="qty-btn checkout-qty-btn" data-action="inc" type="button"
              aria-label="Tăng số lượng">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Discount row -->
    <div class="checkout-discount-row">
      <span class="checkout-discount-label">Giảm giá người bán</span>
      <span class="checkout-discount-value" id="checkout-discount-display">−${formatPrice(discountAmt)}${esc(currency)}</span>
    </div>

    <!-- Totals breakdown -->
    <div class="checkout-totals">
      <div class="checkout-totals-row">
        <span>Giá gốc</span>
        <span id="checkout-orig-display">${formatPrice(origPrice)}${esc(currency)}</span>
      </div>
      <div class="checkout-totals-row checkout-totals-row--coupon">
        <span>Voucher người bán</span>
        <span class="checkout-coupon-value" id="checkout-coupon-display">−${formatPrice(discountAmt)}${esc(currency)}</span>
      </div>
      <div class="checkout-totals-row checkout-totals-row--total">
        <span>Tổng cộng</span>
        <span class="checkout-total-value" id="checkout-total-display">${formatPrice(unitPrice)}${esc(currency)}</span>
      </div>
    </div>

    <!-- Payment method (COD only) -->
    <div class="checkout-payment-section">
      <div class="checkout-payment-label">Phương thức thanh toán</div>
      <div class="checkout-payment-single">
        <span class="checkout-payment-icon" aria-hidden="true">${iconCOD()}</span>
        <span class="checkout-payment-text">
          <span class="checkout-payment-name">Thanh toán khi nhận hàng</span>
          <span class="checkout-payment-desc">COD – Miễn phí</span>
        </span>
        <span class="checkout-payment-check is-visible" aria-hidden="true">${iconCheck()}</span>
      </div>
    </div>

    <!-- Spacer so footer doesn't overlap last item -->
    <div class="checkout-body-spacer" aria-hidden="true"></div>
  </div><!-- /.checkout-body -->

  <!-- Sticky footer -->
  <div class="checkout-footer" id="checkout-footer">
    <div class="checkout-footer-total">
      <span class="checkout-footer-total-label">Tổng cộng</span>
      <span class="checkout-footer-total-value" id="checkout-footer-total">${formatPrice(unitPrice)}${esc(currency)}</span>
    </div>
    <button class="checkout-place-order-btn" id="checkout-place-order-btn" type="button">
      Đặt hàng
    </button>
  </div>
</div>

<!-- Success popup (standalone, outside checkout sheet) -->
<div class="success-popup-backdrop" id="success-popup-backdrop" hidden></div>
<div class="success-popup" id="success-popup" role="dialog" aria-modal="true" aria-label="Đặt hàng thành công" hidden>
  <span class="checkout-success-icon" aria-hidden="true">
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="#E7F7F5"/>
      <circle cx="28" cy="28" r="20" fill="#12B0A0" opacity="0.15"/>
      <path d="M18 28l7 7 13-13" stroke="#12B0A0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <div class="checkout-success-title">Đặt hàng thành công!</div>
  <div class="checkout-success-sub">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</div>

  <div class="checkout-success-summary">
    <div class="checkout-success-row">
      <span class="checkout-success-label">Sản phẩm</span>
      <span class="checkout-success-value" id="success-product-name">${esc(product.name)}</span>
    </div>
    <div class="checkout-success-row">
      <span class="checkout-success-label">Số lượng</span>
      <span class="checkout-success-value" id="success-qty">1</span>
    </div>
    <div class="checkout-success-row">
      <span class="checkout-success-label">Tổng tiền</span>
      <span class="checkout-success-value checkout-success-total" id="success-total">${formatPrice(unitPrice)}${esc(currency)}</span>
    </div>
    <div class="checkout-success-row">
      <span class="checkout-success-label">Thanh toán</span>
      <span class="checkout-success-value">Thanh toán khi nhận hàng (COD)</span>
    </div>
  </div>

  <button class="checkout-success-close-btn" id="success-close-btn" type="button">Đóng</button>
</div>`;
}
