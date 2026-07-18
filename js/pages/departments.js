import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

function orgCard(item) {
  return '<article class="org-card">' +
    (item.image ? '<img class="org-img" src="' + item.image + '" alt="' + esc(item.name) + '">' : '<div class="org-avatar">' + esc(item.name[0] || 'O') + '</div>') +
    '<div class="org-info"><div class="org-top"><strong>' + esc(item.name) + '</strong>' +
    (item.role ? '<span class="org-badge">' + esc(item.role) + '</span>' : '') + '</div>' +
    (item.bio ? '<p class="org-bio">' + esc(item.bio) + '</p>' : '') + '</div></article>'
}

export default function departments() {
  var org = state.organization;
  var house = app.orgTab || (org.length ? org[0].name : 'Research House');
  var inHouse = false;
  var html = '';

  html += '<div class="org-tabs">' +
    org.filter(function (x) { return x.level === 0 }).map(function (h) {
      return '<button class="tab' + (h.name === house ? ' active' : '') + '" data-org-house="' + esc(h.name) + '">' + esc(h.name) + '</button>'
    }).join('') + '</div>';

  org.forEach(function (item) {
    if (item.level === 0) {
      inHouse = item.name === house;
      return;
    }
    if (!inHouse) return;

    if (item.role) {
      html += orgCard(item);
    } else {
      var hcls = 'org-heading';
      if (item.level === 2) hcls += ' org-heading-l2';
      else if (item.level === 3) hcls += ' org-heading-l3';
      html += '<h3 class="' + hcls + '">' + esc(item.name) + '</h3>';
    }
  });

  return shell('Two departments, one mission', '', '<div class="org-section">' + html + '</div>')
}
