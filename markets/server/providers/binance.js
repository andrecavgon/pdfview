// Crypto via API pública da Binance (sem chave). Base configurável: BINANCE_BASE
// (alternativa sem restrição geográfica: https://data-api.binance.vision).
import { cached, getJSON } from '../cache.js';

const BASE = process.env.BINANCE_BASE || 'https://api.binance.com';
const TF = { '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m', '1h': '1h', '4h': '4h', '1d': '1d', '1w': '1w' };
const PREFIX = 'BINANCE:';

const symbols = () => cached('bn:info', 3600_000, async () => {
  const j = await getJSON(`${BASE}/api/v3/exchangeInfo?permissions=SPOT`, { timeout: 20000 });
  return j.symbols.filter((s) => s.status === 'TRADING' && ['USDT', 'USDC', 'BTC'].includes(s.quoteAsset))
    .map((s) => ({ symbol: s.symbol, base: s.baseAsset, quote: s.quoteAsset }));
});

const toQuote = (t) => ({
  id: PREFIX + t.symbol, symbol: t.symbol, price: +t.lastPrice, change: +t.priceChange, changePct: +t.priceChangePercent,
  high: +t.highPrice, low: +t.lowPrice, volume: +t.quoteVolume, ts: Date.now(),
});

export default {
  name: 'binance', prefix: PREFIX, type: 'crypto', timeframes: Object.keys(TF),
  async search(q) {
    const Q = q.toUpperCase().replace(/[\/\-\s]/g, '');
    const all = await symbols();
    const rank = (s) => (s.symbol === Q ? 0 : s.base === Q && s.quote === 'USDT' ? 1 : s.symbol.startsWith(Q) ? 2 : s.base === Q ? 3 : 4);
    return all.filter((s) => s.symbol.includes(Q)).sort((a, b) => rank(a) - rank(b) || a.symbol.length - b.symbol.length).slice(0, 15)
      .map((s) => ({ id: PREFIX + s.symbol, symbol: s.symbol, name: `${s.base}/${s.quote}`, type: 'crypto', exchange: 'Binance' }));
  },
  async quotes(ids) {
    const syms = ids.map((i) => i.slice(PREFIX.length));
    const key = syms.slice().sort().join(',');
    const arr = await cached('bn:q:' + key, 1500, () =>
      getJSON(`${BASE}/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(syms))}`));
    return arr.map(toQuote);
  },
  async candles(id, tf, limit = 500) {
    const s = id.slice(PREFIX.length);
    const k = await cached(`bn:c:${s}:${tf}:${limit}`, tf === '1m' ? 2000 : 5000, () =>
      getJSON(`${BASE}/api/v3/klines?symbol=${s}&interval=${TF[tf]}&limit=${Math.min(limit, 1000)}`));
    return k.map((x) => ({ t: Math.floor(x[0] / 1000), o: +x[1], h: +x[2], l: +x[3], c: +x[4], v: +x[5] }));
  },
};
