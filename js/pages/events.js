import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function events() {
  var ev = state.events.filter(function (e) { return e.published !== false });
  return shell("Events and ongoing work", "What's On",
    '<div class="event-layout grid" style="margin-top:28px"><div><h3>Upcoming Events</h3><div class="grid" style="margin-top:16px">' +
    (ev.length ? ev.map(function (e) {
      var d = new Date(e.date);
      return '<article class="card event-card"><div class="event-date"><strong>' + d.getDate() + '</strong><small>' + d.toLocaleString('en', { month: 'short' }).toUpperCase() + '</small></div><div><h3>' + esc(e.title) + '</h3><p class="muted">' + esc(e.desc || '') + '</p><p class="muted">' + esc(e.time || '') + ' ' + esc(e.venue || '') + '</p></div></article>'
    }).join('') : '<div class="empty">Nothing scheduled yet - check back soon.</div>') +
    '</div></div><div><h3>Ongoing Projects</h3><div class="accordion" style="margin-top:16px">' +
    state.ongoing.map(function (o) {
      return '<div class="card acc"><button data-acc>' + esc(o[0]) + '<span>+</span></button><p>' + esc(o[1]) + '</p></div>'
    }).join('') + '</div></div></div>')
}
