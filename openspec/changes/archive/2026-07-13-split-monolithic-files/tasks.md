## 1. Snapshot pre-refactor dist output

- [x] 1.1 Run `node build.js` and save dist/main.js, dist/styles.css, and one HTML file as reference copies for byte comparison

## 2. Split src/styles.css into src/css/ modules

- [x] 2.1 Create `src/css/` directory
- [x] 2.2 Extract lines 1-107 (variables + reset + base) → `src/css/00-variables.css`
- [x] 2.3 Extract lines 108-205 (Section 1 – Nav) → `src/css/01-nav.css`
- [x] 2.4 Extract lines 206-365 (Section 2 – Carousel) → `src/css/02-carousel.css`
- [x] 2.5 Extract lines 366-488 (Section 3 – Price) → `src/css/03-price.css`
- [x] 2.6 Extract lines 489-820 (Section 4 – Variant) → `src/css/04-variant.css`
- [x] 2.7 Extract lines 821-1426 (Section 5 – Reviews) → `src/css/05-reviews.css`
- [x] 2.8 Extract lines 1427-1528 (Section 6 – About) → `src/css/06-about.css`
- [x] 2.9 Extract lines 1529-1552 (Section 7 – Hashtags) → `src/css/07-hashtags.css`
- [x] 2.10 Extract lines 1553-1729 (Section 8 – Shelf) → `src/css/08-shelf.css`
- [x] 2.11 Extract lines 1730-1892 (Section 9 – Also Like) → `src/css/09-also-like.css`
- [x] 2.12 Extract lines 1893-1925 (Section 10 – Breadcrumb) → `src/css/10-breadcrumb.css`
- [x] 2.13 Extract lines 1926-2055 (Section 11 – Footer) → `src/css/11-footer.css`
- [x] 2.14 Extract lines 2056-2130 (Section 12 – Sticky CTA) → `src/css/12-sticky-cta.css`
- [x] 2.15 Extract lines 2131-2781 (Section 13 – Checkout) → `src/css/13-checkout.css`
- [x] 2.16 Extract lines 2782-2982 (Catalog index) → `src/css/14-catalog.css`
- [x] 2.17 Extract lines 2983-end (Responsive) → `src/css/15-responsive.css`
- [x] 2.18 Delete original `src/styles.css` ← (verify: all 16 css files exist with correct content, no overlap or gaps)

## 3. Split src/main.js into src/js/ modules

- [x] 3.1 Create `src/js/` directory
- [x] 3.2 Extract lines 1-21 (Section 1 – Nav scroll) → `src/js/01-nav-scroll.js`
- [x] 3.3 Extract lines 23-233 (Section 2 – Carousel) → `src/js/02-carousel.js`
- [x] 3.4 Extract lines 235-395 (Section 4 – Variant modal) → `src/js/04-variant-modal.js`
- [x] 3.5 Extract lines 397-975 (Section 13a – Checkout + order queue) → `src/js/13-checkout.js`
- [x] 3.6 Extract lines 977-1244 (Section 5+5b – Reviews) → `src/js/05-reviews.js`
- [x] 3.7 Extract lines 1247-1260 (Section 6 – About collapse) → `src/js/06-about-collapse.js`
- [x] 3.8 Extract lines 1262-1347 (Section 8 – Shelf scroll) → `src/js/08-shelf-scroll.js`
- [x] 3.9 Extract lines 1349-1368 (Section 11 – Footer accordion) → `src/js/11-footer-accordion.js`
- [x] 3.10 Extract lines 1370-1447 (Ad Tracking) → `src/js/14-tracking.js`
- [x] 3.11 Extract lines 1449-end (Admin Panel) → `src/js/15-admin.js`
- [x] 3.12 Delete original `src/main.js` ← (verify: all 10 js files exist, each is a self-contained IIFE, no dangling references)

## 4. Split build.js into build/ modules

- [x] 4.1 Create `build/` and `build/sections/` directories
- [x] 4.2 Extract helper functions (esc, formatPrice, discountPct, goldStars, copyRecursive, validateConfig) → `build/helpers.js` as named exports
- [x] 4.3 Extract all icon* functions → `build/icons.js` as named exports
- [x] 4.4 Extract renderTopNav → `build/sections/nav.js`
- [x] 4.5 Extract renderHeroCarousel → `build/sections/carousel.js`
- [x] 4.6 Extract renderPriceTitle → `build/sections/price.js`
- [x] 4.7 Extract renderSelectOptionsRow → `build/sections/variant.js`
- [x] 4.8 Extract renderReviews → `build/sections/reviews.js`
- [x] 4.9 Extract renderAbout → `build/sections/about.js`
- [x] 4.10 Extract renderHashtags → `build/sections/hashtags.js`
- [x] 4.11 Extract renderSellerShelf → `build/sections/seller-shelf.js`
- [x] 4.12 Extract renderAlsoLike → `build/sections/also-like.js`
- [x] 4.13 Extract renderBreadcrumb → `build/sections/breadcrumb.js`
- [x] 4.14 Extract renderFooter → `build/sections/footer.js`
- [x] 4.15 Extract renderCheckoutSheet (checkout icons + render function) → `build/sections/checkout.js`
- [x] 4.16 Extract renderCatalogIndex → `build/sections/catalog.js`
- [x] 4.17 Extract assemblePage → `build/assemble.js`
- [x] 4.18 Rewrite `build.js` as slim entry: imports from build/, concat logic, build orchestration ← (verify: build.js under 100 lines, all imports resolve correctly)

## 5. Update build process for concatenation

- [x] 5.1 Add concat helper: read src/js/*.js sorted numerically, join with newline → dist/main.js
- [x] 5.2 Add concat helper: read src/css/*.css sorted numerically, join with newline → dist/styles.css
- [x] 5.3 Add numeric-prefix sort function (parse leading digits, sort numerically, warn on non-prefixed files)

## 6. Verification

- [x] 6.1 Run `node build.js` — must succeed without errors
- [x] 6.2 Compare dist/main.js with pre-refactor snapshot — content must be equivalent
- [x] 6.3 Compare dist/styles.css with pre-refactor snapshot — content must be equivalent
- [x] 6.4 Compare generated HTML files with pre-refactor snapshot — must be byte-identical ← (verify: build succeeds, dist output matches pre-refactor, no missing sections)
