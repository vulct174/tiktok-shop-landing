## ADDED Requirements

### Requirement: Twelve-section page order
Each product page SHALL render these 12 sections in this exact order: (1) sticky top nav, (2) hero swipe carousel, (3) price+title block, (4) select-options row, (5) customer reviews, (6) collapsible about, (7) hashtags, (8) explore-more seller shelf, (9) you-may-also-like grid, (10) breadcrumb, (11) accordion footer, (12) sticky bottom CTA.

#### Scenario: All sections present and ordered
- **WHEN** a product page is generated
- **THEN** all 12 sections appear once each, in the specified order
- **AND** the old standalone dark USP section is NOT present

### Requirement: Sticky top navigation
Section 1 SHALL render a sticky top bar (height ~48px) containing a back control, the TikTok Shop logo, a rounded Search pill with pink placeholder text, and a profile control. It SHALL gain a shadow after the page is scrolled.

#### Scenario: Nav stays fixed and gains shadow on scroll
- **WHEN** the user scrolls the page down
- **THEN** the top nav remains fixed at the top of the viewport
- **AND** a shadow appears on the nav once scrolled beyond a small threshold

### Requirement: Hero swipe carousel
Section 2 SHALL render the product images as a horizontal swipe carousel using CSS scroll-snap, with an "N/total" counter and dot pagination whose active dot is visually distinct. It SHALL NOT use a main-image + thumbnail-strip layout. The carousel SHALL NOT auto-rotate.

#### Scenario: Swiping updates counter and active dot
- **WHEN** the user swipes to another slide
- **THEN** the counter updates to the current slide index and total
- **AND** the active pagination dot updates to match the current slide

#### Scenario: Single-image product
- **WHEN** a product has only one image
- **THEN** the counter and dot pagination are hidden and no broken carousel controls appear

### Requirement: Price and title block
Section 3 SHALL display the discount percentage pill, the sale price emphasized in accent color, the original price with strikethrough in a contrast-safe muted color, the uppercase product name, the seller line, and a rating row (average, review count, sold count). The price row SHALL appear before the product name.

#### Scenario: Price anchoring rendered
- **WHEN** a product has price below originalPrice
- **THEN** the sale price shows large in accent color, the original price shows struck-through, and the discount percentage pill shows the computed percent
- **AND** the price row is rendered above the product name

### Requirement: Breadcrumb
Section 10 SHALL render a breadcrumb trail from config (site default, per-product overridable).

#### Scenario: Breadcrumb from config
- **WHEN** a product defines a breadcrumb array
- **THEN** the page renders that trail; otherwise it renders the site default trail

### Requirement: Accordion footer
Section 11 SHALL render an accordion footer with groups (Shop/Sell/About/Customer support/Legal), a free-shipping / new-customer row, and Google Play + App Store badges, all from config.

#### Scenario: Footer groups from config
- **WHEN** the site config defines footer groups and app badges
- **THEN** the footer renders each group as a collapsible accordion item and shows both store badges

### Requirement: Sticky bottom CTA
Section 12 SHALL render a full-width pink "Buy now" pill fixed to the bottom of the viewport; the page body SHALL reserve bottom padding equal to the CTA height so no content is hidden.

#### Scenario: CTA fixed and non-overlapping
- **WHEN** the user scrolls to the end of the page
- **THEN** the "Buy now" bar stays fixed at the bottom and the final content is fully visible above it
