## ADDED Requirements

### Requirement: Real TikTok Shop logo asset
The build SHALL copy `des-refer/assets/tts_logo_dark.1470472f.png` to `assets/products/tts-logo.png` and the nav logo SHALL render as `<img src="assets/products/tts-logo.png" alt="TikTok Shop">` instead of a text span.

#### Scenario: Logo renders as image
- **WHEN** renderTopNav() output is inspected
- **THEN** it contains an `<img>` tag with src pointing to `tts-logo.png` and alt="TikTok Shop"
- **THEN** it does NOT contain a text-only "TikTok Shop" span as the logo

### Requirement: Real app store badge images
The build SHALL use real PNG badge images copied from des-refer: `app_store_download.01930187.png` → `assets/products/badge-app-store.png` and `google_play_download.4bb1256b.png` → `assets/products/badge-google-play.png`. The config `site.appBadges` SHALL reference these PNG files. The old placeholder SVG files (`badge-app-store.svg`, `badge-google-play.svg`) SHALL be deleted.

#### Scenario: Config references PNG badges
- **WHEN** the config file is read
- **THEN** `site.appBadges.appStore` equals `badge-app-store.png`
- **THEN** `site.appBadges.googlePlay` equals `badge-google-play.png`

#### Scenario: Old placeholder SVGs removed
- **WHEN** the assets/products/ directory is listed
- **THEN** `badge-app-store.svg` and `badge-google-play.svg` do NOT exist
- **THEN** `badge-app-store.png` and `badge-google-play.png` DO exist

### Requirement: Real flash sale badge image
The build SHALL copy `des-refer/assets/flash_sale_dark.png~tplv-o3syd03w52-resize-png_800_800.png` to `assets/products/flash-sale-badge.png`. The seller shelf flash sale indicator SHALL render as `<img src="..." alt="Flash Sale">` referencing this image instead of a text-only div.

#### Scenario: Flash sale badge renders as image
- **WHEN** a shelf card has a flash sale badge
- **THEN** the badge contains an `<img>` tag referencing `flash-sale-badge.png`
- **THEN** it does NOT render as a plain text "Flash Sale" div

### Requirement: Asset copy during build
The build process SHALL copy the image assets from `assets/` to `dist/assets/` as part of the existing asset copy step, ensuring all referenced images are available in the distribution output.

#### Scenario: All new assets present in dist after build
- **WHEN** `npm run build` completes
- **THEN** `dist/assets/products/tts-logo.png` exists
- **THEN** `dist/assets/products/badge-app-store.png` exists
- **THEN** `dist/assets/products/badge-google-play.png` exists
- **THEN** `dist/assets/products/flash-sale-badge.png` exists
