// ══════════════════════════════════════════════════════════════
// TRACKING & ANALYTICS CONFIGURATION
// ══════════════════════════════════════════════════════════════
// Separate config file for tracking pixels, webhooks, and secrets.
// Keep this file secure - contains sensitive credentials.

// ── Analytics Pixels ──────────────────────────────────────────
// Leave any ID empty ('') to skip that provider's snippet.
export const tracking = {
  metaPixelId: '',
  tiktokPixelId: 'D9D6F9BC77U2EG6DMA0G',

  // Optional: paste full TikTok Pixel script here (overrides tiktokPixelId)
  // When TikTok updates their script, just paste the new version here
  // Example:
  // tiktokPixelScript: `<!-- TikTok Pixel Code Start -->
  // <script>
  // !function (w, d, t) { ... }(window, document, 'ttq');
  // </script>
  // <!-- TikTok Pixel Code End -->`,
  tiktokPixelScript: `<!-- TikTok Pixel Code Start -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D9D6F9BC77U2EG6DMA0G');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- TikTok Pixel Code End -->`,

  googleTagId: '',
  gtmId: '',
};

// ── Checkout: order submission endpoints ──────────────────────
// Replace placeholder values with your real credentials.
export const checkout = {
  // Google Sheets Apps Script webhook (POST JSON body)
  googleSheetWebhook: 'https://script.google.com/macros/s/AKfycbzf_A0wQJIvgd0-GEKmp6mEgmYnW86H0JT_Sssa2mD33taMYcfXtQIjtuI9fUW1LM89/exec',

  // Secret token for webhook authentication (CHANGE THIS!)
  // Generate a random 32+ character string
  webhookSecret: 'CHANGE_ME_TO_RANDOM_STRING_AT_LEAST_32_CHARS',

  // Telegram Bot API
  telegramBotToken: 'YOUR_BOT_TOKEN',
  telegramChatId: 'YOUR_CHAT_ID',
};

// ── Admin Panel ───────────────────────────────────────────────
// Admin panel — access via ?admin=<adminKey>
// Then enter adminPassword when prompted
export const admin = {
  adminKey: 'xK9m2Qp7vL',   // Change this to your own secret URL key
  adminPassword: 'admin@2024', // Change this to your own password
};
