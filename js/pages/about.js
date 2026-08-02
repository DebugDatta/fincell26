import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function about() {
  var a = state.about;
  var leaders = a.leaders || [];
  var groupOf = function (l, i) { return l.group || (i === 0 ? 'faculty' : 'core') };
  var card = function (l, cls) {
    return '<article class="card ' + (cls || 'leadership-card') + '">' +
      (l.image ? '<img class="leadership-img" src="' + l.image + '" alt="' + esc(l.name) + '">' : '<div class="leadership-avatar">' + esc(l.name[0] || 'L') + '</div>') +
      '<h3>' + esc(l.name) + '</h3><p class="accent">' + esc(l.role) + '</p><p class="muted">' + esc(l.bio) + '</p></article>'
  };
  var grid = function (list) { return '<div class="leadership-grid">' + list.map(function (l) { return card(l) }).join('') + '</div>' };
  var html = '';
  if (leaders.length) {
    var first = true;
    var head = function (title) {
      var s = first ? 'margin-bottom:24px' : 'margin:40px 0 24px';
      first = false;
      return '<h3 style="' + s + '">' + title + '</h3>'
    };
    [
      ['faculty', 'Faculty In Charge'],
      ['core', 'Core'],
      ['past', 'Past Members']
    ].forEach(function (g) {
      var gid = g[0], title = g[1], list = [], i;
      if (gid === 'past') {
        var buckets = {}, order = [], empty = [];
        for (i = 0; i < leaders.length; i++) {
          if (groupOf(leaders[i], i) !== 'past') continue;
          var y = (leaders[i].year || '').trim();
          if (!y) { empty.push(leaders[i]); continue }
          if (!buckets[y]) { buckets[y] = []; order.push(y) }
          buckets[y].push(leaders[i]);
        }
        if (!order.length && !empty.length) return;
        html += head(title);
        order.sort(function (x, z) { return x < z ? 1 : x > z ? -1 : 0 }).forEach(function (y) {
          html += '<h4 class="past-year-head">' + esc(y) + '</h4>' + grid(buckets[y])
        });
        if (empty.length) html += grid(empty);
        return
      }
      for (i = 0; i < leaders.length; i++) if (groupOf(leaders[i], i) === gid) list.push(leaders[i]);
      if (!list.length) return;
      html += head(title);
      html += (gid === 'faculty' && list.length === 1) ? card(list[0], 'faculty-card') : grid(list)
    });
  }
  return shell(esc(a.title), '',
    '<div class="split" style="margin-top:28px"><div><p class="lead">' + esc(a.body) + '</p><div class="value-grid grid">' +
    a.values.map(function (v) { return '<div class="card value-card"><h3>' + esc(v[0]) + '</h3><p class="muted">' + esc(v[1]) + '</p></div>' }).join('') +
    '</div></div><div class="timeline">' +
    a.timeline.map(function (t) { return '<div class="timeline-item"><strong>' + esc(t[0]) + '</strong><p class="muted">' + esc(t[1]) + '</p></div>' }).join('') +
    '</div></div>' +
    (html ? '<div class="leadership-section" style="margin-top:56px">' + html + '</div>' : '')
  )
}
