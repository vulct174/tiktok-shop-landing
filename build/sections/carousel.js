import { esc } from '../helpers.js';

/**
 * renderHeroCarousel(product, imageBaseDir)
 * Section 2: CSS scroll-snap carousel with counter, arrows, and dots
 */
export function renderHeroCarousel(product, imageBaseDir) {
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.thumb || ''];
  const total = images.length;

  const imgUrl = (file) => `${imageBaseDir}/${file}`;
  const altBase = esc(product.name);

  const counterHtml = total > 1
    ? `<div class="hero-counter" aria-hidden="true">1 / ${total}</div>`
    : `<div class="hero-counter hidden" aria-hidden="true">1 / ${total}</div>`;

  const slidesHtml = images.map((img, i) => {
    const isFirst = i === 0;
    const laziness = isFirst ? '' : ' loading="lazy"';
    const fetchprio = isFirst ? ' fetchpriority="high"' : '';
    return `  <div class="hero-slide" role="group" aria-label="Ảnh ${i + 1} / ${total}">
    <img src="${esc(imgUrl(img))}" alt="${altBase}"${laziness}${fetchprio}>
  </div>`;
  }).join('\n');

  // Arrow buttons (only when total > 1)
  const arrowsHtml = total > 1
    ? `  <button class="hero-arrow hero-arrow-prev" type="button" aria-label="Ảnh trước">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
  </button>
  <button class="hero-arrow hero-arrow-next" type="button" aria-label="Ảnh tiếp theo">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
  </button>`
    : '';

  // Dots (only when 2 <= total <= 8)
  let dotsHtml = '';
  if (total >= 2 && total <= 8) {
    const dotButtons = images.map((_, i) => {
      const isActive = i === 0;
      return `    <button class="hero-dot${isActive ? ' is-active' : ''}" type="button" role="tab" aria-label="Ảnh ${i + 1} / ${total}" aria-selected="${isActive ? 'true' : 'false'}"></button>`;
    }).join('\n');
    dotsHtml = `  <div class="hero-dots" role="tablist" aria-label="Chọn ảnh">
${dotButtons}
  </div>`;
  }

  return `<section class="hero-carousel" aria-label="Hình sản phẩm" role="region">
  <div class="hero-slides">
${slidesHtml}
  </div>
  ${counterHtml}
${arrowsHtml}
${dotsHtml}
</section>`;
}
