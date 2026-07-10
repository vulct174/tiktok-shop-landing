## ADDED Requirements

### Requirement: Config file structure
The config file `config/products.js` SHALL be an ES module exporting three named exports: `site`, `tracking`, and `products`. It SHALL be the single source of truth a non-developer edits.

#### Scenario: Three named exports present
- **WHEN** the build imports `config/products.js`
- **THEN** it reads `site`, `tracking`, and `products` exports
- **AND** the build fails with a clear message if any of the three is missing

### Requirement: Site settings schema
The `site` export SHALL include at least `brand`, `currency`, `hotline`, and `imageBaseDir`. `imageBaseDir` defines the directory prefix for all product images.

#### Scenario: Currency applied to prices
- **WHEN** `site.currency` is `₫`
- **THEN** rendered prices display the currency symbol alongside formatted numbers

### Requirement: Product schema
Each entry in `products` SHALL support: `id`, `slug`, `name`, `price`, `originalPrice`, `rating`, `sold`, `shortDesc`, `description`, `images` (array), `thumb`, `gallery` (array), `variants` (`{ color, size }`), `badges` (array), `usp` (array), and `relatedIds` (array).

#### Scenario: Required fields validated
- **WHEN** a product is missing `id`, `slug`, `name`, or `price`
- **THEN** the build fails with an error naming the product and the missing field

#### Scenario: Discount percent derived
- **WHEN** a product has `price` less than `originalPrice`
- **THEN** the rendered page shows a discount percentage computed from the two values

#### Scenario: Optional fields degrade gracefully
- **WHEN** a product omits an optional field such as `badges`, `variants`, or `usp`
- **THEN** the page renders without that block and without errors

### Requirement: Related products resolution excludes current product
For each product page, the build SHALL resolve the related-products list from `relatedIds`; when `relatedIds` is empty or omitted, it SHALL default to all other products. In every case the build SHALL exclude the currently-viewed product from the rendered related list.

#### Scenario: Explicit related list excludes self
- **WHEN** product `p1` has `relatedIds` including `p1`, `p2`, `p3`
- **THEN** the related grid on `p1`'s page shows `p2` and `p3` only, never `p1`

#### Scenario: Empty related list defaults to all others
- **WHEN** product `p2` has an empty or omitted `relatedIds`
- **THEN** the related grid on `p2`'s page shows every product except `p2`

#### Scenario: Unknown related id ignored safely
- **WHEN** `relatedIds` references an id that does not exist in `products`
- **THEN** the build skips the unknown id without crashing and renders the valid remainder

### Requirement: Tracking settings schema
The `tracking` export SHALL include `metaPixelId`, `tiktokPixelId`, `googleTagId`, and `gtmId`. An empty string for any ID SHALL mean that provider's snippet is not injected.

#### Scenario: Empty IDs inject nothing
- **WHEN** all tracking IDs are empty strings
- **THEN** no tracking snippets appear in generated pages
