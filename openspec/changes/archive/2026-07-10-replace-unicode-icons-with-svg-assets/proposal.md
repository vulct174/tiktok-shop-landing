## Why

The build currently uses HTML unicode entities (&#128269;, &#128100;, &#128666;, &#127873;) and text characters (★, ☆, ←) as UI icons, and generates placeholder SVG files for app store badges. The `des-refer/assets/` directory contains the real TikTok Shop assets (logo PNGs, real app store badge images, flash sale badge) that should be used instead. Unicode entities render inconsistently across devices and cannot be styled (color, size, stroke). Replacing them with inline SVGs and real image assets brings visual fidelity to the reference design and allows full CSS control.

## What Changes

- Copy real image assets from `des-refer/assets/` into `assets/` (TikTok Shop logo, app store badges, flash sale badge)
- Replace all unicode entity icons in `build.js` renderers with inline SVG markup (arrow-left, search, person, chevron-right, chevron-down, star, check, truck, gift)
- Replace `goldStars()` text helper to emit inline SVG stars instead of ★/☆ characters
- Replace the nav text logo "TikTok Shop" with an `<img>` referencing the real logo asset
- Replace the Flash Sale text badge in seller shelf with an `<img>` referencing the real flash sale badge
- Update `config/products.js` appBadges to reference real PNG badges
- Remove old placeholder `badge-app-store.svg` and `badge-google-play.svg`

## Capabilities

### New Capabilities
- `inline-svg-icons`: Defines the inline SVG icon system used across all build renderers — icon paths, sizing, styling conventions, and the refactored goldStars helper
- `real-asset-integration`: Defines how real image assets (logo, badges) from des-refer are organized in assets/ and referenced by the build

### Modified Capabilities
<!-- No existing spec-level requirements change — this is a visual implementation swap -->

## Impact

- `build.js`: All 12 section renderers modified (icon markup changes), `goldStars()` helper rewritten
- `config/products.js`: `appBadges` values change from .svg to .png
- `assets/products/`: New files added (tts-logo.png, badge-app-store.png, badge-google-play.png, flash-sale-badge.png), old placeholder SVGs removed
- `src/styles.css`: May need minor adjustments for SVG icon sizing (inline SVGs inherit font-size by default)
- `dist/`: Rebuilt output will contain new markup and reference new image files
