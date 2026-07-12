import { esc } from '../helpers.js';
import { iconChevronDown, iconTruck, iconGift } from '../icons.js';

/**
 * renderFooter(site)
 * Section 11: accordion groups + perks + app badges
 */
export function renderFooter(site) {
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
