# Setup Instructions

## Initial Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd tiktok-shop
   npm install
   ```

2. **Create tracking config**
   ```bash
   cp config/tracking.example.js config/tracking.js
   ```

3. **Edit `config/tracking.js`** with your credentials:
   - TikTok Pixel ID or full script
   - Google Sheet webhook URL + secret token
   - Telegram bot credentials
   - Admin panel password

4. **Build**
   ```bash
   npm run build
   ```

## File Structure

```
config/
├── products.js          → Products, site settings (committed to git)
├── tracking.js          → Your credentials (gitignored, local only)
└── tracking.example.js  → Template (committed to git)
```

## Updating TikTok Pixel Script

When TikTok updates their pixel code:

1. Open `config/tracking.js`
2. Paste full script into `tiktokPixelScript`:
   ```js
   export const tracking = {
     tiktokPixelScript: `<!-- TikTok Pixel Code Start -->
   <script>
   // paste entire new TikTok script here
   </script>
   <!-- TikTok Pixel Code End -->`,
     // ...
   };
   ```
3. Run `npm run build`

No need to edit build code!

## Security

- `config/tracking.js` is gitignored and never committed
- Contains: pixel IDs, webhook URLs, secrets, admin passwords
- Each developer/environment needs their own `tracking.js`
- See `WEBHOOK_SECURITY.md` for webhook setup

## Build & Deploy

```bash
npm run build    # Generate dist/
# Deploy dist/ folder to your hosting
```
