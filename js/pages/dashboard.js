import { shell, $ } from '../utils.js';
import { app } from '../state.js';

var LABELS = {
  '^NSEI': 'Nifty 50', '^BSESN': 'Sensex', '^NSEBANK': 'Bank Nifty',
  'RELIANCE.NS': 'Reliance Industries', 'TCS.NS': 'TCS', 'INFY.NS': 'Infosys',
  'HDFCBANK.NS': 'HDFC Bank', 'ICICIBANK.NS': 'ICICI Bank', 'SBIN.NS': 'SBI'
};

export default function dashboard() {
  var tick = app.ticker || '^NSEI';
  return shell('FINCELL Research Dashboard', 'Analytics',
    '<div class="dash-form"><div class="dash-input-group"><label>Ticker</label>' +
    '<input id="tickerInput" value="' + tick + '" placeholder="e.g. ^NSEI, RELIANCE.NS, TCS.NS"></div>' +
    '<div class="dash-input-group"><label>Period</label>' +
    '<select id="monthsSelect"><option value="1">1 month</option><option value="3" selected>3 months</option>' +
    '<option value="6">6 months</option><option value="12">1 year</option><option value="24">2 years</option>' +
    '</select></div><button class="btn primary" id="loadChartBtn">Load</button></div>' +
    '<div class="card dash-panel"><div class="dash-chart-header"><h3 id="chartTitle">' + (LABELS[tick] || tick) + '</h3>' +
    '<div class="dash-legend"><span class="legend-up">▲ Bullish</span><span class="legend-down">▼ Bearish</span></div></div>' +
    '<div class="chart-lg" id="candleChart"><div class="chart-empty">Enter a ticker and click Load</div></div></div>')
}

export function bindDash() {
  var btn = $('#loadChartBtn');
  if (!btn) return;
  btn.onclick = loadChart;

  var sel = $('#monthsSelect');
  if (sel && app.ticker) sel.value = '3';

  var inp = $('#tickerInput');
  if (inp && app.ticker) inp.value = app.ticker;

  if (app.ticker) loadChart();
  delete app.ticker;
}

function loadChart() {
  var symbol = ($('#tickerInput') || {}).value || '^NSEI';
  var months = parseInt((($('#monthsSelect') || {}).value)) || 3;
  var title = $('#chartTitle');
  if (title) title.textContent = LABELS[symbol] || symbol;

  var chartEl = $('#candleChart');
  if (chartEl) chartEl.innerHTML = '<div class="chart-empty">Loading…</div>';

  fetch('/api/chart?symbol=' + encodeURIComponent(symbol) + '&months=' + months)
    .then(function (r) { return r.json() })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      var result = data.chart && data.chart.result && data.chart.result[0];
      if (!result) throw new Error('No data for ' + symbol);
      renderCandles(result, chartEl);
    })
    .catch(function (e) {
      if (chartEl) chartEl.innerHTML = '<div class="chart-empty">Error: ' + e.message + '</div>';
    });
}

function renderCandles(result, el) {
  var timestamps = result.timestamp || [];
  var quote = result.indicators && result.indicators.quote && result.indicators.quote[0];
  if (!quote || !timestamps.length) { el.innerHTML = '<div class="chart-empty">No data available</div>'; return }

  var opens = quote.open, highs = quote.high, lows = quote.low, closes = quote.close;
  var data = [];
  for (var i = 0; i < timestamps.length; i++) {
    if (opens[i] == null || highs[i] == null || lows[i] == null || closes[i] == null) continue;
    data.push({ t: timestamps[i], o: opens[i], h: highs[i], l: lows[i], c: closes[i] });
  }
  if (!data.length) { el.innerHTML = '<div class="chart-empty">No data available</div>'; return }

  var W = 800, H = 360, P = 16, n = data.length;
  var min = Infinity, max = -Infinity;
  data.forEach(function (d) { if (d.l < min) min = d.l; if (d.h > max) max = d.h });
  var pad = (max - min) * 0.05 || 1;
  min -= pad; max += pad;
  var range = max - min;
  var cw = (W - P * 2) / n;
  var gap = Math.min(cw * 0.2, 2);
  var bw = cw - gap * 2;

  function y(v) { return H - P - ((v - min) / range) * (H - P * 2) }

  var html = '<svg class="candle-chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">';

  /* Grid lines */
  var gridLines = 5;
  for (var g = 0; g <= gridLines; g++) {
    var gy = P + (H - P * 2) * g / gridLines;
    var gv = max - range * g / gridLines;
    html += '<line x1="' + P + '" y1="' + gy + '" x2="' + (W - P) + '" y2="' + gy + '" stroke="rgba(255,255,255,.04)" stroke-width="1"/>' +
      '<text x="' + (P - 4) + '" y="' + (gy + 3) + '" fill="var(--dim)" font-size="8" text-anchor="end">' + fmtPrice(gv) + '</text>';
  }

  /* Candles */
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var x = P + i * cw + gap;
    var isUp = d.c >= d.o;
    var color = isUp ? 'var(--teal)' : 'var(--red)';
    var top = Math.min(d.o, d.c);
    var bottom = Math.max(d.o, d.c);
    var bodyH = Math.max(y(top) - y(bottom), 1);
    /* Wick */
    html += '<line x1="' + (x + bw / 2) + '" y1="' + y(d.h) + '" x2="' + (x + bw / 2) + '" y2="' + y(d.l) + '" stroke="' + color + '" stroke-width="1"/>';
    /* Body */
    html += '<rect x="' + x + '" y="' + y(bottom) + '" width="' + bw + '" height="' + bodyH + '" fill="' + color + '" opacity=".85"/>';
  }

  /* X-axis date labels (show ~6 evenly spaced) */
  var step = Math.max(1, Math.floor(data.length / 6));
  for (var i = 0; i < data.length; i += step) {
    var d = data[i];
    var x = P + i * cw + cw / 2;
    var date = new Date(d.t * 1000);
    var label = date.getDate() + '/' + (date.getMonth() + 1);
    html += '<text x="' + x + '" y="' + (H - 2) + '" fill="var(--dim)" font-size="8" text-anchor="middle">' + label + '</text>';
  }

  html += '</svg>';
  el.innerHTML = html;
}

function fmtPrice(v) {
  if (v >= 10000) return (v / 1000).toFixed(1) + 'k';
  if (v >= 1000) return v.toFixed(0);
  return v.toFixed(1);
}
