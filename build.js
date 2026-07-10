/**
 * build.js – TikTok Shop Landing Page Generator
 *
 * Usage: node build.js
 *
 * Reads config/products.js and emits:
 *   dist/<slug>.html   (one per product)
 *   dist/index.html    (catalog)
 *
 * Also copies src/styles.css, src/main.js, and assets/ into dist/.
 *
 * Windows-safe ESM: config is imported via pathToFileURL.
 * Uses only Node built-ins (fs, path, url). Zero runtime deps.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Paths ────────────────────────────────────────────────────
const ROOT      = __dirname;
const DIST      = path.join(ROOT, 'dist');
const SRC       = path.join(ROOT, 'src');
const ASSETS    = path.join(ROOT, 'assets');
const CONFIG    = path.join(ROOT, 'config', 'products.js');
const TEMPLATE  = path.join(SRC, 'template.html');

// ── HTML-escape helper ───────────────────────────────────────
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ── Format price with thousands separator ───────────────────
function formatPrice(num) {
  return Number(num).toLocaleString('vi-VN');
}

// ── Derive discount percent ──────────────────────────────────
function discountPct(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

// ── Gold star string helper ──────────────────────────────────
function goldStars(count) {
  const n = Math.max(0, Math.min(5, Math.round(count)));
  let out = '';
  for (let i = 0; i < n; i++) out += iconStar();
  for (let i = n; i < 5; i++) out += iconStarEmpty();
  return out;
}

// ── Inline SVG icon helpers ─────────────────────────────────
function iconArrowLeft() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="m20.24 24 13.17-13.17a1 1 0 0 0 0-1.42L30.6 6.6a1 1 0 0 0-1.42 0L12.82 22.94a1.5 1.5 0 0 0 0 2.12l16.35 16.35a1 1 0 0 0 1.42 0l2.82-2.82a1 1 0 0 0 0-1.42L20.24 24Z"/></svg>';
}

function iconSearch() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.83 7.5a14.34 14.34 0 1 1 0 28.68 14.34 14.34 0 0 1 0-28.68Zm0-4a18.33 18.33 0 1 0 11.48 32.64l8.9 8.9a1 1 0 0 0 1.42 0l1.4-1.41a1 1 0 0 0 0-1.42l-8.89-8.9A18.34 18.34 0 0 0 21.83 3.5Z"/></svg>';
}

function iconPerson() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 3a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 4a6 6 0 1 0 0 12.00A6 6 0 0 0 24 7Zm0 19c10.3 0 16.67 6.99 17 17 .02.55-.43 1-1 1h-2c-.54 0-.98-.45-1-1-.3-7.84-4.9-13-13-13s-12.7 5.16-13 13c-.02.55-.46 1-1.02 1h-2c-.55 0-1-.45-.98-1 .33-10.01 6.7-17 17-17Z"/></svg>';
}

function iconChevronRight() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
}

// Narrow chevron matching TikTok reference: viewBox 0 0 24 48 (1:2 aspect).
// At font-size 16px on the container, width="0.5em"=8px, height="1em"=16px.
function iconChevronRightNarrow() {
  return '<svg viewBox="0 0 24 48" width="0.5em" height="1em" fill="currentColor" aria-hidden="true"><path d="M16.73 24 2.7 9.98a1 1 0 0 1 0-1.41l1.13-1.13a1 1 0 0 1 1.41 0L21.11 23.3a1 1 0 0 1 0 1.41L5.25 40.57a1 1 0 0 1-1.41 0L2.7 39.44a1 1 0 0 1 0-1.42L16.73 24Z"></path></svg>';
}

function iconChevronDown() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>';
}

function iconStar() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="var(--star-gold)" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
}

function iconStarEmpty() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
}

// Single solid black star (TikTok 48×48 path) — used in Section 3 rating row only.
// Do NOT use for the reviews section (which uses the gold iconStar helper).
function iconStarSolid() {
  return '<svg width="1em" height="1em" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M24 4l5.09 10.31L41 15.64l-8.5 8.28 2 11.67L24 30.27l-10.5 5.32 2-11.67L7 15.64l11.91-1.33z"/></svg>';
}

function iconCheck() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
}

function iconTruck() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>';
}

function iconGift() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>';
}

// Flame icon for Flash sale label (Material "whatshot").
function iconFlame() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>';
}

// Shopping cart / trolley — clean outline (stroke) matching TikTok bottom-bar style.
function iconCart() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 4H5l1.9 11.4a1 1 0 0 0 1 .85h8.75a1 1 0 0 0 .98-.8L20.5 8H6.2"/></svg>';
}

// Shopping bag — clean outline (stroke) matching TikTok bottom-bar style.
function iconShop() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 8h13.6l-1 11.4a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5.2 8Z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></svg>';
}

// Speech-bubble / chat — clean outline (stroke) matching TikTok bottom-bar style.
function iconChat() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9.5L5 19.5V16h-.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4Z"/></svg>';
}

// ════════════════════════════════════════════════════════════
// SECTION RENDERERS (pure functions → HTML strings)
// ════════════════════════════════════════════════════════════

/**
 * renderTopNav()
 * Section 1: sticky top bar
 */
