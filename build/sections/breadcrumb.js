import { esc } from '../helpers.js';

/**
 * renderBreadcrumb(product, site)
 * Section 10: breadcrumb trail
 */
export function renderBreadcrumb(product, site) {
  const trail = Array.isArray(product.breadcrumb) && product.breadcrumb.length
    ? product.breadcrumb
    : (Array.isArray(site.breadcrumb) ? site.breadcrumb : []);

  if (!trail.length) return '';

  const items = trail.map((item, i) => {
    const isLast = i === trail.length - 1;
    const sep = isLast ? '' : `<span class="breadcrumb-sep" aria-hidden="true">/</span>`;
    return `<li class="breadcrumb-item">${esc(item)}${sep}</li>`;
  }).join('\n    ');

  return `<nav class="breadcrumb-section" aria-label="Đường dẫn điều hướng">
  <ol class="breadcrumb-list">
    ${items}
  </ol>
</nav>`;
}
