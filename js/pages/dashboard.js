import { shell, $, toast } from '../utils.js';
import { app } from '../state.js';

var RANGES = ['1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'max'];
var RANGE_LABELS = { '1mo':'1 Month', '3mo':'3 Months', '6mo':'6 Months', '1y':'1 Year', '2y':'2 Years', '5y':'5 Years', '10y':'10 Years', 'max':'Max' };

function rangeIndex(r) { return RANGES.indexOf(r) }

var LABELS = {
  '^NSEI': 'Nifty 50', '^BSESN': 'Sensex', '^NSEBANK': 'Bank Nifty',
  'RELIANCE.NS': 'Reliance Industries', 'TCS.NS': 'TCS', 'INFY.NS': 'Infosys',
  'HDFCBANK.NS': 'HDFC Bank', 'ICICIBANK.NS': 'ICICI Bank', 'SBIN.NS': 'SBI'
};

export default function dashboard() {
  var tick = app.ticker || '^NSEI';
  return shell('FINCELL Research Dashboard', '',
    '<div class="dash-form">' +
    '<div class="dash-input-group dash-search-wrap"><label>Ticker (search by name or symbol)</label>' +
    '<input id="tickerInput" value="' + tick + '" placeholder="e.g. Reliance, Apple, ^NSEI" autocomplete="off">' +
    '<div class="dash-search-dd" id="searchDropdown"></div></div>' +
    '<div class="dash-input-group"><label>Data range</label>' +
    '<select id="rangeSelect">' + RANGES.map(function (r) { return '<option value="' + r + '"' + (r === '1y' ? ' selected' : '') + '>' + (RANGE_LABELS[r] || r) + '</option>' }).join('') + '</select></div>' +
    '<div class="dash-input-group"><label>Benchmark (optional)</label>' +
    '<input id="benchInput" value="" placeholder="e.g. ^GSPC, SPY"></div>' +
    '<button class="btn primary" id="loadChartBtn">Load</button></div>' +
    '<div class="card dash-panel"><div class="dash-chart-header"><h3 id="chartTitle">' + (LABELS[tick] || tick) + '</h3>' +
    '<div class="dash-legend"><span class="legend-up">▲ Bullish</span><span class="legend-down">▼ Bearish</span></div>' +
    '<button class="dash-info-btn" id="dashInfoBtn" title="Scoring methodology">ℹ</button></div>' +
    '<div class="chart-lg" id="candleChart"><div class="chart-empty">Enter a ticker and click Load</div></div></div>' +
    '<div id="fundPanel"></div>' +
    '<div class="dash-info-overlay" id="dashInfoOverlay"><div class="dash-info-modal">' +
    '<button class="dash-info-close" id="dashInfoClose">╳</button>' +
    '<h3>Scoring Methodology</h3>' +
    '<div class="dash-info-table">' +
    '<div class="dash-info-th"><span>Metric</span><span>How it\'s scored</span><span>What\'s included</span></div>' +
    [
      ['Value', 'Average of all valuation scores', 'P/E, Fwd P/E, PEG, P/S, P/B, EV/EBITDA, EV/Sales, Earnings Yield, Op. Yield, P/FCF, EV/FCF, Target upside, Graham upside'],
      ['Quality', 'Average of all margin scores', 'ROE, ROA, Gross Margin, Operating Margin, Net Margin, EBITDA Margin, FCF Margin'],
      ['Growth', 'Average of Revenue + EPS growth', 'Revenue Growth, EPS Growth'],
      ['Health', 'Average of balance sheet scores', 'Debt/Equity, Debt/EBITDA, Cash/Debt, Interest Cover, Current Ratio, Quick Ratio, OCF, FCF'],
      ['Income', 'Average of income scores', 'Dividend Yield, Payout Ratio, FCF Yield, DPS'],
      ['Earnings', 'Average of earnings quality scores', 'Surprise %, EPS YoY %, Analyst Buy Ratio'],
      ['Momentum', 'Average of price trend scores', 'RSI(14), 52W Position, MA Status, Volatility, RS vs Benchmark (6M, 12M)'],
      ['Risk', 'Average of risk scores', 'Beta, Short Ratio, Short % Float, Institutional Own., Insider Own.'],
      ['Overall', 'Average of Group A + Group B', 'A: Value + Quality + Growth · B: Health + Income + Momentum + Earnings + Risk']
    ].map(function (r) {
      return '<div class="dash-info-tr"><span class="dash-info-metric">' + r[0] + '</span><span class="dash-info-formula">' + r[1] + '</span><span class="dash-info-parts">' + r[2] + '</span></div>'
    }).join('') +
    '<div class="dash-info-th"><span>Scoring helper</span><span>Range</span><span>When it\'s used</span></div>' +
    [
      ['Higher is better', 'Raw value → 0–100', 'ROE, ROA, margins, growth rates, earnings yield, buy ratio'],
      ['Lower is better', 'Raw value → 0–100', 'P/E, P/B, D/E, volatility, short ratio, PEG'],
      ['Midpoint is best', 'Raw value → 0–100', 'RSI (ideal 60), Current Ratio (ideal 2.0), Beta (ideal 1.0)'],
      ['Binary', 'Positive = 100, Negative = 0', 'OCF, FCF, DPS']
    ].map(function (r) {
      return '<div class="dash-info-tr"><span class="dash-info-metric">' + r[0] + '</span><span class="dash-info-formula">' + r[1] + '</span><span class="dash-info-parts">' + r[2] + '</span></div>'
    }).join('') +
    '<div class="dash-info-grades"><strong>Grades</strong> <span>≥85 ELITE</span> <span>≥70 STRONG</span> <span>≥55 FAIR</span> <span>≥40 WEAK</span> <span>&lt;40 RISK</span></div>' +
    '</div></div></div>')
}

export function bindDash() {
  var btn = $('#loadChartBtn');
  if (!btn) return;
  btn.onclick = loadBoth;

  var sel = $('#rangeSelect');
  if (sel && app.range) sel.value = app.range;

  var inp = $('#tickerInput');
  if (inp && app.ticker) inp.value = app.ticker;

  if (app.ticker) loadBoth();
  delete app.ticker;
  delete app.range;

  var infoBtn = $('#dashInfoBtn');
  var infoOverlay = $('#dashInfoOverlay');
  var infoClose = $('#dashInfoClose');
  if (infoBtn && infoOverlay && infoClose) {
    infoBtn.onclick = function () { infoOverlay.classList.add('open') };
    infoClose.onclick = function () { infoOverlay.classList.remove('open') };
    infoOverlay.onclick = function (e) { if (e.target === infoOverlay) infoOverlay.classList.remove('open') }
  }

  // ── Search dropdown ──────────────────────────────
  var searchInput = $('#tickerInput');
  var searchDD = $('#searchDropdown');
  var searchTimer = null;
  var activeIdx = -1;

  function closeSearchDD() { searchDD.innerHTML = ''; searchDD.style.display = 'none'; activeIdx = -1; }

  function renderResults(quotes) {
    if (!quotes.length) { closeSearchDD(); return; }
    activeIdx = -1;
    searchDD.innerHTML = quotes.map(function (q, i) {
      var name = q.longname || q.shortname || q.symbol;
      var label = q.shortname && q.shortname !== q.longname ? name + ' (' + q.shortname + ')' : name;
      return '<div class="dash-search-item" data-idx="' + i + '" data-sym="' + esc(q.symbol) + '">' +
        '<span class="dash-search-sym">' + esc(q.symbol) + '</span>' +
        '<span class="dash-search-name" title="' + esc(label) + '">' + esc(label) + '</span>' +
        '<span class="dash-search-ex">' + esc(q.exchange) + '</span></div>';
    }).join('');
    searchDD.style.display = 'block';
    searchDD.querySelectorAll('.dash-search-item').forEach(function (el) {
      el.onmousedown = function (e) {
        e.preventDefault();
        searchInput.value = el.dataset.sym;
        closeSearchDD();
        loadBoth();
      };
    });
  }

  function doSearch(q) {
    if (!q || q.length < 2) { closeSearchDD(); return; }
    fetch('/api/search?q=' + encodeURIComponent(q))
      .then(function (r) { return r.json() })
      .then(function (data) { renderResults(data.quotes || []) })
      .catch(function () { closeSearchDD() });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var val = searchInput.value.trim();
      searchTimer = setTimeout(function () { doSearch(val) }, 300);
    });
    searchInput.addEventListener('keydown', function (e) {
      var items = searchDD.querySelectorAll('.dash-search-item');
      if (!items.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); items.forEach(function (el, i) { el.classList.toggle('active', i === activeIdx) }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); items.forEach(function (el, i) { el.classList.toggle('active', i === activeIdx) }); }
      else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); searchInput.value = items[activeIdx].dataset.sym; closeSearchDD(); loadBoth(); }
      else if (e.key === 'Escape') { closeSearchDD(); }
    });
    searchInput.addEventListener('blur', function () { setTimeout(closeSearchDD, 150); });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCORING UTILITIES
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function clamp(x, lo, hi) { return Math.max(lo, Math.min(x, hi)) }

