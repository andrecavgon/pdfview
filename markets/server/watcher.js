// Vigilante 24/7: recalcula indicadores do universo, grava snapshots e avalia alertas.
import * as P from './providers/index.js';
import { UNIVERSE } from './providers/demo.js';
import { summarize } from '../shared/indicators.mjs';
import { db, upsertSnapshot, addEvent } from './store.js';
import { bus } from './bus.js';
import { detect, ruleNames } from './opportunities.js';
import { notify, channels } from './notify.js';

const LIVE_UNIVERSE = [
  ...['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT', 'DOTUSDT', 'TRXUSDT', 'LTCUSDT']
    .map((s) => ['BINANCE:' + s, s.replace('USDT', '/USDT'), 'crypto']),
  ...[['AAPL', 'Apple', 'stock'], ['MSFT', 'Microsoft', 'stock'], ['NVDA', 'NVIDIA', 'stock'], ['GOOGL', 'Alphabet', 'stock'], ['AMZN', 'Amazon', 'stock'],
    ['META', 'Meta', 'stock'], ['TSLA', 'Tesla', 'stock'], ['JPM', 'JPMorgan', 'stock'], ['SPY', 'S&P 500 ETF', 'etf'], ['QQQ', 'Nasdaq 100 ETF', 'etf'],
    ['^GSPC', 'S&P 500', 'index'], ['^IXIC', 'Nasdaq Composite', 'index'], ['^DJI', 'Dow Jones', 'index'], ['EURUSD=X', 'EUR/USD', 'forex']]
    .map(([s, n, t]) => ['YAHOO:' + s, n, t]),
];
export const universe = () => (P.MODE === 'demo'
  ? UNIVERSE.map(([s, n, t]) => ['DEMO:' + s, n, t]) : LIVE_UNIVERSE);

const RULES_ON = (process.env.OPPORTUNITY_RULES ? process.env.OPPORTUNITY_RULES.split(',').map((x) => x.trim()) : ruleNames).filter((r) => ruleNames.includes(r));
const COOLDOWN = (+process.env.OPPORTUNITY_COOLDOWN_H || 24) * 3600_000;
const MAX_PER_CYCLE = 5;
const INTERVAL = +process.env.WATCH_INTERVAL_MS || 60_000;
const SNAP_EVERY = +process.env.SNAPSHOT_INTERVAL_MS || 5 * 60_000;
let lastSnap = 0, running = false;
export const status = { notifyChannels: channels(), opportunityRules: RULES_ON, cycles: 0, lastRun: 0, lastError: null, symbols: 0 };

async function refreshSnapshots() {
  const u = universe(), found = [];
  const qs = new Map((await P.quotes(u.map((x) => x[0]))).map((q) => [q.id, q]));
  // Concorrência limitada para respeitar rate limits.
  const queue = [...u];
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (let x; (x = queue.shift());) {
      const [id, name, type] = x;
      try {
        const s = summarize(await P.candles(id, '1d', 400));
        if (!s) continue;
        const q = qs.get(id);
        upsertSnapshot.run(id, id.split(':')[1], name, type, Date.now(), q?.price ?? s.price, q?.changePct ?? s.ret1d, s.rsi14, s.trend,
          s.ret7d, s.ret30d, s.atrPct, s.distFromHigh52wPct, JSON.stringify(s));
        for (const o of detect(s, q, RULES_ON)) found.push({ id, name, price: q?.price ?? s.price, ...o });
      } catch (e) { status.lastError = `${id}: ${e.message}`; }
    }
  }));
  status.symbols = db.prepare('SELECT COUNT(*) n FROM snapshots').get().n;
  await publishOpportunities(found);
}

// Regista e notifica cada (ativo, regra) no máx. 1x por COOLDOWN; no máx. MAX_PER_CYCLE avisos por ciclo
// (o resto fica registado como evento, sem push) para um primeiro arranque não inundar o telemóvel.
async function publishOpportunities(found) {
  const seen = db.prepare('SELECT ts FROM notified WHERE key=?'), mark = db.prepare('INSERT OR REPLACE INTO notified (key,ts) VALUES (?,?)');
  const fresh = found.filter((o) => !((seen.get(`${o.id}|${o.rule}`)?.ts ?? 0) > Date.now() - COOLDOWN));
  let pushed = 0;
  for (const o of fresh) {
    mark.run(`${o.id}|${o.rule}`, Date.now());
    const msg = `${o.name} (${o.id.split(':')[1]}) — ${o.label}. ${o.why}`;
    const ev = addEvent('opportunity', o.id, msg, { rule: o.rule, price: o.price });
    bus.emit('event', ev);
    if (channels().length && pushed < MAX_PER_CYCLE) {
      pushed++;
      const errs = await notify(`📈 ${o.name}: ${o.label}`, `${o.why}
Preço: ${o.price}

Sinal técnico automático, não é aconselhamento financeiro.`);
      if (errs.length) addEvent('notify_error', o.id, errs.join('; '));
    }
  }
}

const test = (cond, v, q, rsi) => ({
  price_above: q.price >= v, price_below: q.price <= v,
  change_pct_above: q.changePct >= v, change_pct_below: q.changePct <= v,
  rsi_above: rsi != null && rsi >= v, rsi_below: rsi != null && rsi <= v,
}[cond]);

async function evalAlerts() {
  const alerts = db.prepare('SELECT * FROM alerts WHERE active=1').all();
  if (!alerts.length) return;
  const qs = new Map((await P.quotes([...new Set(alerts.map((a) => a.symbol_id))])).map((q) => [q.id, q]));
  for (const a of alerts) {
    const q = qs.get(a.symbol_id);
    if (!q) continue;
    if (a.repeat && a.triggered && Date.now() - a.triggered < 3600_000) continue; // máx. 1x/hora
    let rsi = null;
    if (a.cond.startsWith('rsi')) rsi = summarize(await P.candles(a.symbol_id, '1d', 300))?.rsi14 ?? null;
    if (!test(a.cond, a.value, q, rsi)) continue;
    db.prepare('UPDATE alerts SET triggered=?, active=? WHERE id=?').run(Date.now(), a.repeat ? 1 : 0, a.id);
    const msg = `${a.symbol_id} ${a.cond} ${a.value} (preço ${q.price}, 24h ${q.changePct.toFixed(2)}%${rsi != null ? `, RSI ${rsi}` : ''})${a.note ? ' — ' + a.note : ''}`;
    const ev = addEvent('alert', a.symbol_id, msg, { alertId: a.id, price: q.price, changePct: q.changePct, rsi });
    bus.emit('event', ev);
    if (channels().length) notify(`🔔 Alerta ${a.symbol_id.split(':')[1]}`, msg).then((errs) => errs.length && addEvent('notify_error', a.symbol_id, errs.join('; ')));
    if (a.webhook) {
      fetch(a.webhook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(ev), signal: AbortSignal.timeout(8000) })
        .catch((e) => addEvent('webhook_error', a.symbol_id, e.message));
    }
  }
}

export async function tick(force = false) {
  if (running) return;
  running = true;
  try {
    if (force || Date.now() - lastSnap >= SNAP_EVERY || status.symbols === 0) { await refreshSnapshots(); lastSnap = Date.now(); }
    await evalAlerts();
    status.lastError = status.lastError && Date.now() - status.lastRun < 5 * INTERVAL ? status.lastError : null;
  } catch (e) { status.lastError = e.message; } finally { status.cycles++; status.lastRun = Date.now(); running = false; }
}
export function startWatcher() {
  tick();
  return setInterval(tick, INTERVAL).unref();
}
