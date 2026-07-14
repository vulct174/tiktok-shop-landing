/* ═══════════════════════════════════════════════════════════════════
   ADMIN PANEL — hidden, only activates with ?admin=1
   Shows: Order Log, Order Queue, Config status
   ═══════════════════════════════════════════════════════════════════ */
(function() {
  var adminConfig = window.__ADMIN_CONFIG__ || {};
  var adminKey = adminConfig.adminKey || '';
  var adminPassword = adminConfig.adminPassword || '';
  var urlParam = new URLSearchParams(window.location.search).get('admin');

  // Gate 1: URL key must match
  if (!adminKey || urlParam !== adminKey) return;

  // Gate 2: Password prompt
  var attempts = 0;
  var maxAttempts = 3;
  var authenticated = false;
  while (attempts < maxAttempts) {
    var input = prompt('Admin Password (' + (maxAttempts - attempts) + ' lần thử):');
    if (input === null) return; // cancelled
    if (input === adminPassword) { authenticated = true; break; }
    attempts++;
  }
  if (!authenticated) { alert('Sai mật khẩu. Truy cập bị từ chối.'); return; }

  var ORDER_QUEUE_KEY = 'tts_order_queue';
  var ORDER_LOG_KEY = 'tts_order_log';

  function getQueue() {
    try { return JSON.parse(localStorage.getItem(ORDER_QUEUE_KEY)) || []; } catch(e) { return []; }
  }
  function getLog() {
    try { return JSON.parse(localStorage.getItem(ORDER_LOG_KEY)) || []; } catch(e) { return []; }
  }

  // Create admin panel DOM
  var panel = document.createElement('div');
  panel.id = 'admin-panel';
  panel.innerHTML = ''
    + '<div class="admin-header">'
    + '<span class="admin-title">Admin Panel</span>'
    + '<button class="admin-toggle">\u2212</button>'
    + '</div>'
    + '<div class="admin-body">'
    + '<div class="admin-tabs">'
    + '<button class="admin-tab active" data-tab="log">Order Log</button>'
    + '<button class="admin-tab" data-tab="queue">Queue</button>'
    + '<button class="admin-tab" data-tab="config">Config</button>'
    + '</div>'
    + '<div class="admin-section active" id="admin-log"><div id="admin-log-content"></div></div>'
    + '<div class="admin-section" id="admin-queue"><div id="admin-queue-content"></div></div>'
    + '<div class="admin-section" id="admin-config"><div id="admin-config-content"></div></div>'
    + '</div>';
  document.body.appendChild(panel);

  // Inject styles
  var style = document.createElement('style');
  style.textContent = '#admin-panel{position:fixed;bottom:0;left:0;right:0;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;background:#1a1a2e;color:#e0e0e0;box-shadow:0 -2px 20px rgba(0,0,0,.5);max-height:60vh;display:flex;flex-direction:column}'
    + '.admin-header{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:#16213e;border-bottom:1px solid #0f3460}'
    + '.admin-title{font-weight:700;font-size:14px;color:#e94560}'
    + '.admin-toggle{background:none;border:none;color:#e0e0e0;font-size:18px;cursor:pointer;padding:4px 8px}'
    + '.admin-body{overflow-y:auto;flex:1}.admin-body.collapsed{display:none}'
    + '.admin-tabs{display:flex;border-bottom:1px solid #0f3460}'
    + '.admin-tab{background:none;border:none;color:#aaa;padding:10px 16px;cursor:pointer;font-size:13px;border-bottom:2px solid transparent}'
    + '.admin-tab.active{color:#e94560;border-bottom-color:#e94560}'
    + '.admin-section{display:none;padding:12px 16px}.admin-section.active{display:block}'
    + '.admin-table{width:100%;border-collapse:collapse;font-size:12px}'
    + '.admin-table th,.admin-table td{padding:6px 10px;text-align:left;border-bottom:1px solid #0f3460}'
    + '.admin-table th{color:#888;font-weight:600;text-transform:uppercase;font-size:11px}'
    + '.admin-mono{font-family:monospace;font-size:11px}'
    + '.admin-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}'
    + '.admin-badge.success{background:#0a3d2a;color:#4ecca3}'
    + '.admin-badge.error{background:#3d0a0a;color:#e94560}'
    + '.admin-badge.pending{background:#3d3a0a;color:#f0c040}'
    + '.admin-empty{color:#666;text-align:center;padding:24px}'
    + '.admin-queue-count{padding:8px 0;color:#f0c040;font-weight:600}'
    + '.admin-btn{padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-top:12px;background:#0f3460;color:#e0e0e0}'
    + '.admin-btn:hover{background:#1a4f8a}'
    + '.admin-btn-danger{background:#5a1a1a;color:#e94560}'
    + '.admin-btn-danger:hover{background:#7a2a2a}'
    + 'h4{color:#888;margin:16px 0 8px;font-size:12px;text-transform:uppercase}'
    + '.admin-guide{margin:12px 0;border:1px solid #0f3460;border-radius:6px;overflow:hidden}'
    + '.admin-guide summary{padding:10px 14px;cursor:pointer;color:#4ecca3;font-weight:600;font-size:12px;background:#16213e}'
    + '.admin-guide summary:hover{background:#1a2f4e}'
    + '.admin-guide-body{padding:12px 14px;font-size:12px;line-height:1.7}'
    + '.admin-guide-body ol{padding-left:20px;margin:8px 0}'
    + '.admin-guide-body li{margin:4px 0}'
    + '.admin-code-block{background:#0d1117;border:1px solid #30363d;border-radius:4px;padding:10px 12px;margin:8px 0;overflow-x:auto;font-family:monospace;font-size:11px;line-height:1.5;white-space:pre;color:#c9d1d9}';
  document.head.appendChild(style);

  // Tab switching
  var tabs = panel.querySelectorAll('.admin-tab');
  var sections = panel.querySelectorAll('.admin-section');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      sections.forEach(function(s) { s.classList.remove('active'); });
      tab.classList.add('active');
      panel.querySelector('#admin-' + tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'log') renderLog();
      if (tab.dataset.tab === 'queue') renderQueue();
      if (tab.dataset.tab === 'config') renderConfig();
    });
  });

  // Toggle panel
  var toggleBtn = panel.querySelector('.admin-toggle');
  var body = panel.querySelector('.admin-body');
  toggleBtn.addEventListener('click', function() {
    body.classList.toggle('collapsed');
    toggleBtn.textContent = body.classList.contains('collapsed') ? '+' : '−';
  });

  // Render functions
  function renderLog() {
    var log = getLog();
    var container = panel.querySelector('#admin-log-content');
    if (log.length === 0) { container.innerHTML = '<p class="admin-empty">Chưa có log nào</p>'; return; }
    var html = '<table class="admin-table"><thead><tr><th>Time</th><th>Order ID</th><th>Status</th><th>Details</th></tr></thead><tbody>';
    for (var i = log.length - 1; i >= 0; i--) {
      var entry = log[i];
      var statusClass = entry.status === 'done' ? 'success' : entry.status === 'failed' ? 'error' : 'pending';
      html += '<tr><td>' + (entry.time || '').replace('T', ' ').substr(0, 19) + '</td>'
        + '<td class="admin-mono">' + (entry.id || '').substr(0, 16) + '</td>'
        + '<td><span class="admin-badge ' + statusClass + '">' + entry.status + '</span></td>'
        + '<td>' + (entry.details || '') + '</td></tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  function renderQueue() {
    var queue = getQueue();
    var container = panel.querySelector('#admin-queue-content');
    if (queue.length === 0) { container.innerHTML = '<p class="admin-empty">Queue trống — tất cả đơn đã gửi thành công</p>'; return; }
    var html = '<div class="admin-queue-count">' + queue.length + ' đơn đang chờ gửi lại</div>';
    html += '<table class="admin-table"><thead><tr><th>ID</th><th>Khách</th><th>SĐT</th><th>Sản phẩm</th><th>Retries</th><th>Created</th></tr></thead><tbody>';
    for (var i = 0; i < queue.length; i++) {
      var item = queue[i];
      html += '<tr><td class="admin-mono">' + (item.id || '').substr(0, 16) + '</td>'
        + '<td>' + (item.data ? item.data.name : '') + '</td>'
        + '<td>' + (item.data ? item.data.phone : '') + '</td>'
        + '<td>' + (item.data ? item.data.product : '') + '</td>'
        + '<td>' + (item.retries || 0) + '</td>'
        + '<td>' + (item.createdAt || '').replace('T', ' ').substr(0, 19) + '</td></tr>';
    }
    html += '</tbody></table>';
    html += '<button class="admin-btn admin-retry-all">Gửi lại tất cả</button> ';
    html += '<button class="admin-btn admin-btn-danger admin-clear-queue">Xoá queue</button>';
    container.innerHTML = html;

    container.querySelector('.admin-retry-all').addEventListener('click', function() {
      var q = getQueue();
      q.forEach(function(item, idx) {
        setTimeout(function() {
          if (window.__processOrderItem) window.__processOrderItem(item, 0);
        }, idx * 1500);
      });
      alert('Đang gửi lại ' + q.length + ' đơn...');
    });
    container.querySelector('.admin-clear-queue').addEventListener('click', function() {
      if (confirm('Xoá toàn bộ queue? Data sẽ mất vĩnh viễn.')) {
        localStorage.removeItem(ORDER_QUEUE_KEY);
        renderQueue();
      }
    });
  }

  function renderConfig() {
    var container = panel.querySelector('#admin-config-content');
    var config = window.__CHECKOUT_CONFIG__ || {};
    var html = '<table class="admin-table"><tbody>';
    html += '<tr><td>Google Sheet Webhook</td><td>' + (config.googleSheetWebhook ? (config.googleSheetWebhook.indexOf('YOUR_SCRIPT_ID') !== -1 ? '<span class="admin-badge error">Chưa cấu hình</span>' : '<span class="admin-badge success">OK</span> ' + config.googleSheetWebhook.substr(0, 50) + '...') : '<span class="admin-badge error">Không có</span>') + '</td></tr>';
    html += '<tr><td>Telegram Bot Token</td><td>' + (config.telegramBotToken ? (config.telegramBotToken.indexOf('YOUR_BOT_TOKEN') !== -1 ? '<span class="admin-badge error">Chưa cấu hình</span>' : '<span class="admin-badge success">OK</span> ***' + config.telegramBotToken.substr(-6)) : '<span class="admin-badge error">Không có</span>') + '</td></tr>';
    html += '<tr><td>Telegram Chat ID</td><td>' + (config.telegramChatId ? '<span class="admin-badge success">OK</span> ' + config.telegramChatId : '<span class="admin-badge error">Không có</span>') + '</td></tr>';
    html += '</tbody></table>';

    // Setup guides for unconfigured endpoints
    var showGSheetGuide = !config.googleSheetWebhook || config.googleSheetWebhook.indexOf('YOUR_SCRIPT_ID') !== -1;
    var showTelegramGuide = !config.telegramBotToken || config.telegramBotToken.indexOf('YOUR_BOT_TOKEN') !== -1;

    if (showGSheetGuide) {
      html += '<details class="admin-guide"><summary>Hướng dẫn cấu hình Google Sheet Webhook</summary><div class="admin-guide-body"><ol>'
        + '<li>Tạo Google Sheet mới tại sheets.google.com</li>'
        + '<li>Vào Extensions → Apps Script</li>'
        + '<li>Xoá code mặc định, paste đoạn code sau:</li>'
        + '</ol>'
        + '<div class="admin-code-block">function doPost(e) {\n'
        + '  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\n'
        + '  var data = JSON.parse(e.postData.contents);\n'
        + '  sheet.appendRow([\n'
        + '    data.timestamp,\n'
        + '    data.name,\n'
        + '    data.phone,\n'
        + '    data.address,\n'
        + '    data.product,\n'
        + '    data.variant,\n'
        + '    data.quantity,\n'
        + '    data.total,\n'
        + '    data.payment,\n'
        + '    data.pageUrl\n'
        + '  ]);\n'
        + '  return ContentService.createTextOutput(\'OK\');\n'
        + '}</div>'
        + '<ol start="4">'
        + '<li>Click Deploy → New Deployment</li>'
        + '<li>Chọn Type: Web app</li>'
        + '<li>Execute as: Me, Who has access: Anyone</li>'
        + '<li>Click Deploy → Copy URL</li>'
        + '<li>Paste URL vào <code>config/products.js</code> → trường <code>googleSheetWebhook</code></li>'
        + '<li>Chạy <code>npm run build</code> để cập nhật</li>'
        + '</ol></div></details>';
    }

    if (showTelegramGuide) {
      html += '<details class="admin-guide"><summary>Hướng dẫn cấu hình Telegram Bot</summary><div class="admin-guide-body"><ol>'
        + '<li>Mở Telegram, tìm @BotFather</li>'
        + '<li>Gửi /newbot, đặt tên và username cho bot</li>'
        + '<li>Copy token Bot API (dạng: 123456:ABC-DEF...)</li>'
        + '<li>Paste token vào <code>config/products.js</code> → trường <code>telegramBotToken</code></li>'
        + '<li>Để lấy Chat ID:'
        + '<ul style="padding-left:16px;margin:4px 0">'
        + '<li>Thêm bot vào group chat (hoặc gửi tin nhắn cho bot)</li>'
        + '<li>Mở: <code>https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</code></li>'
        + '<li>Tìm "chat":{"id": ... } → đó là Chat ID</li>'
        + '</ul></li>'
        + '<li>Paste Chat ID vào <code>config/products.js</code> → trường <code>telegramChatId</code></li>'
        + '<li>Chạy <code>npm run build</code> để cập nhật</li>'
        + '</ol></div></details>';
    }

    html += '<h4>Test Webhook</h4>';
    html += '<button class="admin-btn admin-test-sheet">Test Google Sheet</button> ';
    html += '<button class="admin-btn admin-test-telegram">Test Telegram</button>';
    html += '<div id="admin-test-result" style="margin-top:10px;font-size:12px;color:#888"></div>';

    html += '<h4>localStorage Stats</h4><table class="admin-table"><tbody>';
    html += '<tr><td>Order Queue</td><td>' + getQueue().length + ' items</td></tr>';
    html += '<tr><td>Order Log</td><td>' + getLog().length + ' entries</td></tr>';
    var totalSize = 0;
    for (var k in localStorage) { if (localStorage.hasOwnProperty(k)) totalSize += localStorage[k].length; }
    html += '<tr><td>localStorage Usage</td><td>' + (totalSize / 1024).toFixed(1) + ' KB</td></tr>';
    html += '</tbody></table>';

    html += '<button class="admin-btn admin-btn-danger admin-clear-log">Xoá log</button>';
    container.innerHTML = html;

    container.querySelector('.admin-clear-log').addEventListener('click', function() {
      if (confirm('Xoá toàn bộ order log?')) {
        localStorage.removeItem(ORDER_LOG_KEY);
        renderConfig();
      }
    });

    var testResult = container.querySelector('#admin-test-result');
    var testData = {
      name: 'TEST - Admin Panel',
      phone: '0123456789',
      address: '123 Test Street, HCM',
      product: 'Test Product',
      variant: 'Default',
      quantity: 1,
      total: '815.000VND',
      totalRaw: 815000,
      payment: 'COD',
      timestamp: new Date().toLocaleString('vi-VN'),
      pageUrl: window.location.href
    };

    var testSheetBtn = container.querySelector('.admin-test-sheet');
    if (testSheetBtn) testSheetBtn.addEventListener('click', function() {
      if (!config.googleSheetWebhook || config.googleSheetWebhook.indexOf('YOUR_SCRIPT_ID') !== -1) {
        testResult.innerHTML = '<span class="admin-badge error">Chưa cấu hình webhook</span>';
        return;
      }
      testResult.innerHTML = '<span class="admin-badge pending">Đang gửi...</span>';
      fetch(config.googleSheetWebhook, {
        method: 'POST',
        body: JSON.stringify(testData),
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      }).then(function(r) {
        testResult.innerHTML = r.ok
          ? '<span class="admin-badge success">OK (' + r.status + ')</span> — kiểm tra Sheet'
          : '<span class="admin-badge error">Lỗi ' + r.status + '</span>';
      }).catch(function(e) {
        testResult.innerHTML = '<span class="admin-badge error">Lỗi: ' + e.message + '</span>';
      });
    });

    var testTgBtn = container.querySelector('.admin-test-telegram');
    if (testTgBtn) testTgBtn.addEventListener('click', function() {
      if (!config.telegramBotToken || config.telegramBotToken.indexOf('YOUR_BOT_TOKEN') !== -1) {
        testResult.innerHTML = '<span class="admin-badge error">Chưa cấu hình Telegram</span>';
        return;
      }
      testResult.innerHTML = '<span class="admin-badge pending">Đang gửi...</span>';
      var msg = '🧪 TEST ORDER\nKhách: ' + testData.name + '\nSĐT: ' + testData.phone + '\nĐịa chỉ: ' + testData.address + '\nSản phẩm: ' + testData.product + '\nTổng: ' + testData.total;
      fetch('https://api.telegram.org/bot' + config.telegramBotToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: config.telegramChatId, text: msg })
      }).then(function(r) { return r.json(); }).then(function(data) {
        testResult.innerHTML = data.ok
          ? '<span class="admin-badge success">OK</span> — kiểm tra Telegram'
          : '<span class="admin-badge error">Lỗi: ' + data.description + '</span>';
      }).catch(function(e) {
        testResult.innerHTML = '<span class="admin-badge error">Lỗi: ' + e.message + '</span>';
      });
    });
  }

  // Initial render
  renderLog();
})();
