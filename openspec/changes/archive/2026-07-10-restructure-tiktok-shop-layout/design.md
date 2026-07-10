## Context

The prior build (`build-tiktok-shop-landing`, archived) was created before the reference images could be rendered — it was inferred from color-band analysis. It got the palette right (`#f01848` accent, `#f0f0f0` bg, white cards, gold stars) but the structure wrong (generic 7 sections, main+thumbnail hero, inline variant chips, a standalone dark USP section that does not exist in the real design). The user then supplied 7 real TikTok Shop screenshots, and a ui-ux-pro-max design report produced concrete tokens, per-section specs, accessibility rules, and conversion notes. This change restructures the UI to the real 12-section layout for a paid-ads landing page. Stack is unchanged: vanilla HTML/CSS/JS + Node `build.js` static generator, mobile-first ~430px.

## Goals / Non-Goals

**Goals:**
- Faithful 12-section clone of the real TikTok Shop product page (order + per-section content).
- Interactive: swipe carousel (counter/dots), Select-options bottom-sheet modal (focus trap/ESC/backdrop), review filter tabs, collapsible about, accordion footer.
- Data-driven reviews / hashtags / breadcrumb / seller shelf / you-may-also-like from config, always excluding the current product where relevant.
- Apply ui-ux-pro-max tokens + a11y (≥44px targets, aria) + performance (preload LCP, lazy below-fold, defer JS, zero web fonts).
- Keep the real product #1 data (images, price, seller, rating) intact.

**Non-Goals:**
- No cart/checkout backend, no real search (Search pill is a static/nav element).
- No functional flash-sale timer backend — countdown is a display element (static or JS-decremented from a config end-time; if no time given, show a static "Flash sale" badge).
- No pixel-perfect font match — system font stack for speed.
- Products #2–6 stay placeholder content (only used as shelf/grid data sources).
- No framework, no TypeScript, no web fonts.

## Decisions

**D1 — Carousel via CSS scroll-snap, JS only for counter/dots.**
Native touch swipe with `scroll-snap-type: x mandatory` needs zero JS for the gesture; a debounced `scroll` listener syncs the "N/total" counter and active dot. Alternative (JS-driven transform slider) rejected: heavier, worse for performance and accessibility. No autorotate (WCAG 2.2.2 + conversion focus).

**D2 — Variant selection as a bottom-sheet modal.**
Matches the real design's "Select options → sheet" pattern. Modal: `role="dialog" aria-modal="true"`, focus trap, ESC + backdrop close, background `inert`/`aria-hidden`, slide-up transition. z-index: backdrop 299, panel 300, nav 200. Replaces the old inline chips.

**D3 — Section renderers stay pure functions in build.js.**
Each of the 12 sections is a pure `render*()` returning an HTML string, substituted into `src/template.html` tokens. Keeps sections independently testable and avoids stubs. New renderers: nav, carousel, priceTitle, selectOptionsRow+modal, reviews, about (collapsible), hashtags, sellerShelf, alsoLike, breadcrumb, footer, stickyCta.

**D4 — Config schema extensions, backward tolerant.**
Add optional `reviews`, `hashtags`, `breadcrumb`, `sellerName` per product; site-level `appBadges`, `footerGroups`, default `sellerName`. Missing optional fields degrade gracefully (empty/absent state, no error). Legacy `usp` is ignored (no longer rendered). Escape all text-context values via the existing `esc()`; `description` remains intentional raw HTML.

**D5 — Data sourcing with current-product exclusion.**
Seller shelf and you-may-also-like both derive from `products.filter(p => p.id !== current.id)`. This reuses the proven related-exclusion logic. Seller shelf = horizontal scroll; also-like = 2-column grid.

**D6 — Review photos reuse existing detail images as placeholders.**
No new review images available; seed review `photos`/item `photo` with existing `den-nlmt-2000w-detail-*` files so nothing 404s. Clearly a placeholder for real UGC later.

**D7 — Performance budget for ads LP.**
Preload first hero slide (`<link rel=preload as=image fetchpriority=high>`); first slide not lazy, all other images `loading="lazy"`. Keep WebP. `main.js` loaded with `defer`. System font stack only. Minimal CSS transitions (transform/opacity) for carousel/modal/accordion.

**D8 — Contrast-safe muted color.**
Strikethrough original price and small muted text use `#767676` (≥4.5:1 on white) instead of `#999999` (fails AA at 14px), per the design report's contrast audit.

## Risks / Trade-offs

- **[Focus trap complexity]** → implement a small, well-tested trap (query focusable elements, wrap Tab/Shift-Tab, restore focus on close). Verify open/close/ESC/backdrop paths.
- **[scroll-snap counter jitter on fast swipe]** → debounce the scroll handler (~100ms) and compute active index from `scrollLeft / slideWidth` rounded.
- **[Windows ESM config import]** → keep `pathToFileURL` import in build.js (already in place).
- **[Placeholder review photos look like the product, not UGC]** → acceptable, labeled; real photos are a later content edit.
- **[Flash-sale timer without backend]** → display-only; if `flashSaleEndsAt` absent, render static badge. No fake countdown that resets on reload unless a config end-time is provided.
- **[Sticky nav + sticky CTA both fixed]** → reserve top offset for content under nav and bottom padding equal to CTA height; test no overlap at the top hero and bottom footer.
- **[Large restructure blast radius]** → template/styles/main.js/build.js all change together; verify the full build end-to-end and spot-check the generated product #1 page for all 12 sections.

## Migration Plan

Greenfield-style UI replacement (no data migration). Deploy = serve regenerated `dist/`. Rollback = redeploy previous `dist/`. Product data and images are preserved; only presentation + config schema grow (additive, backward tolerant).

## Open Questions

- Flash-sale countdown: static badge vs config-driven end-time. Default to static badge unless a `flashSaleEndsAt` is present in config (decided: display-only, no backend).
