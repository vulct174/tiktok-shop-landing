# ad-tracking Specification

## Purpose
TBD - created by archiving change build-tiktok-shop-landing. Update Purpose after archive.
## Requirements
### Requirement: Config-driven snippet injection
The build SHALL inject tracking snippets into each generated page's `<head>` (and `<body>` where the provider requires a noscript fallback) only for providers whose ID in `tracking` is a non-empty string. Providers covered: Meta Pixel, TikTok Pixel, Google Analytics 4 / Google Ads (gtag), and Google Tag Manager.

#### Scenario: Only configured providers injected
- **WHEN** `tracking.gtmId` is set but the other IDs are empty
- **THEN** only the GTM snippet is injected and no Meta/TikTok/gtag snippets appear

#### Scenario: All providers configured
- **WHEN** all four tracking IDs are non-empty
- **THEN** all four snippets are injected with the corresponding IDs substituted

#### Scenario: GTM noscript fallback
- **WHEN** `tracking.gtmId` is set
- **THEN** the GTM `<noscript>` iframe fallback is injected immediately after the opening `<body>` tag

### Requirement: Unified standard e-commerce events
The page SHALL expose a single `trackEvent(name, params)` helper that fires the equivalent standard e-commerce event to every configured provider (Meta `fbq`, TikTok `ttq`, and gtag/dataLayer), so a single call reaches all platforms.

#### Scenario: One call fans out to all providers
- **WHEN** `trackEvent('AddToCart', {...})` is called with Meta, TikTok, and GTM all configured
- **THEN** the corresponding event is sent to Meta, TikTok, and the GTM/gtag dataLayer

#### Scenario: Missing provider is skipped safely
- **WHEN** `trackEvent` is called but a provider's global (e.g., `fbq`) is not present
- **THEN** the helper skips that provider without throwing an error

### Requirement: CTA-driven event firing
Interactive elements SHALL declare their tracking intent via `data-*` attributes so that tapping the sticky "Mua ngay" CTA fires `InitiateCheckout` (and `AddToCart` on add-to-cart actions), including product id, name, price, and currency in the event payload.

#### Scenario: Buy CTA fires checkout event
- **WHEN** the user taps the sticky "Mua ngay" CTA
- **THEN** an `InitiateCheckout` event is fired to all configured providers with the product's id, name, price, and currency

#### Scenario: Page view on load
- **WHEN** a product page finishes loading with tracking configured
- **THEN** a standard page/content-view event is fired once to the configured providers

