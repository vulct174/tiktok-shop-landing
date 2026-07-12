import { esc, formatPrice, discountPct } from '../helpers.js';
import { iconChevronRightNarrow } from '../icons.js';

/**
 * renderSelectOptionsRow(product, imageBaseDir, currency)
 * Section 4: the row that opens the modal + the modal itself
 */
export function renderSelectOptionsRow(product, imageBaseDir, currency) {
  const variants = product.variants || {};
  const colors = Array.isArray(variants.color) ? variants.color : [];
  const defaultLabel = colors.length ? esc(colors[0]) : 'Mặc định';
  const thumbSrc = esc(`${imageBaseDir}/${product.thumb || (Array.isArray(product.images) && product.images[0]) || ''}`);
  const altBase = esc(product.name);

  const colorChipsHtml = colors.length
    ? colors.map((c, i) => `<button class="chip${i === 0 ? ' active' : ''}" type="button" aria-pressed="${i === 0}">${esc(c)}</button>`).join('\n          ')
    : `<button class="chip active" type="button" aria-pressed="true">Mặc định</button>`;

  const pct = discountPct(product.price, product.originalPrice);
  const origPriceHtml = product.originalPrice && product.originalPrice > product.price
    ? `<span class="modal-header-price-orig">${formatPrice(product.originalPrice)}${esc(currency)}</span>` +
      `<span class="modal-header-price-pct">(-${pct}%)</span>`
    : '';
  const soldHtml = product.sold
    ? `Đã bán ${formatPrice(product.sold)}`
    : 'Còn hàng';

  return `<div class="select-options-row" id="select-options-row" role="button" tabindex="0"
    aria-haspopup="dialog" aria-controls="variant-modal" aria-label="Chọn phân loại sản phẩm">
  <span class="select-options-label">Chọn phân loại</span>
  <span class="select-options-value">Mặc định <span class="select-options-chevron" aria-hidden="true">${iconChevronRightNarrow()}</span></span>
</div>

<!-- Modal backdrop -->
<div id="modal-backdrop" class="modal-backdrop" hidden aria-hidden="true"></div>

<!-- Variant bottom-sheet modal -->
<div id="variant-modal" class="variant-modal"
  role="dialog" aria-modal="true" aria-label="Chọn phân loại"
  hidden>
  <div class="modal-drag-indicator" aria-hidden="true"></div>
  <div class="modal-header">
    <img class="modal-header-thumb" src="${thumbSrc}" alt="${altBase}" loading="lazy">
    <div class="modal-header-info">
      <div class="modal-header-price-row">
        <span class="modal-header-price">${formatPrice(product.price)}<span class="modal-header-currency">${esc(currency)}</span></span>
        ${origPriceHtml}
      </div>
      <div class="modal-header-stock">${defaultLabel}</div>
    </div>
    <button class="modal-close" type="button" aria-label="Đóng">&times;</button>
  </div>
  <div class="modal-body">
    <div class="modal-variant-group">
      <div class="modal-variant-label">Màu sắc: <span class="modal-variant-label-value">${defaultLabel}</span></div>
      <div class="modal-variant-chips">
        ${colorChipsHtml}
      </div>
    </div>
    <div class="modal-qty-row">
      <span class="modal-qty-label">Số lượng:</span>
      <button class="qty-btn" data-action="dec" aria-label="Giảm số lượng" type="button" disabled>−</button>
      <input class="qty-input" type="number" value="1" min="1" aria-label="Số lượng" readonly>
      <button class="qty-btn" data-action="inc" aria-label="Tăng số lượng" type="button">+</button>
    </div>
  </div>
  <div class="modal-actions">
      <button class="modal-btn-cart" type="button"
        data-track="AddToCart"
        data-product-id="${esc(String(product.id))}"
        data-product-name="${esc(product.name)}"
        data-price="${esc(String(product.price))}"
        data-currency="VND"
        aria-label="Thêm giỏ hàng">Thêm giỏ hàng</button>
      <button class="modal-btn-buy" type="button"
        data-track="InitiateCheckout"
        data-product-id="${esc(String(product.id))}"
        data-product-name="${esc(product.name)}"
        data-price="${esc(String(product.price))}"
        data-currency="VND"
        aria-label="Mua ngay">Mua ngay</button>
  </div>
</div>`;
}
