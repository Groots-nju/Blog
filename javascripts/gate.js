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
var GATE_SALT    = 'groot_notes_2026';
var GATE_EXPIRY  = 30;
var GATE_STORAGE = 'mdx_gate_token';

/* ── 哈希（同步 fallback + async 两种方式）────── */
function simpleHash(str) {
  /* 当 crypto.subtle 不可用时的 fallback（djb2） */
  var h = 5381;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return 'fb_' + h.toString(16);
}

function getHash(str) {
  try {
    if (window.crypto && window.crypto.subtle) {
      return window.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(str))
        .then(function(buf) {
          return Array.from(new Uint8Array(buf))
            .map(function(b) { return b.toString(16).padStart(2, '0'); })
            .join('');
        })
        .catch(function() {
          return Promise.resolve(simpleHash(str));
        });
    }
  } catch (e) {}
  return Promise.resolve(simpleHash(str));
}

/* ── localStorage ───────────────────────────── */
function isUnlocked() {
  if (!GATE_CODES.length) return true;
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
  var exp = GATE_EXPIRY > 0 ? Date.now() + GATE_EXPIRY * 86400000 : 9999999999999;
  try { localStorage.setItem(GATE_STORAGE, JSON.stringify({ hash: hash, exp: exp })); } catch(e) {}
}

/* ── 锁屏 HTML ──────────────────────────────── */
function buildOverlay() {
  var el = document.createElement('div');
  el.id = 'mdx-gate';
  el.innerHTML =
    '<div class="mdx-gate-bg"></div>' +
    '<div class="mdx-gate-card">' +
    '  <div class="mdx-gate-icon">🔐</div>' +
    '  <h1 class="mdx-gate-title">Groot\'s Notes</h1>' +
    '  <p class="mdx-gate-sub">请输入邀请码以继续访问</p>' +
    '  <div class="mdx-gate-field">' +
    '    <input id="mdx-gate-input" type="text" placeholder="邀请码" autocomplete="off" spellcheck="false" />' +
    '    <button type="button" id="mdx-gate-btn">进入 →</button>' +
    '  </div>' +
    '  <p class="mdx-gate-error" id="mdx-gate-error"></p>' +
    '  <p class="mdx-gate-hint">没有邀请码？请联系 Groot 获取。</p>' +
    '</div>';
  return el;
}

/* ── 主逻辑 ─────────────────────────────────── */
function initGate() {
  if (!GATE_CODES.length) return;
  if (isUnlocked()) return;

  /* 先隐藏页面 */
  document.documentElement.style.visibility = 'hidden';

  /* 防重复 */
  var existing = document.getElementById('mdx-gate');
  if (existing) { document.documentElement.style.visibility = 'visible'; return; }

  var overlay = buildOverlay();
  document.body.appendChild(overlay);
  document.documentElement.style.visibility = 'visible';

  var input = document.getElementById('mdx-gate-input');
  var btn   = document.getElementById('mdx-gate-btn');
  var errEl = document.getElementById('mdx-gate-error');

  if (!input || !btn) return; /* 安全检查 */

  function reset(msg) {
    btn.disabled = false;
    btn.textContent = '进入 →';
    if (msg) {
      errEl.textContent = msg;
      input.classList.remove('mdx-gate-shake');
      void input.offsetWidth; /* 触发 reflow 让动画重新播放 */
      input.classList.add('mdx-gate-shake');
    }
    input.value = '';
    input.focus();
  }

  function tryUnlock() {
    var code = (input.value || '').trim();
    if (!code) { input.focus(); return; }

    btn.disabled = true;
    btn.textContent = '验证中…';
    errEl.textContent = '';

    getHash(code + GATE_SALT).then(function(hash) {
      if (GATE_CODES.indexOf(hash) !== -1) {
        saveToken(hash);
        overlay.classList.add('mdx-gate-unlock');
        setTimeout(function() {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 600);
      } else {
        reset('邀请码无效，请重试');
      }
    }).catch(function(err) {
      reset('验证出错，请刷新页面重试');
      console.error('[gate]', err);
    });
  }

  btn.addEventListener('click', function(e) { e.preventDefault(); tryUnlock(); });
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); tryUnlock(); } });
  setTimeout(function() { input.focus(); }, 150);
}

/* ── 启动 ───────────────────────────────────── */
function startGate() {
  if (document.body) {
    initGate();
  } else {
    document.addEventListener('DOMContentLoaded', initGate);
  }
}

startGate();

/* navigation.instant 支持 */
if (typeof document$ !== 'undefined') {
  document$.subscribe(function() {
    /* 每次页面切换后重新检查 */
    setTimeout(initGate, 0);
  });
}
