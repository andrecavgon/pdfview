// Fornecedor SIMULADO (DATA_MODE=demo). Passeio aleatório determinístico: serve para
// desenvolver/testar offline. Nunca usar para decisões — a UI mostra um aviso permanente.
export const UNIVERSE = [
  ['BTCUSDT', 'Bitcoin / Tether', 'crypto', 67000], ['ETHUSDT', 'Ethereum / Tether', 'crypto', 3400],
  ['SOLUSDT', 'Solana / Tether', 'crypto', 160], ['BNBUSDT', 'BNB / Tether', 'crypto', 590],
  ['XRPUSDT', 'XRP / Tether', 'crypto', 0.55], ['DOGEUSDT', 'Dogecoin / Tether', 'crypto', 0.16],
  ['AAPL', 'Apple Inc.', 'stock', 225], ['MSFT', 'Microsoft Corp.', 'stock', 420], ['NVDA', 'NVIDIA Corp.', 'stock', 130],
  ['TSLA', 'Tesla Inc.', 'stock', 250], ['AMZN', 'Amazon.com', 'stock', 185], ['SPY', 'SPDR S&P 500 ETF', 'etf', 560],
];
const SEC = { '1m': 60, '5m': 300, '15m': 900, '30m': 1800, '1h': 3600, '4h': 14400, '1d': 86400, '1w': 604800 };
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const PREFIX = 'DEMO:';

function series(sym, tf, limit) {
  const u = UNIVERSE.find((x) => x[0] === sym);
  if (!u) throw new Error('símbolo desconhecido');
  const step = SEC[tf], now = Math.floor(Date.now() / 1000), end = Math.floor(now / step) * step;
  const vol = (u[2] === 'crypto' ? 0.012 : 0.007) * Math.sqrt(step / 86400) * 3;
  const out = [];
  let price = u[3];
  // Gerado para trás a partir do preço-base, semente por (símbolo, tf, barra) => estável entre pedidos.
  for (let i = 0; i < limit; i++) {
    const t = end - i * step, R = rng(hash(sym + t));
    const c = price, ch = (R() - 0.5) * 2 * vol, o = c / (1 + ch);
    out.push({ t, o, h: Math.max(o, c) * (1 + R() * vol / 2), l: Math.min(o, c) * (1 - R() * vol / 2), c, v: 1000 + R() * 9000 });
    price = o;
  }
  return out.reverse();
}

export default {
  name: 'demo', prefix: PREFIX, type: 'demo', timeframes: Object.keys(SEC),
  async search(q) {
    const Q = q.toUpperCase();
    return UNIVERSE.filter((u) => u[0].includes(Q) || u[1].toUpperCase().includes(Q))
      .map((u) => ({ id: PREFIX + u[0], symbol: u[0], name: u[1], type: u[2], exchange: 'DEMO' }));
  },
  async quotes(ids) {
    return ids.map((id) => {
      const s = id.slice(PREFIX.length), d = series(s, '1d', 2), c = series(s, '1m', 1)[0];
      const price = c.c * (1 + 0.002 * Math.sin(Date.now() / 3000 + hash(s)) + 0.0005 * Math.sin(Date.now() / 500)), prev = d[0].c;
      return { id, symbol: s, price, change: price - prev, changePct: (price / prev - 1) * 100, high: d[1].h, low: d[1].l, volume: d[1].v * 1e3, ts: Date.now() };
    });
  },
  async candles(id, tf, limit = 500) { return series(id.slice(PREFIX.length), tf, Math.min(limit, 1000)); },
  async news(q) {
    return [{ title: `[DEMO] Notícia simulada sobre ${q}`, publisher: 'Demo', url: '#', ts: Math.floor(Date.now() / 1000), related: [] }];
  },
};
