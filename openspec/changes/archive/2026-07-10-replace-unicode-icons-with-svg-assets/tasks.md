## 1. Copy real assets from des-refer

- [x] 1.1 Copy `des-refer/assets/tts_logo_dark.1470472f.png` → `assets/products/tts-logo.png`
- [x] 1.2 Copy `des-refer/assets/app_store_download.01930187.png` → `assets/products/badge-app-store.png`
- [x] 1.3 Copy `des-refer/assets/google_play_download.4bb1256b.png` → `assets/products/badge-google-play.png`
- [x] 1.4 Copy `des-refer/assets/flash_sale_dark.png~tplv-o3syd03w52-resize-png_800_800.png` → `assets/products/flash-sale-badge.png`
- [x] 1.5 Delete old placeholder `assets/products/badge-app-store.svg` and `assets/products/badge-google-play.svg` ← (verify: old SVGs gone, new PNGs present)

## 2. Update config

- [x] 2.1 In `config/products.js`, change `appBadges.googlePlay` from `'badge-google-play.svg'` to `'badge-google-play.png'` and `appBadges.appStore` from `'badge-app-store.svg'` to `'badge-app-store.png'`

## 3. Add icon helper functions to build.js

- [x] 3.1 Add `iconArrowLeft()` returning inline SVG (24x24, fill currentColor, aria-hidden)
- [x] 3.2 Add `iconSearch()` returning inline SVG
- [x] 3.3 Add `iconPerson()` returning inline SVG
- [x] 3.4 Add `iconChevronRight()` returning inline SVG
- [x] 3.5 Add `iconChevronDown()` returning inline SVG
- [x] 3.6 Add `iconStar()` returning inline SVG (filled, uses var(--star-gold) fill)
- [x] 3.7 Add `iconStarEmpty()` returning inline SVG (stroke only, no fill)
- [x] 3.8 Add `iconCheck()` returning inline SVG
- [x] 3.9 Add `iconTruck()` returning inline SVG
- [x] 3.10 Add `iconGift()` returning inline SVG ← (verify: all 10 icon functions defined, each returns valid SVG with correct attributes)

## 4. Replace icons in renderers

- [x] 4.1 `renderTopNav()`: replace `&#8592;` with `iconArrowLeft()`, text "TikTok Shop" with `<img src="${imgBaseDir}/tts-logo.png" alt="TikTok Shop" class="nav-logo-img">`, `&#128269;` with `iconSearch()`, `&#128100;` with `iconPerson()`
- [x] 4.2 `renderPriceTitle()`: replace `&#8250;` seller chevron with `iconChevronRight()`
- [x] 4.3 `renderSelectOptionsRow()`: replace `&#8250;` with `iconChevronRight()`
- [x] 4.4 Rewrite `goldStars(count)` to return SVG stars: filled stars use `iconStar()`, empty use `iconStarEmpty()`
- [x] 4.5 `renderReviews()`: replace `&#10003;` verified check with `iconCheck()`; update breakdown star labels from `★` text to `iconStar()`
- [x] 4.6 `renderAbout()`: replace `&#8964;` with `iconChevronDown()`
- [x] 4.7 `renderSellerShelf()`: replace `★` with `iconStar()`; replace text Flash Sale badge div with `<img src="${imgBaseDir}/flash-sale-badge.png" alt="Flash Sale" class="shelf-flash-badge-img">`
- [x] 4.8 `renderAlsoLike()`: replace `★` with `iconStar()`
- [x] 4.9 `renderFooter()`: replace `&#8964;` accordion chevrons with `iconChevronDown()`, `&#128666;` with `iconTruck()`, `&#127873;` with `iconGift()` ← (verify: zero `&#` entities remain in build output; all sections use inline SVG or real img assets)

## 5. CSS adjustments for SVG icons

- [x] 5.1 Add `.nav-logo-img` style (height constraint, vertical-align) to `src/styles.css`
- [x] 5.2 Add `.shelf-flash-badge-img` style (sizing to match badge overlay) to `src/styles.css`
- [x] 5.3 Ensure inline SVG icons inherit size from font-size context (verify `width: 1em; height: 1em` works in nav, price, footer contexts)

## 6. Build and verify

- [x] 6.1 Run `npm run build`; confirm all 6 product pages + index.html generate without errors
- [x] 6.2 Verify `dist/assets/products/` contains tts-logo.png, badge-app-store.png, badge-google-play.png, flash-sale-badge.png
- [x] 6.3 Grep dist output for remaining `&#` entities — confirm zero unicode icon entities remain ← (verify: build succeeds, all new assets in dist, no unicode icon entities in HTML output, no broken image refs)
