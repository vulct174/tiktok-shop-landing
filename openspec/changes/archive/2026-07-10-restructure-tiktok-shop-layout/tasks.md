## 1. Config schema extensions

- [x] 1.1 Add site-level `sellerName` default, `appBadges` (googlePlay/appStore refs), and `footerGroups` (accordion groups + links) to `config/products.js`
- [x] 1.2 Add site-level default `breadcrumb` trail
- [x] 1.3 Add per-product optional fields: `reviews`, `hashtags`, `breadcrumb`, `sellerName` (leave #2–6 minimal/placeholder)
- [x] 1.4 Seed Product #1 real reviews: average 4.8, total 10, breakdown {5:8,4:2,3:0,2:0,1:0}, 3 review items (N**n T**n / p**m h**h h** / w**9), photos reuse existing detail images; add hashtags + breadcrumb + sellerName "Năng Lượng Xanh" ← (verify: schema matches commerce-content-config spec; #1 has real review seed; #2–6 still valid)

## 2. Design tokens (styles.css)

- [x] 2.1 Add/confirm CSS variables: accent #f01848, accent-hover #c9123a, accent-light #fff0f3, bg #f0f0f0, surface #fff, text-primary #1a1a1a, text-secondary #666, text-muted-safe #767676, star-gold #f5a623, verified-blue #1976d2, badge-flash #ff4500, badge-vn (#e8f5e9/#2e7d32), border #e8e8e8
- [x] 2.2 Add radius scale (pill 999px, card 12px, sm 8px, xs 4px), shadow scale (card/nav/cta/modal), spacing scale, z-index (nav 200, backdrop 299, modal 300), system font stack
- [x] 2.3 Remove old standalone dark USP section styles ← (verify: no USP section styles remain; strikethrough uses #767676)

## 3. Template restructure (template.html)

- [x] 3.1 Rewrite `src/template.html` skeleton with token slots for all 12 sections + head slots (preload LCP image, tracking-head, meta) + tracking-body slot
- [x] 3.2 Add `<link rel=preload as=image fetchpriority=high>` slot for first hero image; viewport meta; defer main.js ← (verify: 12 section slots present in order; first hero preloaded; main.js deferred)

## 4. Build renderers (build.js)

- [x] 4.1 renderTopNav (back, logo, search pill pink placeholder, profile)
- [x] 4.2 renderHeroCarousel (scroll-snap slides, N/total counter, dots; first img not lazy, rest lazy; badges overlay; single-image hides controls)
- [x] 4.3 renderPriceTitle (discount pill, accent sale price, strikethrough #767676, uppercase name, seller line, rating row; price before name)
- [x] 4.4 renderSelectOptionsRow + renderVariantModal (drag indicator, thumb+price header, close, Màu sắc chips, qty stepper min 1, add-to-cart + buy-now)
- [x] 4.5 renderReviews (aggregate score, breakdown bars from config, photo strip, filter tabs, review cards with verified/region/stars/text/photo/item/date; empty state if no reviews)
- [x] 4.6 renderAbout (collapsible chevron, description HTML raw, detail images) — replaces old detail section
- [x] 4.7 renderHashtags (chips from config)
- [x] 4.8 renderSellerShelf (horizontal-scroll cards from other products; flash-sale badge/optional timer; excludes current) ← (verify: current product excluded from shelf)
- [x] 4.9 renderAlsoLike (2-column grid from other products; 2-line clamped name; badge; rating/sold; price+strikethrough; excludes current) ← (verify: current product excluded; 2-column)
- [x] 4.10 renderBreadcrumb (per-product or site default) + renderFooter (accordion groups, free-shipping row, app badges) + renderStickyCta ("Buy now", tracking data-*)
- [x] 4.11 Remove old USP renderer; ignore legacy `usp` field; wire all 12 renderers into template substitution in correct order ← (verify: all 12 sections emitted in order; no USP section; legacy usp ignored without error)
- [x] 4.12 Ensure esc() applied to all text-context config values; description stays raw HTML; JSON-in-script safe (escape </) ← (verify: no unescaped injection; window.__PRODUCT__ safe)

## 5. Client interactivity (main.js)

- [x] 5.1 Carousel: debounced scroll → update counter + active dot; hide controls when single image
- [x] 5.2 Select-options modal: open/close (button + backdrop + ESC), slide-up, focus trap, move focus in on open + restore on close, background inert/aria-hidden, qty stepper min 1
- [x] 5.3 Review filter tabs: single active, accent style, filter the visible review list
- [x] 5.4 Collapsible About: toggle + aria-expanded
- [x] 5.5 Accordion footer: independent group toggle + aria-expanded
- [x] 5.6 Sticky nav shadow-on-scroll; trackEvent() unchanged; Buy-now (sticky + modal) fire InitiateCheckout with product payload, guarded per provider ← (verify: modal focus trap + all close paths work; tabs/collapsible/accordion toggle; buy-now fires events; missing globals skipped)

## 6. Build, run, verify

- [x] 6.1 Run `npm run build`; confirm 6 `dist/<slug>.html` + `dist/index.html` generated, no errors; no 404 image refs (incl. app badges + review photos)
- [x] 6.2 Spot-check Product #1 page: all 12 sections in order, carousel counter/dots, price anchoring, reviews from config, seller shelf + also-like exclude self, footer accordion, sticky Buy now
- [x] 6.3 Confirm idempotent rebuild; products #2–6 still valid; des-refer untouched; no framework runtime in output ← (verify: end-to-end build matches all three specs; 12 sections work; exclusions correct; a11y attributes present)
