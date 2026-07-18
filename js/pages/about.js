import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function about() {
  var a = state.about;
  return shell(esc(a.title), '',
    '<div class="split" style="margin-top:28px"><div><p class="lead">' + esc(a.body) + '</p><div class="value-grid grid">' +
    a.values.map(function (v) { return '<div class="card value-card"><h3>' + esc(v[0]) + '</h3><p class="muted">' + esc(v[1]) + '</p></div>' }).join('') +
    '</div></div><div class="timeline">' +
    a.timeline.map(function (t) { return '<div class="timeline-item"><strong>' + esc(t[0]) + '</strong><p class="muted">' + esc(t[1]) + '</p></div>' }).join('') +
    '</div></div>' +
    (a.leaders && a.leaders.length ? '<div class="leadership-section" style="margin-top:56px"><h3 style="margin-bottom:24px">Faculty In Charge</h3>' +
      (function (l) {
        return '<article class="card faculty-card">' +
          (l.image ? '<img class="leadership-img" src="' + l.image + '" alt="' + esc(l.name) + '">' : '<div class="leadership-avatar">' + esc(l.name[0] || 'L') + '</div>') +
          '<h3>' + esc(l.name) + '</h3><p class="accent">' + esc(l.role) + '</p><p class="muted">' + esc(l.bio) + '</p></article>'
      })(a.leaders[0]) +
      (a.leaders.length > 1 ? '<h3 style="margin:40px 0 24px">Core</h3><div class="leadership-grid">' +
        a.leaders.slice(1).map(function (l) {
          return '<article class="card leadership-card">' +
            (l.image ? '<img class="leadership-img" src="' + l.image + '" alt="' + esc(l.name) + '">' : '<div class="leadership-avatar">' + esc(l.name[0] || 'L') + '</div>') +
            '<h3>' + esc(l.name) + '</h3><p class="accent">' + esc(l.role) + '</p><p class="muted">' + esc(l.bio) + '</p></article>'
        }).join('') + '</div>' : '') + '</div>' : '')
  )
}
