## Why

The current landing page (from the archived `build-tiktok-shop-landing`) was built from color/band inference before the real designs were viewable. Now that 7 real TikTok Shop screenshots are available, the actual page layout is confirmed to differ substantially: it has 12 sections (sticky nav, swipe carousel, a bottom-sheet variant modal, a full customer-reviews block, collapsible about, hashtags, a seller shelf, a 2-column "you may also like" grid, breadcrumb, and an accordion footer), and it has NO standalone dark USP section. Since this is a paid-ads landing page, faithfully matching the high-converting TikTok Shop pattern (social proof placement, price anchoring, thumb-reachable sticky CTA) directly affects ad quality score and ROAS. The palette we inferred was correct; the structure was not.

## What Changes

- **BREAKING (UI structure)**: Replace the generic 7-section product page with the real **12-section TikTok Shop layout**. The old standalone dark USP section is **removed** (its content is baked into hero images).
- Add a **sticky top navigation** (back, TikTok Shop logo, Search pill, profile), with shadow-on-scroll.
- Convert the hero to a **horizontal swipe carousel** (CSS scroll-snap) with an "N/9" counter and dot pagination; preload the first image for LCP, lazy-load the rest. (Replaces main-image + thumbnail-strip.)
- Keep the **price+title block** but reorder so price leads; use contrast-safe strikethrough color and real price/seller/rating data.
- Convert variant selection to a **"Select options" row → bottom-sheet modal** (drag indicator, thumb + price header, variant chips, quantity stepper, add-to-cart + buy-now buttons) with full a11y (focus trap, ESC, aria-modal, inert background).
- Add a **customer reviews** block: aggregate score, 5→1 star breakdown bars, review photo strip, filter tabs, and review cards — data-driven from config, seeded with 3 real reviews.
- Add a **collapsible "About this product"** section (chevron, aria-expanded) with description HTML + detail images.
- Add **hashtags**, an **"Explore more from {seller}"** horizontal card shelf, and a **"You may also like"** 2-column grid — both sourced from other products, excluding the current product.
- Add a **breadcrumb** and an **accordion footer** (Shop/Sell/About/Customer support/Legal + free-shipping row + Google Play / App Store badges).
- Rename the sticky CTA label from "Mua ngay" to **"Buy now"** to match the reference.
- Extend `config/products.js` with new fields: per-product `reviews`, `hashtags`, `breadcrumb`, `sellerName`; site-level `appBadges`, `footerGroups`, default `sellerName`. The old `usp` field is no longer rendered.
- Apply the **ui-ux-pro-max design tokens** (accent `#f01848`, contrast-safe muted `#767676`, star gold, badge colors, radius/shadow scales, system font stack) and **accessibility** + **performance** guidance (preload LCP image, lazy-load below-fold, defer JS, zero web fonts, ≥44px tap targets).

## Capabilities

### New Capabilities
- `tiktok-shop-page-layout`: The 12-section mobile page structure, section order, and per-section layout/content mapping that faithfully clones the real TikTok Shop product page.
- `interactive-components`: Client-side behaviors — hero swipe carousel (counter + dots), Select-options bottom-sheet modal (focus trap, ESC, backdrop), review filter tabs, collapsible about, accordion footer — with their states and accessibility.
- `commerce-content-config`: Config schema extensions (reviews, hashtags, breadcrumb, sellerName, appBadges, footerGroups) and the data-sourcing rules for reviews, seller shelf, and "you may also like" (excluding the current product).

### Modified Capabilities
<!-- The prior change is archived; this change introduces new capabilities rather than editing existing spec files in openspec/specs. UI structure change is captured under the new capabilities above. -->

## Impact

- **Files**: `src/template.html` (full restructure), `src/styles.css` (new tokens + 12-section styles), `src/main.js` (carousel, modal, tabs, collapsible, accordion), `build.js` (new section renderers + config fields + data sourcing), `config/products.js` (schema additions + review seed for product #1).
- **Assets**: may add `assets/products/` references for app-store/Google-Play badges and reuse existing detail images as review photo placeholders. `des-refer/` remains read-only reference.
- **Data**: products #2–6 stay placeholder but become the data source for the seller shelf and "you may also like" grid.
- **Dependencies**: none new — still zero browser runtime deps, Node built-ins only.
- **External systems**: tracking (Meta/TikTok/GA4/GTM) unchanged; CTA + modal buy-now fire standard e-commerce events.
