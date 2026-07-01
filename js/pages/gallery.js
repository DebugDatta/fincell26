import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

export default function gallery() {
  var gs = state.gallery.filter(function (g) { return g.published !== false && (app.galFilter === 'all' || g.category === app.galFilter) });
  return shell('Event gallery', 'Moments',
    '<div class="filter-tabs">' + ['all', 'events', 'workshops', 'team'].map(function (f) {
      return '<button class="tab ' + (app.galFilter === f ? 'active' : '') + '" data-filter="' + f + '">' + f + '</button>'
    }).join('') + '</div><div class="gallery-grid">' +
    gs.map(function (g) {
      return '<article class="card gallery-card"><button data-lightbox="' + g.id + '"><img loading="lazy" src="' + g.url + '" alt="' + esc(g.name) + '"><div class="gallery-info"><strong>' + esc(g.name) + '</strong><p class="muted">' + esc(g.category) + '</p></div></button></article>'
    }).join('') + '</div>')
}