function safeDiv(a, b) { return (a == null || b == null || b === 0) ? null : a / b }

function scoreHigher(v, bad, good) {
  if (v == null) return null;
  return clamp((v - bad) / (good - bad) * 100, 0, 100);
}

function scoreLower(v, good, bad) {
  if (v == null) return null;
  return clamp((bad - v) / (bad - good) * 100, 0, 100);
}

function scoreMid(v, low, ideal, high) {
  if (v == null) return null;
  if (v <= ideal) return clamp((v - low) / (ideal - low) * 100, 0, 100);
  return clamp((high - v) / (high - ideal) * 100, 0, 100);
}

function scorePositive(v) {
  if (v == null) return null;
  return v > 0 ? 100 : 0;
}

function avg5(a, b, c, d, e) {
  var sum = 0, n = 0;
  [a, b, c, d, e].forEach(function (v) { if (v != null) { sum += v; n++ } });
  return n === 0 ? null : sum / n;
}

function avg3(a, b, c) { return avg5(a, b, c, null, null) }

function scoreText(s) {
  if (s == null) return '—';
  return '' + Math.round(s);
}

function grade(s) {
  if (s == null) return 'N/A';
  if (s >= 85) return 'ELITE';
  if (s >= 70) return 'STRONG';
  if (s >= 55) return 'FAIR';
  if (s >= 40) return 'WEAK';
  return 'RISK';
}

function overallBadge(s) {
  if (s == null) return 'N/A ';
  if (s >= 85) return 'ELITE ';
  if (s >= 70) return 'STRONG ';
  if (s >= 55) return 'FAIR ';
  if (s >= 40) return 'WEAK ';
  return 'RISK ';
}

function arrow(v) {
  if (v == null) return '';
  return v > 0 ? '▲ ' : v < 0 ? '▼ ' : '■ ';
}

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORMATTING
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fmtNum(v) {
  if (v == null) return '—';
  if (typeof v === 'object' && v.raw != null) v = v.raw;
  var n = Number(v);
  if (isNaN(n)) return '—';
  return n.toFixed(2);
}

function fmtPct(v) {
  if (v == null) return '—';
  if (typeof v === 'object' && v.raw != null) v = v.raw;
  var n = Number(v);
  if (isNaN(n)) return '—';
  return (n * 100).toFixed(2) + '%';
}

function fmtPctRaw(v) {
  if (v == null) return '—';
  return v.toFixed(2) + '%';
}

