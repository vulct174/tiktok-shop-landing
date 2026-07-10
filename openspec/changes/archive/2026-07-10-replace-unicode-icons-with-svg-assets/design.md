## Context

The TikTok Shop landing page generator (`build.js`) currently uses HTML unicode entities and text characters as UI icons across all 12 section renderers. The `des-refer/assets/` directory contains real TikTok Shop branding assets (logos, app store badges, flash sale badge) scraped from the actual TikTok Shop product pages. These real assets should be used instead of placeholder SVGs and text.

Current icon system: unicode entities (`&#128269;`, `&#128100;`, `&#128666;`, `&#127873;`, `&#8592;`, `&#8250;`, `&#8964;`, `&#10003;`) and text characters (`★`, `☆`).

Target icon system: inline SVG elements with consistent 24x24 viewBox, plus real image assets for branding elements.

## Goals / Non-Goals

**Goals:**
- Replace all unicode entity icons with inline SVGs that can be styled via CSS (color, size)
- Use real TikTok Shop logo image from des-refer assets
- Use real app store badge images (PNG) from des-refer assets instead of placeholder SVGs
- Use real flash sale badge image from des-refer assets
- Maintain all existing ARIA attributes and accessibility semantics
- Keep the zero-dependency, build-time-only architecture

**Non-Goals:**
- Creating an icon sprite or external SVG file (inline is simpler for this project)
- Adding an icon library dependency (Heroicons, Lucide, etc.)
- Changing the layout, spacing, or visual design beyond icon swaps
- Modifying client-side JavaScript (main.js) — only build-time renderers change

## Decisions

### 1. Inline SVG over external sprite
Icons are emitted as inline `<svg>` elements within the HTML output. This avoids HTTP requests, works offline, and keeps the zero-dependency philosophy. Each icon is a helper function in build.js returning an SVG string.

### 2. Icon helper functions at top of build.js
A block of `icon*()` functions (iconArrowLeft, iconSearch, iconPerson, iconChevronRight, iconChevronDown, iconStar, iconStarEmpty, iconCheck, iconTruck, iconGift) defined after the existing utility functions. Each returns a complete `<svg>` string with `width="1em" height="1em"` for font-relative sizing, `fill="currentColor"` for CSS color inheritance, and `aria-hidden="true"`.

### 3. Real assets copied with clean names
Files from `des-refer/assets/` are copied into `assets/products/` (same directory as existing badges) with clean names: `tts-logo.png`, `badge-app-store.png`, `badge-google-play.png`, `flash-sale-badge.png`. The hashed/long filenames from des-refer are not suitable for maintainable config references.

### 4. goldStars() rewritten to emit SVG
The `goldStars(count)` helper changes from returning `★☆` text to returning a string of inline SVG star icons (filled with `var(--star-gold)` / empty with `currentColor` stroke only). This makes stars styleable and consistent across all browsers.

### 5. Old placeholder SVG badges deleted
`assets/products/badge-app-store.svg` and `assets/products/badge-google-play.svg` are removed since they contained only text approximations and are now replaced by real PNG screenshots from TikTok Shop.

## Risks / Trade-offs

- **Inline SVG increases HTML size**: Each icon adds ~200-400 bytes of SVG markup per occurrence. For a product page with ~50 icon instances, this adds ~15KB uncompressed. Acceptable for a static page with no framework runtime. → Mitigation: SVG paths are minimal (single-path icons).
- **Real badge PNGs are larger than placeholder SVGs**: The real app store badge PNGs are raster images vs the ~300 byte placeholder SVGs. → Mitigation: badges are below-the-fold in footer, lazy-loaded, and only 2 images total.
- **Star SVG repetition**: goldStars() repeats 5 SVG elements per rating display (aggregate, each review card, shelf cards, also-like cards). → Mitigation: SVGs are small (~250 bytes each), total repetition is bounded by products-per-page.
