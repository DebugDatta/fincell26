import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

export default function departments() {
  var list = state.departments.filter(function (d) { return d.published !== false }),
    d = list.find(function (x) { return x.id === app.dept }) || list[0];
  if (!d) return shell('Four departments, one mission', 'The Cell', '<div class="empty">No departments available.</div>');
  var members = (d.members || []).filter(function (m) { return m.published !== false });
  return shell('Four departments, one mission', 'The Cell',
    '<div class="dept-tabs">' + list.map(function (x) {
      return '<button class="tab ' + (x.id === d.id ? 'active' : '') + '" data-dept="' + x.id + '">' + esc(x.name) + '</button>'
    }).join('') + '</div><article class="card dept-card"><div class="dept-img-box"><img src="' + d.image + '" alt="' + esc(d.name) + '"></div>' +
    '<div class="dept-content"><p class="eyebrow">' + esc(d.label) + '</p><h2>' + esc(d.name) + '</h2><p class="muted">' + esc(d.desc) +
    '</p><div class="tag-list">' + d.skills.map(function (s) { return '<span class="tag">' + esc(s) + '</span>' }).join('') +
    '</div></div></article>' +
    (members.length ? '<div style="margin-top:40px"><h3 style="margin-bottom:20px">Team</h3><div class="member-list">' +
      members.map(function (m) {
        return '<article class="card member-card">' +
          (m.image ? '<img class="member-img" src="' + m.image + '" alt="' + esc(m.name) + '">' : '<div class="member-avatar">' + esc(m.name[0] || 'T') + '</div>') +
          '<h3>' + esc(m.name) + '</h3><p class="accent">' + esc(m.role) + '</p></article>'
      }).join('') + '</div></div>' : '')
  )
}
