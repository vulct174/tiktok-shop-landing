## Why

The landing page mimics a TikTok Shop product page but stops at the "Buy now" button — tapping it does nothing. The 9 analyzed TikTok mobile screenshots show a full purchase flow (Order summary → Add address → Payment method). To make the landing page a faithful, demo-complete clone (and to exercise the same conversion patterns), "Buy now" should open a realistic mock checkout bottom-sheet flow. This is a front-end demo only — no backend, no real payment.

## What Changes

- Add a **mock Order-summary bottom sheet** opened by the sticky "Buy now" button: address card, product line with quantity stepper, discount + totals breakdown, payment-method radio list (COD default), and a sticky "Place order" footer.
- Add a **mock Add-address sub-sheet** (opened from the order sheet's address card): Name, Phone (VN +84, validated), Address select, Current-location card, Address details, and a "Set as default" cyan toggle. Save is disabled until Name + valid Phone are present; on Save it populates the order sheet's address card.
- **Place order** (mock): shows an inline "Đặt hàng thành công" success confirmation and fires `trackEvent('Purchase', …)`. No real payment — clearly a demo.
- Reuse the existing bottom-sheet accessibility pattern from `initVariantModal()` (portal-to-body, backdrop, focus trap, ESC, `inert`) for both new sheets, with correct z-index stacking so the address sub-sheet layers above the order sheet.
- Confirm/complete UI token alignment to the reference: add CSS vars for deal-teal (`#12B0A0` on `#E7F7F5`), toggle-cyan (`#25C4CC`), reuse coupon-pink (`#FFF0F2`). Existing accent/text/bg/star tokens and the header + sticky-bar layout are already aligned and are kept.

## Capabilities

### New Capabilities
- `mock-checkout`: A front-end-only checkout demo — an Order-summary bottom sheet and an Add-address sub-sheet, with quantity control, price totals, address entry + validation, payment-method selection, and a simulated order-placement confirmation. No server interaction or payment processing.

### Modified Capabilities
<!-- No existing OpenSpec capability specs exist in this repo; nothing's spec-level behavior is being changed. -->

## Impact

- **Code**: `build.js` (new `renderCheckoutSheet()` + `renderAddressSheet()` render functions + section wiring), `src/template.html` (new `<!-- SECTION_CHECKOUT -->` placeholder), `src/main.js` (new IIFE controllers for both sheets + Place-order confirmation), `src/styles.css` (new checkout/address section blocks + missing tokens). Rebuild `dist/`.
- **Data**: `config/products.js` product content is unchanged (stays solar light). The sheets read the already-inlined `window.__PRODUCT__` / product render data.
- **Dependencies**: none added — vanilla JS, no framework, no test runner introduced.
- **Risk**: front-end only, low blast radius outside the four in-scope files; primary sensitivity is ensuring the flow is unmistakably a demo (no real payment implied) and that focus/keyboard accessibility matches the existing modal pattern.
