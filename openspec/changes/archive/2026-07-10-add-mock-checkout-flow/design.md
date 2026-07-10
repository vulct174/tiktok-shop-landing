## Context

The landing page is a static, build-time-generated single page (`build.js` renders HTML strings from `config/products.js` + `src/template.html` into `dist/`). Client behavior lives in `src/main.js` as vanilla IIFE modules; styling in `src/styles.css` uses `:root` CSS variables, mobile-first, max-width 430px. There is no framework, no bundler beyond the custom `build.js`, and no test runner (package.json has only a `build` script).

An existing bottom-sheet already ships: `initVariantModal()` in `main.js` portals a modal + backdrop to `document.body`, applies `inert` to `.page-wrapper`, traps focus, closes on ESC/backdrop/close, and restores focus. The reference TikTok screenshots (analyzed this session) show the desired checkout flow: Order summary (screens 6, 8), variant/quantity sheet (screen 7), and Add address (screen 9). This design reuses the proven modal pattern rather than inventing a new one.

## Goals / Non-Goals

**Goals:**
- Add a mock Order-summary bottom sheet opened by "Buy now", matching the reference layout.
- Add an Add-address sub-sheet with real field validation (Name + VN phone) and a working Set-as-default toggle, layered above the order sheet.
- Real, working behavior: quantity stepper recomputes totals, payment radio group with COD default, Save gating, address card population, and a mock "Place order" success + `Purchase` tracking.
- Keep the existing accessibility guarantees (focus trap, `inert`, ESC, reduced motion) for both sheets.
- Confirm design-token alignment; add only the missing tokens (deal-teal, toggle-cyan).

**Non-Goals:**
- No backend, no network submission, no real payment integration.
- No change to product data (`config/products.js` stays solar light).
- No new dependencies, no test framework, no routing.
- Not replicating every pixel of every reference screen — replicate structure/interaction of screens 6, 8, 9 (and the variant/qty behavior of 7 within the order line).

## Decisions

**D1 — Reuse the variant-modal pattern for both sheets (vs. build a generic modal manager).**
Each sheet gets its own IIFE controller mirroring `initVariantModal()` (portal, backdrop, focus trap, ESC, `inert`). Rationale: lowest risk, matches the established codebase idiom, no refactor of working code. Alternative (a shared modal framework) was rejected — larger blast radius and unjustified for two sheets.

**D2 — Sheet stacking via distinct z-index layers.**
Order sheet + its backdrop sit at the existing modal layer; the address sub-sheet + its own backdrop sit one layer above (new `--z-modal-2` / reuse of the lightbox tier). Only the topmost sheet responds to ESC/backdrop. Rationale: the reference shows the address form overlaying the order summary; independent backdrops keep dismissal unambiguous.

**D3 — Markup generated in build.js, behavior in main.js.**
`renderCheckoutSheet(product, currency)` and `renderAddressSheet()` return HTML strings injected via a new `<!-- SECTION_CHECKOUT -->` placeholder in `template.html`. Controllers in `main.js` wire behavior. Rationale: consistent with all 12 existing sections; keeps content escaping (`esc()`) and formatting (`formatPrice()`) centralized in build.js.

**D4 — Totals computed client-side from product data.**
Quantity × unit price, minus a fixed mock seller discount, drives the line total and footer Total. Source values come from the already-inlined `window.__PRODUCT__` (id/name/price/currency) plus data-attributes on the rendered markup for original price and discount. Rationale: no new data source; single source of truth is the product already on the page.

**D5 — VN phone validation rule.**
Valid = 9–10 digits after `+84`, first digit ∈ {3,5,7,8,9}. Implemented as a small regex in the address controller. Save button `disabled` toggles on `(name.trim() !== '') && phoneValid`. Rationale: matches Vietnamese mobile numbering; mirrors the disabled pink Save in screenshot 9.

**D6 — Mock "Place order" = inline confirmation + tracking, never a fake payment UI.**
On place-order, swap the footer/region to a success state "Đặt hàng thành công" and call the existing `trackEvent('Purchase', {...})`. No card entry, no spinner pretending to charge. Rationale: honest demo boundary; reuses the existing tracking fan-out.

**D7 — Missing-address handling = allow-with-hint.**
Place order is not blocked when no address is saved (demo convenience), but an inline hint notes an address is normally required. Rationale: keeps the demo frictionless while still teaching the real-world constraint; avoids a dead-end that a static demo can't otherwise resolve.

## Risks / Trade-offs

- **Focus-trap duplication across three controllers** → Mitigation: copy the exact, already-verified logic from `initVariantModal()`; keep each controller self-contained so a bug in one can't break the others.
- **Two stacked sheets fighting over ESC/backdrop** → Mitigation: topmost-only dismissal via z-index tiers and per-sheet backdrops; the order sheet's key handler ignores ESC while the address sub-sheet is open.
- **Demo mistaken for real checkout** → Mitigation: mock-only payment (no card capture flow), explicit success-state copy, no network calls; `Purchase` event is analytics only.
- **`inert` nesting** → When the address sub-sheet opens, the order sheet must become inert too so focus stays in the top sheet → Mitigation: address controller inerts both `.page-wrapper` and the order sheet element while open, and restores on close.
- **Build output drift** → Mitigation: verification runs `npm run build` and inspects generated `dist/*.html` for the sheet markup, wiring, tokens, and validation attributes (no test runner exists to invent).

## Migration Plan

Additive front-end change — no data migration, no rollback risk beyond reverting the four in-scope files. Deploy = rebuild `dist/`. Rollback = revert `build.js`, `src/template.html`, `src/main.js`, `src/styles.css` and rebuild.

## Open Questions

None blocking. All decisions (missing-address handling D7, phone rule D5, mock boundary D6) are resolved above for autonomous implementation.
