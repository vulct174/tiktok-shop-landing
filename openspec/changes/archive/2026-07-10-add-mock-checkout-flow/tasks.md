## 1. Design tokens & template wiring

- [x] 1.1 In `src/styles.css` `:root`, add any missing tokens: `--deal-teal: #12B0A0;`, `--deal-teal-bg: #E7F7F5;`, `--toggle-cyan: #25C4CC;` (reuse existing `--accent-light: #FFF0F2;` for discount rows). Add a new z-index tier for the stacked address sub-sheet (e.g. `--z-modal-2` above `--z-modal`).
- [x] 1.2 In `src/template.html`, add a new `<!-- SECTION_CHECKOUT -->` placeholder (after the sticky CTA placeholder, before closing `.page-wrapper` or just after it, consistent with modal portalling). ← (verify: placeholder exists and is replaced at build time)

## 2. Build-time markup (build.js)

- [x] 2.1 Add `renderCheckoutSheet(product, currency)` returning the Order-summary sheet HTML: header (close btn + title "Đơn hàng" + teal subtitle), shipping-address card (prompt state), product line (thumb + name + variant label + price + qty stepper reusing `.qty-btn`/`.qty-input` classes), seller-discount row, totals breakdown (Original price / coupons / bold Total), payment-method radio group (COD checked by default, TikTok PayLater, card), sticky footer (Total + "Place order" pill). Use `esc()` and `formatPrice()`. Include `data-*` attributes for unit price, original price, discount, id, name, currency so JS can compute totals and fire tracking.
- [x] 2.2 Add `renderAddressSheet()` returning the Add-address sub-sheet HTML: title "Add new address" + close, Name input (label + required), Phone field (VN +84 prefix + number input + inline error slot), Address "Select address" row, Current-location card + "Use current location" button, Address details textarea (optional), "Set as default" toggle (role=switch, aria-checked), Save button (disabled by default). All inputs have associated `<label>`s; payment/radio semantics correct.
- [x] 2.3 Wire both renderers into the build: call them in the page assembly and `html.replace('<!-- SECTION_CHECKOUT -->', ...)`. Ensure they render once per page. ← (verify: `npm run build` succeeds; generated dist HTML contains both sheets + backdrops)

## 3. Client behavior (src/main.js)

- [x] 3.1 Add `initCheckoutSheet()` IIFE mirroring `initVariantModal()`: portal sheet + backdrop to body, open on `.cta-buy-now` click, close on ESC/backdrop/close btn, focus trap, `inert` on `.page-wrapper`, restore focus, respect `prefers-reduced-motion`.
- [x] 3.2 Implement the quantity stepper in the order sheet (min 1, decrement disabled at 1) and recompute line total + footer Total from `data-*` price attributes on quantity change.
- [x] 3.3 Implement payment-method radio behavior (COD default; single selection). Ensure exactly one selected at all times.
- [x] 3.4 Add `initAddressSheet()` IIFE: open from the order sheet's address card, portal above the order sheet (`--z-modal-2`), inert BOTH `.page-wrapper` and the order sheet while open, focus trap, ESC/backdrop/close dismiss ONLY this sub-sheet, restore focus to the address card. ← (verify: stacked sheets — ESC closes only the top one, order sheet stays open)
- [x] 3.5 Implement address form validation: VN phone regex (9–10 digits after +84, starts 3/5/7/8/9); Save `disabled` unless name non-empty AND phone valid; inline phone error toggled on invalid; Set-as-default toggle flips `aria-checked`.
- [x] 3.6 On Save: close sub-sheet, replace the order sheet's address prompt with saved name/phone/address text. ← (verify: address card updates with entered values)
- [x] 3.7 Implement "Place order": show inline "Đặt hàng thành công" success state; if no address saved, show inline hint (allow-with-hint); fire `trackEvent('Purchase', { content_ids, content_name, value, currency, num_items })` with current quantity/value. No network/payment. ← (verify: success state shows, Purchase event fires with correct qty/value, no real payment path)

## 4. Styling (src/styles.css)

- [x] 4.1 Add a "SECTION 13 – Checkout Sheets" block: order sheet + address sub-sheet bottom-sheet styles (reuse `.variant-modal`/`.modal-backdrop` conventions), address card, product line, totals breakdown, payment rows, sticky place-order footer, teal subtitle, coupon-pink discount rows.
- [x] 4.2 Style the address form: labelled inputs on `#F5F5F5` fields, phone prefix, inline error text (accent red), Set-as-default toggle in `--toggle-cyan` (on) with visible off state, Save button disabled (faded pink) vs enabled (solid `--accent`).
- [x] 4.3 Ensure focus-visible outlines on all interactive controls, muted text uses `--text-muted-safe` (#767676), and `prefers-reduced-motion` disables sheet transitions. ← (verify: AA contrast on muted text, visible focus states, reduced-motion honored)

## 5. Build & verify

- [x] 5.1 Run `npm run build` from workspace root; confirm 6 product pages + index regenerate with no errors.
- [x] 5.2 Inspect generated `dist/den-nang-luong-mat-troi.html`: order sheet + address sub-sheet markup present, `.cta-buy-now` wired, radio group + COD default, Save disabled attribute, validation error slot, tokens in `dist/styles.css`. ← (verify: all spec scenarios represented in built output; no stubs/TODOs; flow is clearly mock)
