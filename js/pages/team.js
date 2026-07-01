import { esc, shell } from '../utils.js';
import { state } from '../state.js';

export default function team() {
  return shell('Meet the team', 'The People',
    '<p class="lead" style="margin-top:18px">Twenty-plus driven students across four verticals, united by a shared belief that great finance starts with great thinking.</p><div class="team-grid grid" style="margin-top:28px">' +
    state.team.filter(function (t) { return t.published !== false })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0) })
      .map(function (t) {
        return '<article class="card team-card">' +
          (t.image ? '<img class="avatar" src="' + t.image + '" alt="' + esc(t.name) + '">' : '<div class="avatar">' + esc(t.name[0] || 'F') + '</div>') +
          '<h3>' + esc(t.name) + '</h3><p class="accent">' + esc(t.role) + '</p><p class="muted">' + esc(t.dept) + '</p><p class="muted">' + esc(t.bio) + '</p></article>'
      }).join('') + '</div>')
}
