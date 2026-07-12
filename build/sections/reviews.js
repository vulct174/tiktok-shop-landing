import { esc, formatPrice, goldStars } from '../helpers.js';
import { iconStarSolid, iconChevronDown } from '../icons.js';

/**
 * renderReviews(product, imageBaseDir)
 * Section 5: aggregate score, breakdown bars, photo strip, filter tabs, review cards
 */
export function renderReviews(product, imageBaseDir) {
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
