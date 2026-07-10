## ADDED Requirements

### Requirement: Open Order-summary sheet from Buy now
The system SHALL open a mock Order-summary bottom sheet when the sticky "Buy now" button (`.cta-buy-now`) is activated. The sheet SHALL use the same accessibility pattern as the existing variant modal: portalled to `document.body`, a backdrop, a focus trap, ESC-to-close, and `inert` applied to `.page-wrapper` background content.

#### Scenario: Buy now opens the order sheet
- **WHEN** the user activates the "Buy now" button
- **THEN** the Order-summary bottom sheet becomes visible, the backdrop appears, background content is inert, and focus moves to the first focusable element inside the sheet

#### Scenario: Dismissing the order sheet
- **WHEN** the order sheet is open and the user presses ESC, clicks the backdrop, or activates the sheet's close button
- **THEN** the sheet closes, the backdrop is removed, `inert` is cleared from the background, and focus returns to the "Buy now" button

#### Scenario: Reduced motion
- **WHEN** the user's system requests reduced motion (`prefers-reduced-motion: reduce`)
- **THEN** the sheet appears without slide/opacity transitions

### Requirement: Order-summary sheet contents
The Order-summary sheet SHALL display, in order: a header (close control + title "Đơn hàng" + a teal subtitle), a shipping-address card, a product line, a discount row, a totals breakdown, a payment-method list, and a sticky footer with the total and a "Place order" button. Content SHALL reflect the current product (solar light) using the inlined product data.

#### Scenario: Product line shows current product
- **WHEN** the order sheet is open
- **THEN** it shows the product thumbnail, product name, variant label, unit price, and a quantity stepper

#### Scenario: Totals breakdown
- **WHEN** the order sheet is open
- **THEN** it shows Original price, any seller coupon/discount as a negative amount, and a bold Total; the Total equals original price minus discount times quantity

### Requirement: Quantity stepper in order sheet
The order sheet SHALL provide a quantity stepper (decrement / value / increment) with a minimum of 1. The decrement control SHALL be disabled when quantity is 1. Changing the quantity SHALL update the displayed line total and the footer Total.

#### Scenario: Increment updates totals
- **WHEN** the user increments the quantity to 2
- **THEN** the Total reflects two units and the decrement control is enabled

#### Scenario: Decrement floor at 1
- **WHEN** the quantity is 1
- **THEN** the decrement control is disabled and quantity cannot go below 1

### Requirement: Payment-method selection
The order sheet SHALL present payment methods as a single-choice radio group with Cash on Delivery (COD) selected by default. Selection is a mock — no payment is processed.

#### Scenario: COD default
- **WHEN** the order sheet opens
- **THEN** the COD option is selected and exactly one option is selected at a time

#### Scenario: Switching method
- **WHEN** the user selects a different payment option
- **THEN** that option becomes the only selected one

### Requirement: Open Add-address sub-sheet
The system SHALL open an Add-address sub-sheet when the shipping-address card in the order sheet is activated. The sub-sheet SHALL layer above the order sheet (higher stacking order), and dismissing it (ESC, backdrop, or close) SHALL close only the topmost (address) sheet, leaving the order sheet open.

#### Scenario: Address card opens sub-sheet
- **WHEN** the user activates the shipping-address card
- **THEN** the Add-address sub-sheet appears above the order sheet with focus moved into it

#### Scenario: ESC closes only the top sheet
- **WHEN** the address sub-sheet is open over the order sheet and the user presses ESC
- **THEN** only the address sub-sheet closes and the order sheet remains open with focus returned to the address card

### Requirement: Address form fields and validation
The Add-address sub-sheet SHALL provide fields: Name (required), Phone with a "VN +84" prefix (required, validated as a Vietnamese mobile number), Address (Select address), a Current-location card with a "Use current location" action (mock), Address details (optional), and a "Set as default" toggle. A Vietnamese mobile number SHALL be 9 to 10 digits after the +84 prefix and begin with 3, 5, 7, 8, or 9. The Save button SHALL be disabled while Name is empty OR Phone is invalid, and enabled only when Name is non-empty AND Phone is valid. An invalid Phone entry SHALL show an inline error message beneath the Phone field.

#### Scenario: Save disabled until valid
- **WHEN** the Name field is empty or the Phone field is not a valid VN mobile number
- **THEN** the Save button is disabled and styled in its faded/disabled state

#### Scenario: Invalid phone shows inline error
- **WHEN** the user enters a Phone value that is not a valid VN mobile number
- **THEN** an inline error appears under the Phone field and Save remains disabled

#### Scenario: Save enabled when valid
- **WHEN** Name is non-empty and Phone is a valid VN mobile number
- **THEN** the Save button becomes enabled and styled in its active (solid) state

#### Scenario: Set-as-default toggle
- **WHEN** the user activates the "Set as default" toggle
- **THEN** its checked state flips and is exposed via `aria-checked`

### Requirement: Save address populates order sheet
When a valid address is saved, the system SHALL close the Add-address sub-sheet and replace the "Add shipping address" prompt in the order sheet with the saved recipient name, phone, and address text.

#### Scenario: Saving updates the address card
- **WHEN** the user saves a valid address
- **THEN** the sub-sheet closes and the order sheet's address card shows the entered name, phone, and address instead of the "Add shipping address" prompt

### Requirement: Place order confirmation (mock)
Activating "Place order" SHALL display an inline success confirmation reading "Đặt hàng thành công" and SHALL fire `trackEvent('Purchase', …)` with the product id, name, value, currency, and quantity. No real payment or network order submission occurs. If no address has been saved, the order MAY still be placed in this demo, but an inline hint SHALL indicate an address is normally required.

#### Scenario: Place order shows success
- **WHEN** the user activates "Place order" with a saved address
- **THEN** an inline "Đặt hàng thành công" confirmation is shown and a `Purchase` tracking event is fired with the current quantity and computed value

#### Scenario: Place order without address
- **WHEN** the user activates "Place order" with no saved address
- **THEN** an inline hint indicates an address is normally required, while the mock still allows completion

### Requirement: Checkout accessibility
Both sheets SHALL meet WCAG 2.1 AA interaction requirements: keyboard operability, a focus trap while open, `role="dialog"` with `aria-modal="true"`, an accessible label, associated labels for every input, the payment options grouped as a radio group, the toggle exposing `role`/`aria-checked`, visible focus indicators, and muted text meeting AA contrast (using `#767676`, not `#8A8B91`).

#### Scenario: Keyboard-only operation
- **WHEN** a keyboard-only user opens a sheet and presses Tab / Shift+Tab
- **THEN** focus cycles only within the open sheet and never reaches inert background content

#### Scenario: Labelled controls
- **WHEN** assistive technology inspects the address form
- **THEN** every input has an associated label, the payment list is announced as a radio group, and the default toggle exposes its checked state
