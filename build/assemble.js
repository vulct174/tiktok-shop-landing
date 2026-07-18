import { esc, formatPrice } from './helpers.js';
import { renderTopNav } from './sections/nav.js';
import { renderHeroCarousel } from './sections/carousel.js';
import { renderPriceTitle } from './sections/price.js';
import { renderSelectOptionsRow } from './sections/variant.js';
import { renderReviews } from './sections/reviews.js';
import { renderAbout } from './sections/about.js';
import { renderHashtags } from './sections/hashtags.js';
import { renderSellerShelf } from './sections/seller-shelf.js';
import { renderAlsoLike } from './sections/also-like.js';
import { renderBreadcrumb } from './sections/breadcrumb.js';
import { renderFooter } from './sections/footer.js';
import { renderCheckoutSheet } from './sections/checkout.js';

// ════════════════════════════════════════════════════════════
// STICKY CTA RENDERER
// ════════════════════════════════════════════════════════════

function renderStickyCta(product, currency) {
  return `<div class="sticky-cta-bar" role="complementary" aria-label="Mua hàng">
  <button
    class="cta-buy-now"
    type="button"
    data-track="InitiateCheckout"
    data-product-id="${esc(String(product.id))}"
    data-product-name="${esc(product.name)}"
    data-price="${esc(String(product.price))}"
    data-currency="VND"
    aria-label="Mua ngay – ${formatPrice(product.price)}${esc(currency)}, miễn phí vận chuyển"
  >
    <span class="cta-buy-now-label">Mua ngay</span>
    <span class="cta-buy-now-price">${formatPrice(product.price)}${esc(currency)}<span class="cta-buy-now-sep">|</span>Miễn phí vận chuyển</span>
  </button>
</div>`;
}

// ════════════════════════════════════════════════════════════
// TRACKING INJECTION
// ════════════════════════════════════════════════════════════

/**
 * buildTrackingHead(tracking)
 * Returns HTML snippets for <head>. Only non-empty IDs are included.
 */
function buildTrackingHead(tracking) {
  const parts = [];

  // ── Google Tag Manager ──
  if (tracking.gtmId) {
    parts.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${esc(tracking.gtmId)}');<\/script>
<!-- End Google Tag Manager -->`);
  }

  // ── Meta Pixel ──
  if (tracking.metaPixelId) {
    parts.push(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${esc(tracking.metaPixelId)}');
fbq('track', 'PageView');
<\/script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${esc(tracking.metaPixelId)}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`);
  }

  // ── TikTok Pixel ──
  if (tracking.tiktokPixelId) {
    parts.push(`<!-- TikTok Pixel Code Start -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${esc(tracking.tiktokPixelId)}');
  ttq.page();
}(window, document, 'ttq');
<\/script>
<!-- TikTok Pixel Code End -->`);
  }

  // ── Google Analytics 4 / gtag ──
  if (tracking.googleTagId) {
    parts.push(`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(tracking.googleTagId)}"><\/script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${esc(tracking.googleTagId)}');
<\/script>
<!-- End Google tag -->`);
  }

  return parts.join('\n');
}

function buildTrackingBodyNoscript(tracking) {
  if (!tracking.gtmId) return '';
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(tracking.gtmId)}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

// ════════════════════════════════════════════════════════════
// PAGE ASSEMBLER
// ════════════════════════════════════════════════════════════

