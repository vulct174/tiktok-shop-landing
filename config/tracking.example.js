// ══════════════════════════════════════════════════════════════
// TRACKING & ANALYTICS CONFIGURATION TEMPLATE
// ══════════════════════════════════════════════════════════════
// Copy this file to tracking.js and fill in your credentials.
// tracking.js is gitignored to keep secrets safe.

// ── Analytics Pixels ──────────────────────────────────────────
// Leave any ID empty ('') to skip that provider's snippet.
export const tracking = {
  metaPixelId: '',
  tiktokPixelId: '',

  // Optional: paste full TikTok Pixel script here (overrides tiktokPixelId)
  // When TikTok updates their script, just paste the new version here
  // Example:
  // tiktokPixelScript: `<!-- TikTok Pixel Code Start -->
  // <script>
  // !function (w, d, t) { ... }(window, document, 'ttq');
  // </script>
  // <!-- TikTok Pixel Code End -->`,
  tiktokPixelScript: '',

  googleTagId: '',
  gtmId: '',
};

// ── Checkout: order submission endpoints ──────────────────────
export const checkout = {
  // Google Sheets Apps Script webhook (POST JSON body)
  googleSheetWebhook: 'YOUR_WEBHOOK_URL',

  // Secret token for webhook authentication
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
  adminKey: 'CHANGE_ME',
  adminPassword: 'CHANGE_ME',
};
