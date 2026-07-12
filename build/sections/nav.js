import { iconSearch } from '../icons.js';

/**
 * renderTopNav()
 * Section 1: sticky top bar
 */
export function renderTopNav(imgBaseDir) {
  return `<nav class="top-nav" aria-label="Điều hướng chính">
  <div class="nav-left-group">
    <img src="${imgBaseDir}/tts-logo-light.png" alt="TikTok Shop Vietnam" class="nav-logo-img">
  </div>
  <div class="nav-search" role="search" aria-label="Tìm kiếm sản phẩm">
    <span class="nav-search-icon" aria-hidden="true">${iconSearch()}</span>
    <span class="nav-search-placeholder">Tìm kiếm</span>
  </div>
</nav>`;
}
