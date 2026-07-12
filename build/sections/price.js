import { esc, formatPrice, discountPct } from '../helpers.js';
import { iconStarSolid } from '../icons.js';

/**
 * renderPriceTitle(product, currency, site)
 * Section 3: price row (before name), name, seller, rating
 */
export function renderPriceTitle(product, currency, site) {
  const pct = discountPct(product.price, product.originalPrice);
  const sellerName = product.sellerName || site.sellerName || 'TikTok Shop';
  const rating = product.rating || 0;

  // Discount: plain accent text (no pill background), e.g. "-56%"
  const discountPill = pct > 0
    ? `<span class="price-discount-pill">-${pct}%</span>`
    : '';

  // Original price: number first, then currency after (e.g. "1.818.000₫"), muted line-through
  const origPrice = product.originalPrice && product.originalPrice > product.price
    ? `<span class="price-original">${formatPrice(product.originalPrice)}${esc(currency)}</span>`
    : '';

  // Review count shown after the single star
  const reviewCount = product.reviews ? product.reviews.total : 0;
  const reviewCountHtml = reviewCount
    ? `<span class="rating-review-count">${reviewCount}</span>`
    : '';

  // Sold count
  const soldCount = product.sold || 0;

  return `<section class="price-title-block" aria-label="Thông tin giá">
  <div class="price-row">
    ${discountPill}<span class="price-sale" aria-label="Giá khuyến mãi: ${formatPrice(product.price)} ${esc(currency)}"><span class="price-currency">${esc(currency)}</span>${formatPrice(product.price)}</span>
    ${origPrice}
  </div>
  <h1><span class="product-name">${esc(product.name)}</span></h1>
  <div class="seller-line">Bán bởi <span>${esc(sellerName)}</span></div>
  <div class="rating-row" aria-label="Đánh giá ${rating} sao">
    <span class="rating-value">${esc(String(rating))}</span>
    <span class="rating-stars" style="font-size:13px;color:#000;" aria-hidden="true">${iconStarSolid()}</span>
    ${reviewCountHtml}
    <span class="rating-sep" aria-hidden="true"></span>
    <span class="sold-count">${formatPrice(soldCount)} đã bán</span>
  </div>
</section>`;
}
