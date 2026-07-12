import { esc } from '../helpers.js';
import { iconChevronDown } from '../icons.js';

/**
 * renderAbout(product, imageBaseDir)
 * Section 6: collapsible, description HTML raw, detail images
 */
export function renderAbout(product, imageBaseDir) {
  const gallery = Array.isArray(product.gallery) ? product.gallery : [];
  const desc = product.description || product.shortDesc || '';
  const imgUrl = (file) => `${imageBaseDir}/${file}`;

  const galleryHtml = gallery.length
    ? `<div class="about-gallery">
      ${gallery.map(img => `<img src="${esc(imgUrl(img))}" alt="${esc(product.name)}" loading="lazy">`).join('\n      ')}
    </div>`
    : '';

  return `<section class="about-section" aria-label="Về sản phẩm">
  <div class="about-title">Về sản phẩm này</div>
  <button class="about-toggle" type="button" aria-expanded="true" aria-controls="about-content">
    <span class="about-toggle-label" id="about-toggle-label">Mô tả sản phẩm</span>
    <span class="about-chevron" aria-hidden="true">${iconChevronDown()}</span>
  </button>
  <div id="about-content" class="about-content expanded" role="region" aria-labelledby="about-toggle-label">
    <div class="about-inner">
      <div class="about-description">${desc}</div>
      ${galleryHtml}
    </div>
  </div>
</section>`;
}
