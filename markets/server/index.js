import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import * as P from './providers/index.js';
import { callTool, toolList } from './tools.js';
import { handleMcp } from './mcp.js';
import { startWatcher, status as watcherStatus, universe } from './watcher.js';
import { db } from './store.js';
import { bus } from './bus.js';

const PORT = +process.env.PORT || 3000;
const ROOT = join(import.meta.dirname, '..');
const API_KEY = process.env.AGENT_API_KEY || '';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
const STATIC = { '/': 'public', '/shared/': 'shared', '/vendor/': 'node_modules/lightweight-charts/dist' };
const startedAt = Date.now();

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
};
const bodyOf = async (req) => {
  let n = 0; const chunks = [];
  for await (const c of req) { if ((n += c.length) > 1e6) throw Object.assign(new Error('payload demasiado grande'), { status: 413 }); chunks.push(c); }
  return chunks.length ? JSON.parse(Buffer.concat(chunks)) : {};
};
function authorized(req) {
  if (!API_KEY) return true;
  const got = Buffer.from((req.headers.authorization || '').replace(/^Bearer /i, ''));
  const want = Buffer.from(API_KEY);
  return got.length === want.length && timingSafeEqual(got, want);
}
const sse = (req, res) => {
  res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive', 'x-accel-buffering': 'no' });
  res.write('retry: 3000\n\n');
  const ka = setInterval(() => res.write(': ka\n\n'), 20000);
  req.on('close', () => clearInterval(ka));
  return (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

async function serveStatic(url, res) {
  const [prefix, dir] = Object.entries(STATIC).sort((a, b) => b[0].length - a[0].length).find(([p]) => url.pathname.startsWith(p));
  let rel = normalize(decodeURIComponent(url.pathname.slice(prefix.length))).replace(/^(\.\.[/\\])+/, '');
  if (rel === '.' || rel.endsWith('/') || rel.endsWith('\\')) rel = join(rel, 'index.html');
  const file = join(ROOT, dir, rel);
  if (!file.startsWith(join(ROOT, dir))) return json(res, 403, { error: 'proibido' });
  try {
    if (!(await stat(file)).isFile()) throw 0;
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': rel.includes('index') ? 'no-cache' : 'public, max-age=300' });
    res.end(await readFile(file));
  } catch { json(res, 404, { error: 'não encontrado' }); }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = url.pathname, q = Object.fromEntries(url.searchParams);
  try {
    // ---- API pública do site (dados de mercado) ----
    if (path === '/api/status') return json(res, 200, { mode: P.MODE, uptimeSec: Math.floor((Date.now() - startedAt) / 1000), watcher: watcherStatus, agentAuth: !!API_KEY, universe: universe().map(([id, name, type]) => ({ id, name, type })) });
    if (path === '/api/search') return json(res, 200, q.q ? await P.search(q.q, q.type) : []);
    if (path === '/api/quotes') return json(res, 200, await P.quotes((q.ids || '').split(',').filter(Boolean).slice(0, 50)));
    if (path === '/api/candles') return json(res, 200, await P.candles(q.id, q.tf || '1d', Math.min(+q.limit || 500, 1000)));
    if (path === '/api/news') return json(res, 200, await P.news(q.q || ''));
    if (path === '/api/scan') return json(res, 200, await callTool('scan_market', Object.fromEntries(Object.entries(q).map(([k, v]) => [k, isNaN(+v) ? v : +v]))));
    if (path === '/api/overview') return json(res, 200, await callTool('market_overview'));

    // Preços ao vivo para o browser (SSE): o servidor consulta o fornecedor, não o cliente.
    if (path === '/api/stream') {
      const ids = (q.ids || '').split(',').filter(Boolean).slice(0, 40);
      const send = sse(req, res);
      let stop = false; req.on('close', () => (stop = true));
      const loop = async () => {
        while (!stop) {
          try { send('quotes', await P.quotes(ids)); } catch (e) { send('error', { message: e.message }); }
          await new Promise((r) => setTimeout(r, +process.env.STREAM_MS || 2500));
        }
      };
      return void loop();
    }

    // ---- API para agentes (autenticada se AGENT_API_KEY definida) ----
    if (path.startsWith('/agent/') || path === '/mcp') {
      if (!authorized(req)) return json(res, 401, { error: 'Authorization: Bearer <AGENT_API_KEY> em falta/inválida' });
      if (path === '/mcp') {
        if (req.method === 'GET') return json(res, 405, { error: 'use POST (JSON-RPC)' });
        const msg = await bodyOf(req);
        const out = Array.isArray(msg) ? (await Promise.all(msg.map(handleMcp))).filter(Boolean) : await handleMcp(msg);
        if (!out || (Array.isArray(out) && !out.length)) { res.writeHead(202); return res.end(); }
        return json(res, 200, out);
      }
      if (path === '/agent/v1/tools') return json(res, 200, toolList());
      if (path === '/agent/v1/events') { // stream contínuo de alertas/sinais
        const send = sse(req, res);
        const since = +req.headers['last-event-id'] || +q.since_id || 0;
        for (const e of await callTool('get_events', { since_id: since, limit: 100 })) send('alert', e);
        const on = (e) => send('alert', e);
        bus.on('event', on); req.on('close', () => bus.off('event', on));
        return;
      }
      const m = path.match(/^\/agent\/v1\/tools\/(\w+)$/);
      if (m) {
        const args = req.method === 'POST' ? await bodyOf(req) : Object.fromEntries(Object.entries(q).map(([k, v]) => [k, isNaN(+v) ? v : +v]));
        return json(res, 200, { result: await callTool(m[1], args) });
      }
      return json(res, 404, { error: 'rota de agente desconhecida', see: '/agent/v1/tools' });
    }
    if (path === '/healthz') return json(res, 200, { ok: true, snapshots: db.prepare('SELECT COUNT(*) n FROM snapshots').get().n });
    return serveStatic(url, res);
  } catch (e) {
    json(res, e.status || (e instanceof SyntaxError ? 400 : 502), { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`Markets Terminal em http://localhost:${PORT}  [dados: ${P.MODE}]${API_KEY ? '' : '  ⚠ AGENT_API_KEY não definida: API de agentes aberta'}`);
  startWatcher();
});
for (const s of ['SIGTERM', 'SIGINT']) process.on(s, () => { server.close(); db.close(); process.exit(0); });
