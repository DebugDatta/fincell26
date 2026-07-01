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
