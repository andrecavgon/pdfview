// Ações, ETFs, índices, FX e futuros via endpoints públicos do Yahoo Finance (não oficiais).
// Para produção com SLA, trocar por Polygon/Finnhub/IEX mantendo esta interface.
import { cached, getJSON } from '../cache.js';

const Q1 = 'https://query1.finance.yahoo.com';
const Q2 = 'https://query2.finance.yahoo.com';
const PREFIX = 'YAHOO:';
// Yahoo não tem 4h: agregamos a partir de 1h. 1w idem a partir de 1wk nativo.
const TF = {
  '1m': ['1m', '7d'], '5m': ['5m', '60d'], '15m': ['15m', '60d'], '30m': ['30m', '60d'],
  '1h': ['60m', '730d'], '4h': ['60m', '730d'], '1d': ['1d', '10y'], '1w': ['1wk', '20y'],
};
const TYPES = { EQUITY: 'stock', ETF: 'etf', INDEX: 'index', CURRENCY: 'forex', FUTURE: 'future', MUTUALFUND: 'fund', CRYPTOCURRENCY: 'crypto' };

const chart = (sym, interval, range) =>
  cached(`yh:${sym}:${interval}:${range}`, interval === '1m' ? 4000 : 10000, () =>
    getJSON(`${Q1}/v8/finance/chart/${encodeURIComponent(sym)}?interval=${interval}&range=${range}&includePrePost=false`)
      .then((j) => { const r = j.chart?.result?.[0]; if (!r) throw new Error(j.chart?.error?.description || 'sem dados'); return r; }));

function aggregate(c, seconds) {
  const out = [];
  for (const x of c) {
    const b = Math.floor(x.t / seconds) * seconds;
    const l = out.at(-1);
    if (l && l.t === b) { l.h = Math.max(l.h, x.h); l.l = Math.min(l.l, x.l); l.c = x.c; l.v += x.v; }
    else out.push({ ...x, t: b });
  }
  return out;
}

export default {
  name: 'yahoo', prefix: PREFIX, type: 'stock', timeframes: Object.keys(TF),
  async search(q) {
    const j = await cached('yh:s:' + q.toLowerCase(), 30_000, () =>
      getJSON(`${Q2}/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=12&newsCount=0`));
    return (j.quotes || []).filter((x) => x.symbol && TYPES[x.quoteType]).map((x) => ({
      id: PREFIX + x.symbol, symbol: x.symbol, name: x.shortname || x.longname || x.symbol,
      type: TYPES[x.quoteType], exchange: x.exchDisp || x.exchange || '',
    }));
  },
  async quotes(ids) {
    const res = await Promise.allSettled(ids.map(async (id) => {
      const s = id.slice(PREFIX.length);
      const m = (await chart(s, '1d', '5d')).meta;
      const prev = m.chartPreviousClose ?? m.previousClose;
      return {
        id, symbol: s, price: m.regularMarketPrice, change: m.regularMarketPrice - prev,
        changePct: ((m.regularMarketPrice / prev) - 1) * 100, high: m.regularMarketDayHigh, low: m.regularMarketDayLow,
        volume: m.regularMarketVolume, currency: m.currency, ts: Date.now(),
      };
    }));
    return res.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  },
  async candles(id, tf, limit = 500) {
    const [interval, range] = TF[tf];
    const r = await chart(id.slice(PREFIX.length), interval, range);
    const q = r.indicators.quote[0];
    let c = (r.timestamp || []).map((t, i) => ({ t, o: q.open[i], h: q.high[i], l: q.low[i], c: q.close[i], v: q.volume[i] || 0 }))
      .filter((x) => x.o != null && x.c != null);
    if (tf === '4h') c = aggregate(c, 4 * 3600);
    return c.slice(-limit);
  },
  async news(q) {
    const j = await cached('yh:n:' + q, 120_000, () =>
      getJSON(`${Q2}/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=0&newsCount=15`));
    return (j.news || []).map((n) => ({ title: n.title, publisher: n.publisher, url: n.link, ts: n.providerPublishTime, related: n.relatedTickers || [] }));
  },
};
