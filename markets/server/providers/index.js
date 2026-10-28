import binance from './binance.js';
import yahoo from './yahoo.js';
import demo from './demo.js';

export const MODE = process.env.DATA_MODE === 'demo' ? 'demo' : 'live';
const list = MODE === 'demo' ? [demo] : [binance, yahoo];

export const providers = list;
export const providerFor = (id) => {
  const p = list.find((x) => id.startsWith(x.prefix));
  if (!p) throw new Error(`id inválido: ${id} (esperado ${list.map((x) => x.prefix + '…').join(' | ')})`);
  return p;
};

// Pesquisa unificada: consulta todos os fornecedores em paralelo, tolera falhas parciais.
export async function search(query, type) {
  const rs = await Promise.allSettled(list.map((p) => p.search(query)));
  let out = rs.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  if (type) out = out.filter((x) => x.type === type);
  const q = query.toUpperCase();
  const score = (x) => (x.symbol === q ? 0 : x.symbol.startsWith(q) ? 1 : 2);
  return out.sort((a, b) => score(a) - score(b)).slice(0, 20);
}

// Cotações de ids de fornecedores diferentes, agrupadas por fornecedor.
export async function quotes(ids) {
  const groups = new Map();
  for (const id of ids) { const p = providerFor(id); (groups.get(p) || groups.set(p, []).get(p)).push(id); }
  const rs = await Promise.allSettled([...groups].map(([p, g]) => p.quotes(g)));
  return rs.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

export const candles = (id, tf = '1d', limit = 500) => {
  const p = providerFor(id);
  if (!p.timeframes.includes(tf)) throw new Error(`timeframe inválido: ${tf}`);
  return p.candles(id, tf, limit);
};

export async function news(query) {
  const p = list.find((x) => x.news);
  return p ? p.news(query) : [];
}
