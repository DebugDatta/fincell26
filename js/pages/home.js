import { esc } from '../utils.js';
import { state } from '../state.js';

export default function home() {
  var h = state.hero;
  return '<section class="page"><div class="hero"><div class="container hero-layout"><div class="hero-copy"><span class="eyebrow">' + esc(h.label) + '</span><h1 class="display">' + esc(h.title) + '</h1><p class="lead">' + esc(h.subtitle) + '</p><div class="hero-actions"><a class="btn primary" data-route="' + h.primaryRoute + '" href="' + (h.primaryRoute === 'home' ? '/' : '/' + h.primaryRoute) + '">' + esc(h.primaryText) + '</a><a class="btn secondary" data-route="' + h.secondaryRoute + '" href="' + (h.secondaryRoute === 'home' ? '/' : '/' + h.secondaryRoute) + '">' + esc(h.secondaryText) + '</a></div><div class="stats">' + state.stats.map(function (s) { return '<div class="stat"><strong data-count="' + s.value + '">0</strong><span>' + esc(s.label) + '</span></div>' }).join('') + '</div></div><aside class="terminal"><div class="terminal-head"><span>Market Pulse</span><span class="pulse">Live</span></div><div class="chart" id="heroChart"></div><div id="marketQuotes" class="market-quotes"></div></aside></div></div><div class="feature-strip"><div class="container feature-grid grid">' + [
    ['Quantitative', 'Statistical models and algo strategies', 'departments'],
    ['Fundamental', 'Equity research and DCF modelling', 'departments'],
    ['Editorial', 'Finance commentary and newsletters', 'blogs'],
    ['Operations', 'Events, outreach and strategy', 'events']
  ].map(function (f) {
    return '<a class="card feature-card" data-route="' + f[2] + '" href="' + (f[2] === 'home' ? '/' : '/' + f[2]) + '"><div class="feature-icon">' + f[0][0] + '</div><h3>' + f[0] + '</h3><p class="muted">' + f[1] + '</p></a>'
  }).join('') + '</div></div></section>'
}
