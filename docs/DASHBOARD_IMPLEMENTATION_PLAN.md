# FINCELL Dashboard — Complete Implementation Plan

> **Goal**: Transform the FINCELL website into a full-featured financial research dashboard, inspired by FinceptTerminal's 100+ data connectors and analytics modules — but built as a **free, web-based** platform suitable for undergraduate use.

## Current State (Already Built)

| Feature | Status | Location |
|---------|--------|----------|
| SPA routing (10 pages) | ✅ Done | `js/main.js` |
| Admin CMS panel | ✅ Done | `js/pages/admin.js` |
| Canvas market background | ✅ Done | `js/main.js` |
| Yahoo Finance market ticker | ✅ Done | `server.mjs`, `netlify/functions/market.js` |
| Yahoo Finance candlestick chart | ✅ Done | `netlify/functions/chart.js` |
| Yahoo Finance fundamentals | ✅ Done | `netlify/functions/fundamentals.js` |
| Fundamentals scoring engine | ✅ Done | `js/pages/dashboard.js` (1000+ lines) |
| Technical indicators (RSI, MACD, BB, ATR) | ✅ Done | `js/pages/dashboard.js` |
| Relative strength vs benchmark | ✅ Done | `js/pages/dashboard.js` |
| Responsive dark theme | ✅ Done | `styles.css` |
| Departments, Team, Events, etc. | ✅ Done | `js/pages/` |

---

## Phase 1 — Quick Wins (1-2 Weeks)

These require minimal code and add maximum visual impact.

### 1.1 Live Market Ticker Tape
Add a scrolling ticker in the header showing real-time prices for Nifty 50, Sensex, Bank Nifty, USD/INR, Gold.

**Free API**: Yahoo Finance (already integrated)
**New file**: `js/ticker.js`
**Changes needed**:
- Add a `<div class="ticker-tape">` inside `#siteHeader` in `render()` function
- Fetch `/api/market` for Nifty, add more endpoints for Sensex (`^BSESN`), Bank Nifty (`^NSEBANK`)
- Use CSS `@keyframes marquee` for smooth scrolling animation

```js
// js/ticker.js — Fetch multiple symbols in parallel
export function initTicker() {
  var symbols = ['^NSEI', '^BSESN', '^NSEBANK', 'RELIANCE.NS', 'HDFCBANK.NS'];
  symbols.forEach(function (s) { fetchTicker(s); });
  setInterval(function () { symbols.forEach(function (s) { fetchTicker(s); }) }, 60000);
}
```

**CSS for ticker** (add to `styles.css`):
```css
.ticker-tape { overflow: hidden; white-space: nowrap; }
.ticker-inner { display: inline-flex; gap: 32px; animation: scroll 30s linear infinite; }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
```

### 1.2 Sector Performance Widget
Show Nifty sectoral indices (IT, Pharma, Bank, Auto, FMCG, Metal, Energy, Realty).

**Free API**: Yahoo Finance (scrape or use `^CNXIT`, `^CNXPHARMA`, etc.)
**New file**: `js/sectors.js`
**Location**: Dashboard page, below the chart

**Reference data**: Nifty sector indices have Yahoo tickers like:
- `^CNXIT` — Nifty IT
- `^CNXPHARMA` — Nifty Pharma
- `^CNXBANK` — Nifty Bank
- `^CNXAUTO` — Nifty Auto
- `^CNXFMCG` — Nifty FMCG
- `^CNXMETAL` — Nifty Metal
- `^CNXENERGY` — Nifty Energy
- `^CNXREALTY` — Nifty Realty

### 1.3 Top Gainers / Losers
Add a sidebar showing Nifty 50 top 5 gainers and losers.

**Free API**: Yahoo Finance screener (query `https://query1.finance.yahoo.com/v1/finance/screener`)
**New file**: `js/gainers.js`

### 1.4 Economic Calendar
Display upcoming economic events (RBI policy, US Fed, CPI, GDP releases).

**Free API**: Trading Economics (free tier: 100 calls/day) or ForexFactory scrape
**New file**: `js/calendar.js`
**Location**: New section on dashboard or events page

---

