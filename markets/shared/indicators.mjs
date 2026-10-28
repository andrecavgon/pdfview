// Indicadores técnicos. Usados no servidor (agentes/scanner) e no browser (gráfico).
// Todas as funções devolvem arrays alinhados com a entrada; null durante o aquecimento.

export const sma = (v, n) => {
  const out = new Array(v.length).fill(null);
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    s += v[i];
    if (i >= n) s -= v[i - n];
    if (i >= n - 1) out[i] = s / n;
  }
  return out;
};

export const ema = (v, n) => {
  const out = new Array(v.length).fill(null);
  if (v.length < n) return out;
  const k = 2 / (n + 1);
  let prev = v.slice(0, n).reduce((a, b) => a + b, 0) / n;
  out[n - 1] = prev;
  for (let i = n; i < v.length; i++) out[i] = prev = v[i] * k + prev * (1 - k);
  return out;
};

export const rsi = (v, n = 14) => {
  const out = new Array(v.length).fill(null);
  if (v.length <= n) return out;
  let g = 0, l = 0;
  for (let i = 1; i <= n; i++) {
    const d = v[i] - v[i - 1];
    d >= 0 ? (g += d) : (l -= d);
  }
  g /= n; l /= n;
  out[n] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  for (let i = n + 1; i < v.length; i++) {
    const d = v[i] - v[i - 1];
    g = (g * (n - 1) + Math.max(d, 0)) / n;
    l = (l * (n - 1) + Math.max(-d, 0)) / n;
    out[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
  }
  return out;
};

export const macd = (v, fast = 12, slow = 26, signal = 9) => {
  const f = ema(v, fast), s = ema(v, slow);
  const line = v.map((_, i) => (f[i] != null && s[i] != null ? f[i] - s[i] : null));
  const start = line.findIndex((x) => x != null);
  const sig = new Array(v.length).fill(null);
  if (start >= 0) {
    const e = ema(line.slice(start), signal);
    e.forEach((x, i) => (sig[start + i] = x));
  }
  const hist = line.map((x, i) => (x != null && sig[i] != null ? x - sig[i] : null));
  return { line, signal: sig, hist };
};

export const bollinger = (v, n = 20, mult = 2) => {
  const mid = sma(v, n);
  const upper = new Array(v.length).fill(null), lower = new Array(v.length).fill(null);
  for (let i = n - 1; i < v.length; i++) {
    let s = 0;
    for (let j = i - n + 1; j <= i; j++) s += (v[j] - mid[i]) ** 2;
    const sd = Math.sqrt(s / n);
    upper[i] = mid[i] + mult * sd;
    lower[i] = mid[i] - mult * sd;
  }
  return { mid, upper, lower };
};

export const atr = (c, n = 14) => {
  const tr = c.map((x, i) =>
    i === 0 ? x.h - x.l : Math.max(x.h - x.l, Math.abs(x.h - c[i - 1].c), Math.abs(x.l - c[i - 1].c)));
  const out = new Array(c.length).fill(null);
  if (c.length < n) return out;
  let prev = tr.slice(0, n).reduce((a, b) => a + b, 0) / n;
  out[n - 1] = prev;
  for (let i = n; i < c.length; i++) out[i] = prev = (prev * (n - 1) + tr[i]) / n;
  return out;
};

const last = (a) => { for (let i = a.length - 1; i >= 0; i--) if (a[i] != null) return a[i]; return null; };
const r = (x, d = 4) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);

// Resumo legível por máquinas e por agentes: último valor + sinais interpretados.
export function summarize(candles) {
  if (!candles || candles.length < 30) return null;
  const closes = candles.map((c) => c.c);
  const price = closes.at(-1);
  const s20 = last(sma(closes, 20)), s50 = last(sma(closes, 50)), s200 = last(sma(closes, 200));
  const e12 = last(ema(closes, 12)), e26 = last(ema(closes, 26));
  const rs = last(rsi(closes, 14));
  const m = macd(closes);
  const bb = bollinger(closes);
  const at = last(atr(candles));
  const bU = last(bb.upper), bL = last(bb.lower);
  const ret = (n) => (closes.length > n ? (price / closes.at(-1 - n) - 1) * 100 : null);

  let trend = 'neutral';
  if (s50 != null && s20 != null) trend = price > s20 && s20 > s50 ? 'up' : price < s20 && s20 < s50 ? 'down' : 'neutral';
  const signals = [];
  if (rs != null) {
    if (rs >= 70) signals.push('RSI sobrecomprado');
    else if (rs <= 30) signals.push('RSI sobrevendido');
  }
  const h = m.hist, n = h.length;
  if (h[n - 1] != null && h[n - 2] != null) {
    if (h[n - 2] <= 0 && h[n - 1] > 0) signals.push('MACD cruzamento de alta');
    if (h[n - 2] >= 0 && h[n - 1] < 0) signals.push('MACD cruzamento de baixa');
  }
  if (bU != null && price > bU) signals.push('Preço acima da banda de Bollinger superior');
  if (bL != null && price < bL) signals.push('Preço abaixo da banda de Bollinger inferior');
  if (s50 != null && s200 != null) signals.push(s50 > s200 ? 'Golden cross ativo (SMA50>SMA200)' : 'Death cross ativo (SMA50<SMA200)');

  const hi = Math.max(...candles.slice(-252).map((c) => c.h));
  const lo = Math.min(...candles.slice(-252).map((c) => c.l));
  return {
    price: r(price, 6), trend,
    rsi14: r(rs, 2), macd: r(last(m.line), 4), macdSignal: r(last(m.signal), 4), macdHist: r(last(m.hist), 4),
    sma20: r(s20, 4), sma50: r(s50, 4), sma200: r(s200, 4), ema12: r(e12, 4), ema26: r(e26, 4),
    bbUpper: r(bU, 4), bbLower: r(bL, 4), atr14: r(at, 4), atrPct: at ? r((at / price) * 100, 2) : null,
    ret1d: r(ret(1), 2), ret7d: r(ret(7), 2), ret30d: r(ret(30), 2), ret90d: r(ret(90), 2),
    high52w: r(hi, 4), low52w: r(lo, 4), distFromHigh52wPct: r((price / hi - 1) * 100, 2),
    signals,
  };
}
