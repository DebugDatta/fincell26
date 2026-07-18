import { esc, shell } from '../utils.js';
import { state, app } from '../state.js';

function collectYears() {
  var y = {};
  for (var k in state.projects) {
    state.projects[k].forEach(function (p) { y[p.year] = true })
  }
  return Object.keys(y).sort().reverse()
}

function filterItems() {
  var q = (app.projSearch || '').toLowerCase();
  if (!q) {
    var tab = app.projTab || 'fundamental';
    return state.projects[tab] || []
  }
  var filters = app.projFilters;
  if (!filters) {
    filters = app.projFilters = { houses: { fundamental: true, quantitative: true }, years: {} };
    collectYears().forEach(function (y) { filters.years[y] = true })
  }
  var all = [];
  if (filters.houses.fundamental && filters.houses.quantitative) {
    all = state.projects.fundamental.concat(state.projects.quantitative)
  } else if (filters.houses.fundamental) {
    all = state.projects.fundamental
  } else if (filters.houses.quantitative) {
    all = state.projects.quantitative
  } else {
    return []
  }
  return all.filter(function (p) {
    if (p.title.toLowerCase().indexOf(q) === -1) return false;
    if (!filters.years[p.year]) return false;
    return true
  })
}

export default function projects() {
  var filters = app.projFilters;
  if (!filters) {
    filters = app.projFilters = { houses: { fundamental: true, quantitative: true }, years: {} };
    collectYears().forEach(function (y) { filters.years[y] = true })
  }
  var years = collectYears();
  var items = filterItems();
  var q = (app.projSearch || '');
  var showFilter = q.length > 0;

  var html = '<input class="proj-search" type="search" placeholder="Search by name..." value="' + esc(q) + '" data-proj-search>';

  html += '<div class="proj-layout">';

  html += '<div class="proj-main"><div class="org-tabs">' +
    ['fundamental', 'quantitative'].map(function (t) {
      var label = t === 'fundamental' ? 'Fundamental Research' : 'Quantitative Research';
      return '<button class="tab' + (app.projTab === t ? ' active' : '') + '" data-proj-tab="' + t + '">' + label + '</button>'
    }).join('') + '</div>';

  if (!items.length) {
    html += '<div class="empty proj-empty" style="margin-top:28px">' + (q ? 'No projects found matching your search.' : 'No projects in this category yet.') + '</div>'
  } else {
    html += '<div class="proj-grid">' +
      items.map(function (p) {
        return '<article class="card proj-card"><div class="proj-head"><strong>' + esc(p.title) + '</strong><span class="proj-year">' + esc(p.year) + '</span></div>' +
          '<p class="proj-desc">' + esc(p.desc) + '</p>' +
          (p.link ? '<a class="btn subtle proj-link" href="' + esc(p.link) + '" target="_blank">Read More</a>' : '') + '</article>'
      }).join('') + '</div>'
  }

  html += '</div>';

  if (showFilter) {
    html += '<aside class="proj-filter-col"><h4>Filter</h4><div class="proj-filter-section"><h5>Houses</h5>' +
      ['fundamental', 'quantitative'].map(function (k) {
        var label = k === 'fundamental' ? 'Fundamental Research' : 'Quantitative Research';
        return '<label class="proj-check-label"><input type="checkbox" data-proj-filter="houses.' + k + '"' + (filters.houses[k] ? ' checked' : '') + '> ' + label + '</label>'
      }).join('') + '</div><div class="proj-filter-section"><h5>Year</h5>' +
      years.map(function (y) {
        return '<label class="proj-check-label"><input type="checkbox" data-proj-filter="years.' + y + '"' + (filters.years[y] ? ' checked' : '') + '> ' + y + '</label>'
      }).join('') + '</div></aside>'
  }

  html += '</div>';

  return shell('Research and projects', '', html)
}
