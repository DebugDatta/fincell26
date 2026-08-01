import { routes, typo, state } from './state.js';

export function $(s, r) { return (r || document).querySelector(s) }
export function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }

export function esc(v) { return String(v == null ? '' : v).replace(/[&<>\"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }

export function pathOf(p) { return p === 'home' ? '/' : '/' + p }

export function pageFromPath() {
  var p = location.pathname.replace(/^\//, '') || 'home';
  if (p === 'admin') return 'admin';
  return routes.some(function (r) { return r[0] === p }) ? p : 'home'
}

export function applyType(p) {
  var t = (state.typography && state.typography[p]) || typo, r = document.documentElement.style;
  r.setProperty('--heading-font', '"' + t.headingFont + '",Inter,Arial,sans-serif');
  r.setProperty('--body-font', '"' + t.bodyFont + '",Inter,Arial,sans-serif');
  r.setProperty('--button-font', '"' + t.buttonFont + '",Inter,Arial,sans-serif');
  ['headingWeight', 'bodyWeight', 'buttonWeight'].forEach(function (k) {
    r.setProperty('--' + k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase() }), t[k])
  });
  r.setProperty('--heading-size', t.headingSize + 'px');
  r.setProperty('--body-size', t.bodySize + 'px');
  r.setProperty('--button-size', t.buttonSize + 'px');
  r.setProperty('--heading-ls', t.headingLs + 'px');
  r.setProperty('--body-ls', t.bodyLs + 'px');
  r.setProperty('--button-ls', t.buttonLs + 'em');
  r.setProperty('--heading-lh', t.headingLh);
  r.setProperty('--body-lh', t.bodyLh);
  r.setProperty('--button-lh', t.buttonLh);
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    r.removeProperty('--page-text');
  } else {
    r.setProperty('--page-text', t.textColor);
  }
}

export function shell(title, eye, body) {
  return '<section class="page"><div class="section"><div class="container">' + (eye ? '<span class="eyebrow">' + eye + '</span>' : '') + '<h1 class="section-title">' + title + '</h1>' + body + '</div></div></section>'
}

export function listBox(t, s, arr, empty) {
  return '<article class="card list-card"><div class="list-head"><div class="dept-icon">' + t[0] + '</div><div><h3>' + t + '</h3><p class="muted">' + s + '</p></div></div><div class="item-list">' + (arr.length ? arr.map(function (x) {
    return '<a class="resource-item" href="' + esc(x.url) + '"><span>' + esc(x.name || x.title) + '</span><small class="muted">Open</small></a>'
  }).join('') : '<div class="empty">' + empty + '</div>') + '</div></article>'
}

export function newsCard(n) {
  return '<article class="card news-card"><span class="tag">' + esc(n.c) + '</span><h3>' + esc(n.h) + '</h3><p class="muted">' + esc(n.e || n.d) + '</p></article>'
}

export function foot(id) {
  return '<a data-route="' + id + '" href="' + pathOf(id) + '">' + routes.find(function (r) { return r[0] === id })[1] + '</a>'
}

export function toast(m) {
  var t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(t.timer);
  t.timer = setTimeout(function () { t.classList.remove('show') }, 2200)
}

export function counters() {
  $$('[data-count]').forEach(function (e) {
    var target = +e.dataset.count || 0, n = 0, step = Math.max(1, Math.ceil(target / 36)),
      tm = setInterval(function () {
        n = Math.min(target, n + step);
        e.textContent = n;
        if (n >= target) clearInterval(tm)
      }, 22)
  })
}

export function line(sel, v) {
  var el = $(sel);
  if (!el) return;
  var w = 620, h = 200, p = 20,
    min = Math.min.apply(null, v) - 4, max = Math.max.apply(null, v) + 4,
    xs = v.map(function (_, i) { return p + i * ((w - p * 2) / (v.length - 1)) }),
    ys = v.map(function (y) { return h - p - ((y - min) / (max - min)) * (h - p * 2) });
  var d = 'M' + xs[0] + ',' + ys[0];
  for (var i = 1; i < xs.length; i++) {
    var cx = (xs[i - 1] + xs[i]) / 2;
    d += ' C' + cx + ',' + ys[i - 1] + ' ' + cx + ',' + ys[i] + ' ' + xs[i] + ',' + ys[i];
  }
  var fill = d + ' L' + xs[xs.length - 1] + ',' + (h - p) + ' L' + xs[0] + ',' + (h - p) + ' Z';
  var gradId = 'lg' + sel.replace(/[^a-z]/gi, '');
  el.innerHTML = '<svg class="spark-line" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">'
    + '<defs>'
    + '<linearGradient id="' + gradId + 'a" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0%" stop-color="var(--teal)" stop-opacity=".18"/>'
    + '<stop offset="100%" stop-color="var(--teal)" stop-opacity="0"/>'
    + '</linearGradient>'
    + '<linearGradient id="' + gradId + 'b" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0%" stop-color="var(--teal)" stop-opacity=".5"/>'
    + '<stop offset="100%" stop-color="var(--blue)" stop-opacity=".9"/>'
    + '</linearGradient>'
    + '</defs>'
    + '<path d="' + fill + '" fill="url(#' + gradId + 'a)"/>'
    + '<path d="' + d + '" fill="none" stroke="url(#' + gradId + 'b)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<circle cx="' + xs[xs.length - 1] + '" cy="' + ys[ys.length - 1] + '" r="4" fill="var(--teal)" opacity=".9"/>'
    + '<circle cx="' + xs[xs.length - 1] + '" cy="' + ys[ys.length - 1] + '" r="8" fill="rgba(78,205,196,.15)"/>'
    + '</svg>';
}

export function charts() {
  line('#dashChart', [100, 104, 99, 108, 115, 112, 119, 125, 121, 130, 128, 135, 140])
}

export function input(label, path, val) {
  return '<label class="field"><span>' + label + '</span><input data-path="' + path + '" value="' + esc(val) + '"></label>'
}
export function area(label, path, val) {
  return '<label class="field"><span>' + label + '</span><textarea rows="4" data-path="' + path + '">' + esc(val) + '</textarea></label>'
}
