## 1. Project scaffolding

- [x] 1.1 Create `package.json` with `"type": "module"`, `"scripts": { "build": "node build.js", "serve": "node build.js && npx --yes serve dist" }`, no runtime deps
- [x] 1.2 Create directory structure: `config/`, `src/`, `assets/products/`, ensure `dist/` is git-ignorable
- [x] 1.3 Add `.gitignore` for `dist/` and `node_modules/`
- [x] 1.4 Generate placeholder product images for products #2–6 into `assets/products/` (keep existing real `den-nlmt-2000w-cover.jpg`); ensure every image referenced by config exists ← (verify: no config image reference lacks a file)

## 2. Config file (product-config)

- [x] 2.1 Create `config/products.js` as ES module exporting `site`, `tracking`, `products`
- [x] 2.2 Populate `site` (brand, currency `₫`, hotline, imageBaseDir `assets/products`) and `tracking` (metaPixelId, tiktokPixelId, googleTagId, gtmId — all empty strings)
- [x] 2.3 Add 6 products with Vietnamese placeholder copy; product #1 = real "Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W - 308 LED" using `den-nlmt-2000w-cover.jpg`
- [x] 2.4 Populate each product's full schema: id, slug, name, price, originalPrice, rating, sold, shortDesc, description, images, thumb, gallery, variants{color,size}, badges, usp, relatedIds ← (verify: schema matches product-config spec; relatedIds set so exclusion logic is exercised)

## 3. Design system (product-page-ui)

- [x] 3.1 Create `src/styles.css` with CSS variables for palette (bg `#f0f0f0`, surface `#fff`, accent `#f01848`, dark `#181818`), mobile-first, max-width ~430px centered
- [x] 3.2 Style all 7 sections: hero gallery, title+price, variant selector, dark USP, detail description, related grid, footer + sticky CTA bar
- [x] 3.3 Reserve body bottom padding equal to sticky CTA height so last content is not hidden ← (verify: sticky CTA does not overlap content; palette matches design)

## 4. Page template (product-page-ui)

- [x] 4.1 Create `src/template.html` skeleton with `<head>` token slots (title, meta, tracking-head) and 7 marked section regions + tracking-body slot
- [x] 4.2 Ensure template links `styles.css` and `main.js` via relative paths and sets viewport meta for mobile ← (verify: all 7 sections present and ordered in template)

## 5. Client interactivity (product-page-ui + ad-tracking)

- [x] 5.1 Create `src/main.js`: hero gallery thumbnail → main image switch
- [x] 5.2 Variant chip selection (single active per group) + quantity stepper (min 1)
- [x] 5.3 Implement `trackEvent(name, params)` fan-out to fbq / ttq / dataLayer(gtag), each guarded by typeof check
- [x] 5.4 Wire sticky "Mua ngay" CTA + add-to-cart via `data-*` attributes to fire InitiateCheckout / AddToCart; fire ViewContent once on load ← (verify: single trackEvent call fans out to all present providers, missing globals skipped safely)

## 6. Build script (landing-page-generator + ad-tracking)

- [x] 6.1 Create `build.js` importing config via `pathToFileURL` (Windows-safe ESM import)
- [x] 6.2 Validate config: three exports present; each product has required fields; detect duplicate slugs → fail with clear errors
- [x] 6.3 Section renderers: pure functions returning HTML strings for gallery, price (with derived discount %), variants, USP, detail, related
- [x] 6.4 Related-products resolver: use relatedIds or all-products default, filter out current product id, drop unknown ids ← (verify: current product never appears in its own related grid; empty relatedIds → all others; unknown id ignored)
- [x] 6.5 Tracking injection: per-provider snippet with ID placeholder, injected only for non-empty IDs; GTM noscript after `<body>` ← (verify: empty IDs inject nothing; each configured provider injected once with correct ID)
- [x] 6.6 Render each product into `dist/<slug>.html` from template; generate `dist/index.html` catalog
- [x] 6.7 Copy `styles.css`, `main.js`, and `assets/` into `dist/` with correct relative references ← (verify: served dist/ pages load CSS/JS/images with no 404s)

## 7. Build, run, and verify output

- [x] 7.1 Run `npm run build`; confirm 6 `dist/<slug>.html` files + `dist/index.html` are generated with no errors
- [x] 7.2 Manually inspect a generated page: all 7 sections render, prices/discount correct, related grid excludes self
- [x] 7.3 Confirm rebuild is idempotent and pages contain no framework runtime code ← (verify: end-to-end build produces working, self-contained dist/ matching all specs)
