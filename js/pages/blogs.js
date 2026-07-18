import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

export default function blogs() {
  var section = app.thinkTankSection || 'blogs';
  var items = state[section] || [];

  var html =
    '<div class="filter-tabs" style="margin-top:28px">' +
      ['blogs', 'podcasts'].map(function (s) {
        return '<button class="tab' + (section === s ? ' active' : '') + '" data-tt-section="' + s + '">' +
          (s === 'blogs' ? 'Blogs' : 'Podcasts') + '</button>'
      }).join('') +
    '</div>';

  items = items.filter(function (b) { return b.published !== false });

  if (!items.length) {
    html += '<div class="empty" style="margin-top:28px">Nothing to show yet.</div>'
  } else {
    html += '<div class="blog-grid grid" style="margin-top:28px">' +
      items.map(function (b) {
        return '<article class="card blog-card"><span class="tag">' + esc(b.c) + '</span><h3>' + esc(b.t) + '</h3><p class="muted">' + esc(b.p) + '</p><div class="resource-item"><span>' + esc(b.a) + '</span><small>' + esc(b.rt) + '</small></div></article>'
      }).join('') + '</div>'
  }

  return shell('Think Tank', '', html)
}
