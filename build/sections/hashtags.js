import { esc } from '../helpers.js';

/**
 * renderHashtags(product)
 * Section 7: hashtag chips
 */
export function renderHashtags(product) {
  const tags = Array.isArray(product.hashtags) ? product.hashtags : [];
  if (!tags.length) return '';

  const chipsHtml = tags.map(t => `<span class="hashtag-chip">${esc(t)}</span>`).join('\n  ');

  return `<section class="hashtags-section" aria-label="Hashtags">
  ${chipsHtml}
</section>`;
}