function renderTopNav(imgBaseDir) {
  return `<nav class="top-nav" aria-label="Điều hướng chính">
  <div class="nav-left-group">
    <img src="${imgBaseDir}/tts-logo-light.png" alt="TikTok Shop Vietnam" class="nav-logo-img">
  </div>
  <div class="nav-search" role="search" aria-label="Tìm kiếm sản phẩm">
    <span class="nav-search-icon" aria-hidden="true">${iconSearch()}</span>
    <span class="nav-search-placeholder">Tìm kiếm</span>
  </div>
  <button class="nav-btn nav-cart-btn" aria-label="Giỏ hàng" type="button">${iconCart()}</button>
</nav>`;
}

/**
 * renderHeroCarousel(product, imageBaseDir)
 * Section 2: CSS scroll-snap carousel with counter, arrows, and dots
 */
function renderHeroCarousel(product, imageBaseDir) {
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

/**
 * renderPriceTitle(product, currency, site)
 * Section 3: price row (before name), name, seller, rating
 */
function renderPriceTitle(product, currency, site) {
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

/**
 * renderSelectOptionsRow(product, imageBaseDir, currency)
 * Section 4: the row that opens the modal + the modal itself
 */
function renderSelectOptionsRow(product, imageBaseDir, currency) {
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

/**
 * renderReviews(product, imageBaseDir)
 * Section 5: aggregate score, breakdown bars, photo strip, filter tabs, review cards
 */
function renderReviews(product, imageBaseDir) {
  const reviews = product.reviews;
  if (!reviews) {
    return `<section class="reviews-section" aria-label="Đánh giá của khách hàng">
  <div class="reviews-section-title">Đánh giá của khách hàng</div>
  <div class="reviews-empty">Chưa có đánh giá.</div>
</section>`;
  }

  const imgUrl = (file) => `${imageBaseDir}/${file}`;
  const breakdown = reviews.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  // Bar width is relative to total reviews (matches reference: 8/10 → 80%)
  const totalReviews = reviews.total || Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;

  const breakdownHtml = [5, 4, 3, 2, 1].map(star => {
    const count = breakdown[star] || 0;
    const pct = Math.round((count / totalReviews) * 100);
    return `<div class="breakdown-row">
      <span class="breakdown-label">
        <span class="breakdown-num">${star}</span>
        <span class="breakdown-star" aria-hidden="true">${iconStarSolid()}</span>
      </span>
      <div class="breakdown-bar-bg" role="progressbar" aria-valuenow="${count}" aria-valuemin="0" aria-valuemax="${totalReviews}" aria-label="${star} sao: ${count} đánh giá">
        <div class="breakdown-bar-fill" style="width:${pct}%"></div>
      </div>
      <span class="breakdown-count">${count}</span>
    </div>`;
  }).join('\n  ');

  const items = Array.isArray(reviews.items) ? reviews.items : [];
  // How many review cards load per "View more" click (and are shown initially).
  const reviewPageSize = reviews.pageSize || 5;

  // "Photos from reviews" strip is built from review items that include a photo,
  // each rendered as a 120px card with a gradient overlay (avatar + name + stars).
  const photoItems = items.filter(it => it.photo);
  const photosHtml = photoItems.length
    ? `<div class="reviews-photos-title">Ảnh từ đánh giá</div>
  <div class="reviews-photos-strip" aria-label="Ảnh từ đánh giá">
    ${photoItems.map(it => {
      const initials = (it.name || '?').charAt(0).toUpperCase();
      const stars = it.stars || 5;
      return `<div class="review-photo-card">
      <img class="review-photo-card-img" src="${esc(imgUrl(it.photo))}" alt="Ảnh đánh giá của ${esc(it.name)}" loading="lazy">
      <div class="review-photo-overlay" aria-hidden="true">
        <div class="review-photo-user">
          <span class="review-photo-avatar">${initials}</span>
          <span class="review-photo-name" title="${esc(it.name)}">${esc(it.name)}</span>
        </div>
        <div class="review-photo-stars" role="img" aria-label="${stars} sao">${goldStars(stars)}</div>
      </div>
    </div>`;
    }).join('\n    ')}
  </div>`
    : '';

  // Sort segmented control + filter chips (star dropdown, visuals, verified)
  const reviewControls = `<div class="reviews-controls">
    <div class="reviews-sort-tabs" role="tablist" aria-label="Sắp xếp đánh giá">
      <button class="reviews-sort-tab active" type="button" role="tab" aria-selected="true" data-sort="recommended">Đề xuất</button>
      <button class="reviews-sort-tab" type="button" role="tab" aria-selected="false" data-sort="recent">Mới nhất</button>
    </div>
    <div class="reviews-filter-row" aria-label="Lọc đánh giá">
      <div class="review-star-filter">
        <button class="review-filter-chip review-filter-chip--dropdown" type="button" aria-haspopup="listbox" aria-expanded="false" data-filter-star="all">
          <span class="review-filter-chip-star" aria-hidden="true">${iconStarSolid()}</span>
          <span class="review-filter-chip-label">Tất cả</span>
          <span class="review-filter-chip-caret" aria-hidden="true">${iconChevronDown()}</span>
        </button>
        <ul class="review-star-menu" role="listbox" aria-label="Lọc theo số sao" hidden>
          <li class="review-star-option active" role="option" aria-selected="true" data-star="all" tabindex="0">Tất cả sao</li>
          <li class="review-star-option" role="option" aria-selected="false" data-star="5" tabindex="0">5 sao</li>
          <li class="review-star-option" role="option" aria-selected="false" data-star="4" tabindex="0">4 sao</li>
          <li class="review-star-option" role="option" aria-selected="false" data-star="3" tabindex="0">3 sao</li>
          <li class="review-star-option" role="option" aria-selected="false" data-star="2" tabindex="0">2 sao</li>
          <li class="review-star-option" role="option" aria-selected="false" data-star="1" tabindex="0">1 sao</li>
        </ul>
      </div>
      <button class="review-filter-chip" type="button" aria-pressed="false" data-filter-visuals>Có hình ảnh</button>
      <button class="review-filter-chip" type="button" aria-pressed="false" data-filter-verified>Đã mua hàng</button>
    </div>
    <div class="reviews-status-line">
      <span class="reviews-status-text">Hiển thị <span class="reviews-shown-count">${items.length}</span> trong ${reviews.total} đánh giá · Lọc theo</span>
      <button class="reviews-reset" type="button">Đặt lại bộ lọc</button>
    </div>
    <div class="reviews-allstar-heading">Tất cả sao</div>
  </div>`;

  const cardsHtml = items.length
    ? items.map(item => {
        const starCount = item.stars || 5;
        const stars = goldStars(starCount);
        const initials = (item.name || '?').charAt(0).toUpperCase();
        const hasPhoto = !!item.photo;
        const sidePhotoHtml = hasPhoto
          ? `<div class="review-side-photo">
        <img src="${esc(imgUrl(item.photo))}" alt="Ảnh đánh giá của ${esc(item.name)}" loading="lazy">
      </div>`
          : '';
        const verifiedHtml = item.verified
          ? `<span class="review-name-sep" aria-hidden="true">·</span><span class="review-verified">Đã mua hàng</span>`
          : '';
        const regionHtml = item.region
          ? `<div class="review-region">${esc(item.region)}</div>`
          : '';
        return `<div class="review-card" data-stars="${starCount}" data-photo="${hasPhoto ? '1' : '0'}" data-verified="${item.verified ? '1' : '0'}" data-date="${esc(item.date || '')}">
      <div class="review-card-header">
        <div class="review-avatar" aria-hidden="true">${initials}</div>
        <div class="review-identity">
          <div class="review-name-row">
            <span class="review-name">${esc(item.name)}</span>
            ${verifiedHtml}
          </div>
          ${regionHtml}
        </div>
      </div>
      <div class="review-card-stars" aria-label="${starCount} sao" role="img">${stars}</div>
      <div class="review-body-row">
        <p class="review-text">${esc(item.text)}</p>
        ${sidePhotoHtml}
      </div>
      ${item.itemLabel ? `<div class="review-item-label"><span>Phân loại:</span> ${esc(item.itemLabel)}</div>` : ''}
      <div class="review-date">${esc(item.date || '')}</div>
    </div>`;
      }).join('\n  ')
    : '<div class="reviews-empty">Chưa có đánh giá chi tiết.</div>';

  return `<section class="reviews-section" aria-label="Đánh giá của khách hàng">
  <div class="reviews-section-title">Đánh giá của khách hàng</div>
  <div class="reviews-aggregate">
    <span class="reviews-score" aria-label="Điểm trung bình ${reviews.average}">${reviews.average}</span>
    <span class="reviews-score-star" aria-hidden="true">${iconStarSolid()}</span>
    <span class="reviews-aggregate-sep" aria-hidden="true">·</span>
    <span class="reviews-total">${reviews.total} đánh giá toàn cầu</span>
  </div>
  <div class="reviews-breakdown" aria-label="Phân bổ đánh giá">
    ${breakdownHtml}
  </div>
  ${photosHtml}
  ${reviewControls}
  <div class="review-cards" data-page-size="${reviewPageSize}">
    ${cardsHtml}
  </div>
  <div class="reviews-more-wrap">
    <button class="reviews-more-btn" type="button" aria-expanded="false" hidden>Xem thêm</button>
    <div class="reviews-end" hidden>Không còn đánh giá</div>
  </div>
</section>`;
}

/**
 * renderAbout(product, imageBaseDir)
 * Section 6: collapsible, description HTML raw, detail images
 */
function renderAbout(product, imageBaseDir) {
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

/**
 * renderHashtags(product)
 * Section 7: hashtag chips
 */
function renderHashtags(product) {
  const tags = Array.isArray(product.hashtags) ? product.hashtags : [];
  if (!tags.length) return '';

  const chipsHtml = tags.map(t => `<span class="hashtag-chip">${esc(t)}</span>`).join('\n  ');

  return `<section class="hashtags-section" aria-label="Hashtags">
  ${chipsHtml}
</section>`;
}

/**
 * renderSellerShelf(product, otherProducts, imageBaseDir, currency)
 * Section 8: horizontal scroll cards (excludes current product)
 */
function renderSellerShelf(product, otherProducts, imageBaseDir, currency, sellerShelf) {
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

/**
 * renderAlsoLike(otherProducts, imageBaseDir, currency)
 * Section 9: 2-column grid (excludes current product)
 */
function renderAlsoLike(otherProducts, imageBaseDir, currency) {
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

/**
 * renderBreadcrumb(product, site)
 * Section 10: breadcrumb trail
 */
function renderBreadcrumb(product, site) {
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

/**
 * renderFooter(site)
 * Section 11: accordion groups + perks + app badges
 */
function renderFooter(site) {
  const footerGroups = Array.isArray(site.footerGroups) ? site.footerGroups : [];
  const appBadges = site.appBadges || {};
  const imgBaseDir = site.imageBaseDir || 'assets/products';

  const groupsHtml = footerGroups.map((group, gi) => {
    const groupId = `footer-group-${gi}`;
    const contentId = `footer-group-content-${gi}`;
    const linksHtml = (Array.isArray(group.links) ? group.links : [])
      .map(link => `<a href="${esc(link.href || '#')}">${esc(link.label)}</a>`)
      .join('\n      ');
    return `<div class="footer-group" id="${groupId}">
    <button class="footer-group-toggle" type="button"
      aria-expanded="false" aria-controls="${contentId}">
      <span class="footer-group-title">${esc(group.title)}</span>
      <span class="footer-group-chevron" aria-hidden="true">${iconChevronDown()}</span>
    </button>
    <div class="footer-group-content" id="${contentId}" role="region">
      <div class="footer-group-links">
      ${linksHtml}
      </div>
    </div>
  </div>`;
  }).join('\n  ');

  const googlePlaySrc = appBadges.googlePlay ? `${imgBaseDir}/${appBadges.googlePlay}` : '';
  const appStoreSrc = appBadges.appStore ? `${imgBaseDir}/${appBadges.appStore}` : '';
  const badgesHtml = (googlePlaySrc || appStoreSrc)
    ? `<div class="footer-badges-row" aria-label="Tải ứng dụng">
    ${googlePlaySrc ? `<a class="footer-badge-link" href="#" aria-label="Google Play"><img src="${esc(googlePlaySrc)}" alt="Get it on Google Play"></a>` : ''}
    ${appStoreSrc ? `<a class="footer-badge-link" href="#" aria-label="App Store"><img src="${esc(appStoreSrc)}" alt="Download on the App Store"></a>` : ''}
  </div>`
    : '';

  return `<footer class="page-footer" aria-label="Thông tin trang">
  <img class="footer-logo" src="${imgBaseDir}/tts-logo-light.png" alt="TikTok Shop Vietnam logo">
  ${groupsHtml}
  <div class="footer-perks-row" aria-label="Ưu đãi">
    <div class="footer-perk">
      <span class="footer-perk-icon" aria-hidden="true">${iconTruck()}</span>
      <span class="footer-perk-label">Miễn phí vận chuyển</span>
    </div>
    <div class="footer-perk">
      <span class="footer-perk-icon" aria-hidden="true">${iconGift()}</span>
      <span class="footer-perk-label">Ưu đãi khách mới</span>
    </div>
  </div>
  ${badgesHtml}
</footer>`;
}

/**
 * iconLocationPin()
 * Inline SVG: location / map-pin for address sheet.
 */
function iconLocationPin() {
  return '<svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
}

/**
 * iconCOD()
 * Cash on delivery icon (wallet/cash outline).
 */
function iconCOD() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 10v4m-2-2h4"/></svg>';
}

/**
 * iconPayLater()
 * TikTok PayLater icon (clock with coin).
 */
function iconPayLater() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
}

/**
 * iconCard()
 * Credit/debit card icon.
 */
function iconCard() {
  return '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
}

/**
 * renderCheckoutSheet(product, currency)
 * Section 13: mock Order-summary bottom sheet.
 * Rendered into <!-- SECTION_CHECKOUT --> via assemblePage.
 */
function renderCheckoutSheet(product, currency) {
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

    <!-- Shipping address card -->
    <button class="checkout-address-card" id="checkout-address-card"
      type="button" aria-haspopup="dialog" aria-label="Thêm địa chỉ giao hàng">
      <span class="checkout-address-icon" aria-hidden="true">${iconLocationPin()}</span>
      <div class="checkout-address-content">
        <div class="checkout-address-prompt" id="checkout-address-display">
          <span class="checkout-address-prompt-text">Thêm địa chỉ giao hàng</span>
          <span class="checkout-address-prompt-sub">Nhấn để thêm địa chỉ</span>
        </div>
      </div>
      <span class="checkout-address-chevron" aria-hidden="true">${iconChevronRight()}</span>
    </button>

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

    <!-- Payment method -->
    <div class="checkout-payment-section">
      <div class="checkout-payment-label">Phương thức thanh toán</div>
      <fieldset class="checkout-payment-group" aria-label="Chọn phương thức thanh toán">
        <legend class="sr-only">Phương thức thanh toán</legend>

        <label class="checkout-payment-option">
          <input class="checkout-payment-radio" type="radio"
            name="checkout-payment" value="cod" checked
            aria-label="Thanh toán khi nhận hàng (COD)">
          <span class="checkout-payment-icon" aria-hidden="true">${iconCOD()}</span>
          <span class="checkout-payment-text">
            <span class="checkout-payment-name">Thanh toán khi nhận hàng</span>
            <span class="checkout-payment-desc">COD – Miễn phí</span>
          </span>
          <span class="checkout-payment-check" aria-hidden="true">${iconCheck()}</span>
        </label>

        <label class="checkout-payment-option">
          <input class="checkout-payment-radio" type="radio"
            name="checkout-payment" value="paylater"
            aria-label="TikTok PayLater">
          <span class="checkout-payment-icon" aria-hidden="true">${iconPayLater()}</span>
          <span class="checkout-payment-text">
            <span class="checkout-payment-name">TikTok PayLater</span>
            <span class="checkout-payment-desc">Trả sau · 0% lãi suất</span>
          </span>
          <span class="checkout-payment-check" aria-hidden="true">${iconCheck()}</span>
        </label>

        <label class="checkout-payment-option">
          <input class="checkout-payment-radio" type="radio"
            name="checkout-payment" value="card"
            aria-label="Thẻ tín dụng / Ghi nợ">
          <span class="checkout-payment-icon" aria-hidden="true">${iconCard()}</span>
          <span class="checkout-payment-text">
            <span class="checkout-payment-name">Thẻ tín dụng / Ghi nợ</span>
            <span class="checkout-payment-desc">Visa, Mastercard, JCB</span>
          </span>
          <span class="checkout-payment-check" aria-hidden="true">${iconCheck()}</span>
        </label>

      </fieldset>
    </div>

    <!-- Inline hint (shown when place-order attempted without address) -->
    <div class="checkout-address-hint" id="checkout-address-hint" hidden>
      <span class="checkout-address-hint-text">Bạn chưa có địa chỉ giao hàng. Đơn hàng vẫn được đặt (demo) nhưng thường cần địa chỉ.</span>
    </div>

    <!-- Success state (shown after place order) -->
    <div class="checkout-success" id="checkout-success" hidden>
      <span class="checkout-success-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#E7F7F5"/>
          <path d="M14 24l7 7 13-13" stroke="#12B0A0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <div class="checkout-success-title">Đặt hàng thành công</div>
      <div class="checkout-success-sub">Đơn hàng của bạn đã được ghi nhận (demo).</div>
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
</div>`;
}

/**
 * renderAddressSheet()
 * Section 13: Add-address sub-sheet (portalled, layered above order sheet).
 */
function renderAddressSheet() {
  return `<!-- Address sub-sheet backdrop -->
<div id="address-backdrop" class="modal-backdrop address-backdrop" hidden aria-hidden="true"></div>

<!-- Add-address bottom sheet -->
<div id="address-sheet" class="address-sheet"
  role="dialog" aria-modal="true" aria-labelledby="address-sheet-title"
  hidden>
  <div class="modal-drag-indicator" aria-hidden="true"></div>

  <!-- Header -->
  <div class="address-header">
    <button class="modal-close address-close-btn" type="button" aria-label="Đóng">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <span class="address-title" id="address-sheet-title">Thêm địa chỉ mới</span>
  </div>

  <!-- Form body -->
  <div class="address-body">
    <form class="address-form" id="address-form" novalidate>

      <!-- Name field -->
      <div class="address-field-group">
        <label class="address-field-label" for="addr-name">Họ và tên <span class="address-required" aria-hidden="true">*</span></label>
        <input class="address-field-input" id="addr-name" name="name"
          type="text" autocomplete="name" required
          placeholder="Nhập họ và tên" aria-required="true">
      </div>

      <!-- Phone field -->
      <div class="address-field-group">
        <label class="address-field-label" for="addr-phone">Số điện thoại <span class="address-required" aria-hidden="true">*</span></label>
        <div class="address-phone-row">
          <span class="address-phone-prefix" aria-label="Mã quốc gia Việt Nam">VN +84</span>
          <input class="address-field-input address-phone-input" id="addr-phone" name="phone"
            type="tel" autocomplete="tel-national" required
            placeholder="9x xxxx xxxx" aria-required="true"
            aria-describedby="addr-phone-error"
            inputmode="numeric">
        </div>
        <div class="address-field-error" id="addr-phone-error" role="alert" aria-live="polite" hidden>
          Số điện thoại không hợp lệ. Nhập 9–10 số bắt đầu bằng 3, 5, 7, 8 hoặc 9.
        </div>
      </div>

      <!-- Address select row -->
      <div class="address-field-group">
        <label class="address-field-label" id="addr-select-label">Địa chỉ</label>
        <div class="address-select-row" id="addr-select" tabindex="0" role="button" aria-labelledby="addr-select-label">
          <span class="address-select-placeholder">Chọn tỉnh / Thành phố, Quận / Huyện, Phường / Xã</span>
          <span class="address-select-chevron" aria-hidden="true">${iconChevronRight()}</span>
        </div>
      </div>

      <!-- Current location card -->
      <div class="address-location-card">
        <span class="address-location-icon" aria-hidden="true">${iconLocationPin()}</span>
        <div class="address-location-content">
          <div class="address-location-label">Vị trí hiện tại</div>
          <div class="address-location-sub">Dùng GPS để xác định địa chỉ</div>
        </div>
        <button class="address-use-location-btn" type="button" aria-label="Sử dụng vị trí hiện tại (demo)">
          Dùng vị trí này
        </button>
      </div>

      <!-- Address details -->
      <div class="address-field-group">
        <label class="address-field-label" for="addr-detail">Chi tiết địa chỉ <span class="address-optional">(tùy chọn)</span></label>
        <textarea class="address-field-input address-detail-textarea" id="addr-detail" name="detail"
          placeholder="Số nhà, tên đường, tòa nhà…" rows="2"
          aria-label="Chi tiết địa chỉ"></textarea>
      </div>

      <!-- Set as default toggle -->
      <div class="address-default-row">
        <span class="address-default-label">Đặt làm địa chỉ mặc định</span>
        <button class="address-default-toggle" id="addr-default-toggle"
          type="button" role="switch" aria-checked="false"
          aria-label="Đặt làm địa chỉ mặc định">
          <span class="address-toggle-thumb" aria-hidden="true"></span>
        </button>
      </div>

    </form>
  </div><!-- /.address-body -->

  <!-- Save button footer -->
  <div class="address-footer">
    <button class="address-save-btn" id="address-save-btn" type="button" disabled
      aria-disabled="true">
      Lưu địa chỉ
    </button>
  </div>
</div>`;
}

/**
 * renderStickyCta(product, currency)
 * Section 12: full-width fixed Buy now pill
 */
function renderStickyCta(product, currency) {
  return `<div class="sticky-cta-bar" role="complementary" aria-label="Mua hàng">
  <div class="sticky-cta-left">
    <button class="cta-icon-btn" type="button" aria-label="Shop">
      <span class="cta-icon-btn-icon" aria-hidden="true">${iconShop()}</span>
      <span class="cta-icon-btn-label">Shop</span>
    </button>
    <button class="cta-icon-btn" type="button" aria-label="Chat">
      <span class="cta-icon-btn-icon" aria-hidden="true">${iconChat()}</span>
      <span class="cta-icon-btn-label">Chat</span>
    </button>
  </div>
  <button class="cta-icon-btn cta-cart-btn" type="button" aria-label="Giỏ hàng">
    <span class="cta-icon-btn-icon" aria-hidden="true">${iconCart()}</span>
  </button>
  <button
    class="cta-buy-now"
    type="button"
    data-track="InitiateCheckout"
    data-product-id="${esc(String(product.id))}"
    data-product-name="${esc(product.name)}"
    data-price="${esc(String(product.price))}"
    data-currency="VND"
    aria-label="Mua ngay – ${formatPrice(product.price)}${esc(currency)}, miễn phí vận chuyển"
  >
    <span class="cta-buy-now-label">Mua ngay</span>
    <span class="cta-buy-now-price">${formatPrice(product.price)}${esc(currency)}<span class="cta-buy-now-sep">|</span>Miễn phí vận chuyển</span>
  </button>
</div>`;
}

// ════════════════════════════════════════════════════════════
// TRACKING INJECTION
// ════════════════════════════════════════════════════════════

/**
 * buildTrackingHead(tracking)
 * Returns HTML snippets for <head>. Only non-empty IDs are included.
 */
function buildTrackingHead(tracking) {
  const parts = [];

  // ── Google Tag Manager ──
  if (tracking.gtmId) {
    parts.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${esc(tracking.gtmId)}');<\/script>
<!-- End Google Tag Manager -->`);
  }

  // ── Meta Pixel ──
  if (tracking.metaPixelId) {
    parts.push(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${esc(tracking.metaPixelId)}');
fbq('track', 'PageView');
<\/script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${esc(tracking.metaPixelId)}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`);
  }

  // ── TikTok Pixel ──
  if (tracking.tiktokPixelId) {
    parts.push(`<!-- TikTok Pixel -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${esc(tracking.tiktokPixelId)}');
  ttq.page();
}(window, document, 'ttq');
<\/script>
<!-- End TikTok Pixel -->`);
  }

  // ── Google Analytics 4 / gtag ──
  if (tracking.googleTagId) {
    parts.push(`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(tracking.googleTagId)}"><\/script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${esc(tracking.googleTagId)}');
<\/script>
<!-- End Google tag -->`);
  }

  return parts.join('\n');
}

/**
 * buildTrackingBodyNoscript(tracking)
 * Returns the GTM noscript iframe (injected right after <body>).
 */
function buildTrackingBodyNoscript(tracking) {
  if (!tracking.gtmId) return '';
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(tracking.gtmId)}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

// ════════════════════════════════════════════════════════════
// CONFIG VALIDATION
// ════════════════════════════════════════════════════════════

function validateConfig(site, tracking, products) {
  const errors = [];

  if (!site)     errors.push('config/products.js is missing the `site` export.');
  if (!tracking) errors.push('config/products.js is missing the `tracking` export.');
  if (!products) errors.push('config/products.js is missing the `products` export.');

  if (errors.length) {
    throw new Error('Config validation failed:\n' + errors.join('\n'));
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('`products` must be a non-empty array.');
  }

  // Required fields per product
  const required = ['id', 'slug', 'name', 'price'];
  const seen = {};
  products.forEach((p, i) => {
    const label = `products[${i}] (id: "${p.id || '?'}", slug: "${p.slug || '?'}")`;
    required.forEach(field => {
      if (p[field] == null || p[field] === '') {
        errors.push(`${label} is missing required field: "${field}".`);
      }
    });
    // Slug duplicate check
    if (p.slug) {
      if (seen[p.slug]) {
        errors.push(`Duplicate slug "${p.slug}" found in ${label} and products[${seen[p.slug]}].`);
      } else {
        seen[p.slug] = i;
      }
    }
  });

  if (errors.length) {
    throw new Error('Config validation failed:\n' + errors.join('\n'));
  }
}

// ════════════════════════════════════════════════════════════
// ASSET COPY HELPER
// ════════════════════════════════════════════════════════════

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// ════════════════════════════════════════════════════════════
// CATALOG INDEX RENDERER
// ════════════════════════════════════════════════════════════

function renderCatalogIndex(products, site) {
  const currency   = site.currency || '₫';
  const imgBaseDir = site.imageBaseDir || 'assets/products';

  const cards = products.map(p => {
    const thumb = p.thumb || (Array.isArray(p.images) && p.images[0]) || '';
    const pct   = discountPct(p.price, p.originalPrice);
    const discountTag = pct > 0
      ? `<span class="badge" style="position:static;display:inline-block;margin-top:4px;">-${pct}%</span>`
      : '';
    return `  <a class="catalog-card" href="${esc(p.slug)}.html" aria-label="${esc(p.name)}">
    <div class="catalog-card-img-wrap">
      <img src="${esc(`${imgBaseDir}/${thumb}`)}" alt="${esc(p.name)}" loading="lazy">
    </div>
    <div class="catalog-card-body">
      <div class="catalog-card-name">${esc(p.name)}</div>
      <div class="catalog-card-price">${formatPrice(p.price)}${esc(currency)}</div>
      ${p.originalPrice ? `<div class="catalog-card-orig">${formatPrice(p.originalPrice)}${esc(currency)}</div>` : ''}
      ${discountTag}
      <span class="catalog-card-cta">Xem ngay</span>
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
  <div class="page-wrapper">
    <header class="catalog-header">
      <h1>${esc(site.brand)}</h1>
      <p>Danh mục sản phẩm – ${products.length} sản phẩm</p>
    </header>
    <main class="catalog-grid">
${cards}
    </main>
    <footer class="catalog-footer">
      <div>${esc(site.brand)}</div>
      <div>© ${new Date().getFullYear()} ${esc(site.brand)}. Bảo lưu mọi quyền.</div>
    </footer>
  </div>
</body>
</html>`;
}

// ════════════════════════════════════════════════════════════
// PAGE ASSEMBLER
// ════════════════════════════════════════════════════════════

function assemblePage(product, allProducts, site, tracking, templateHtml, sellerShelf) {
  const currency   = site.currency || '₫';
  const imgBaseDir = site.imageBaseDir || 'assets/products';

  // Other products for shelf and grid (exclude current)
  const otherProducts = allProducts.filter(p => p.id !== product.id);

  // Render all 12 sections
  const sectionTopNav        = renderTopNav(imgBaseDir);
  const sectionHeroCarousel  = renderHeroCarousel(product, imgBaseDir);
  const sectionPriceTitle    = renderPriceTitle(product, currency, site);
  const sectionSelectOptions = renderSelectOptionsRow(product, imgBaseDir, currency);
  const sectionReviews       = renderReviews(product, imgBaseDir);
  const sectionAbout         = renderAbout(product, imgBaseDir);
  const sectionHashtags      = renderHashtags(product);
  const sectionSellerShelf   = renderSellerShelf(product, otherProducts, imgBaseDir, currency, sellerShelf);
  // TẠM ẨN "You may also like" — bật lại bằng cách đổi về:
  // const sectionAlsoLike   = renderAlsoLike(otherProducts, imgBaseDir, currency);
  const sectionAlsoLike      = '';
  const sectionBreadcrumb    = renderBreadcrumb(product, site);
  const sectionFooter        = renderFooter(site);
  const sectionStickyCta     = renderStickyCta(product, currency);
  // Section 13: checkout sheets (portalled, rendered outside .page-wrapper)
  const productWithImgDir    = Object.assign({}, product, { _imgBaseDir: imgBaseDir });
  const sectionCheckout      = renderCheckoutSheet(productWithImgDir, currency) + '\n' + renderAddressSheet();

  // Build tracking snippets
  const trackingHead         = buildTrackingHead(tracking);
  const trackingBodyNoscript = buildTrackingBodyNoscript(tracking);

  // LCP preload for first hero image
  const firstImage = (Array.isArray(product.images) && product.images[0]) || product.thumb || '';
  const preloadLcp = firstImage
    ? `<link rel="preload" as="image" href="${esc(`${imgBaseDir}/${firstImage}`)}" fetchpriority="high">`
    : '';

  // Product JSON for client-side tracking (safe serialization: escape </)
  const productJsonRaw = JSON.stringify({
    id:       product.id,
    name:     product.name,
    price:    product.price,
    currency: currency,
    slug:     product.slug,
  }).replace(/<\//g, '<\\/');

  // Substitute template tokens
  let html = templateHtml;
  html = html.replace('{{PAGE_TITLE}}',       esc(product.name) + ' – ' + esc(site.brand));
  html = html.replace('{{META_DESCRIPTION}}', esc(product.shortDesc || product.name));
  html = html.replace('{{OG_TITLE}}',         esc(product.name));
  html = html.replace('{{OG_DESCRIPTION}}',   esc(product.shortDesc || ''));
  const ogImg = product.thumb || (Array.isArray(product.images) && product.images[0]) || '';
  html = html.replace('{{OG_IMAGE}}',         esc(`${imgBaseDir}/${ogImg}`));
  html = html.replace('{{PRODUCT_JSON}}',     productJsonRaw);
  html = html.replace('{{PRELOAD_LCP}}',      preloadLcp);

  // Section substitution (12 sections)
  html = html.replace('<!-- SECTION_TOP_NAV -->',       sectionTopNav);
  html = html.replace('<!-- SECTION_HERO_CAROUSEL -->', sectionHeroCarousel);
  html = html.replace('<!-- SECTION_PRICE_TITLE -->',   sectionPriceTitle);
  html = html.replace('<!-- SECTION_SELECT_OPTIONS -->', sectionSelectOptions);
  html = html.replace('<!-- SECTION_REVIEWS -->',       sectionReviews);
  html = html.replace('<!-- SECTION_ABOUT -->',         sectionAbout);
  html = html.replace('<!-- SECTION_HASHTAGS -->',      sectionHashtags);
  html = html.replace('<!-- SECTION_SELLER_SHELF -->', sectionSellerShelf);
  html = html.replace('<!-- SECTION_ALSO_LIKE -->',    sectionAlsoLike);
  html = html.replace('<!-- SECTION_BREADCRUMB -->',   sectionBreadcrumb);
  html = html.replace('<!-- SECTION_FOOTER -->',       sectionFooter);
  html = html.replace('<!-- SECTION_STICKY_CTA -->',   sectionStickyCta);
  html = html.replace('<!-- SECTION_CHECKOUT -->',      sectionCheckout);

  // Tracking injection
  html = html.replace('<!-- TRACKING_HEAD -->',          trackingHead);
  html = html.replace('<!-- TRACKING_BODY_NOSCRIPT -->', trackingBodyNoscript);

  return html;
}

// ════════════════════════════════════════════════════════════
// MAIN BUILD ENTRY POINT
// ════════════════════════════════════════════════════════════

async function build() {
  console.log('Building TikTok Shop landing pages…\n');

  // ── Load config via pathToFileURL (Windows-safe ESM import) ──
  const configUrl = pathToFileURL(CONFIG).href;
  let site, tracking, products, sellerShelf;
  try {
    const config = await import(configUrl);
    site        = config.site;
    tracking    = config.tracking;
    products    = config.products;
    sellerShelf = config.sellerShelf;
  } catch (err) {
    console.error('Failed to import config:', err.message);
    process.exit(1);
  }

  // ── Validate config ──
  try {
    validateConfig(site, tracking, products);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // ── Read template ──
  let templateHtml;
  try {
    templateHtml = fs.readFileSync(TEMPLATE, 'utf8');
  } catch (err) {
    console.error('Cannot read template:', err.message);
    process.exit(1);
  }

  // ── Prepare dist directory ──
  fs.mkdirSync(DIST, { recursive: true });

  // ── Copy assets ──
  console.log('Copying assets…');
  fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(DIST, 'styles.css'));
  fs.copyFileSync(path.join(SRC, 'main.js'), path.join(DIST, 'main.js'));
  if (fs.existsSync(ASSETS)) {
    copyRecursive(ASSETS, path.join(DIST, 'assets'));
  }

  // ── Generate per-product pages ──
  const generatedFiles = [];
  for (const product of products) {
    const html     = assemblePage(product, products, site, tracking, templateHtml, sellerShelf);
    const outFile  = path.join(DIST, `${product.slug}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    generatedFiles.push(`${product.slug}.html`);
    console.log(`  ✓ dist/${product.slug}.html`);
  }

  // ── Generate catalog index ──
  const indexHtml  = renderCatalogIndex(products, site);
  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml, 'utf8');
  console.log('  ✓ dist/index.html');

  console.log(`\nBuild complete. ${generatedFiles.length} product pages + index.html generated in dist/\n`);
}

build().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
