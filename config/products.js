// config/products.js
// ============================================================
// SINGLE SOURCE OF TRUTH — edit this file to update products
// and site settings. Re-run `npm run build` to regenerate dist/.
//
// Tracking pixels, webhooks, and admin credentials are now in
// config/tracking.js (keep that file secure!)
// ============================================================

// Import tracking config
export { tracking, checkout, admin } from './tracking.js';

export const site = {
  brand: 'TikTok Shop VN',
  currency: '₫',
  hotline: '1800 1234',
  imageBaseDir: 'assets/products',
  // Default seller name (per-product can override)
  sellerName: 'Năng Lượng Xanh',
  // App store badge image refs (relative to imageBaseDir)
  appBadges: {
    googlePlay: 'badge-google-play.png',
    appStore: 'badge-app-store.png',
  },
  // Default breadcrumb trail
  breadcrumb: ['TikTok Shop', 'Nhà cửa & Đời sống', 'Năng lượng mặt trời & Gió', 'Hệ thống điện mặt trời'],
  // Footer accordion groups
  footerGroups: [
    {
      title: 'Mua sắm',
      links: [
        { label: 'Tất cả danh mục', href: '#' },
        { label: 'Flash Sale', href: '#' },
        { label: 'Voucher & Mã giảm giá', href: '#' },
        { label: 'Hàng ngày giá tốt', href: '#' },
      ],
    },
    {
      title: 'Bán hàng',
      links: [
        { label: 'Bán hàng trên TikTok Shop', href: '#' },
        { label: 'Trung tâm người bán', href: '#' },
        { label: 'Chính sách người bán', href: '#' },
      ],
    },
    {
      title: 'Về TikTok Shop',
      links: [
        { label: 'Giới thiệu TikTok Shop', href: '#' },
        { label: 'Blog & Tin tức', href: '#' },
        { label: 'Tuyển dụng', href: '#' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Trung tâm trợ giúp', href: '#' },
        { label: 'Hoàn trả & Hoàn tiền', href: '#' },
        { label: 'Liên hệ hỗ trợ', href: '#' },
        { label: 'Báo cáo vi phạm', href: '#' },
      ],
    },
    {
      title: 'Pháp lý',
      links: [
        { label: 'Điều khoản dịch vụ', href: '#' },
        { label: 'Chính sách bảo mật', href: '#' },
        { label: 'Chính sách Cookie', href: '#' },
      ],
    },
  ],
};

export const products = [
  // ─── Product 1 ─── REAL product ─────────────────────────
  // Real price/rating/sold from TikTok Shop listing (seller: Năng Lượng Xanh).
  {
    id: 'p1',
    slug: 'den-nang-luong-mat-troi',
    name: 'Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W - 308 LED',
    price: 815000,           // -56% vs original
    originalPrice: 1818000,
    rating: 4.8,             // 10 đánh giá
    sold: 49,
    sellerName: 'Năng Lượng Xanh',
    shortDesc: 'Đèn năng lượng mặt trời Mắt Ngọc 2000W – 308 LED bản cao cấp, 5 mặt sáng toả rộng gấp 3, pin Cell dung lượng cao, tặng dây nối 5M, bảo hành 5 năm 1 đổi 1.',
    description: `<p>Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W – 308 LED là dòng đèn năng lượng mặt trời cao cấp dành cho sân vườn, cổng nhà, sân thượng và các khu vực ngoài trời cần ánh sáng mạnh, bền bỉ.</p>
<ul>
  <li><strong>308 bóng LED siêu sáng</strong> – công suất tương đương 2000W, chiếu sáng diện rộng</li>
  <li><strong>5 mặt sáng toả rộng gấp 3</strong> lần so với đèn thông thường, không có góc khuất</li>
  <li><strong>Pin Cell</strong> dung lượng cao, sạc nhanh hơn và lưu điện lâu hơn pin thường</li>
  <li><strong>Cảm biến ánh sáng tự động</strong> – tự bật khi trời tối, tự tắt khi trời sáng</li>
  <li><strong>Tặng kèm dây nối 5M</strong> – lắp đặt linh hoạt, không cần đi dây điện</li>
  <li><strong>Bảo hành 5 năm – 1 đổi 1</strong> toàn bộ sản phẩm nếu lỗi nhà sản xuất</li>
  <li>Chống nước cao cấp, chịu được mưa lớn và thời tiết khắc nghiệt</li>
  <li>Lắp đặt đơn giản, không cần thợ điện</li>
</ul>`,
    // Hero gallery: 12 deduped square/near-square product images, cover first
    images: [
      'den-nlmt-2000w-01.webp',
      'den-nlmt-2000w-02.jpg',
      'den-nlmt-2000w-03.webp',
      'den-nlmt-2000w-04.webp',
      'den-nlmt-2000w-05.webp',
      'den-nlmt-2000w-06.webp',
      'den-nlmt-2000w-07.webp',
      'den-nlmt-2000w-08.webp',
      'den-nlmt-2000w-09.webp',
      'den-nlmt-2000w-10.webp',
      'den-nlmt-2000w-11.webp',
      'den-nlmt-2000w-12.webp',
    ],
    // Thumbnail / OG image = cover (hero-01)
    thumb: 'den-nlmt-2000w-01.webp',
    // Detail images (used in About section, not a separate gallery)
    gallery: [
      'den-nlmt-2000w-detail-01.webp',
      'den-nlmt-2000w-detail-02.webp',
      'den-nlmt-2000w-detail-03.jpg',
      'den-nlmt-2000w-detail-04.webp',
      'den-nlmt-2000w-detail-05.webp',
      'den-nlmt-2000w-detail-06.jpg',
      'den-nlmt-2000w-detail-07.webp',
      'den-nlmt-2000w-detail-08.jpg',
      'den-nlmt-2000w-detail-09.webp',
      'den-nlmt-2000w-detail-10.webp',
      'den-nlmt-2000w-detail-11.webp',
      'den-nlmt-2000w-detail-12.webp',
      'den-nlmt-2000w-detail-13.webp',
      'den-nlmt-2000w-detail-14.webp',
      'den-nlmt-2000w-detail-15.webp',
      'den-nlmt-2000w-detail-16.webp',
      'den-nlmt-2000w-detail-17.webp',
      'den-nlmt-2000w-detail-18.webp',
      'den-nlmt-2000w-detail-19.jpg',
      'den-nlmt-2000w-detail-20.webp',
      'den-nlmt-2000w-detail-21.webp',
      'den-nlmt-2000w-detail-22.webp',
      'den-nlmt-2000w-detail-23.jpg',
      'den-nlmt-2000w-detail-24.jpg',
      'den-nlmt-2000w-detail-25.jpg',
      'den-nlmt-2000w-detail-26.jpg',
      'den-nlmt-2000w-detail-27.jpg',
      'den-nlmt-2000w-detail-28.jpg',
      'den-nlmt-2000w-detail-29.jpg',
      'den-nlmt-2000w-detail-30.jpg',
      'den-nlmt-2000w-detail-31.jpg',
      'den-nlmt-2000w-detail-32.webp',
      'den-nlmt-2000w-detail-33.jpg',
      'den-nlmt-2000w-detail-34.jpg',
      'den-nlmt-2000w-detail-35.jpg',
      'den-nlmt-2000w-detail-36.jpg',
      'den-nlmt-2000w-detail-37.jpg',
      'den-nlmt-2000w-detail-38.jpg',
      'den-nlmt-2000w-detail-39.jpg',
      'den-nlmt-2000w-detail-40.jpg',
    ],
    variants: {
      color: ['Mặc định'],
    },
    badges: ['Pin Cell', 'Tặng dây 5M', '308 LED', 'Bảo hành 5 năm'],
    usp: [
      { icon: '☀️', text: '5 mặt sáng toả rộng gấp 3' },
      { icon: '🛡️', text: 'Bảo hành 5 năm – 1 đổi 1' },
      { icon: '🔋', text: 'Pin Cell dung lượng cao' },
      { icon: '🎁', text: 'Tặng dây nối 5M' },
      { icon: '💡', text: 'Cảm biến ánh sáng tự động' },
    ],
    relatedIds: ['p2', 'p3', 'p4'],
    hashtags: [
      '#dennangluongmattroi',
      '#dennlmt',
      '#solarlight',
      '#gbsolar',
      '#dennangluongmattroisanvuon',
    ],
    // Per-product breadcrumb (falls back to site.breadcrumb if omitted)
    // breadcrumb: omitted → use site default
    reviews: {
      average: 4.8,
      total: 10,
      breakdown: { 5: 8, 4: 2, 3: 0, 2: 0, 1: 0 },
      // Photos strip: reuse existing detail images
      photos: [
        'den-nlmt-2000w-detail-05.webp',
        'den-nlmt-2000w-detail-10.webp',
        'den-nlmt-2000w-detail-15.webp',
        'den-nlmt-2000w-detail-20.webp',
      ],
      items: [
        {
          name: 'N**n T**n',
          verified: true,
          region: 'VN',
          stars: 5,
          text: 'đèn sáng lắm nha nhà bên cạnh mua mắt tiền hơn đèn mình ăn đứt',
          photo: 'den-nlmt-2000w-detail-05.webp',
          itemLabel: 'Mặc định',
          date: '2026-07-07',
        },
        {
          name: 'p**m h**h h**',
          verified: true,
          region: 'VN',
          stars: 5,
          text: 'đèn giống như quảng cáo chất lượng thì phải dùng thử xem thế nào',
          itemLabel: 'Mặc định',
          date: '2026-07-04',
        },
        {
          name: 'w**9',
          verified: true,
          region: 'VN',
          stars: 5,
          text: 'Nhận được sản phẩm y như giới thiệu, đèn sáng, còn chất lượng thì thời gian mới biết được',
          photo: 'den-nlmt-2000w-detail-10.webp',
          itemLabel: 'Mặc định',
          date: '2026-07-04',
        },
      ],
    },
  },

  // ─── Product 2 ─── placeholder ──────────────────────────
  {
    id: 'p2',
    slug: 'noi-chien-khong-dau',
    name: 'Nồi Chiên Không Dầu Thông Minh 5.5L - Màn Hình Cảm Ứng',
    price: 890000,
    originalPrice: 1490000,
    rating: 4.7,
    sold: 8320,
    shortDesc: 'Nồi chiên không dầu dung tích lớn 5.5L, màn hình cảm ứng, 12 chế độ nấu tự động, tiết kiệm 80% dầu ăn.',
    description: `<p>Nồi Chiên Không Dầu Thông Minh 5.5L mang đến trải nghiệm nấu ăn lành mạnh, tiện lợi cho cả gia đình.</p>
<ul>
  <li>Dung tích 5.5L – phù hợp gia đình 4–6 người</li>
  <li>Màn hình cảm ứng LED hiện đại, dễ thao tác</li>
  <li>12 chế độ nấu tự động: chiên, nướng, hấp, sấy khô</li>
  <li>Tiết kiệm 80% dầu ăn, tốt cho sức khỏe</li>
  <li>Lớp phủ chống dính Teflon cao cấp, vệ sinh dễ dàng</li>
  <li>Công suất 1700W, đạt nhiệt độ nhanh chóng</li>
</ul>`,
    images: ['noi-chien-khong-dau-cover.svg'],
    thumb: 'noi-chien-khong-dau-cover.svg',
    gallery: [],
    variants: { color: ['Đen', 'Trắng', 'Xám'] },
    badges: ['HOT', 'Deal'],
    usp: [],
    relatedIds: ['p1', 'p3', 'p5'],
  },

  // ─── Product 3 ─── placeholder ──────────────────────────
  {
    id: 'p3',
    slug: 'robot-hut-bui',
    name: 'Robot Hút Bụi Thông Minh AI Navigation - Lau Nhà Tự Động',
    price: 1590000,
    originalPrice: 2990000,
    rating: 4.6,
    sold: 5670,
    shortDesc: 'Robot hút bụi AI tự lập bản đồ nhà, hút & lau kết hợp, pin 2600mAh, tự về sạc, điều khiển qua app điện thoại.',
    description: `<p>Robot Hút Bụi Thông Minh với công nghệ AI Navigation thế hệ mới, mang lại ngôi nhà sạch bóng mà không cần bạn bỏ công sức.</p>
<ul>
  <li>AI tự lập bản đồ nhà thông minh, tối ưu đường đi</li>
  <li>Kết hợp hút bụi và lau nhà trong một thiết bị</li>
  <li>Lực hút 2500Pa, làm sạch bụi mịn và lông thú cưng</li>
  <li>Pin 2600mAh, hoạt động liên tục 120 phút</li>
  <li>Tự động về trạm sạc khi hết pin</li>
  <li>Điều khiển qua app, hẹn giờ tiện lợi</li>
  <li>Cảm biến chống va chạm và rơi cầu thang</li>
</ul>`,
    images: ['robot-hut-bui-cover.svg'],
    thumb: 'robot-hut-bui-cover.svg',
    gallery: [],
    variants: { color: ['Đen', 'Trắng'] },
    badges: ['Bán Chạy', 'Xu hướng'],
    usp: [],
    relatedIds: ['p1', 'p2', 'p4', 'p5', 'p6'],
  },

  // ─── Product 4 ─── placeholder ──────────────────────────
  {
    id: 'p4',
    slug: 'may-loc-khong-khi',
    name: 'Máy Lọc Không Khí HEPA H13 - Diệt Khuẩn UV, Phòng 60m²',
    price: 1290000,
    originalPrice: 2190000,
    rating: 4.9,
    sold: 3450,
    shortDesc: 'Máy lọc không khí bộ lọc HEPA H13 cao cấp, đèn UV diệt khuẩn, lọc 99.97% bụi mịn PM2.5, phù hợp phòng đến 60m².',
    description: `<p>Máy Lọc Không Khí HEPA H13 bảo vệ sức khỏe cả gia đình khỏi bụi mịn, vi khuẩn, virus, và các chất gây dị ứng.</p>
<ul>
  <li>Bộ lọc HEPA H13 lọc 99.97% bụi mịn PM2.5</li>
  <li>Đèn UV-C diệt khuẩn và virus hiệu quả</li>
  <li>Phù hợp phòng diện tích đến 60m²</li>
  <li>Lọc than hoạt tính khử mùi hôi, formaldehyde</li>
  <li>Cảm biến chất lượng không khí thời gian thực</li>
  <li>Chế độ ngủ siêu yên tĩnh dưới 25dB</li>
  <li>Timer và điều khiển từ xa thông minh</li>
</ul>`,
    images: ['may-loc-khong-khi-cover.svg'],
    thumb: 'may-loc-khong-khi-cover.svg',
    gallery: [],
    variants: { color: ['Trắng', 'Xám Bạc'] },
    badges: ['Top 1', 'Hàng Việt'],
    usp: [],
    relatedIds: ['p1', 'p3', 'p5'],
  },

  // ─── Product 5 ─── placeholder ──────────────────────────
  {
    id: 'p5',
    slug: 'may-pha-ca-phe',
    name: 'Máy Pha Cà Phê Espresso Tự Động 15 Bar - Cappuccino Latte',
    price: 2190000,
    originalPrice: 3990000,
    rating: 4.7,
    sold: 2180,
    shortDesc: 'Máy pha cà phê espresso 15 bar áp suất cao, tích hợp bình đánh sữa, màn hình LCD, làm được espresso, cappuccino, latte.',
    description: `<p>Máy Pha Cà Phê Espresso 15 Bar mang hương vị cà phê quán đến tận nhà bạn, với thiết kế sang trọng và tính năng chuyên nghiệp.</p>
<ul>
  <li>Áp suất 15 bar – chuẩn barista chuyên nghiệp</li>
  <li>Bình đánh sữa tạo bọt mịn cho cappuccino, latte</li>
  <li>Màn hình LCD hiển thị trực quan, dễ sử dụng</li>
  <li>Bình chứa nước 1.8L, ngăn chứa bã cà phê 14 viên</li>
  <li>Công suất 1450W, nước nóng sẵn sàng sau 30 giây</li>
  <li>Tương thích cả bột cà phê xay và viên nén ESE</li>
  <li>Vệ sinh tự động theo chu kỳ</li>
</ul>`,
    images: ['may-pha-ca-phe-cover.svg'],
    thumb: 'may-pha-ca-phe-cover.svg',
    gallery: [],
    variants: { color: ['Đen', 'Bạc', 'Đỏ Đô'] },
    badges: ['Cao Cấp', 'Deal'],
    usp: [],
    relatedIds: ['p2', 'p3', 'p6'],
  },

  // ─── Product 6 ─── placeholder ──────────────────────────
  {
    id: 'p6',
    slug: 'loa-bluetooth',
    name: 'Loa Bluetooth Chống Nước IPX7 - Âm Thanh 360°, Bass Mạnh',
    price: 490000,
    originalPrice: 890000,
    rating: 4.8,
    sold: 15600,
    shortDesc: 'Loa Bluetooth 5.3 chống nước IPX7, âm thanh 360° toàn hướng, bass sâu 30W, pin 24 giờ, kết nối ghép đôi TWS.',
    description: `<p>Loa Bluetooth Chống Nước IPX7 – người bạn đồng hành lý tưởng trong mọi chuyến đi, từ bãi biển đến camping, party ngoài trời.</p>
<ul>
  <li>Bluetooth 5.3 kết nối ổn định, phạm vi 15m</li>
  <li>Chống nước đạt chuẩn IPX7 – có thể ngâm trong nước 30 phút</li>
  <li>Công suất 30W, âm thanh 360° toàn hướng sống động</li>
  <li>Bass sâu với loa siêu trầm tần số thấp</li>
  <li>Pin 6000mAh, phát nhạc liên tục đến 24 giờ</li>
  <li>Ghép đôi TWS 2 loa cùng lúc cho âm thanh stereo</li>
  <li>Mic tích hợp, nghe gọi rảnh tay tiện lợi</li>
</ul>`,
    images: ['loa-bluetooth-cover.svg'],
    thumb: 'loa-bluetooth-cover.svg',
    gallery: [],
    variants: { color: ['Đen', 'Xanh Lam', 'Đỏ', 'Vàng'] },
    badges: ['Bán Chạy #1', 'Flash Sale'],
    usp: [],
    relatedIds: [],
  },
];

// ============================================================
// SELLER SHELF — "Explore more from <seller>" cross-sell cards.
// These are NOT landing pages; each links out to the live
// TikTok Shop listing (href) and uses the shop's CDN image (img).
// Data mirrors the real shop shelf (seller: Năng Lượng Xanh).
// Fields: name, price, originalPrice, rating, sold, flash, img, href
// ============================================================
export const sellerShelf = [
  {
    name: '[TẶNG DÂY 5M] [BẢN CAO CẤP 308 LED] [5 MẶT SÁNG TOẢ RỘNG GẤP 3] [ BẢO HÀNH 5 NĂM 1 ĐỔI 1] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W.',
    price: 815000, originalPrice: 1818000, rating: 4.7, sold: 1320, flash: true,
    img: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/d6740177fd1b44159aed1a66be57863f~tplv-o3syd03w52-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/1733587213215368841',
  },
  {
    name: '[Bảo Hành 5 Năm 1 Đổi 1] [BẢN CAO CẤP, NHÔM ĐÚC 96 LED 5054] Đèn Năng Lượng Mặt Trời Mắt Ngọc 600W',
    price: 489000, originalPrice: 1178000, rating: 4.8, sold: 656, flash: true,
    img: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/8782c2aab89342ffa25e0c8c6da4ecbd~tplv-o3syd03w52-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-600w-chong-loa-bao-hanh-5-nam/1734748237523355273',
  },
  {
    name: '[BẢN CAO CẤP, NHÔM ĐÚC 96 LED 5054] Đèn Năng Lượng Mặt Trời Mắt Ngọc 600W, Bảo Hành Chính Hãng Công Ty GB Solar 5 Năm 1 Đổi 1',
    price: 489000, originalPrice: 1178000, rating: 4.5, sold: 2388, flash: true,
    img: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/8782c2aab89342ffa25e0c8c6da4ecbd~tplv-o3syd03w52-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-600w-chong-loa-bao-hanh-5-nam/1733720717718161033',
  },
  {
    name: '[224 LED BẢN NÂNG CẤP BẢO HÀNH 5 NĂM 1 ĐỔI 1] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W.',
    price: 719000, originalPrice: 1638000, rating: 4.2, sold: 3255, flash: true,
    img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f1a4357011a14a52a7c6945e4f92b1b9~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-2000w-bao-hanh-5-nam-chong-loa/1732718737939728009',
  },
  {
    name: '[224 LED BẢN NÂNG CẤP BẢO HÀNH 5 NĂM 1 ĐỔI 1] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W',
    price: 719000, originalPrice: 1638000, rating: 4.4, sold: 6602, flash: true,
    img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f1a4357011a14a52a7c6945e4f92b1b9~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-2000w-bao-hanh-5-nam-chong-loa/1732505838367442569',
  },
  {
    name: 'Dây nối dài 5m đèn năng lượng ,Chống Nước, Bảo hành 2 năm 1 đổi 1',
    price: 49000, originalPrice: 98000, rating: 4.7, sold: 6447, flash: true,
    img: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/bc0ca9f48db943d49094178e09c0f828~tplv-o3syd03w52-resize-webp:600:600.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/day-noi-dai-5m-den-nang-luong-mat-troi-chong-nuoc-an-toan/1729578381774064265',
  },
  {
    name: '[PIN CELL+1 ĐỔI 1+BẢO HÀNH 5 NĂM] [224 LED BẢN NÂNG CẤP] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W.',
    price: 719000, originalPrice: 1638000, rating: 4.7, sold: 1736, flash: true,
    img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f1a4357011a14a52a7c6945e4f92b1b9~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/1734561655787652745',
  },
  {
    name: '[COMBO MUA 2 BỘ TẶNG 2 DÂY NỐI 5M] [BẢN CAO CẤP 308 LED] BẢO HÀNH 5 NĂM 1 ĐỔI 1, Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W',
    price: 1648000, originalPrice: 3636000, rating: 4.8, sold: 415, flash: true,
    img: 'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/1693fb5c2d4d44cda63d31695d5e7900~tplv-o3syd03w52-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-2000w-chong-loa-bao-hanh-5-nam/1733587212651431561',
  },
  {
    name: '[PIN CELL+1 ĐỔI 1+BẢO HÀNH 5 NĂM] [224 LED BẢN NÂNG CẤP] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W.',
    price: 719000, originalPrice: 1638000, rating: 4.5, sold: 445, flash: true,
    img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f1a4357011a14a52a7c6945e4f92b1b9~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-2000w-chong-loa-bao-hanh-5-nam/1735445050799720073',
  },
  {
    name: '[224 LED, COMBO MUA 2 BỘ TẶNG 1 DÂY NỐI 5M] [BẢN NÂNG CẤP BẢO HÀNH 5 NĂM 1 ĐỔI 1] Đèn Năng Lượng Mặt Trời Mắt Ngọc 2000W',
    price: 1468000, originalPrice: 3276000, rating: 4.4, sold: 1458, flash: true,
    img: 'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/575811b05bcc42d6948d87f0c3ea717c~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=e1be8f53&idc=my&from=2378011839',
    href: 'https://shop.tiktok.com/vn/pdp/den-nang-luong-mat-troi-2000w-bao-hanh-5-nam-chong-tham/1732506131771262601',
  },
];