## Phase 2 — Data Expansion (2-4 Weeks)

Add multiple free data sources alongside Yahoo Finance.

### 2.1 Alpha Vantage Integration
**What**: Technical indicators (SMA, EMA, RSI, MACD), FX rates, crypto
**Free tier**: 25 API calls/day (1 key per user), 500 calls/day (2nd key)
**New function**: `netlify/functions/alpha.js`
**Docs**: https://www.alphavantage.co/documentation/

**Key endpoints**:
```
/api/alpha?function=TIME_SERIES_DAILY&symbol=RELIANCE.BSE
/api/alpha?function=FX_DAILY&from_symbol=USD&to_symbol=INR
/api/alpha?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=INR
/api/alpha?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=INR
```

### 2.2 FRED Economic Data (Federal Reserve)
**What**: 800,000+ US economic indicators (GDP, unemployment, CPI, interest rates, yield curve)
**Free tier**: Unlimited with free API key
**New function**: `netlify/functions/fred.js`
**Docs**: https://fred.stlouisfed.org/docs/api/api_key.html

**Key series for Indian context comparison**:
```
GDP — US GDP (comparison)
UNRATE — US unemployment
FEDFUNDS — Fed interest rate
CPIAUCSL — US inflation
T10YIE — 10Y breakeven inflation
DGS10 — 10Y Treasury yield
DGS2 — 2Y Treasury yield
```

**New page section**: Economic Dashboard tab

### 2.3 World Bank Data
**What**: Global development indicators (50+ years)
**Free**: No API key required
**New function**: `netlify/functions/worldbank.js`
**Docs**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

**Relevant indicators**:
```
NY.GDP.MKTP.KD.ZG — GDP growth (annual %)
FP.CPI.TOTL.ZG — Inflation
BN.CAB.XOKA.GD.ZS — Current account balance (% of GDP)
BX.KLT.DINV.WD.GD.ZS — Foreign direct investment (% of GDP)
```

### 2.4 GNews API — Financial News Feed
**What**: Curated finance news with search
**Free tier**: 100 requests/day
**New function**: `netlify/functions/gnews.js`
**Location**: Replace hardcoded news on News page

### 2.5 RBI / Indian Government Data
**What**: RBI monetary policy, Indian economic indicators
**Free**: No API key (RBI CKAN/Open Data portal)
**New function**: `netlify/functions/rbi.js`
**Source**: https://api.rbi.org.in/

---

## Phase 3 — Advanced Analytics (4-8 Weeks)

### 3.1 Portfolio Tracker (Paper Trading)
Let users create a watchlist and track virtual portfolio performance.

**New file**: `js/portfolio.js`
**Data**: Yahoo Finance (already integrated)
**Local storage**: Save holdings in `localStorage`

**Features**:
- Add/remove symbols
- Track cost basis, current value, P&L, returns %
- Historical performance chart
- Portfolio allocation pie chart (SVG)

### 3.2 Currency Converter & Commodities
Live forex rates and commodity prices.

**Free APIs**:
- **ExchangeRate-API**: 1500 calls/month free
- **Alpha Vantage FX**: USD/INR, EUR/INR, GBP/INR
- **Gold price**: Via `libra.alpha` or GoldAPI.io (250 calls/day free)

**New function**: `netlify/functions/forex.js`
**Widget location**: Dashboard sidebar

### 3.3 Mutual Fund NAV Tracker
Track Indian mutual fund NAVs.

**Free source**: AMFI India data (scrape from `https://www.amfiindia.com/nav-history`)
**Alternative**: `https://api.mfapi.in/mf/{scheme-code}` (free, no key)
**New function**: `netlify/functions/mfapi.js`

### 3.4 IPO Calendar & Performance
Show upcoming IPOs and recently listed stock performance.

**Free sources**:
- `https://www.chittorgarh.com/ipo/` (scrape)
- BSE website
**New function**: `netlify/functions/ipo.js`

### 3.5 Company Comparison Tool
Side-by-side comparison of 2-3 stocks.

**New file**: `js/comparison.js`
**Data**: Yahoo Finance fundamentals (already integrated)
**Feature**: Overlay charts, ratio comparison table

