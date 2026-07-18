# Webhook Security Setup

## Bước 1: Tạo Secret Token

Tạo chuỗi ngẫu nhiên ít nhất 32 ký tự, ví dụ:
```
x9K2mQ7vL4pN8hR5jT3wZ6aY1cF0uE2g
```

Cập nhật vào `config/products.js`:
```js
export const checkout = {
  googleSheetWebhook: 'YOUR_WEBHOOK_URL',
  webhookSecret: 'x9K2mQ7vL4pN8hR5jT3wZ6aY1cF0uE2g', // thay bằng token của bạn
  ...
};
```

## Bước 2: Cập nhật Google Apps Script

Mở Google Apps Script editor của webhook, thay code bằng:

```js
// Replace YOUR_SECRET_TOKEN with the same value from config/products.js
const WEBHOOK_SECRET = 'x9K2mQ7vL4pN8hR5jT3wZ6aY1cF0uE2g';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validate secret token
    if (!data._secret || data._secret !== WEBHOOK_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Unauthorized: invalid secret'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Remove secret from data before logging
    delete data._secret;

    // Get active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Customer Name',
        'Phone',
        'Address',
        'Product',
        'Variant',
        'Quantity',
        'Total',
        'Payment',
        'Page URL'
      ]);
    }

    // Append order data
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('vi-VN'),
      data.name || '',
      data.phone || '',
      data.address || '',
      data.product || '',
      data.variant || '',
      data.quantity || '',
      data.total || '',
      data.payment || 'COD',
      data.pageUrl || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Order recorded'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Bước 3: Deploy lại

1. Trong Apps Script editor: **Deploy** > **Manage deployments**
2. Click icon ⚙️ (Edit) ở deployment hiện tại
3. **Version**: New version
4. **Save** → Copy URL mới (hoặc giữ nguyên URL cũ)

## Bảo mật

✅ **Đã có:**
- Secret token validation ngăn spam request
- Admin credentials chỉ có trong `admin.html`
- DevTools blocking với `disable-devtool`

⚠️ **Lưu ý:**
- `webhookSecret` vẫn nằm trong HTML source (static site limitation)
- Đây là lớp bảo vệ cơ bản, không thay thế authentication thật
- Nếu cần bảo mật cao hơn → dùng serverless function (Cloudflare Workers, Vercel Edge)

## Rate Limiting (Optional)

Thêm rate limiting vào Apps Script:

```js
const RATE_LIMIT_KEY = 'rate_limit_';
const MAX_REQUESTS_PER_MINUTE = 10;

function doPost(e) {
  const clientIp = e.parameter.userIp || 'unknown';
  const cacheKey = RATE_LIMIT_KEY + clientIp;
  const cache = CacheService.getScriptCache();

  const requestCount = parseInt(cache.get(cacheKey) || '0');
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Rate limit exceeded'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  cache.put(cacheKey, (requestCount + 1).toString(), 60); // 60 seconds TTL

  // ... rest of validation logic
}
```
