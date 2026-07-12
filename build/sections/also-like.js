import { esc, formatPrice } from '../helpers.js';
import { iconStar } from '../icons.js';

/**
 * renderAlsoLike(otherProducts, imageBaseDir, currency)
 * Section 9: 2-column grid (excludes current product)
 */
export function renderAlsoLike(otherProducts, imageBaseDir, currency) {
  const imgUrl = (file) => `${imageBaseDir}/${file}`;

  const badgeClassMap = {
    'Deal': 'badge-deal',
    'Xu hướng': 'badge-xu-huong',
    'Hàng Việt': 'badge-hang-viet',
  };

  const cards = otherProducts.map(p => {
    const thumb = p.thumb || (Array.isArray(p.images) && p.images[0]) || '';
    const badgeArr = Array.isArray(p.badges) ? p.badges : [];
    const badgeLabel = badgeArr.find(b => badgeClassMap[b]) || badgeArr[0] || '';
    const badgeClass = badgeClassMap[badgeLabel] || 'badge-deal';
    const badgeHtml = badgeLabel
      ? `<span class="also-like-badge ${badgeClass}" aria-label="${esc(badgeLabel)}">${esc(badgeLabel)}</span>`
      : '';

    const hasFlash = Array.isArray(p.badges) && p.badges.some(b => /flash/i.test(b));
    const flashRow = hasFlash
      ? `<div class="also-like-card-flash"><span class="also-like-card-flash-label">Flash sale</span></div>`
      : '';

    return `<a class="also-like-card" href="${esc(p.slug)}.html" aria-label="${esc(p.name)}">
      <div class="also-like-card-img-wrap">
        <img src="${esc(imgUrl(thumb))}" alt="${esc(p.name)}" loading="lazy">
        ${badgeHtml}
      </div>
      <div class="also-like-card-info">
        <div class="also-like-card-name">${esc(p.name)}</div>
        ${flashRow}
        <div class="also-like-card-rating">
          <span class="also-like-rating-value">${esc(String(p.rating || 0))}</span>
          <span class="s-star" aria-hidden="true">${iconStar()}</span>
          <span class="also-like-card-divider"></span>
          <span class="also-like-card-sold">${formatPrice(p.sold || 0)} đã bán</span>
        </div>
        <div class="also-like-card-price-row">
          <span class="also-like-card-currency">${esc(currency)}</span><span class="also-like-card-price-num">${formatPrice(p.price)}</span>
          ${p.originalPrice && p.originalPrice > p.price
            ? `<span class="also-like-card-orig">${esc(currency)}${formatPrice(p.originalPrice)}</span>`
            : ''}
        </div>
      </div>
    </a>`;
  }).join('\n  ');

  return `<section class="also-like-section" aria-label="Bạn có thể thích">
  <div class="also-like-title">Có thể bạn cũng thích</div>
  <div class="also-like-grid">
    ${cards}
  </div>
</section>`;
}
