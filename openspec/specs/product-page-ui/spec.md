# product-page-ui Specification

## Purpose
TBD - created by archiving change build-tiktok-shop-landing. Update Purpose after archive.
## Requirements
### Requirement: Seven-section page structure
Each product page SHALL render seven sections in this exact order: (1) hero image gallery, (2) title + price block, (3) variant selector, (4) dark USP/highlight section, (5) detail description, (6) related products, (7) footer with sticky bottom CTA bar.

#### Scenario: All seven sections present and ordered
- **WHEN** a product page is rendered
- **THEN** all seven sections appear once each, in the specified order

### Requirement: Mobile-first design system
The page SHALL be mobile-first, single-column, constrained to a max width of approximately 430px and centered on wider viewports. It SHALL use background `#f0f0f0`, white surfaces, accent/CTA/price color `#f01848`, and a dark section color `#181818`.

#### Scenario: Palette applied
- **WHEN** the page renders
- **THEN** the CTA and price use `#f01848`, the page background is `#f0f0f0`, and the USP section uses a dark `#181818` background with light text

#### Scenario: Centered on desktop
- **WHEN** the page is viewed on a wide desktop viewport
- **THEN** content is constrained to ~430px and horizontally centered

### Requirement: Hero image gallery
Section 1 SHALL show a main product image with a thumbnail strip. Selecting a thumbnail SHALL update the main image. Badges from config SHALL overlay or sit adjacent to the hero.

#### Scenario: Thumbnail switches main image
- **WHEN** a user selects a gallery thumbnail
- **THEN** the main hero image updates to the selected image

#### Scenario: Single-image product
- **WHEN** a product has only one image
- **THEN** the hero shows that image with no broken thumbnail strip

### Requirement: Title and price block
Section 2 SHALL display product name, sale price in `#f01848`, original price with strikethrough, discount percentage, star rating, and sold count.

#### Scenario: Price block renders sale and original
- **WHEN** a product has price and a higher originalPrice
- **THEN** the sale price shows in accent color and the original price shows struck through with the discount percentage

### Requirement: Variant selector and quantity stepper
Section 3 SHALL render selectable color and size chips (when provided) and a quantity stepper with a minimum of 1. Selecting a chip SHALL mark it active.

#### Scenario: Selecting a variant chip
- **WHEN** a user taps a color or size chip
- **THEN** that chip becomes the active selection and others in its group deselect

#### Scenario: Quantity cannot go below one
- **WHEN** the quantity is 1 and the user taps decrement
- **THEN** the quantity remains 1

### Requirement: Dark USP section
Section 4 SHALL render the product's `usp` items (e.g., warranty, freeship, authenticity) as an icon/text list on a dark `#181818` background with light text.

#### Scenario: USP list renders on dark background
- **WHEN** a product has usp items
- **THEN** they render as a list on the dark section

### Requirement: Detail description
Section 5 SHALL render the product's detail `gallery` images stacked vertically together with the `description` rich text.

#### Scenario: Detail images stack vertically
- **WHEN** a product has multiple gallery images
- **THEN** they render stacked in a single column in order

### Requirement: Related products grid
Section 6 SHALL render the resolved related products (excluding the current product) as a thumbnail grid; each item links to that product's page and shows its thumb, name, and price.

#### Scenario: Related grid links to other pages
- **WHEN** the related section renders on a product page
- **THEN** each grid item links to `<related-slug>.html` and the current product is absent

### Requirement: Sticky bottom CTA
Section 7 SHALL include a footer and a sticky bottom bar fixed to the viewport bottom, containing a primary "Mua ngay" (Buy now) CTA in `#f01848`.

#### Scenario: CTA stays fixed while scrolling
- **WHEN** the user scrolls the page
- **THEN** the sticky "Mua ngay" bar remains fixed at the bottom of the viewport