---

## Phase 4 — Data Visualization Upgrades (Ongoing)

### 4.1 Replace SVG Charts with Lightweight Charts (TradingView)
TradingView's library is free, open-source, and infinitely better.

**Library**: https://github.com/tradingview/lightweight-charts
**CDN**: `<script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>`

**Benefits over current SVG**:
- Interactive crosshair
- Zoom/pan
- Volume histogram
- Time range selector
- Multiple series overlay

### 4.2 Add Chart.js for Non-Candle Charts
**Library**: https://www.chartjs.org/
**Use cases**:
- Portfolio allocation (doughnut chart)
- Sector performance (bar chart)
- Historical returns (line chart)
- Correlation matrix (heatmap)

### 4.3 Market Heatmap
A treemap showing Nifty 50 stocks by market cap with color coding for daily change.

**Library**: https://d3js.org/ (free, or use Canvas API)
**Alternative**: Use `<canvas>` with custom D3 treemap layout

---

## Phase 5 — Export & Sharing (Future)

### 5.1 PDF Report Generation
**Library**: `html2canvas` + `jsPDF` (both free)
**Feature**: Export dashboard snapshot as PDF

### 5.2 CSV/Excel Download
Download chart data or fundamentals as CSV.
**Native**: Simple `Blob` + `URL.createObjectURL`

### 5.3 Shareable Links
Generate a unique URL with stock symbol pre-loaded.
**Approach**: URL hash params (`/dashboard#RELIANCE.NS`)

---

## Complete Free API Reference Table

| API | Data Type | Free Limit | Key Needed | Use Case |
|-----|-----------|-----------|-----------|----------|
| **Yahoo Finance** | Stocks, indices, FX, fundamentals | Unlimited | No | Core market data |
| **Alpha Vantage** | Stocks, FX, crypto, technicals | 25/day | Yes | Technical indicators |
| **FRED** | 800K US economic series | Unlimited | Yes | US macro data |
| **World Bank** | Global development indicators | Unlimited | No | Global comparisons |
| **IMF** | GDP, trade, inflation | Unlimited | No | Global macro |
| **GNews** | Finance news headlines | 100/day | Yes | News feed |
| **ExchangeRate-API** | Forex conversion | 1500/month | Yes | Currency converter |
| **CoinGecko** | Crypto prices/metrics | Unlimited | No | Crypto section |
| **AMFI India / mfapi.in** | Mutual fund NAVs | Unlimited | No | MF tracker |
| **Trading Economics** | Economic calendar | 100/day | Yes | Calendar widget |
| **RBI API** | Indian monetary data | Unlimited | No | Indian macro |
| **GoldAPI.io** | Gold spot price | 250/day | Yes | Commodity widget |
| **OpenFIGI** | Stock identifiers/mapping | Unlimited | Yes | Symbol lookup |
| **SEC EDGAR** | US company filings | Unlimited | No | Advanced research |
| **Polygon.io** | Real-time stocks/options | Free (delayed) | Yes | Optional upgrade |
| **Twelve Data** | Stocks, forex, crypto | 800/day | Yes | Backup data source |

---

## Architecture — New Netlify Functions to Create

```
netlify/functions/
├── market.js          → Yahoo Nifty 50 (DONE)
├── chart.js           → Yahoo OHLCV chart (DONE)
├── fundamentals.js    → Yahoo financials (DONE)
├── alpha.js           → Alpha Vantage wrapper (NEW)
├── fred.js            → FRED economic data (NEW)
├── worldbank.js       → World Bank API (NEW)
├── gnews.js           → GNews headlines (NEW)
├── forex.js           → ExchangeRate-API (NEW)
├── rbi.js             → RBI CKAN portal (NEW)
├── mfapi.js           → Indian mutual funds (NEW)
├── ipo.js             → IPO calendar (NEW)
├── gold.js            → GoldAPI.io (NEW)
├── coingecko.js       → CoinGecko proxy (NEW)
```

**Each function follows the same pattern**:
```js
// netlify/functions/example.js
exports.handler = async function (event, context) {
  try {
    var data = await fetch('https://api.example.com/data', { headers: { ... } });
    var json = await data.json();
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify(json)
    };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: e.message }) };
  }
};
```

