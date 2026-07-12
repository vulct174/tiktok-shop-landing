import { esc, formatPrice, discountPct } from '../helpers.js';
import { iconFlame, iconStar } from '../icons.js';

/**
 * renderSellerShelf(product, otherProducts, imageBaseDir, currency, sellerShelf)
 * Section 8: horizontal scroll cards (excludes current product)
 */
export function renderSellerShelf(product, otherProducts, imageBaseDir, currency, sellerShelf) {
  const sellerName = product.sellerName || 'shop';

  // Absolute (http/https) images pass through; otherwise prefix base dir.
  const resolveImg = (file) => /^https?:\/\//i.test(file) ? file : `${imageBaseDir}/${file}`;

  // Prefer the dedicated seller-shelf config (real cross-sell items linking
  // out to live listings). Fall back to internal products (link to .html).
  const useShelfConfig = Array.isArray(sellerShelf) && sellerShelf.length > 0;

  const items = useShelfConfig
    ? sellerShelf
    : otherProducts.map(p => ({
        name:          p.name,
        price:         p.price,
        originalPrice: p.originalPrice,
        rating:        p.rating,
        sold:          p.sold,
        flash:         Array.isArray(p.badges) && p.badges.some(b => /flash/i.test(b)),
        img:           p.thumb || (Array.isArray(p.images) && p.images[0]) || '',
        href:          `${p.slug}.html`,
      }));

  const cards = items.map(it => {
    const flashRow = it.flash
      ? `<div class="shelf-card-flash"><span class="shelf-card-flash-icon" aria-hidden="true">${iconFlame()}</span><span class="shelf-card-flash-label">Flash sale</span></div>`
      : '';
    const isExternal = /^https?:\/\//i.test(it.href || '');
    const linkAttrs = isExternal
      ? ` target="_blank" rel="noopener noreferrer"`
      : '';
    const origPrice = it.originalPrice && it.originalPrice > it.price
      ? `<span class="shelf-card-orig">${esc(currency)}${formatPrice(it.originalPrice)}</span>`
      : '';

    return `<div class="shelf-card">
      <a href="${esc(it.href || '#')}"${linkAttrs} aria-label="${esc(it.name)}" tabindex="0">
        <div class="shelf-card-img-wrap">
          <img src="${esc(resolveImg(it.img || ''))}" alt="${esc(it.name)}" loading="lazy">
        </div>
        <div class="shelf-card-info">
          <h3 class="shelf-card-name">${esc(it.name)}</h3>
          ${flashRow}
          <div class="shelf-card-rating">
            <span class="shelf-card-rating-value">${esc(String(it.rating || 0))}</span>
            <span class="s-star" aria-hidden="true">${iconStar()}</span>
            <span class="shelf-card-divider"></span>
            <span class="shelf-card-sold">${formatPrice(it.sold || 0)} đã bán</span>
          </div>
          <div class="shelf-card-price-row">
            <span class="shelf-card-currency">${esc(currency)}</span><span class="shelf-card-price-num">${formatPrice(it.price)}</span>
            ${origPrice}
          </div>
        </div>
      </a>
    </div>`;
  }).join('\n  ');

  return `<section class="seller-shelf-section" aria-label="Khám phá thêm từ cửa hàng">
  <div class="shelf-title">Khám phá thêm từ ${esc(sellerName)}</div>
  <div class="shelf-cards">
    ${cards}
  </div>
</section>`;
}
