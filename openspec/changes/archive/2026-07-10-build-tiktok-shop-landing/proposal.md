## Why

The team needs a fast, conversion-optimized sales landing page (TikTok-Shop style) to run paid ads against. Ads traffic is unforgiving: slow pages and unreliable pixel firing directly hurt ad quality scores and conversion. There is no existing site — this builds it from the reference designs in `des-refer/`. A framework runtime would add unnecessary JS weight and hydration delays, so a static-output approach is chosen to maximize Core Web Vitals and guarantee tracking pixels fire on first paint.

## What Changes

- Introduce a **static landing-page generator**: a Node.js `build.js` reads a single config file and emits one static HTML file per product into `dist/`, plus a `dist/index.html` catalog.
- Introduce an **editable config file** (`config/products.js`, ES module) holding all product data, site settings, and tracking IDs — the only file a non-developer edits.
- Reconstruct the reference design as a **mobile-first product page with 7 sections**: hero gallery, title+price, variant selector, dark USP section, detail description, related products, footer + sticky CTA bar.
- Implement a **design system** (`src/styles.css`) matching the extracted palette: background `#f0f0f0`, accent/CTA `#f01848`, dark section `#181818`, mobile-first single column ~430px.
- Implement **client interactivity** (`src/main.js`): image gallery, variant chips, quantity stepper, sticky "Mua ngay" CTA, and a unified `trackEvent()` helper.
- Implement **config-driven ad tracking**: build-time injection of Meta Pixel, TikTok Pixel, GA4 (gtag), and GTM snippets — only for non-empty IDs — with standard e-commerce events (`AddToCart`, `InitiateCheckout`, `Purchase`) fired across all platforms.
- Implement **related-products logic** at build time: resolve each product's related list (or all products when unspecified) and **exclude the currently-viewed product**.
- Ship **6 products** with Vietnamese placeholder copy (product #1 uses the real fetched cover image and name); the user replaces content later via config.

## Capabilities

### New Capabilities
- `landing-page-generator`: The build pipeline that reads config and emits static per-product HTML pages plus an index, including template rendering and asset resolution.
- `product-config`: The config schema (`site`, `tracking`, `products`) contract, including validation, defaults, and the related-products exclusion rule.
- `product-page-ui`: The 7-section mobile-first product page, its design system, and client interactivity (gallery, variants, quantity, sticky CTA).
- `ad-tracking`: Config-driven injection of Meta/TikTok/GA4/GTM snippets and the unified standard-event firing on CTA interactions.

### Modified Capabilities
<!-- None — greenfield project, no existing specs. -->

## Impact

- **New files**: `config/products.js`, `src/template.html`, `src/styles.css`, `src/main.js`, `build.js`, `package.json`, generated `dist/**`.
- **Assets**: `assets/products/` (placeholders + existing real cover `den-nlmt-2000w-cover.jpg`).
- **Dependencies**: Node.js for the build step; **zero runtime dependencies** shipped to the browser. No framework.
- **External systems**: Meta Pixel, TikTok Pixel, Google Analytics/Ads, Google Tag Manager — all optional and off unless IDs are configured.
- **Reference**: `des-refer/` design mockups (read-only source of truth for layout/style).