Add rewrites to `netlify.toml`:
```toml
[[redirects]]
  from = "/api/alpha"
  to = "/.netlify/functions/alpha"
  status = 200

[[redirects]]
  from = "/api/fred"
  to = "/.netlify/functions/fred"
  status = 200

# ... repeat for each new endpoint
```

---

## File Structure — New Files to Create

```
js/
├── main.js            (EXISTING — app shell)
├── market.js          (EXISTING — market ticker)
├── state.js           (EXISTING — CMS state)
├── utils.js           (EXISTING — helpers)
├── ticker.js          (NEW — scrolling ticker tape)
├── sectors.js         (NEW — sector performance)
├── gainers.js         (NEW — top gainers/losers)
├── calendar.js        (NEW — economic calendar)
├── portfolio.js       (NEW — portfolio tracker)
├── comparison.js      (NEW — stock comparison tool)
├── forex.js           (NEW — currency converter)
├── commodity.js       (NEW — gold/crude prices)
├── mutualfund.js      (NEW — MF NAV tracker)
└── pages/
    ├── dashboard.js   (EXISTING — enhance with widgets)
    ├── home.js        (EXISTING)
    ├── about.js       (EXISTING)
    ├── departments.js (EXISTING)
    ├── projects.js    (EXISTING)
    ├── gallery.js     (EXISTING)
    ├── events.js      (EXISTING)
    ├── blogs.js       (EXISTING)
    ├── news.js        (EXISTING — connect to GNews)
    ├── contact.js     (EXISTING)
    ├── admin.js       (EXISTING)
    └── team.js        (EXISTING)
```

---

## Dashboard Layout — Enhanced Design

