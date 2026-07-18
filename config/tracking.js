// ══════════════════════════════════════════════════════════════
// TRACKING & ANALYTICS CONFIGURATION
// ══════════════════════════════════════════════════════════════

// ── Analytics Pixels ──────────────────────────────────────────
// TikTok Pixel script is in config/tiktok-pixel.html
// tiktokPixelId is only used as fallback if that file doesn't exist
export const tracking = {
  metaPixelId: '',
  tiktokPixelId: '',
  googleTagId: '',
  gtmId: '',
};

// ── Checkout: order submission endpoints ──────────────────────
export const checkout = {
  googleSheetWebhook: 'https://script.google.com/macros/s/AKfycbzf_A0wQJIvgd0-GEKmp6mEgmYnW86H0JT_Sssa2mD33taMYcfXtQIjtuI9fUW1LM89/exec',
  webhookSecret: 'CHANGE_ME_TO_RANDOM_STRING_AT_LEAST_32_CHARS',
  telegramBotToken: 'YOUR_BOT_TOKEN',
  telegramChatId: 'YOUR_CHAT_ID',
};

// ── Admin Panel ───────────────────────────────────────────────
export const admin = {
  adminKey: 'xK9m2Qp7vL',
  adminPassword: 'admin@2024',
};
