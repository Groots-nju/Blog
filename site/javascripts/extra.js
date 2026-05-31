/* ═══════════════════════════════════════════════
   Groot's Notes — extra.js
   GLightbox · Progress Bar · Word Count · Random
═══════════════════════════════════════════════ */

/* ── 文章 URL 列表（随机跳转用）─────────────────── */
var PAGES = [
  'note1/page1/', 'note1/page2/', 'note1/page3/',
  'blog/2026/05/31/hello/', 'blog/2026/05/28/kyoto/',
  'timeline/', 'map/'
];

/* ── 工具：获取 base_url ────────────────────────── */
function getBase() {
  var m = document.querySelector('meta[name="base"]');
  if (m) return m.content.replace(/\/$/, '');
  // 从 canonical link 推断
  var canon = document.querySelector('link[rel="canonical"]');
  if (canon) {
    var u = new URL(canon.href);
    var parts = u.pathname.split('/').filter(Boolean);
    if (parts.length > 1) return '/' + parts[0];
  }
  return '';
}

/* ── GLightbox 初始化 ───────────────────────────── */
function initLightbox() {
  if (typeof GLightbox === 'undefined') return;
  // 给所有内容图（非卡片缩略图）加 lightbox
  document.querySelectorAll('.md-typeset img:not(.card-thumb):not([data-no-lightbox])').forEach(function(img) {
    if (!img.closest('a')) {
      var wrap = document.createElement('a');
      wrap.href = img.src;
      wrap.className = 'glightbox';
      wrap.dataset.description = img.alt || '';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
    } else {
      img.closest('a').classList.add('glightbox');
    }
  });
  GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
}

/* ── 阅读进度条 ─────────────────────────────────── */
function initProgressBar() {
  var bar = document.getElementById('mdx-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'mdx-progress-bar';
    document.body.prepend(bar);
  }
  function update() {
    var el = document.documentElement;
    var pct = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
    bar.style.transform = 'scaleX(' + Math.min(1, pct) + ')';
  }
  window.removeEventListener('scroll', window.__progressScroll);
  window.__progressScroll = update;
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── 字数 + 阅读时长 ────────────────────────────── */
function initWordCount() {
  if (document.querySelector('.mdx-word-count')) return;
  var article = document.querySelector('article.md-content__inner, .md-content__inner');
  var h1 = article && article.querySelector('h1');
  if (!h1) return;

  // 只在文章页显示（不在首页/标签/地图等特殊页）
  if (document.body.classList.contains('no-wordcount')) return;

  var text = article.innerText || '';
  var zh = (text.match(/[一-龥]/g) || []).length;
  var en = (text.replace(/[一-龥]/g, ' ').match(/\b[a-zA-Z]{2,}\b/g) || []).length;
  var total = zh + en;
  if (total < 50) return; // 太短的页面不显示
  var mins = Math.max(1, Math.round(total / 280));

  var el = document.createElement('div');
  el.className = 'mdx-word-count';
  el.innerHTML =
    '<span class="mdx-wc-item">📖 约 <strong>' + total.toLocaleString() + '</strong> 字</span>' +
    '<span class="mdx-wc-sep">·</span>' +
    '<span class="mdx-wc-item">⏱ 预计阅读 <strong>' + mins + '</strong> 分钟</span>';
  h1.insertAdjacentElement('afterend', el);
}

/* ── 随机文章 ───────────────────────────────────── */
window.goRandom = function () {
  var base = getBase();
  var pick = PAGES[Math.floor(Math.random() * PAGES.length)];
  window.location.href = base + '/' + pick;
};

/* ── 主入口（兼容 navigation.instant）─────────────── */
function boot() {
  initProgressBar();
  initLightbox();
  initWordCount();
}

document.addEventListener('DOMContentLoaded', boot);
if (typeof document$ !== 'undefined') {
  document$.subscribe(function () {
    // 清理旧字数标签再重新注入
    document.querySelectorAll('.mdx-word-count').forEach(function (el) { el.remove(); });
    boot();
  });
}
