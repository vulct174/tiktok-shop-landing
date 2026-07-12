## ADDED Requirements

### Requirement: Source JS split into individual module files
The system SHALL store client-side JavaScript as individual files under `src/js/`, one file per functional section (IIFE), with numeric prefixes for ordering.

#### Scenario: JS files exist with correct naming
- **WHEN** the developer looks at `src/js/`
- **THEN** the following files exist: `01-nav-scroll.js`, `02-carousel.js`, `04-variant-modal.js`, `05-reviews.js`, `06-about-collapse.js`, `08-shelf-scroll.js`, `11-footer-accordion.js`, `13-checkout.js`, `14-tracking.js`, `15-admin.js`

#### Scenario: Each JS file is self-contained
- **WHEN** any single `src/js/*.js` file is examined
- **THEN** it contains exactly one IIFE (or one top-level block for admin) and has no import/export statements or references to variables defined in other src/js files

### Requirement: Source CSS split into individual module files
The system SHALL store stylesheets as individual files under `src/css/`, one file per visual section, with numeric prefixes for ordering.

#### Scenario: CSS files exist with correct naming
- **WHEN** the developer looks at `src/css/`
- **THEN** the following files exist: `00-variables.css`, `01-nav.css`, `02-carousel.css`, `03-price.css`, `04-variant.css`, `05-reviews.css`, `06-about.css`, `07-hashtags.css`, `08-shelf.css`, `09-also-like.css`, `10-breadcrumb.css`, `11-footer.css`, `12-sticky-cta.css`, `13-checkout.css`, `14-catalog.css`, `15-responsive.css`

### Requirement: Build-time code split into ES modules
The system SHALL organize build-time code (HTML renderers, helpers, icons) into ES module files under a `build/` directory, with a slim `build.js` entry point.

#### Scenario: Build modules exist
- **WHEN** the developer looks at `build/`
- **THEN** the following exist: `helpers.js`, `icons.js`, `assemble.js`, and a `sections/` subdirectory containing one file per render function

#### Scenario: Build entry point is slim
- **WHEN** the developer opens `build.js`
- **THEN** it contains only imports from `build/` modules, the concatenation logic, and the build orchestration (under 100 lines)

### Requirement: Build concatenates split files into identical dist output
The build process SHALL concatenate all `src/js/*.js` files (sorted by filename) into `dist/main.js` and all `src/css/*.css` files (sorted by filename) into `dist/styles.css`.

#### Scenario: dist/main.js matches original content
- **WHEN** `node build.js` is run after the refactor
- **THEN** `dist/main.js` contains the same content as the original monolithic `src/main.js` would have produced (identical bytes, accounting for file boundary newlines)

#### Scenario: dist/styles.css matches original content
- **WHEN** `node build.js` is run after the refactor
- **THEN** `dist/styles.css` contains the same content as the original monolithic `src/styles.css` would have produced

#### Scenario: HTML pages are unchanged
- **WHEN** `node build.js` is run after the refactor
- **THEN** all generated HTML files in `dist/` are byte-identical to pre-refactor output

### Requirement: Zero runtime dependencies
The build process SHALL use only Node.js built-in modules (fs, path, url). No bundlers, transpilers, or third-party packages SHALL be added.

#### Scenario: No new dependencies
- **WHEN** `package.json` is examined after the refactor
- **THEN** it has no `dependencies` or `devDependencies` entries

### Requirement: Original monolithic files removed
After the split is complete, the original `src/main.js` and `src/styles.css` SHALL be removed to prevent confusion about which files are authoritative.

#### Scenario: No duplicate source files
- **WHEN** the developer looks at `src/`
- **THEN** `src/main.js` and `src/styles.css` do not exist; only `src/js/`, `src/css/`, and `src/template.html` remain
