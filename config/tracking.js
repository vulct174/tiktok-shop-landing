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
  // Note: TikTok Pixel script is now in config/tiktok-pixel.html
  // Update that file when TikTok releases new pixel code
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
