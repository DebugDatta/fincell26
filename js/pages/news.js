import { esc, shell, newsCard } from '../utils.js';
import { state } from '../state.js';

export default function news() {
  var a = state.news.filter(function (n) { return n.published !== false }), f = a[0];
  return shell('Latest news', 'Finance Pulse',
    f ? '<div class="news-layout grid" style="margin-top:28px"><article class="card news-card featured"><div><span class="tag">' + esc(f.c) + ' - Featured</span><h3>' + esc(f.h) + '</h3><p class="lead">' + esc(f.e) + '</p></div><p class="muted">' + esc(f.d) + '</p></article><div class="grid">' +
    a.slice(1, 4).map(newsCard).join('') + '</div></div><div class="blog-grid grid" style="margin-top:22px">' +
    a.slice(4).map(newsCard).join('') + '</div>' : '<div class="empty">No news published.</div>')
}
