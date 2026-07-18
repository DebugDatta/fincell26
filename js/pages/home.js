import { esc } from '../utils.js';
import { state } from '../state.js';

export default function home() {
  var h = state.hero;
  return '<section class="page"><div class="hero"><div class="container hero-layout"><div class="hero-copy"><span class="eyebrow">' + esc(h.label) + '</span><h1 class="display">' + esc(h.title) + '</h1><p class="lead">' + esc(h.subtitle) + '</p><div class="hero-actions"><a class="btn primary" data-route="' + h.secondaryRoute + '" href="' + (h.secondaryRoute === 'home' ? '/' : '/' + h.secondaryRoute) + '">' + esc(h.secondaryText) + '</a><a class="btn primary" data-route="blogs" href="/blogs">Blogs &amp; Podcasts</a></div><div class="stats">' + state.stats.map(function (s) { return '<div class="stat"><strong data-count="' + s.value + '">0</strong><span>' + esc(s.label) + '</span></div>' }).join('') + '</div></div><aside class="terminal"><div class="terminal-head"><span>Market Pulse</span><span class="pulse">Live</span></div><div class="chart" id="heroChart"></div><div id="marketQuotes" class="market-quotes"></div></aside></div></div></section>'
}
