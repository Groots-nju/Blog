/* ═══════════════════════════════════════════════
   Groot's Notes — Invite Gate
   邀请码验证系统
═══════════════════════════════════════════════ */

/* ── 邀请码配置（哈希值，由 tools/generate-codes.html 生成）── */
var GATE_CODES = [
  /* 在这里粘贴哈希值，每行一个，例如：
     "a3f5c2e1d4b6a7f8e9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
  */  
"8ffef49bbcbb4b9c5453349a3464e210e180c3455539709ba0c927c399f1599e", // 魏钰函
];

/* ── 设置 ────────────────────────────────────── */
var GATE_SALT    = 'groot_notes_2026'; // 盐值，不要修改
var GATE_EXPIRY  = 30;                 // 登录有效天数
var GATE_STORAGE = 'mdx_gate_token';

/* ── 工具函数 ────────────────────────────────── */
async function sha256(str) {
  var buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str)
  );
  return Array.from(new Uint8Array(buf))
    .map(function(b) { return b.toString(16).padStart(2, '0'); })
    .join('');
}

function isUnlocked() {
  if (!GATE_CODES.length) return true; // 没有设置邀请码则放行
  try {
    var raw = localStorage.getItem(GATE_STORAGE);
    if (!raw) return false;
    var data = JSON.parse(raw);
    if (GATE_EXPIRY > 0 && Date.now() > data.exp) {
      localStorage.removeItem(GATE_STORAGE);
      return false;
    }
    return GATE_CODES.indexOf(data.hash) !== -1;
  } catch (e) { return false; }
}

function saveToken(hash) {
  var exp = GATE_EXPIRY > 0
    ? Date.now() + GATE_EXPIRY * 86400000
    : 9999999999999;
  localStorage.setItem(GATE_STORAGE, JSON.stringify({ hash: hash, exp: exp }));
}

/* ── 锁屏 HTML ──────────────────────────────── */
function buildOverlay() {
  var el = document.createElement('div');
  el.id = 'mdx-gate';
  el.innerHTML = [
    '<div class="mdx-gate-bg"></div>',
    '<div class="mdx-gate-card">',
    '  <div class="mdx-gate-icon">🔐</div>',
    '  <h1 class="mdx-gate-title">Groot\'s Notes</h1>',
    '  <p class="mdx-gate-sub">请输入邀请码以继续访问</p>',
    '  <div class="mdx-gate-field">',
    '    <input id="mdx-gate-input" type="text" ',
    '           placeholder="邀请码" autocomplete="off" spellcheck="false" />',
    '    <button id="mdx-gate-btn">进入 →</button>',
    '  </div>',
    '  <p class="mdx-gate-error" id="mdx-gate-error"></p>',
    '  <p class="mdx-gate-hint">没有邀请码？请联系 Groot 获取。</p>',
    '</div>'
  ].join('');
  return el;
}

/* ── 主逻辑 ─────────────────────────────────── */
function initGate() {
  if (!GATE_CODES.length) return; // 未配置邀请码，跳过
  if (isUnlocked()) return;       // 已验证，放行

  // 隐藏页面内容
  document.documentElement.style.visibility = 'hidden';

  var overlay = buildOverlay();
  document.body.appendChild(overlay);
  document.documentElement.style.visibility = 'visible';

  var input  = document.getElementById('mdx-gate-input');
  var btn    = document.getElementById('mdx-gate-btn');
  var errEl  = document.getElementById('mdx-gate-error');

  function showError(msg) {
    errEl.textContent = msg;
    input.classList.add('mdx-gate-shake');
    setTimeout(function() { input.classList.remove('mdx-gate-shake'); }, 500);
    input.value = '';
    input.focus();
  }

  function tryUnlock() {
    var code = input.value.trim();
    if (!code) return;
    btn.disabled = true;
    btn.textContent = '验证中…';

    sha256(code + GATE_SALT).then(function(hash) {
      if (GATE_CODES.indexOf(hash) !== -1) {
        saveToken(hash);
        overlay.classList.add('mdx-gate-unlock');
        setTimeout(function() { overlay.remove(); }, 600);
      } else {
        btn.disabled = false;
        btn.textContent = '进入 →';
        showError('邀请码无效，请重试');
      }
    });
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') tryUnlock();
  });
  setTimeout(function() { input.focus(); }, 100);
}

/* 普通加载 + navigation.instant 两种情况 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGate);
} else {
  initGate();
}
if (typeof document$ !== 'undefined') {
  document$.subscribe(initGate);
}
