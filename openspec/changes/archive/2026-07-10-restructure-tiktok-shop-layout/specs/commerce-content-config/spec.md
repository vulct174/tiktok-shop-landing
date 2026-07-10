## ADDED Requirements

### Requirement: Reviews config schema
Each product MAY define a `reviews` object: `{ average, total, breakdown: {5,4,3,2,1}, photos: [images], items: [{ name, verified, region, stars, text, photo?, itemLabel, date }] }`. The reviews section SHALL render aggregate score, star breakdown bars sized from `breakdown`, a photo strip from `photos`, and review cards from `items`.

#### Scenario: Breakdown bars sized from config
- **WHEN** a product's `reviews.breakdown` is {5:8,4:2,3:0,2:0,1:0}
- **THEN** the 5-star bar renders proportionally largest and the zero-count bars render empty, with counts shown

#### Scenario: Review card renders all fields
- **WHEN** a review item has name, verified, region, stars, text, photo, itemLabel, and date
- **THEN** the card shows the masked name, a Verified-purchase marker, region, gold stars, the text, the photo, the item label, and the date

#### Scenario: Product without reviews
- **WHEN** a product omits `reviews`
- **THEN** the reviews section renders an empty/absent state without errors

### Requirement: Hashtags, breadcrumb, seller config
Each product MAY define `hashtags` (array), `breadcrumb` (array), and `sellerName`; the site config MAY define default `sellerName`, `appBadges` (googlePlay/appStore image refs), and `footerGroups`. The build SHALL use these fields when present to render the corresponding UI sections.

#### Scenario: Hashtags rendered as chips
- **WHEN** a product defines a hashtags array
- **THEN** each tag renders as a chip in the hashtags section

#### Scenario: Seller name resolution
- **WHEN** a product omits `sellerName`
- **THEN** the site default `sellerName` is used in the price block and the "Explore more from {seller}" heading

### Requirement: Seller shelf data sourcing
The "Explore more from {seller}" shelf SHALL be populated from products other than the current one, rendered as a horizontal-scroll card list (image, optional flash-sale badge/timer, rating, sold, price + strikethrough).

#### Scenario: Shelf excludes current product
- **WHEN** the seller shelf renders on a product page
- **THEN** the current product does not appear in the shelf

### Requirement: You-may-also-like data sourcing
The "You may also like" grid SHALL render a 2-column grid of other products (image, 2-line clamped name, optional badge, rating, sold, price + strikethrough), excluding the current product.

#### Scenario: Grid excludes current product and is 2-column
- **WHEN** the you-may-also-like grid renders on a product page
- **THEN** it shows a 2-column grid of other products and the current product is absent

### Requirement: Legacy USP field ignored
The build SHALL no longer render a standalone USP section; a legacy `usp` field on a product SHALL be ignored without causing errors.

#### Scenario: Legacy usp present but not rendered
- **WHEN** a product still contains a `usp` array
- **THEN** the build succeeds and no standalone dark USP section is emitted