function fmtMoney(v) {
  if (v == null) return '—';
  if (typeof v === 'object' && v.raw != null) v = v.raw;
  var n = Number(v);
  if (isNaN(n)) return '—';
  var abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

function fmtDate(ts) {
  if (ts == null) return '—';
  var d = new Date(ts * 1000);
  if (isNaN(d.getTime())) return '—';
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function rawVal(v) {
  if (v == null) return null;
  if (typeof v === 'object' && v.raw != null) return v.raw;
  if (typeof v === 'number') return v;
  return null;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOMENTUM COMPUTATION FROM PRICE DATA
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getCloses(result) {
  if (!result || !result.timestamp || !result.indicators) return null;
  var quote = result.indicators.quote && result.indicators.quote[0];
  return quote ? quote.close : null;
}

function calcRSI(closes, period) {
  if (!closes || closes.length < period + 1) return null;
  var changes = [];
  for (var i = 1; i < closes.length; i++) {
    if (closes[i] != null && closes[i - 1] != null) changes.push(closes[i] - closes[i - 1]);
  }
  if (changes.length < period + 1) return null;
  var idx = changes.length - period - 1;
  if (idx < 0) idx = 0;
  var avgGain = 0, avgLoss = 0;
  for (var i = idx; i < idx + period && i < changes.length; i++) {
    if (changes[i] >= 0) avgGain += changes[i]; else avgLoss -= changes[i];
  }
  avgGain /= period;
  avgLoss /= period;
  for (var i = idx + period; i < changes.length; i++) {
    var d = changes[i];
    avgGain = (avgGain * (period - 1) + (d >= 0 ? d : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (d < 0 ? -d : 0)) / period;
  }
  if (avgLoss === 0) return 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

function calcSMA(values, period) {
  if (!values || values.length < period) return null;
  var sum = 0, n = 0;
  for (var i = values.length - period; i < values.length; i++) {
    if (values[i] != null) { sum += values[i]; n++ }
  }
  return n < period ? null : sum / n;
}

function calcReturn(closes, periodsBack) {
  if (!closes || closes.length <= periodsBack) return null;
  var current = closes[closes.length - 1];
  var prev = closes[closes.length - 1 - periodsBack];
  if (current == null || prev == null || prev === 0) return null;
  return (current / prev - 1) * 100;
}

function calcVolatility(closes) {
  if (!closes || closes.length < 30) return null;
  var returns = [];
  for (var i = 1; i < closes.length; i++) {
    if (closes[i] != null && closes[i - 1] != null && closes[i - 1] !== 0)
      returns.push(closes[i] / closes[i - 1] - 1);
  }
  if (returns.length < 2) return null;
  var mean = returns.reduce(function (a, b) { return a + b }, 0) / returns.length;
  var variance = returns.reduce(function (a, b) { return a + (b - mean) * (b - mean) }, 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

function highest(values) {
  if (!values || !values.length) return null;
  var h = -Infinity;
  for (var i = 0; i < values.length; i++) {
    if (values[i] != null && values[i] > h) h = values[i];
  }
  return h === -Infinity ? null : h;
}

function lowest(values) {
  if (!values || !values.length) return null;
  var l = Infinity;
  for (var i = 0; i < values.length; i++) {
    if (values[i] != null && values[i] < l) l = values[i];
  }
  return l === Infinity ? null : l;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION COMPUTATION
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function computeMomentum(chartResult, extraRS) {
  var closes = getCloses(chartResult);
  var quote = chartResult && chartResult.indicators && chartResult.indicators.quote && chartResult.indicators.quote[0];
  var highs = quote ? quote.high : null;
  var lows = quote ? quote.low : null;
  var volume = quote ? quote.volume : null;

  var rsi14 = calcRSI(closes, 14);
  var sma20 = calcSMA(closes, 20);
  var sma50 = calcSMA(closes, 50);
  var sma200 = calcSMA(closes, 200);
  var high52 = highest(highs);
  var low52 = lowest(lows);
  var dClose = closes && closes.length > 0 ? closes[closes.length - 1] : null;
  var ret1m = calcReturn(closes, 21);
  var ret3m = calcReturn(closes, 63);
  var ret6m = calcReturn(closes, 126);
  var ret12m = calcReturn(closes, 252);
  var vol = calcVolatility(closes);

  // Advanced metrics
  var ema12 = calcEMA(closes, 12);
  var ema26 = calcEMA(closes, 26);
  var macdLine = (ema12 != null && ema26 != null) ? ema12 - ema26 : null;
  var bb = calcBB(closes, 20, 2);
  var atr = calcATR(highs, lows, closes, 14);
  var atrPct = (atr != null && dClose != null && dClose !== 0) ? atr / dClose * 100 : null;
  var maxDD = calcMaxDrawdown(closes);
  var winRate = calcWinRate(closes);
  var consec = calcConsecutive(closes);
  var volAvg = calcVolumeAvg(volume, 20);
  var volLatest = volume && volume.length > 0 ? volume[volume.length - 1] : null;
  var volRatio = (volAvg != null && volAvg !== 0 && volLatest != null) ? volLatest / volAvg : null;
  var goldenCross = (sma20 != null && sma50 != null) ? (sma20 > sma50 ? 'Yes' : 'No') : null;
  var macdSignal = (macdLine != null) ? (macdLine > 0 ? 'Positive' : 'Negative') : null;

  var pos52 = (high52 == null || low52 == null || high52 === low52 || dClose == null) ? null :
    (dClose - low52) / (high52 - low52) * 100;

  var maStatus = (dClose == null) ? 'N/A' :
    dClose > sma20 && dClose > sma50 && dClose > sma200 ? 'Bullish' :
    dClose > sma50 && dClose > sma200 ? 'Strong' :
    dClose > sma200 ? 'Neutral' :
    dClose > sma50 ? 'Weak' :
    'Bearish';

  var maScore = (dClose == null) ? null :
    dClose > sma20 && dClose > sma50 && dClose > sma200 ? 100 :
    dClose > sma50 && dClose > sma200 ? 80 :
    dClose > sma200 ? 60 :
    dClose > sma50 ? 45 :
    25;

  var rsiScore = scoreMid(rsi14, 30, 60, 85);
  var posScore = scoreHigher(pos52, 20, 90);
  var volScore = scoreLower(vol, 10, 80);
  var rs6Score = extraRS && extraRS.rs6 ? extraRS.rs6.score : null;
  var rs12Score = extraRS && extraRS.rs12 ? extraRS.rs12.score : null;
  var momComposite = avg5(rsiScore, posScore, avg3(maScore, volScore, null), null, avg3(rs6Score, rs12Score, null));

  var rows = [
    { name: 'RSI 14', value: fmtNum(rsi14), score: rsiScore },
    { name: 'MACD', value: (macdLine != null ? (macdLine > 0 ? '+' : '') + macdLine.toFixed(2) : '—') + ' (' + (macdSignal || '—') + ')', score: scorePositive(macdLine) },
    { name: 'BB %B', value: (bb && bb.pctB != null ? bb.pctB.toFixed(1) + '%' : '—'), score: scoreMid(bb && bb.pctB, 0, 50, 100) },
    { name: 'ATR', value: fmtNum(atr) + ' (' + (atrPct != null ? atrPct.toFixed(2) + '%' : '—') + ')', score: scoreLower(atrPct, 1, 5) },
    { name: 'Golden Cross', value: goldenCross || '—', score: goldenCross === 'Yes' ? 100 : goldenCross === 'No' ? 0 : null },
    { name: '1M Return', value: arrow(ret1m) + fmtPctRaw(ret1m), score: null },
    { name: '3M Return', value: arrow(ret3m) + fmtPctRaw(ret3m), score: null },
    { name: '6M Return', value: arrow(ret6m) + fmtPctRaw(ret6m), score: null },
    { name: '12M Return', value: arrow(ret12m) + fmtPctRaw(ret12m), score: null }
  ];

  if (extraRS) {
    if (extraRS.rs6 && extraRS.rs6.score != null) rows.push(extraRS.rs6);
    if (extraRS.rs12 && extraRS.rs12.score != null) rows.push(extraRS.rs12);
  }

  rows.push(
    { name: 'Volatility (Ann.)', value: fmtPctRaw(vol), score: volScore },
    { name: 'Max Drawdown', value: (maxDD != null ? '-' + maxDD.toFixed(2) + '%' : '—'), score: scoreLower(maxDD, 5, 40) },
    { name: 'Win Rate', value: (winRate != null ? winRate.toFixed(1) + '%' : '—'), score: scoreHigher(winRate, 40, 65) },
    { name: 'Max Consec. ↑', value: (consec ? consec.maxUp + ' days' : '—'), score: null },
    { name: 'Max Consec. ↓', value: (consec ? consec.maxDown + ' days' : '—'), score: null }
  );

  if (volRatio != null) {
    rows.push({ name: 'Vol vs 20d Avg', value: 'x' + volRatio.toFixed(2), score: scoreMid(volRatio, 0.3, 1.0, 3.0) });
  }

  rows.push(
    { name: 'MA 20/50/200', value: maStatus, score: maScore }
  );

  return {
    rows: rows,
    composite: momComposite
  };
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADVANCED OHLCV METRICS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calcEMA(values, period) {
  if (!values || values.length < period) return null;
  var multiplier = 2 / (period + 1);
  var sum = 0, n = 0;
  for (var i = values.length - period; i < values.length; i++) {
    if (values[i] != null) { sum += values[i]; n++; }
  }
  if (n < period) return null;
  var ema = sum / n;
  for (var i = values.length - period + 1; i < values.length; i++) {
    if (values[i] != null) ema = (values[i] - ema) * multiplier + ema;
  }
  return ema;
}

function calcBB(closes, period, stddev) {
  if (!closes || closes.length < period) return null;
  var sma = calcSMA(closes, period);
  if (sma == null) return null;
  var sumSq = 0, n = 0;
  for (var i = closes.length - period; i < closes.length; i++) {
    if (closes[i] != null) { sumSq += (closes[i] - sma) * (closes[i] - sma); n++; }
  }
  if (n < period) return null;
  var variance = sumSq / n;
  var stdev = Math.sqrt(variance);
  var upper = sma + stddev * stdev;
  var lower = sma - stddev * stdev;
  var lastClose = closes[closes.length - 1];
  var pctB = (upper - lower) === 0 ? null : (lastClose - lower) / (upper - lower) * 100;
  return { upper: upper, lower: lower, middle: sma, pctB: pctB, bandwidth: (upper - lower) / sma * 100 };
}

function calcATR(highs, lows, closes, period) {
  if (!highs || !lows || !closes || highs.length < period + 1) return null;
  var trs = [];
  for (var i = 1; i < highs.length; i++) {
    if (highs[i] == null || lows[i] == null || closes[i - 1] == null) continue;
    var hl = highs[i] - lows[i];
    var hc = Math.abs(highs[i] - closes[i - 1]);
    var lc = Math.abs(lows[i] - closes[i - 1]);
    trs.push(Math.max(hl, hc, lc));
  }
  if (trs.length < period) return null;
  var sum = 0;
  for (var i = trs.length - period; i < trs.length; i++) sum += trs[i];
  return sum / period;
}

function calcMaxDrawdown(closes) {
  if (!closes || closes.length < 2) return null;
  var peak = closes[0];
  var maxDD = 0;
  for (var i = 1; i < closes.length; i++) {
    if (closes[i] == null) continue;
    if (closes[i] > peak) peak = closes[i];
    var dd = (peak - closes[i]) / peak * 100;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

function calcWinRate(closes) {
  if (!closes || closes.length < 2) return null;
  var wins = 0, total = 0;
  for (var i = 1; i < closes.length; i++) {
    if (closes[i] != null && closes[i - 1] != null) { total++; if (closes[i] > closes[i - 1]) wins++; }
  }
  return total === 0 ? null : wins / total * 100;
}

function calcConsecutive(closes) {
  if (!closes || closes.length < 2) return null;
  var current = 0, maxUp = 0, maxDown = 0;
  for (var i = 1; i < closes.length; i++) {
    if (closes[i] == null || closes[i - 1] == null) continue;
    if (closes[i] > closes[i - 1]) { current = current > 0 ? current + 1 : 1; }
    else if (closes[i] < closes[i - 1]) { current = current < 0 ? current - 1 : -1; }
    else { current = 0; }
    if (current > maxUp) maxUp = current;
    if (current < maxDown) maxDown = current;
  }
  return { maxUp: maxUp, maxDown: Math.abs(maxDown) };
}

function calcVolumeAvg(volume, period) {
  if (!volume || volume.length < period) return null;
  var sum = 0, n = 0;
  for (var i = volume.length - period; i < volume.length; i++) {
    if (volume[i] != null) { sum += volume[i]; n++; }
  }
  return n < period ? null : sum / n;
}

function computePriceSnapshot(chartResult) {
  var closes = getCloses(chartResult);
  var quote = chartResult && chartResult.indicators && chartResult.indicators.quote && chartResult.indicators.quote[0];
  var highs = quote ? quote.high : null;
  var lows = quote ? quote.low : null;
  var opens = quote ? quote.open : null;
  var volume = quote ? quote.volume : null;

  var dClose = closes && closes.length > 0 ? closes[closes.length - 1] : null;
  var dOpen = opens && opens.length > 0 ? opens[opens.length - 1] : null;
  var dHigh = highs && highs.length > 0 ? highs[highs.length - 1] : null;
  var dLow = lows && lows.length > 0 ? lows[lows.length - 1] : null;
  var prevClose = (closes && closes.length > 1) ? closes[closes.length - 2] : null;
  var dayChange = (dClose != null && prevClose != null) ? dClose - prevClose : null;
  var dayChangePct = (dayChange != null && prevClose != null && prevClose !== 0) ? dayChange / prevClose * 100 : null;

  var high52 = highest(highs);
  var low52 = lowest(lows);
  var pos52 = (high52 == null || low52 == null || high52 === low52 || dClose == null) ? null :
    (dClose - low52) / (high52 - low52) * 100;
  var from52High = (high52 == null || dClose == null) ? null : (dClose / high52 - 1) * 100;
  var from52Low = (low52 == null || dClose == null) ? null : (dClose / low52 - 1) * 100;

  var range = (dHigh != null && dLow != null) ? dHigh - dLow : null;
  var rangePct = (range != null && dClose != null && dClose !== 0) ? range / dClose * 100 : null;

  var retYtd = null;
  // Find Jan 1st or earliest data point
  for (var i = 0; i < (chartResult && chartResult.timestamp ? chartResult.timestamp.length : 0); i++) {
    var ts = chartResult.timestamp[i];
    if (ts && closes[i] != null && closes[i] > 0) {
      var d = new Date(ts * 1000);
      if (d.getMonth() === 0 && d.getDate() <= 7) {
        retYtd = (dClose / closes[i] - 1) * 100;
        break;
      }
    }
  }
  if (retYtd == null && closes && closes.length > 0 && closes[0] > 0) {
    retYtd = (dClose / closes[0] - 1) * 100;
  }

  var volAvg = calcVolumeAvg(volume, 20);
  var volLatest = volume && volume.length > 0 ? volume[volume.length - 1] : null;
  var volRatio = (volAvg != null && volAvg !== 0 && volLatest != null) ? volLatest / volAvg : null;

  var rows = [];
  rows.push({ name: 'Close', value: fmtNum(dClose), score: null });
  if (dayChange != null) rows.push({ name: 'Day Change', value: arrow(dayChange) + (dayChange > 0 ? '+' : '') + fmtNum(dayChange) + ' (' + (dayChangePct > 0 ? '+' : '') + (dayChangePct != null ? dayChangePct.toFixed(2) + '%' : '—') + ')', score: null });
  rows.push({ name: 'Open / High / Low', value: fmtNum(dOpen) + ' / ' + fmtNum(dHigh) + ' / ' + fmtNum(dLow), score: null });
  rows.push({ name: 'Day Range', value: fmtNum(range) + ' (' + (rangePct != null ? rangePct.toFixed(2) + '%' : '—') + ')', score: null });
  rows.push({ name: '52W High', value: fmtNum(high52) + ' (' + arrow(from52High) + (from52High != null ? from52High.toFixed(2) + '%' : '—') + ')', score: null });
  rows.push({ name: '52W Low', value: fmtNum(low52) + ' (' + arrow(from52Low) + (from52Low != null ? from52Low.toFixed(2) + '%' : '—') + ')', score: null });
  rows.push({ name: '52W Position', value: (pos52 != null ? pos52.toFixed(1) + '%' : '—'), score: scoreHigher(pos52, 20, 90) });
  rows.push({ name: 'YTD Return', value: arrow(retYtd) + (retYtd != null ? retYtd.toFixed(2) + '%' : '—'), score: null });
  if (volLatest != null) rows.push({ name: 'Volume', value: fmtMoney(volLatest), score: null });
  if (volRatio != null) rows.push({ name: 'Vol vs 20d Avg', value: 'x' + volRatio.toFixed(2), score: null });

  return { rows: rows, composite: null };
}

function computeSnapshot(fd, stat, detail) {
  var dClose = rawVal(fd && fd.currentPrice);
  var mcap = rawVal(detail && detail.marketCap);
  var ev = rawVal(stat && stat.enterpriseValue);
  var shares = rawVal(stat && stat.sharesOutstanding);

  if (!mcap && dClose && shares) mcap = dClose * shares;

  var rows = [
    { name: 'Price', value: fmtNum(dClose), score: null },
    { name: 'Market Cap', value: fmtMoney(mcap), score: null },
    { name: 'Enterprise Value', value: fmtMoney(ev), score: null }
  ];

  return { rows: rows, composite: null };
}

function computeValuation(fd, stat, detail) {
  var dClose = rawVal(fd && fd.currentPrice);
  var eps = rawVal(stat && stat.trailingEps);
  var bvTotal = rawVal(stat && stat.bookValue);
  var shares = rawVal(stat && stat.sharesOutstanding);
  var bvps = safeDiv(bvTotal, shares);
  var mcap = rawVal(detail && detail.marketCap);
  var ev = rawVal(stat && stat.enterpriseValue);
  var revenue = rawVal(fd && fd.totalRevenue);
  var opM = rawVal(fd && fd.operatingMargins);
  var fcf = rawVal(fd && fd.freeCashflow);

  var pe = rawVal(detail && detail.trailingPE);
  var fpe = rawVal(stat && stat.forwardPE);
  var ps = safeDiv(mcap, revenue);
  var pb = rawVal(stat && stat.priceToBook);
  var evEbitda = rawVal(stat && stat.enterpriseToEbitda);
  var evSales = rawVal(stat && stat.enterpriseToRevenue);
  var peg = rawVal(stat && stat.pegRatio);

  // New valuation metrics
  var targetPrice = rawVal(fd && fd.targetMeanPrice);
  var targetUpside = (targetPrice != null && dClose != null && dClose !== 0)
    ? (targetPrice / dClose - 1) * 100 : null;
  var recKey = fd && fd.recommendationKey;
  var recMean = rawVal(fd && fd.recommendationMean);
  var analystCount = rawVal(fd && fd.numberOfAnalystOpinions);
  var fcfYield = safeDiv(fcf, mcap);
  var pfcf = safeDiv(mcap, fcf);
  var evfcf = safeDiv(ev, fcf);

  var earnYield = safeDiv(eps, dClose);
  var opYield = (opM != null && ps != null && ps !== 0) ? opM / ps : null;

  var grahamPrice = (eps != null && bvps != null && eps > 0 && bvps > 0) ?
    Math.sqrt(22.5 * eps * bvps) : null;
  var grahamUpside = (grahamPrice != null && dClose != null && dClose !== 0) ?
    (grahamPrice / dClose - 1) * 100 : null;

  var peScore = scoreLower(pe, 8, 45);
  var fpeScore = scoreLower(fpe, 8, 40);
  var psScore = scoreLower(ps, 1, 15);
  var pbScore = scoreLower(pb, 1, 12);
  var pegScore = scoreLower(peg, 0.5, 3.5);
  var evScore = scoreLower(evEbitda, 5, 30);
  var evSalesScore = scoreLower(evSales, 1, 15);
  var earnYieldScore = scoreHigher(earnYield, 0.02, 0.12);
  var opYieldScore = scoreHigher(opYield, 0.03, 0.15);
  var grahamScore = scoreHigher(grahamUpside, -30, 50);
  var targetScore = scoreHigher(targetUpside, -10, 40);
  var pfcfScore = scoreLower(pfcf, 5, 45);
  var evfcfScore = scoreLower(evfcf, 5, 50);

  var valueComposite = avg5(
    avg3(peScore, fpeScore, pegScore),
    avg3(psScore, pbScore, evScore),
    avg5(evSalesScore, targetScore, pfcfScore, evfcfScore, null),
    avg3(earnYieldScore, opYieldScore, null),
    grahamScore);

  var rows = [
    { name: 'P/E TTM', value: fmtNum(pe), score: peScore },
    { name: 'Fwd P/E', value: fmtNum(fpe), score: fpeScore, cat: 'Value' },
    { name: 'PEG Ratio', value: fmtNum(peg), score: pegScore, cat: 'Value' },
    { name: 'P/S TTM', value: fmtNum(ps), score: psScore, cat: 'Value' },
    { name: 'P/B', value: fmtNum(pb), score: pbScore, cat: 'Value' },
    { name: 'EV/EBITDA', value: fmtNum(evEbitda), score: evScore, cat: 'Value' },
    { name: 'EV/Sales', value: fmtNum(evSales), score: evSalesScore, cat: 'Value' },
    { name: 'Earnings Yield', value: fmtPct(earnYield), score: earnYieldScore, cat: 'Value' },
    { name: 'Op. Earn. Yield', value: fmtPct(opYield), score: opYieldScore, cat: 'Value' },
    { name: 'EPS TTM', value: fmtNum(eps), score: null },
    { name: 'BVPS', value: fmtNum(bvps), score: pbScore, cat: 'Value' },
    { name: 'FCF Yield', value: fmtPct(fcfYield), score: null },
    { name: 'Price / FCF', value: fmtNum(pfcf), score: pfcfScore, cat: 'Value' },
    { name: 'EV / FCF', value: fmtNum(evfcf), score: evfcfScore, cat: 'Value' },
    { name: 'Target Price', value: fmtNum(targetPrice), score: null },
    { name: 'Upside to Target', value: arrow(targetUpside) + (targetUpside != null ? targetUpside.toFixed(2) + '%' : '—'), score: targetScore, cat: 'Value' },
    { name: 'Analyst Consensus', value: (recKey || '—') + (recMean != null ? ' (' + recMean.toFixed(2) + ')' : ''), score: null },
    { name: 'Analyst Count', value: (analystCount != null ? analystCount : '—'), score: null }
  ];

  // Add Graham rows only if computable
  if (grahamPrice != null) {
    rows.push({ name: 'Graham Price', value: fmtNum(grahamPrice), score: grahamScore, cat: 'Value' });
    rows.push({ name: 'Graham Upside', value: arrow(grahamUpside) + (grahamUpside != null ? grahamUpside.toFixed(2) + '%' : '—'), score: grahamScore, cat: 'Value' });
  }

  return { rows: rows, composite: valueComposite };
}

function computeQuality(fd, stat) {
  var roe = rawVal(fd && fd.returnOnEquity);
  var roa = rawVal(fd && fd.returnOnAssets);
  var grossM = rawVal(fd && fd.grossMargins);
  var opM = rawVal(fd && fd.operatingMargins);
  var netM = rawVal(fd && fd.profitMargins);
  var ebitdaM = rawVal(fd && fd.ebitdaMargins);
  var fcfM = rawVal(fd && fd.freeCashflow);
  var revenue = rawVal(fd && fd.totalRevenue);
  var fcfMargin = safeDiv(fcfM, revenue);
  var netIncome = rawVal(stat && stat.netIncomeToCommon);
  var grossProfit = rawVal(fd && fd.grossProfit);
  var netMarginComputed = (netIncome != null && revenue != null && revenue !== 0) ? netIncome / revenue : netM;

  var roeScore = scoreHigher(roe, 0.05, 0.25);
  var roaScore = scoreHigher(roa, 0.02, 0.15);
  var grossScore = scoreHigher(grossM, 0.20, 0.60);
  var opScore = scoreHigher(opM, 0.05, 0.30);
  var netScore = scoreHigher(netMarginComputed, 0.03, 0.25);
  var ebitdaScore = scoreHigher(ebitdaM, 0.08, 0.35);
  var fcfMarginScore = scoreHigher(fcfMargin, 0, 0.20);

  var qualityComposite = avg5(
    avg3(roeScore, roaScore, null),
    avg3(grossScore, opScore, netScore),
    avg3(ebitdaScore, fcfMarginScore, null),
    null, null);

  var rows = [
    { name: 'ROE', value: fmtPct(roe), score: roeScore, cat: 'Quality' },
    { name: 'ROA', value: fmtPct(roa), score: roaScore, cat: 'Quality' },
    { name: 'Gross Margin', value: fmtPct(grossM), score: grossScore, cat: 'Quality' },
    { name: 'Operating Margin', value: fmtPct(opM), score: opScore, cat: 'Quality' },
    { name: 'Net Margin', value: fmtPct(netM), score: netScore, cat: 'Quality' },
    { name: 'EBITDA Margin', value: fmtPct(ebitdaM), score: ebitdaScore, cat: 'Quality' },
    { name: 'FCF Margin', value: fmtPct(fcfMargin), score: fcfMarginScore, cat: 'Quality' },
    { name: 'Net Income', value: fmtMoney(netIncome), score: null, cat: 'Quality' },
    { name: 'Gross Profit', value: fmtMoney(grossProfit), score: null, cat: 'Quality' }
  ];

  return { rows: rows, composite: qualityComposite };
}

function computeGrowth(fd) {
  var revGrowth = rawVal(fd && fd.revenueGrowth);
  var epsGrowth = rawVal(fd && fd.earningsGrowth);

  var revScore = scoreHigher(revGrowth, 0, 0.25);
  var epsScore = scoreHigher(epsGrowth, 0, 0.30);
  var growthComposite = avg3(revScore, epsScore, null);

  var rows = [
    { name: 'Revenue Growth', value: arrow(revGrowth) + fmtPct(revGrowth), score: revScore, cat: 'Growth' },
    { name: 'EPS Growth', value: arrow(epsGrowth) + fmtPct(epsGrowth), score: epsScore, cat: 'Growth' }
  ];

  return { rows: rows, composite: growthComposite };
}

function computeRisk(fd, stat) {
  var beta = rawVal(stat && stat.beta);
  var shortRatio = rawVal(stat && stat.shortRatio);
  var shortPctFloat = rawVal(stat && stat.shortPercentOfFloat);
  var sharesShort = rawVal(stat && stat.sharesShort);
  var floatShares = rawVal(stat && stat.floatShares);
  var instOwn = rawVal(stat && stat.heldPercentInstitutions);
  var insiderOwn = rawVal(stat && stat.heldPercentInsiders);

  var betaScore = scoreMid(beta, 0, 1.0, 2.5);
  var shortScore = scoreLower(shortRatio, 1, 10);
  var shortPctScore = scoreLower(shortPctFloat, 0.02, 0.30);
  var instScore = scoreMid(instOwn, 0, 0.60, 1.0);
  var insiderScore = scoreHigher(insiderOwn, 0, 0.30);

  var riskComposite = avg5(betaScore, shortScore, shortPctScore, avg3(instScore, insiderScore, null), null);

  var rows = [
    { name: 'Beta (5Y)', value: fmtNum(beta), score: betaScore, cat: 'Risk' },
    { name: 'Short Ratio', value: fmtNum(shortRatio), score: shortScore, cat: 'Risk' },
    { name: 'Short % Float', value: fmtPct(shortPctFloat), score: shortPctScore, cat: 'Risk' },
    { name: 'Shares Short', value: fmtMoney(sharesShort), score: null, cat: 'Risk' },
    { name: 'Float Shares', value: fmtMoney(floatShares), score: null, cat: 'Risk' },
    { name: 'Institutional Own.', value: fmtPct(instOwn), score: instScore, cat: 'Risk' },
    { name: 'Insider Own.', value: fmtPct(insiderOwn), score: insiderScore, cat: 'Risk' }
  ];

  return { rows: rows, composite: riskComposite };
}

function computeHealth(fd, stat) {
  var debtEq = rawVal(fd && fd.debtToEquity);
  var currRatio = rawVal(fd && fd.currentRatio);
  var quickRatio = rawVal(fd && fd.quickRatio);
  var totalDebt = rawVal(fd && fd.totalDebt);
  var totalCash = rawVal(fd && fd.totalCash);
  var ebitda = rawVal(fd && fd.ebitda);
  var fcf = rawVal(fd && fd.freeCashflow);
  var ocf = rawVal(fd && fd.operatingCashflow);

  var debtEqNorm = (debtEq != null && Math.abs(debtEq) <= 5) ? debtEq * 100 : debtEq;
  var cashDebt = safeDiv(totalCash, totalDebt);
  var intCover = safeDiv(ebitda, totalDebt ? totalDebt * 0.05 : null);

  var debtEqScore = scoreLower(debtEqNorm, 0, 250);
  var debtEbitdaScore = scoreLower(safeDiv(totalDebt, ebitda), 0, 6);
  var cashDebtScore = scoreHigher(cashDebt, 0, 1.5);
  var currScore = scoreMid(currRatio, 0.5, 2.0, 5.0);
  var quickScore = scoreMid(quickRatio, 0.3, 1.5, 4.0);
  var intScore = scoreHigher(intCover, 2, 20);
  var ocfScore = scorePositive(ocf);
  var fcfScore = scorePositive(fcf);

  var healthComposite = avg5(
    avg3(debtEqScore, debtEbitdaScore, null),
    avg3(cashDebtScore, intScore, null),
    avg3(currScore, quickScore, null),
    null,
    avg3(ocfScore, fcfScore, null));

  var rows = [
    { name: 'Debt / Equity', value: fmtNum(debtEqNormalized(debtEq)), score: debtEqScore, cat: 'Health' },
    { name: 'Cash / Debt', value: fmtNum(cashDebt), score: cashDebtScore, cat: 'Health' },
    { name: 'Current Ratio', value: fmtNum(currRatio), score: currScore, cat: 'Health' },
    { name: 'Quick Ratio', value: fmtNum(quickRatio), score: quickScore, cat: 'Health' },
    { name: 'Interest Cover', value: fmtNum(intCover), score: intScore, cat: 'Health' },
    { name: 'OCF', value: fmtMoney(ocf), score: ocfScore, cat: 'Health' },
    { name: 'FCF', value: fmtMoney(fcf), score: fcfScore, cat: 'Health' }
  ];

  return { rows: rows, composite: healthComposite };
}

function debtEqNormalized(v) {
  if (v == null) return null;
  if (typeof v === 'object' && v.raw != null) v = v.raw;
  return Math.abs(v) <= 5 ? v * 100 : v;
}

function computeIncome(fd, stat, detail) {
  var divYield = rawVal(detail && detail.dividendYield);
  var payout = rawVal(detail && detail.payoutRatio);
  var fcf = rawVal(fd && fd.freeCashflow);
  var mcap = rawVal(detail && detail.marketCap);
  var eps = rawVal(stat && stat.trailingEps);
  var dClose = rawVal(fd && fd.currentPrice);
  var divRate = rawVal(detail && detail.dividendRate);

  var fcfYield = safeDiv(fcf, mcap);
  var dps = (divYield != null && dClose != null) ? dClose * divYield : null;

  var yieldScore = scoreHigher(divYield, 0, 0.05);
  var payoutScore = scoreMid(payout, 0, 0.40, 1.0);
  var fcfYieldScore = scoreHigher(fcfYield, 0, 0.08);
  var dpsScore = scorePositive(dps);

  var incomeComposite = avg5(yieldScore, payoutScore, fcfYieldScore, null, dpsScore);

  var rows = [
    { name: 'Dividend Yield', value: fmtPct(divYield), score: yieldScore, cat: 'Income' },
    { name: 'Dividend Rate', value: fmtNum(divRate), score: null, cat: 'Income' },
    { name: 'Payout Ratio', value: fmtPct(payout), score: payoutScore, cat: 'Income' },
    { name: 'FCF Yield', value: fmtPct(fcfYield), score: fcfYieldScore, cat: 'Income' },
    { name: 'DPS (Est.)', value: fmtNum(dps), score: dpsScore, cat: 'Income' }
  ];

  return { rows: rows, composite: incomeComposite };
}

function computeEarnings(ear, events, rec) {
  var quarterlyEarnings = ear && ear.earningsChart && ear.earningsChart.quarterly;
  var lastQ = quarterlyEarnings && quarterlyEarnings.length > 0 ? quarterlyEarnings[0] : null;
  var prevQ = quarterlyEarnings && quarterlyEarnings.length > 1 ? quarterlyEarnings[1] : null;

  var epsActual = lastQ && lastQ.actual;
  var epsEst = lastQ && lastQ.estimate;
  var epsSurprise = (epsActual != null && epsEst != null && epsEst !== 0)
    ? ((epsActual - epsEst) / Math.abs(epsEst)) * 100 : null;

  var prevActual = prevQ && prevQ.actual;
  var epsYoY = (epsActual != null && prevActual != null && prevActual !== 0)
    ? ((epsActual - prevActual) / Math.abs(prevActual)) * 100 : null;

  var curEstimate = ear && ear.earningsChart && ear.earningsChart.currentQuarterEstimate;
  var curEstDate = ear && ear.earningsChart && ear.earningsChart.currentQuarterEstimateDate;

  var eDates = events && events.earnings && events.earnings.earningsDate;
  var nextDate = eDates && eDates.length > 0 ? eDates[0] : null;
  var epsEstNext = events && events.earnings && events.earnings.earningsAverage;
  var revEstNext = events && events.earnings && events.earnings.revenueAverage;

  var trend = rec && rec.trend && rec.trend[0];
  var totalRec = trend ? (trend.strongBuy + trend.buy + trend.hold + trend.sell + trend.strongSell) : 0;
  var buyRatio = totalRec > 0 ? (trend.strongBuy + trend.buy) / totalRec : null;

  var surpriseScore = scoreHigher(epsSurprise, -5, 15);
  var yoyScore = scoreHigher(epsYoY, -15, 30);
  var buyScore = scoreHigher(buyRatio, 0.2, 0.7);

  var earningsComposite = avg5(surpriseScore, yoyScore, buyScore, null, null);

  var rows = [
    { name: 'EPS (Last Q)', value: fmtNum(epsActual), score: null, cat: 'Earnings' },
    { name: 'EPS Estimate', value: fmtNum(epsEst), score: null, cat: 'Earnings' },
    { name: 'Surprise %', value: (epsSurprise != null ? (epsSurprise > 0 ? '+' : '') + epsSurprise.toFixed(2) + '%' : '—'), score: surpriseScore, cat: 'Earnings' },
    { name: 'EPS YoY %', value: (epsYoY != null ? (epsYoY > 0 ? '+' : '') + epsYoY.toFixed(2) + '%' : '—'), score: yoyScore, cat: 'Earnings' },
    { name: 'Next EPS Est', value: fmtNum(epsEstNext), score: null, cat: 'Earnings' },
    { name: 'Next Revenue Est', value: fmtMoney(revEstNext), score: null, cat: 'Earnings' }
  ];

  if (nextDate) {
    rows.push({ name: 'Next Earnings', value: fmtDate(nextDate), score: null, cat: 'Earnings' });
  }

  if (trend) {
    var trendStr = '↑' + (trend.strongBuy + trend.buy) + ' →' + trend.hold + ' ↓' + (trend.sell + trend.strongSell);
    rows.push({ name: 'Analyst Trend', value: trendStr, score: buyScore, cat: 'Earnings' });
  }

  return { rows: rows, composite: earningsComposite };
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION COLOR HELPERS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var SECTION_CSS = {
  'COMPOSITE': 'dash-comp',
  'SNAPSHOT': 'dash-snapshot',
  'VALUATION': 'dash-valuation',
  'QUALITY': 'dash-quality',
  'GROWTH': 'dash-growth',
  'HEALTH': 'dash-health',
  'INCOME': 'dash-income',
  'EARNINGS': 'dash-earnings',
  'RISK': 'dash-risk',
  'MOMENTUM': 'dash-momentum'
};

function sectionCss(title) {
  return SECTION_CSS[title] || 'dash-section-default';
}

function scoreColor(s) {
  if (s == null) return 'var(--dim)';
  if (s >= 80) return 'var(--teal)';
  if (s >= 60) return 'var(--blue)';
  if (s >= 40) return 'var(--amber)';
  return 'var(--red)';
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD RENDERING
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderRowHTML(row, isAlt) {
  var valColor = row.score != null ? (row.score >= 40 ? 'var(--teal)' : 'var(--red)') : 'var(--text)';
  var scoreStr = scoreText(row.score);
  var sc = scoreColor(row.score);
  var alt = isAlt ? ' alt' : '';

  return '<div class="dash-row' + alt + '">' +
    '<span class="dash-metric">' + esc(row.name) + '</span>' +
    '<span class="dash-value" style="color:' + valColor + '">' + row.value + '</span>' +
    '<span class="dash-score"' + (row.score != null ? ' style="color:' + sc + '"' : '') + '>' + scoreStr + '</span>' +
    '</div>';
}

function renderSectionHTML(title, rows, startOpen) {
  var css = sectionCss(title);
  var collapsed = startOpen ? '' : ' collapsed';
  var arrow = startOpen ? '▼' : '▶';
  var h = '<div class="dash-section' + collapsed + '">' +
    '<div class="dash-section-header clickable ' + css + '" data-toggle="section">' +
    '<span class="dash-toggle">' + arrow + '</span><span>' + esc(title) + '</span><span>Value</span><span>Score</span></div>' +
    '<div class="dash-rows">';
  rows.forEach(function (row, i) {
    h += renderRowHTML(row, i % 2 === 1);
  });
  h += '</div></div>';
  return h;
}

function bindSectionToggles(el) {
  if (!el) return;
  var headers = el.querySelectorAll('[data-toggle="section"]');
  for (var i = 0; i < headers.length; i++) {
    headers[i].onclick = function () {
      var section = this.parentElement;
      section.classList.toggle('collapsed');
      var arrow = this.querySelector('.dash-toggle');
      if (arrow) arrow.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
    };
  }
}

function renderScoreCardHTML(name, score) {
  var sc = scoreColor(score);
  var gr = grade(score);
  var s = score != null ? Math.round(score) : '—';
  return '<div class="dash-score-card" style="border-top-color:' + sc + '">' +
    '<span>' + esc(name) + '</span>' +
    '<strong style="color:' + sc + '">' + s + '</strong>' +
    '<small style="color:' + sc + '">' + gr + '</small>' +
    '</div>';
}

function renderDashboard(fundData, chartResult, el) {
  if (!el) return;

  var fd = fundData && fundData.financialData;
  var stat = fundData && fundData.defaultKeyStatistics;
  var detail = fundData && fundData.summaryDetail;

  var hasFundamentals = fd && stat && detail && rawVal(fd.currentPrice) != null;

  if (!hasFundamentals) {
    var priceSnapshot = computePriceSnapshot(chartResult);
    var momentum = computeMomentum(chartResult, fundData ? fundData._momentumExtra : null);

    var h = '<div class="dash-fundamentals">';
    h += '<div class="dash-notice">Fundamental data unavailable for this symbol (indices and some ETFs lack financial statements). Showing all price-derived metrics.</div>';

    h += '<div class="dash-composite">';
    h += renderScoreCardHTML('Momentum', momentum.composite);
    h += '</div>';

    h += renderSectionHTML('PRICE SNAPSHOT', priceSnapshot.rows, true);
    h += renderSectionHTML('MOMENTUM', momentum.rows, false);
    h += '</div>';

    el.innerHTML = h;
    bindSectionToggles(el);
    return;
  }

  var ear = fundData && fundData.earnings;
  var events = fundData && fundData.calendarEvents;
  var rec = fundData && fundData.recommendationTrend;

  var snapshot = computeSnapshot(fd, stat, detail);
  var valuation = computeValuation(fd, stat, detail);
  var quality = computeQuality(fd, stat);
  var growth = computeGrowth(fd);
  var health = computeHealth(fd, stat);
  var income = computeIncome(fd, stat, detail);
  var momentum = computeMomentum(chartResult, fundData._momentumExtra);
  var earnings = computeEarnings(ear, events, rec);
  var risk = computeRisk(fd, stat);

  var overallScore = avg5(
    avg5(valuation.composite, quality.composite, growth.composite, null, null),
    avg5(health.composite, income.composite, momentum.composite, earnings.composite, risk.composite),
    null, null, null);

  var h = '<div class="dash-fundamentals">';

  h += '<div class="dash-composite">';
  h += renderScoreCardHTML('Value', valuation.composite);
  h += renderScoreCardHTML('Quality', quality.composite);
  h += renderScoreCardHTML('Growth', growth.composite);
  h += renderScoreCardHTML('Health', health.composite);
  h += renderScoreCardHTML('Income', income.composite);
  h += renderScoreCardHTML('Earnings', earnings.composite);
  h += renderScoreCardHTML('Momentum', momentum.composite);
  h += renderScoreCardHTML('Risk', risk.composite);
  h += '</div>';

  h += renderSectionHTML('SNAPSHOT', snapshot.rows, true);
  h += renderSectionHTML('VALUATION', valuation.rows, false);
  h += renderSectionHTML('QUALITY', quality.rows, false);
  h += renderSectionHTML('GROWTH', growth.rows, false);
  h += renderSectionHTML('HEALTH', health.rows, false);
  h += renderSectionHTML('INCOME', income.rows, false);
  h += renderSectionHTML('EARNINGS', earnings.rows, false);
  h += renderSectionHTML('RISK', risk.rows, false);
  h += renderSectionHTML('MOMENTUM', momentum.rows, false);
  h += '</div>';

  el.innerHTML = h;
  bindSectionToggles(el);

  var titleEl = $('#chartTitle');
  if (titleEl && overallScore != null) {
    titleEl.textContent = (titleEl.textContent || '') + ' | ' + overallBadge(overallScore) + Math.round(overallScore);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA LOADING
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadBoth() {
  var symbol = ($('#tickerInput') || {}).value || '';
  if (!symbol.trim()) {
    toast('Please enter a ticker symbol');
    return;
  }
  symbol = symbol.trim();

  var range = ($('#rangeSelect') || {}).value || '1y';

  var bench = ($('#benchInput') || {}).value.trim();

  var title = $('#chartTitle');
  if (title) title.textContent = LABELS[symbol] || symbol;

  var chartEl = $('#candleChart');
  var fundEl = $('#fundPanel');

  if (chartEl) chartEl.innerHTML = '<div class="chart-empty">Loading data…</div>';
  if (fundEl) fundEl.innerHTML = '<div class="chart-empty">Loading fundamentals…</div>';

  var promises = [];

  // Fetch chart data
  var chartPromise = fetch('/api/chart?symbol=' + encodeURIComponent(symbol) + '&range=' + range)
    .then(function (r) { return r.json() })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      if (data.chart && data.chart.error) throw new Error(data.chart.error.description || 'Not found');
      var result = data.chart && data.chart.result && data.chart.result[0];
      if (!result) throw new Error('No data for ' + symbol);
      return result;
    });

  // Fetch fundamentals (may return partial data for indices — handled by renderDashboard)
  var fundPromise = fetch('/api/fundamentals?symbol=' + encodeURIComponent(symbol))
    .then(function (r) { return r.json() })
    .then(function (data) {
      if (data.error) throw new Error(data.error);
      if (data.quoteSummary && data.quoteSummary.error) throw new Error(data.quoteSummary.error.description || 'Not found');
      if (data.quoteSummary && data.quoteSummary.result && data.quoteSummary.result[0]) {
        return data.quoteSummary.result[0];
      }
      // Return empty object — renderDashboard will check for usable fields
      return {};
    });

  promises.push(chartPromise, fundPromise);

  // RS computation needs at least 1 year — bump range if shorter
  var rsRange = (!bench || rangeIndex(range) >= rangeIndex('1y')) ? range : '1y';
  if (rsRange !== range) {
    chartPromise = fetch('/api/chart?symbol=' + encodeURIComponent(symbol) + '&range=' + rsRange)
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.error) throw new Error(data.error);
        if (data.chart && data.chart.error) throw new Error(data.chart.error.description || 'Not found');
        var result = data.chart && data.chart.result && data.chart.result[0];
        if (!result) throw new Error('No data for ' + symbol);
        return result;
      });
    promises[0] = chartPromise;
  }

  // Fetch benchmark data if provided
  var benchPromise = null;
  if (bench) {
    benchPromise = fetch('/api/chart?symbol=' + encodeURIComponent(bench) + '&range=' + rsRange)
      .then(function (r) { return r.json() })
      .then(function (data) {
        if (data.error) throw new Error('Benchmark error: ' + data.error);
        var result = data.chart && data.chart.result && data.chart.result[0];
        if (!result) throw new Error('No data for benchmark: ' + bench);
        return result;
      })
      .catch(function (e) {
        toast('⚠️ Benchmark "' + bench + '" not found — RS metrics unavailable');
        return null;
      });
    promises.push(benchPromise);
  }

  Promise.all(promises)
    .then(function (results) {
      var chartResult = results[0];
      var fundResult = results[1];

      renderCandles(chartResult, chartEl);

      // If benchmark was fetched, compute relative strength and inject into momentum
      if (bench && results[2]) {
        injectRelativeStrength(chartResult, results[2], fundResult);
      }

      renderDashboard(fundResult, chartResult, fundEl);
    })
    .catch(function (e) {
      var msg = '❌ Invalid ticker: ' + symbol;
      if (chartEl) chartEl.innerHTML = '<div class="chart-empty" style="color:var(--red)">' + msg + '<br><span style="color:var(--dim);font-size:11px">' + esc(e.message) + '</span></div>';
      if (fundEl) fundEl.innerHTML = '<div class="chart-empty" style="color:var(--red)">' + msg + '<br><span style="color:var(--dim);font-size:11px">' + esc(e.message) + '</span></div>';
      toast(msg);
    });
}

function injectRelativeStrength(stockResult, benchResult, fundResult) {
  if (!stockResult || !benchResult) return;
  var stockCloses = getCloses(stockResult);
  var benchCloses = getCloses(benchResult);
  if (!stockCloses || !benchCloses) return;

  var ret6s = calcReturn(stockCloses, 126);
  var ret12s = calcReturn(stockCloses, 252);
  var ret6b = calcReturn(benchCloses, 126);
  var ret12b = calcReturn(benchCloses, 252);

  var rs6 = (ret6s != null && ret6b != null) ? ret6s - ret6b : null;
  var rs12 = (ret12s != null && ret12b != null) ? ret12s - ret12b : null;

  var rs6Score = scoreHigher(rs6, -20, 25);
  var rs12Score = scoreHigher(rs12, -25, 35);

  // Store on fundResult for dashboard renderer to use
  fundResult._momentumExtra = {
    rs6: { name: '6M RS vs Index', value: arrow(rs6) + (rs6 != null ? rs6.toFixed(2) + '%' : '—'), score: rs6Score },
    rs12: { name: '12M RS vs Index', value: arrow(rs12) + (rs12 != null ? rs12.toFixed(2) + '%' : '—'), score: rs12Score }
  };
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHART RENDERING (UNCHANGED)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderCandles(result, el) {
  var timestamps = result.timestamp || [];
  var quote = result.indicators && result.indicators.quote && result.indicators.quote[0];
  if (!quote || !timestamps.length) { if (el) el.innerHTML = '<div class="chart-empty">No data available</div>'; return }

  var opens = quote.open, highs = quote.high, lows = quote.low, closes = quote.close;
  var data = [];
  for (var i = 0; i < timestamps.length; i++) {
    if (opens[i] == null || highs[i] == null || lows[i] == null || closes[i] == null) continue;
    data.push({ t: timestamps[i], o: opens[i], h: highs[i], l: lows[i], c: closes[i] });
  }
  if (!data.length) { if (el) el.innerHTML = '<div class="chart-empty">No data available</div>'; return }

  var W = Math.max(300, (el ? el.clientWidth : 800) - 4), H = Math.min(380, W * 0.475), P = 24, n = data.length;
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

  var gridLines = 5;
  for (var g = 0; g <= gridLines; g++) {
    var gy = P + (H - P * 2) * g / gridLines;
    var gv = max - range * g / gridLines;
    html += '<line x1="' + P + '" y1="' + gy + '" x2="' + (W - P) + '" y2="' + gy + '" stroke="var(--line)" stroke-width="1"/>' +
      '<text x="' + (P - 4) + '" y="' + (gy + 3) + '" fill="var(--dim)" font-size="8" text-anchor="end">' + fmtPrice(gv) + '</text>';
  }

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var x = P + i * cw + gap;
    var isUp = d.c >= d.o;
    var color = isUp ? 'var(--teal)' : 'var(--red)';
    var top = Math.min(d.o, d.c);
    var bottom = Math.max(d.o, d.c);
    var bodyH = Math.max(y(top) - y(bottom), 1);
    html += '<line x1="' + (x + bw / 2) + '" y1="' + y(d.h) + '" x2="' + (x + bw / 2) + '" y2="' + y(d.l) + '" stroke="' + color + '" stroke-width="1"/>';
    html += '<rect x="' + x + '" y="' + y(bottom) + '" width="' + bw + '" height="' + bodyH + '" fill="' + color + '" opacity=".85"/>';
  }

  var labelCount = Math.min(8, data.length);
  var step = Math.max(1, Math.floor(data.length / labelCount));
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for (var i = 0; i < data.length; i += step) {
    var d = data[i];
    var x = P + i * cw + cw / 2;
    var date = new Date(d.t * 1000);
    var label = months[date.getMonth()] + ' ' + date.getDate();
    if (date.getMonth() === 0 || i === 0 || i + step >= data.length) label += ' ' + date.getFullYear();
    html += '<text x="' + x + '" y="' + (H - 5) + '" fill="var(--dim)" font-size="8" text-anchor="middle">' + label + '</text>';
  }

  html += '</svg>';
  if (el) el.innerHTML = html;
}

function fmtPrice(v) {
  if (v >= 10000) return (v / 1000).toFixed(1) + 'k';
  if (v >= 1000) return v.toFixed(0);
  return v.toFixed(1);
}
