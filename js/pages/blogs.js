import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function blogs() {
  return shell('From the blog', 'Perspectives',
    '<div class="blog-grid grid" style="margin-top:28px">' +
    state.blogs.filter(function (b) { return b.published !== false }).map(function (b) {
      return '<article class="card blog-card"><span class="tag">' + esc(b.c) + '</span><h3>' + esc(b.t) + '</h3><p class="muted">' + esc(b.p) + '</p><div class="resource-item"><span>' + esc(b.a) + '</span><small>' + esc(b.rt) + '</small></div></article>'
    }).join('') + '</div>')
}
