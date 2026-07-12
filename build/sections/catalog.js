import { esc, formatPrice, discountPct } from '../helpers.js';
import { iconSearch } from '../icons.js';

// ════════════════════════════════════════════════════════════
// CATALOG INDEX RENDERER
// ════════════════════════════════════════════════════════════

export function renderCatalogIndex(products, site) {
  const currency   = site.currency || '₫';
  const imgBaseDir = site.imageBaseDir || 'assets/products';

  const cards = products.map(p => {
    const thumb = p.thumb || (Array.isArray(p.images) && p.images[0]) || '';
    const pct   = discountPct(p.price, p.originalPrice);
    const discountTag = pct > 0
      ? `<span class="catalog-card-discount">-${pct}%</span>`
      : '';
    const soldHtml = p.sold
      ? `<div class="catalog-card-sold">${formatPrice(p.sold)} đã bán</div>`
      : '';
    return `  <a class="catalog-card" href="${esc(p.slug)}.html" aria-label="${esc(p.name)}">
    <div class="catalog-card-img-wrap">
      <img src="${esc(`${imgBaseDir}/${thumb}`)}" alt="${esc(p.name)}" loading="lazy">
      ${discountTag}
    </div>
    <div class="catalog-card-body">
      <div class="catalog-card-name">${esc(p.name)}</div>
      <div class="catalog-card-price-row">
        <span class="catalog-card-price">${formatPrice(p.price)}${esc(currency)}</span>
        ${p.originalPrice ? `<span class="catalog-card-orig">${formatPrice(p.originalPrice)}${esc(currency)}</span>` : ''}
      </div>
      ${soldHtml}
    </div>
  </a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(site.brand)} – Danh Mục Sản Phẩm</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="page-wrapper catalog-page">
    <nav class="top-nav catalog-nav" aria-label="Điều hướng chính">
      <div class="nav-left-group">
        <img src="${imgBaseDir}/tts-logo-light.png" alt="TikTok Shop Vietnam" class="nav-logo-img">
      </div>
      <div class="nav-search" role="search" aria-label="Tìm kiếm sản phẩm">
        <span class="nav-search-icon" aria-hidden="true">${iconSearch()}</span>
        <span class="nav-search-placeholder">Tìm kiếm</span>
      </div>
    </nav>
    <header class="catalog-header">
      <div class="catalog-header-inner">
        <h1>${esc(site.brand)}</h1>
        <p>${products.length} sản phẩm</p>
      </div>
    </header>
    <main class="catalog-grid">
${cards}
    </main>
    <footer class="catalog-footer">
      <div class="catalog-footer-brand">${esc(site.brand)}</div>
      <div class="catalog-footer-copy">&copy; ${new Date().getFullYear()} ${esc(site.brand)}. Bảo lưu mọi quyền.</div>
    </footer>
  </div>
</body>
</html>`;
}
