## ADDED Requirements

### Requirement: Select-options bottom-sheet modal
The "Select options" row SHALL open a bottom-sheet modal containing a drag indicator, a header (product thumbnail ~80px + sale price + close control), a variant section ("Màu sắc:" + chips), a quantity stepper (minimum 1), and "Thêm vào giỏ" (outline) + "Mua ngay" (accent) buttons. The modal SHALL slide up on open and animate closed.

#### Scenario: Row opens modal
- **WHEN** the user taps the "Select options" row
- **THEN** the bottom-sheet modal slides up over a dimmed backdrop

#### Scenario: Modal closes via all documented paths
- **WHEN** the user taps the close control, taps the backdrop, or presses ESC
- **THEN** the modal animates closed and focus returns to the "Select options" row

#### Scenario: Quantity cannot go below one
- **WHEN** the quantity is 1 and the user taps decrement in the modal
- **THEN** the quantity stays at 1 and the decrement control is visibly disabled

### Requirement: Modal accessibility
The modal SHALL use `role="dialog"` with `aria-modal="true"`, trap focus within itself while open, move focus to the first interactive element on open, and make background content inert / `aria-hidden` while open.

#### Scenario: Focus trap active
- **WHEN** the modal is open and the user presses Tab past the last focusable element
- **THEN** focus cycles back to the first focusable element within the modal (and background elements are not reachable)

### Requirement: Review filter tabs
The customer-reviews section SHALL render filter tabs (e.g., All / 5★ / 4★ / With photo) where exactly one tab is active at a time, styled with the accent color when active.

#### Scenario: Selecting a filter tab
- **WHEN** the user taps a filter tab
- **THEN** that tab becomes the single active tab (accent-styled) and the review list reflects the selected filter

### Requirement: Collapsible about section
The "About this product" section SHALL be collapsible via a chevron control with `aria-expanded` reflecting its state.

#### Scenario: Toggle about section
- **WHEN** the user taps the "Product description" header
- **THEN** the description content expands or collapses and `aria-expanded` toggles accordingly

### Requirement: Accordion footer behavior
Each footer group SHALL expand/collapse independently with `aria-expanded` reflecting its state.

#### Scenario: Expand a footer group
- **WHEN** the user taps a footer group header
- **THEN** that group's links expand and its `aria-expanded` becomes true, independent of other groups

### Requirement: Tap target sizing
Interactive controls (nav buttons, close, chevrons, CTA, quantity buttons, tabs) SHALL have a minimum tap target of 44×44px.

#### Scenario: Controls meet minimum size
- **WHEN** any interactive control is rendered
- **THEN** its effective tap area is at least 44×44px

### Requirement: Standard e-commerce tracking on CTA
The sticky "Buy now" CTA and the modal buy-now button SHALL fire standard e-commerce tracking events (via the unified trackEvent helper) with product id, name, price, and currency, each provider guarded so a missing global does not throw.

#### Scenario: Buy now fires checkout event
- **WHEN** the user taps "Buy now" (sticky or modal)
- **THEN** an InitiateCheckout event is dispatched to all configured providers with the product payload, and missing providers are skipped without error
