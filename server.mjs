import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = new URL('.', import.meta.url);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);

    /* ── Market data proxy ───────────────────────────── */
    if (pathname === '/api/market') {
      try {
        const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=5d',
          { headers: { 'user-agent': 'Mozilla/5.0' } });
        if (!r.ok) throw new Error('NSEI ' + r.status);
        const data = await r.json();
        res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    /* ── Chart data proxy ───────────────────────────── */
    if (pathname === '/api/chart') {
      const symbol = url.searchParams.get('symbol') || '^NSEI';
      const months = parseInt(url.searchParams.get('months')) || 3;
      const range = months <= 1 ? '1mo' : months <= 3 ? '3mo' : months <= 6 ? '6mo' : months <= 12 ? '1y' : months <= 24 ? '2y' : '5y';
      try {
        const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) +
          '?interval=1d&range=' + range, { headers: { 'user-agent': 'Mozilla/5.0' } });
        if (!r.ok) throw new Error(symbol + ' ' + r.status);
        const data = await r.json();
        if (data.chart && data.chart.error) throw new Error(data.chart.error.description || 'Yahoo error');
        res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    /* ── Fundamentals data proxy ──────────────────────── */
    if (pathname === '/api/fundamentals') {
      const symbol = url.searchParams.get('symbol') || '';
      if (!symbol) {
        res.writeHead(400, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(JSON.stringify({ error: 'Symbol parameter is required' }));
        return;
      }
      async function getCrumb() {
        const r = await fetch('https://fc.yahoo.com/', { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'manual' });
        const cookie = r.headers.get('set-cookie') || '';
        const a3 = cookie.split(';')[0];
        const r2 = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', { headers: { 'user-agent': 'Mozilla/5.0', 'cookie': a3 } });
        return { cookie: a3, crumb: (await r2.text()).trim() };
      }
      try {
        const auth = await getCrumb();
        const modules = 'financialData,defaultKeyStatistics,summaryDetail,earnings';
        const r = await fetch('https://query2.finance.yahoo.com/v10/finance/quoteSummary/' +
          encodeURIComponent(symbol) + '?modules=' + modules + '&crumb=' + encodeURIComponent(auth.crumb), {
          headers: { 'user-agent': 'Mozilla/5.0', 'cookie': auth.cookie }
        });
        if (!r.ok) throw new Error(symbol + ' ' + r.status);
        const data = await r.json();
        if (data.quoteSummary && data.quoteSummary.error) throw new Error(data.quoteSummary.error.description || 'Yahoo error');
        res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
        res.end(JSON.stringify(data));
      } catch (e) {
        res.writeHead(502, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    let file = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    if (!extname(file)) file = 'index.html';
    const data = await readFile(new URL(file, root));
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    const data = await readFile(new URL('index.html', root));
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(data);
  }
});
server.listen(4173, () => console.log('FINCELL running at http://localhost:4173'));
