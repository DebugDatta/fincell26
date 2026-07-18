import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

function catMatch(c) {
  var f = app.galFilter;
  return f === 'workshop' ? (c === 'workshop' || c === 'workshops') : c === f
}

export default function gallery() {
  var period = app.galPeriod || 'current';
  var gs = state.gallery.filter(function (g) { return g.published !== false && (g.period || 'past') === period && catMatch(g.category) });

  var html =
    '<div class="period-tabs">' +
      ['current', 'past'].map(function (p) {
        return '<button class="tab' + (period === p ? ' active' : '') + '" data-gal-period="' + p + '">' + p.charAt(0).toUpperCase() + p.slice(1) + '</button>'
      }).join('') +
    '</div>' +
    '<div class="filter-tabs">' +
      ['events', 'workshop'].map(function (f) {
        return '<button class="tab' + (app.galFilter === f ? ' active' : '') + '" data-filter="' + f + '">' + (f === 'workshop' ? 'Workshop' : 'Events') + '</button>'
      }).join('') +
    '</div>';

  if (!gs.length) {
    html += '<div class="empty" style="margin-top:28px">Nothing to show yet.</div>'
  } else {
    html += '<div class="gallery-grid">' +
      gs.map(function (g) {
        return '<article class="card gallery-card"><button data-lightbox="' + g.id + '"><img loading="lazy" src="' + g.url + '" alt="' + esc(g.name) + '"><div class="gallery-info"><strong>' + esc(g.name) + '</strong><p class="muted">' + esc(g.category) + '</p></div></button></article>'
      }).join('') + '</div>'
  }

  return shell('Gallery', '', html)
}