```
┌─────────────────────────────────────────────────────┐
│ HEADER: Logo | NAV | [Marquee Ticker]               │
├─────────────────────────────────────────────────────┤
│ KPI ROW: Nifty 50 | Sensex | Bank Nifty | USD/INR  │
│          India VIX | Gold | Crude                   │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  CANDLESTICK CHART   │  SECTOR WIDGET              │
│  (Interactive)       │  IT     +1.2% ████████      │
│                      │  Pharma +0.8% ██████        │
│  Time: 1M | 3M | 6M  │  Bank   -0.3% ████         │
│  | 1Y | 5Y           │  Auto   +0.5% █████         │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│ FUNDAMENTALS PANEL (scoring system — ALREADY BUILT) │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │Val│ │Qua│ │Gro│ │Hlth│ │Inc│ │Ern│ │Mom│ │Rsk│ │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ │
├─────────────────────────────────────────────────────┤
│ TOP GAINERS  │  TOP LOSERS  │  NEWS HEADLINES      │
│ RELIANCE ▲3% │ TCS ▼1.2%   │ RBI holds rates...   │
│ HDFC ▲2.1%  │ INFY ▼0.8%  │ GDP grows 6.5%...    │
│ ICICI ▲1.5% │ WIPRO ▼0.5% │ Gold at new high...  │
├─────────────────────────────────────────────────────┤
│ PORTFOLIO TRACKER  │  ECONOMIC CALENDAR           │
│ [Add holdings]     │  Jul 15 — RBI Policy        │
│ P&L: +2.3%        │  Jul 20 — US CPI            │
│                     │  Jul 25 — Fed Decision      │
├─────────────────────────────────────────────────────┤
│ FOOTER                                               │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step Build Order

### Week 1: Market Data Expansion
```
Day 1-2:  Live ticker tape in header
Day 3-4:  Sector performance widget
Day 5-6:  Top gainers/losers
Day 7:    Alpha Vantage function + technical indicators
```

### Week 2: News & Economic Data
```
Day 1-2:  GNews integration → dynamic news page
Day 3-4:  FRED function → US macro widget
Day 5-6:  World Bank function → global data
Day 7:    Economic calendar widget
```

### Week 3: Portfolio & Tools
```
Day 1-3:  Portfolio tracker with localStorage
Day 4-5:  Currency converter widget
Day 6-7:  Commodity prices widget
```

### Week 4: Advanced Features
```
Day 1-2:  Mutual fund NAV tracker
Day 3-4:  IPO calendar widget
Day 5-6:  Company comparison tool
Day 7:    PDF export + CSV download
```

### Week 5+: Polish
```
- TradingView Lightweight Charts upgrade
- Market heatmap (D3 treemap)
- Mobile responsive refinements
- Performance optimization
- Caching layer (sessionStorage)
```

---

## Key Integration Points (Code)

### Adding a new data source
```js
// 1. Create Netlify function in netlify/functions/
// 2. Add redirect in netlify.toml
// 3. Create JS module in js/
// 4. Import and call from main.js or dashboard.js
```

Example — adding news from GNews:

```js
// netlify/functions/gnews.js
exports.handler = async function () {
  var key = process.env.GNEWS_KEY; // Set in Netlify dashboard
  var r = await fetch(`https://gnews.io/api/v4/search?q=finance&lang=en&country=in&max=10&apikey=${key}`);
  var data = await r.json();
  return { statusCode: 200, body: JSON.stringify(data.articles) };
};
```

```js
// js/pages/news.js (modify fetchNews function)
export async function fetchNews() {
  var r = await fetch('/api/gnews');
  var articles = await r.json();
  // Map to your news card format
  return articles.map(function (a) {
    return { h: a.title, e: a.description, d: a.publishedAt.slice(0, 10), c: 'News', l: a.url };
  });
}
```

### Environment variables for API keys
Set in Netlify dashboard → Site settings → Environment variables:
```
ALPHA_VANTAGE_KEY=your_key
FRED_KEY=your_key
GNEWS_KEY=your_key
EXCHANGE_RATE_KEY=your_key
GOLD_API_KEY=your_key
```

---

## What to Build vs What to Skip

### BUILD THESE (undergraduate-appropriate, free, high value)
- ✅ Sector performance widgets
- ✅ Top gainers/losers
- ✅ Portfolio tracker (paper)
- ✅ Economic calendar
- ✅ Currency converter
- ✅ Commodity prices
- ✅ Mutual fund NAVs
- ✅ IPO calendar
- ✅ News feed integration
- ✅ Company comparison
- ✅ FRED economic data
- ✅ World Bank indicators
- ✅ PDF/CSV export
- ✅ Market heatmap

### SKIP THESE (too complex, paid-only, or overkill)
- ❌ Real-time WebSocket streaming (costly)
- ❌ 16 broker integrations (not needed for college)
- ❌ AI agents / LLM integration (complex, costly)
- ❌ Satellite/maritime tracking (not relevant)
- ❌ QuantLib / derivatives pricing (overkill for undergrad)
- ❌ High-frequency trading (infrastructure heavy)
- ❌ Options strategy builder (niche)
- ❌ MCP / automation pipeline (advanced)

---

## Resources & Learning

### Free API Signup Links
| API | Signup |
|-----|--------|
| Alpha Vantage | https://www.alphavantage.co/support/#api-key |
| FRED | https://fred.stlouisfed.org/docs/api/api_key.html |
| GNews | https://gnews.io/register |
| ExchangeRate-API | https://www.exchangerate-api.com/ |
| GoldAPI | https://www.goldapi.io/register |
| OpenFIGI | https://www.openfigi.com/ |

### Free Libraries
| Library | Use |
|---------|-----|
| Lightweight Charts (TradingView) | Interactive OHLCV/candlestick charts |
| Chart.js | Bar, line, doughnut, radar charts |
| D3.js | Custom visualizations, heatmaps |
| html2canvas + jsPDF | PDF export |
| Papa Parse | CSV export/import |

### Reference Projects
- **FinceptTerminal** (GitHub): C++/Qt6 desktop app with 100+ data sources
- **OpenBB Terminal**: Python open-source Bloomberg alternative
- **Grafana**: Dashboarding reference (layout, design patterns)

---

> **Key Principle**: Add one data source at a time. Each new API should be a separate Netlify function with a clear `/api/` route. Keep the frontend modular — one JS file per feature widget. Use the existing scoring engine in `dashboard.js` as a template for new analytics features.
