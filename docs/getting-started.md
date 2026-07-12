# TikTok Shop Landing Page – Hướng dẫn Start & Build & Deploy

## Tổng quan

Đây là bộ sinh trang landing page kiểu TikTok Shop, mobile-first. Hệ thống đọc config sản phẩm từ `config/products.js` và tạo ra các file HTML tĩnh trong thư mục `dist/`.

**Không cần framework, không cần bundler** – chỉ cần Node.js >= 18.

---

## Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **npm** (đi kèm Node.js)
- Không có dependency bên ngoài (zero runtime deps)

---

## Cấu trúc thư mục

```
tiktok-shop/
├── config/
│   └── products.js       # Cấu hình sản phẩm, site, tracking
├── src/
│   ├── template.html     # Template HTML chung
│   ├── styles.css        # CSS (mobile-first)
│   └── main.js           # JavaScript client-side
├── assets/
│   └── products/         # Ảnh sản phẩm (hero, detail, cover)
├── build.js              # Script build chính
├── dist/                 # Output – deploy thư mục này
│   ├── index.html        # Trang catalog
│   ├── <slug>.html       # Trang chi tiết từng sản phẩm
│   ├── styles.css
│   ├── main.js
│   └── assets/
├── package.json
└── docs/                 # Tài liệu
```

---

## Bắt đầu nhanh (Quick Start)

### 1. Clone & cài đặt

```bash
git clone <repo-url>
cd tiktok-shop
```

Không cần `npm install` vì project không có dependency.

### 2. Build

```bash
npm run build
```

Lệnh này chạy `node build.js`, tạo ra toàn bộ file tĩnh trong `dist/`.

### 3. Xem trước (Preview)

```bash
npm run serve
```

Lệnh này build rồi khởi chạy server tĩnh tại `http://localhost:3000` (dùng `npx serve`).

---

## Thêm / sửa sản phẩm

Mở file `config/products.js`:

1. Thêm object sản phẩm mới vào mảng `products`
2. Đặt ảnh vào `assets/products/`
3. Chạy `npm run build`

Các trường quan trọng:
- `id`, `slug`, `name` – định danh và URL
- `price`, `originalPrice` – giá hiển thị
- `images[]` – danh sách ảnh hero carousel
- `detailImages[]` – ảnh mô tả sản phẩm
- `variants` – tùy chọn (màu, size...)
- `reviews[]` – đánh giá mock

---

## Build chi tiết

```bash
node build.js
```

Build sẽ:
1. Đọc `config/products.js` (ESM import)
2. Đọc `src/template.html`
3. Với mỗi sản phẩm → render HTML hoàn chỉnh → ghi vào `dist/<slug>.html`
4. Tạo `dist/index.html` (trang catalog liệt kê tất cả sản phẩm)
5. Copy `src/styles.css`, `src/main.js`, `assets/` vào `dist/`

**Output**: thư mục `dist/` chứa site tĩnh hoàn chỉnh, sẵn sàng deploy.

---

## Deploy

### Option A: Static hosting (khuyên dùng)

Upload toàn bộ thư mục `dist/` lên bất kỳ dịch vụ static hosting nào:

| Dịch vụ | Lệnh / Cách |
|---------|-------------|
| **Netlify** | Kéo thả thư mục `dist/` vào Netlify Drop, hoặc dùng CLI: `npx netlify-cli deploy --dir=dist --prod` |
| **Vercel** | `npx vercel dist --prod` |
| **Cloudflare Pages** | Connect repo → Build command: `npm run build` → Output: `dist` |
| **GitHub Pages** | Push `dist/` lên branch `gh-pages`, hoặc dùng GitHub Actions |
| **Firebase Hosting** | `firebase init hosting` → public: `dist` → `firebase deploy` |

### Option B: VPS / Server truyền thống

```bash
# Build trên máy local
npm run build

# Upload dist/ lên server
scp -r dist/ user@server:/var/www/tiktok-shop/

# Hoặc dùng rsync
rsync -avz dist/ user@server:/var/www/tiktok-shop/
```

Cấu hình Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/tiktok-shop;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Cache tĩnh
    location ~* \.(css|js|jpg|jpeg|webp|png|svg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option C: CI/CD tự động

Ví dụ GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Build & Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm run build
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ./dist
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Tracking & Analytics

Cấu hình pixel/tracking trong `config/products.js` → object `tracking`:

```js
tracking: {
  tiktokPixelId: 'YOUR_PIXEL_ID',
  fbPixelId: 'YOUR_FB_PIXEL_ID',
  googleAdsId: 'YOUR_GOOGLE_ADS_ID',
}
```

Rebuild sau khi thay đổi tracking ID.

---

## Lưu ý

- **Không commit `dist/`** nếu dùng CI/CD (thêm `dist/` vào `.gitignore`)
- **Ảnh nên dùng WebP** để tối ưu tốc độ tải
- **Test trên mobile** – UI được thiết kế mobile-first, luôn kiểm tra trên thiết bị thật
- Build lại mỗi khi thay đổi config hoặc source code
