// Fonte única das capacidades expostas a agentes: REST (/agent/v1/tools/:nome) e MCP (/mcp).
import * as P from './providers/index.js';
import { summarize } from '../shared/indicators.mjs';
import { db, addEvent } from './store.js';
import { bus } from './bus.js';
import { cached } from './cache.js';

const TFS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const idDesc = 'ID com prefixo do fornecedor, ex.: BINANCE:BTCUSDT ou YAHOO:AAPL (obtido via search_symbols).';
const ALERT_CONDS = ['price_above', 'price_below', 'rsi_above', 'rsi_below', 'change_pct_above', 'change_pct_below'];

const snapRow = (r) => ({
  id: r.id, symbol: r.symbol, name: r.name, type: r.type, price: r.price, changePct: r.change_pct,
  rsi14: r.rsi, trend: r.trend, ret7d: r.ret7d, ret30d: r.ret30d, atrPct: r.atr_pct, distFromHigh52wPct: r.dist_high,
  updated: new Date(r.updated).toISOString(),
});

export const tools = {
  search_symbols: {
    description: 'Pesquisa símbolos em ações, ETFs, índices, FX e crypto por ticker ou nome. Devolve ids para usar nas outras ferramentas.',
    input: { type: 'object', properties: { query: { type: 'string' }, type: { type: 'string', enum: ['crypto', 'stock', 'etf', 'index', 'forex', 'future'] } }, required: ['query'] },
    run: ({ query, type }) => P.search(String(query), type),
  },
  get_quote: {
    description: 'Cotações atuais (preço, variação 24h, máx/mín, volume).',
    input: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' }, description: idDesc } }, required: ['ids'] },
    run: ({ ids }) => P.quotes(ids.slice(0, 50)),
  },
  get_candles: {
    description: 'Velas OHLCV históricas (t em segundos UTC), ordem cronológica.',
    input: { type: 'object', properties: { id: { type: 'string', description: idDesc }, timeframe: { type: 'string', enum: TFS, default: '1d' }, limit: { type: 'integer', default: 200, maximum: 1000 } }, required: ['id'] },
    run: ({ id, timeframe = '1d', limit = 200 }) => P.candles(id, timeframe, Math.min(limit, 1000)),
  },
  get_indicators: {
    description: 'Análise técnica resumida: RSI, MACD, SMA/EMA, Bollinger, ATR, retornos, distância ao máximo 52s e sinais interpretados.',
    input: { type: 'object', properties: { id: { type: 'string', description: idDesc }, timeframe: { type: 'string', enum: TFS, default: '1d' } }, required: ['id'] },
    run: async ({ id, timeframe = '1d' }) => {
      const c = await P.candles(id, timeframe, 500);
      return { id, timeframe, candles: c.length, ...(summarize(c) ?? { error: 'histórico insuficiente' }) };
    },
  },
  scan_market: {
    description: 'Scanner sobre o universo vigiado 24/7 (dados pré-calculados, resposta instantânea). Filtros opcionais combináveis.',
    input: { type: 'object', properties: {
      type: { type: 'string', enum: ['crypto', 'stock', 'etf', 'index'] }, rsi_below: { type: 'number' }, rsi_above: { type: 'number' },
      trend: { type: 'string', enum: ['up', 'down', 'neutral'] }, min_change_pct: { type: 'number', description: 'variação 24h mínima (%)' },
      max_change_pct: { type: 'number' }, min_ret30d: { type: 'number' }, near_high_pct: { type: 'number', description: 'a no máximo X% do máximo 52s' },
      sort: { type: 'string', enum: ['change_pct', 'rsi', 'ret7d', 'ret30d', 'atr_pct'], default: 'change_pct' }, order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
      limit: { type: 'integer', default: 25 } } },
    run: (a) => {
      const w = [], v = [];
      const add = (sql, x) => { w.push(sql); v.push(x); };
      if (a.type) add('type = ?', a.type);
      if (a.rsi_below != null) add('rsi < ?', a.rsi_below);
      if (a.rsi_above != null) add('rsi > ?', a.rsi_above);
      if (a.trend) add('trend = ?', a.trend);
      if (a.min_change_pct != null) add('change_pct >= ?', a.min_change_pct);
      if (a.max_change_pct != null) add('change_pct <= ?', a.max_change_pct);
      if (a.min_ret30d != null) add('ret30d >= ?', a.min_ret30d);
      if (a.near_high_pct != null) add('dist_high >= ?', -Math.abs(a.near_high_pct));
      const sort = { change_pct: 'change_pct', rsi: 'rsi', ret7d: 'ret7d', ret30d: 'ret30d', atr_pct: 'atr_pct' }[a.sort] || 'change_pct';
      const order = a.order === 'asc' ? 'ASC' : 'DESC';
      const sql = `SELECT * FROM snapshots ${w.length ? 'WHERE ' + w.join(' AND ') : ''} ORDER BY ${sort} ${order} LIMIT ?`;
      return db.prepare(sql).all(...v, Math.min(a.limit ?? 25, 200)).map(snapRow);
    },
  },
  market_overview: {
    description: 'Visão geral: principais movers (maiores subidas/descidas), ativos sobrecomprados/sobrevendidos e contagem de tendências no universo vigiado.',
    input: { type: 'object', properties: {} },
    run: () => {
      const q = (sql, ...a) => db.prepare(sql).all(...a).map(snapRow);
      return {
        updated: db.prepare('SELECT MAX(updated) u FROM snapshots').get().u,
        topGainers: q('SELECT * FROM snapshots ORDER BY change_pct DESC LIMIT 5'),
        topLosers: q('SELECT * FROM snapshots ORDER BY change_pct ASC LIMIT 5'),
        oversold: q('SELECT * FROM snapshots WHERE rsi < 30 ORDER BY rsi ASC LIMIT 5'),
        overbought: q('SELECT * FROM snapshots WHERE rsi > 70 ORDER BY rsi DESC LIMIT 5'),
        trends: db.prepare('SELECT trend, COUNT(*) n FROM snapshots GROUP BY trend').all(),
      };
    },
  },
  get_news: {
    description: 'Últimas notícias para um ticker ou termo.',
    input: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    run: ({ query }) => P.news(String(query)),
  },
  create_alert: {
    description: 'Cria um alerta vigiado 24/7. Dispara evento (SSE /agent/v1/events) e, se indicado, POST no webhook.',
    input: { type: 'object', properties: {
      id: { type: 'string', description: idDesc }, condition: { type: 'string', enum: ALERT_CONDS }, value: { type: 'number' },
      webhook: { type: 'string', description: 'URL https opcional' }, note: { type: 'string' }, repeat: { type: 'boolean', default: false } },
      required: ['id', 'condition', 'value'] },
    run: ({ id, condition, value, webhook, note, repeat }) => {
      P.providerFor(id);
      if (!ALERT_CONDS.includes(condition)) throw new Error('condição inválida');
      if (webhook && !/^https:\/\//.test(webhook)) throw new Error('webhook tem de ser https');
      const r = db.prepare('INSERT INTO alerts (symbol_id,cond,value,webhook,note,repeat,created) VALUES (?,?,?,?,?,?,?)')
        .run(id, condition, value, webhook ?? null, note ?? null, repeat ? 1 : 0, Date.now());
      return { alertId: Number(r.lastInsertRowid) };
    },
  },
  list_alerts: {
    description: 'Lista alertas.', input: { type: 'object', properties: { active_only: { type: 'boolean', default: true } } },
    run: ({ active_only = true } = {}) => db.prepare(`SELECT * FROM alerts ${active_only ? 'WHERE active=1' : ''} ORDER BY id DESC`).all(),
  },
  delete_alert: {
    description: 'Remove um alerta.', input: { type: 'object', properties: { alertId: { type: 'integer' } }, required: ['alertId'] },
    run: ({ alertId }) => ({ deleted: Number(db.prepare('DELETE FROM alerts WHERE id=?').run(alertId).changes) }),
  },
  get_events: {
    description: 'Eventos recentes (alertas disparados, sinais do vigilante). Use since_id para ler incrementalmente.',
    input: { type: 'object', properties: { since_id: { type: 'integer', default: 0 }, limit: { type: 'integer', default: 50 } } },
    run: ({ since_id = 0, limit = 50 } = {}) =>
      db.prepare('SELECT * FROM events WHERE id > ? ORDER BY id ASC LIMIT ?').all(since_id, Math.min(limit, 500)).map((e) => ({ ...e, data: JSON.parse(e.data) })),
  },
};

export async function callTool(name, args = {}) {
  const t = tools[name];
  if (!t) throw Object.assign(new Error(`ferramenta desconhecida: ${name}`), { status: 404 });
  for (const k of t.input.required ?? []) if (args[k] == null) throw Object.assign(new Error(`parâmetro em falta: ${k}`), { status: 400 });
  return t.run(args);
}
export const toolList = () => Object.entries(tools).map(([name, t]) => ({ name, description: t.description, inputSchema: t.input }));
export { addEvent, bus, cached };