export function assemblePage(product, allProducts, site, tracking, templateHtml, sellerShelf, checkout, admin) {
  const currency   = site.currency || '₫';
  const imgBaseDir = site.imageBaseDir || 'assets/products';

  // Other products for shelf and grid (exclude current)
  const otherProducts = allProducts.filter(p => p.id !== product.id);

  // Render all 12 sections
  const sectionTopNav        = renderTopNav(imgBaseDir);
  const sectionHeroCarousel  = renderHeroCarousel(product, imgBaseDir);
  const sectionPriceTitle    = renderPriceTitle(product, currency, site);
  const sectionSelectOptions = renderSelectOptionsRow(product, imgBaseDir, currency);
  const sectionReviews       = renderReviews(product, imgBaseDir);
  const sectionAbout         = renderAbout(product, imgBaseDir);
  const sectionHashtags      = renderHashtags(product);
  const sectionSellerShelf   = renderSellerShelf(product, otherProducts, imgBaseDir, currency, sellerShelf);
  // TẠM ẨN "You may also like" — bật lại bằng cách đổi về:
  // const sectionAlsoLike   = renderAlsoLike(otherProducts, imgBaseDir, currency);
  const sectionAlsoLike      = '';
  const sectionBreadcrumb    = renderBreadcrumb(product, site);
  const sectionFooter        = renderFooter(site);
  const sectionStickyCta     = renderStickyCta(product, currency);
  // Section 13: checkout sheets (portalled, rendered outside .page-wrapper)
  const productWithImgDir    = Object.assign({}, product, { _imgBaseDir: imgBaseDir });
  const sectionCheckout      = renderCheckoutSheet(productWithImgDir, currency);

  // Build tracking snippets
  const trackingHead         = buildTrackingHead(tracking);
  const trackingBodyNoscript = buildTrackingBodyNoscript(tracking);

  // LCP preload for first hero image
  const firstImage = (Array.isArray(product.images) && product.images[0]) || product.thumb || '';
  const preloadLcp = firstImage
    ? `<link rel="preload" as="image" href="${esc(`${imgBaseDir}/${firstImage}`)}" fetchpriority="high">`
    : '';

  // Product JSON for client-side tracking (safe serialization: escape </)
  const productJsonRaw = JSON.stringify({
    id:       product.id,
    name:     product.name,
    price:    product.price,
    currency: currency,
    slug:     product.slug,
  }).replace(/<\//g, '<\\/');

  // Checkout config JSON for order submission
  const checkoutConfigRaw = JSON.stringify(checkout || {}).replace(/<\//g, '<\\/');
  const adminConfigRaw = JSON.stringify(admin || {}).replace(/<\//g, '<\\/');

  // Substitute template tokens
  let html = templateHtml;
  html = html.replace('{{PAGE_TITLE}}',       esc(product.name) + ' – ' + esc(site.brand));
  html = html.replace('{{META_DESCRIPTION}}', esc(product.shortDesc || product.name));
  html = html.replace('{{OG_TITLE}}',         esc(product.name));
  html = html.replace('{{OG_DESCRIPTION}}',   esc(product.shortDesc || ''));
  const ogImg = product.thumb || (Array.isArray(product.images) && product.images[0]) || '';
  html = html.replace('{{OG_IMAGE}}',         esc(`${imgBaseDir}/${ogImg}`));
  html = html.replace('{{PRODUCT_JSON}}',     productJsonRaw);
  html = html.replace('{{CHECKOUT_CONFIG_JSON}}', checkoutConfigRaw);
  html = html.replace('{{PRELOAD_LCP}}',      preloadLcp);

  // Section substitution (12 sections)
  html = html.replace('<!-- SECTION_TOP_NAV -->',       sectionTopNav);
  html = html.replace('<!-- SECTION_HERO_CAROUSEL -->', sectionHeroCarousel);
  html = html.replace('<!-- SECTION_PRICE_TITLE -->',   sectionPriceTitle);
  html = html.replace('<!-- SECTION_SELECT_OPTIONS -->', sectionSelectOptions);
  html = html.replace('<!-- SECTION_REVIEWS -->',       sectionReviews);
  html = html.replace('<!-- SECTION_ABOUT -->',         sectionAbout);
  html = html.replace('<!-- SECTION_HASHTAGS -->',      sectionHashtags);
  html = html.replace('<!-- SECTION_SELLER_SHELF -->', sectionSellerShelf);
  html = html.replace('<!-- SECTION_ALSO_LIKE -->',    sectionAlsoLike);
  html = html.replace('<!-- SECTION_BREADCRUMB -->',   sectionBreadcrumb);
  html = html.replace('<!-- SECTION_FOOTER -->',       sectionFooter);
  html = html.replace('<!-- SECTION_STICKY_CTA -->',   sectionStickyCta);
  html = html.replace('<!-- SECTION_CHECKOUT -->',      sectionCheckout);

  // Tracking injection
  html = html.replace('<!-- TRACKING_HEAD -->',          trackingHead);
  html = html.replace('<!-- TRACKING_BODY_NOSCRIPT -->', trackingBodyNoscript);

  return html;
}
