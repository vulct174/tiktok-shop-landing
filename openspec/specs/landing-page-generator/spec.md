# landing-page-generator Specification

## Purpose
TBD - created by archiving change build-tiktok-shop-landing. Update Purpose after archive.
## Requirements
### Requirement: Static per-product page generation
The build script SHALL read the product config and generate exactly one static HTML file per product into the `dist/` directory, named `dist/<slug>.html` where `<slug>` is the product's `slug` field.

#### Scenario: Generate one page per product
- **WHEN** the build script runs against a config with 6 products
- **THEN** `dist/` contains 6 HTML files, one per product slug
- **AND** each file is a complete, standalone HTML document requiring no framework runtime

#### Scenario: Slug collision detection
- **WHEN** two products share the same `slug`
- **THEN** the build fails with a clear error naming the duplicate slug
- **AND** no partial/overwritten output is left that silently drops a product

### Requirement: Catalog index page
The build script SHALL generate a `dist/index.html` catalog page listing all products with thumbnails linking to each product page.

#### Scenario: Index lists all products
- **WHEN** the build completes
- **THEN** `dist/index.html` exists and contains a link to every product's `<slug>.html`

### Requirement: Template rendering from a single skeleton
The build script SHALL render every product page from the single `src/template.html` skeleton by substituting product data, so layout changes in one place propagate to all pages.

#### Scenario: Shared template propagation
- **WHEN** a structural change is made in `src/template.html` and the build is re-run
- **THEN** all generated product pages reflect the change

### Requirement: Asset and static file resolution
The build script SHALL copy `src/styles.css`, `src/main.js`, and the `assets/` directory into `dist/` (or reference them with correct relative paths) so generated pages load styles, scripts, and images correctly when `dist/` is served.

#### Scenario: Generated page loads its assets
- **WHEN** a generated `dist/<slug>.html` is opened from a static server rooted at `dist/`
- **THEN** the stylesheet, main script, and product images all resolve (no 404s)

#### Scenario: Image path built from config base dir
- **WHEN** a product references image `1.jpg` and `site.imageBaseDir` is `assets/products`
- **THEN** the rendered `<img>` src resolves to the product image under that base directory

### Requirement: Reproducible, dependency-free build
The build SHALL run via `npm run build` (invoking `node build.js`) using only Node.js built-ins, with no runtime browser dependencies emitted.

#### Scenario: Build runs with no install of runtime deps
- **WHEN** `npm run build` is executed in a clean checkout
- **THEN** the build completes successfully without requiring browser-facing npm packages
- **AND** generated pages contain no framework runtime code

#### Scenario: Rebuild is idempotent
- **WHEN** the build is run twice with unchanged config
- **THEN** the second run produces functionally identical `dist/` output

