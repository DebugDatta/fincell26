import { $, line } from './utils.js';
import { app } from './state.js';

var cache = null;

function fmt(n) {
  if (n == null) return '--';
  if (n >= 10000) return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  if (n >= 100) return n.toFixed(2);
  return n.toFixed(2);
}

export function fetchMarket() {
  return fetch('/api/market')
    .then(function (r) { if (!r.ok) throw new Error('Network error'); return r.json() })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      cache = data;
      renderMarket(data);
      drawChart(data);
    })
    .catch(function () {
      var el = $('#marketQuotes');
      if (!el) return;
      if (cache) { renderMarket(cache); return }
      el.innerHTML = '<div class="market-row" style="justify-content:center;padding:10px;color:var(--dim);font-size:11px">Market data unavailable</div>';
    });
}

function renderMarket(data) {
  var el = $('#marketQuotes');
  if (!el) return;
  var r = data.chart && data.chart.result && data.chart.result[0];
  if (!r) { el.innerHTML = ''; return }
  var price = r.meta.regularMarketPrice;
  var prev = r.meta.chartPreviousClose;
  var change = price - prev;
  var pct = (change / prev * 100);
  var cls = change >= 0 ? 'up' : 'down';
  var arrow = change >= 0 ? '▲' : '▼';
  el.innerHTML =
    '<div class="market-row ' + cls + '" id="niftyRow">' +
    '<span class="market-name">Nifty 50</span>' +
    '<span class="market-price">' + fmt(price) + '</span>' +
    '<span class="market-change">' + arrow + ' ' + fmt(Math.abs(change)) + ' (' + pct.toFixed(2) + '%)</span></div>';
  var row = $('#niftyRow');
  if (row) row.onclick = function () { app.ticker = '^NSEI'; app.navigate && app.navigate('dashboard', true) };
}

function drawChart(data) {
  var r = data.chart && data.chart.result && data.chart.result[0];
  if (!r) return;
  var quote = r.indicators && r.indicators.quote && r.indicators.quote[0];
  if (!quote) return;
  var closes = quote.close;
  if (!closes) return;
  var vals = closes.filter(function (v) { return v != null });
  vals = vals.slice(-30);
  if (vals.length < 2) return;
  line('#heroChart', vals);
}

export function initMarket() {
  var el = $('#marketQuotes');
  if (!el) return;
  fetchMarket();
  setInterval(fetchMarket, 120000);
}
