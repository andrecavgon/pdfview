import { createChart, CandlestickSeries, LineSeries, AreaSeries, HistogramSeries, CrosshairMode } from '/vendor/lightweight-charts.standalone.production.mjs';
import { sma, ema, rsi, macd, bollinger } from '/shared/indicators.mjs';

const $ = (s) => document.querySelector(s);
const TFS = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
const INDS = { vol: 'Volume', sma20: 'SMA 20', sma50: 'SMA 50', sma200: 'SMA 200', ema21: 'EMA 21', bb: 'Bollinger (20,2)', rsi: 'RSI (14)', macd: 'MACD (12,26,9)' };
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const state = {
  cur: store.get('cur', null), tf: store.get('tf', '1d'), ctype: store.get('ctype', 'candle'),
  inds: new Set(store.get('inds', ['vol', 'sma20', 'sma50'])), wl: store.get('wl', null), candles: [], quotes: new Map(), tab: 'watch', status: null,
};

// ---------- utilidades ----------
function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, ''); else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
const api = async (path) => { const r = await fetch(path); const j = await r.json(); if (!r.ok) throw new Error(j.error || r.status); return j; };
const fmt = (p) => (p == null || isNaN(p) ? '—' : Math.abs(p) >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: 2 }) : Math.abs(p) >= 1 ? p.toFixed(2) : p.toPrecision(4));
const pct = (x) => (x == null || isNaN(x) ? '—' : `${x > 0 ? '+' : ''}${x.toFixed(2)}%`);
const cls = (x) => (x > 0 ? 'up' : x < 0 ? 'down' : '');
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const short = (id) => id.split(':')[1];
const intraday = (tf) => !['1d', '1w'].includes(tf);

// ---------- gráfico ----------
let chart, main, volSeries, liveStream;
function buildChart() {
  chart?.remove();
  const text = css('--muted'), line = css('--line');
  chart = createChart($('#chart'), {
    autoSize: true,
    layout: { background: { color: 'transparent' }, textColor: text, panes: { separatorColor: line, enableResize: true }, fontFamily: 'inherit' },
    grid: { vertLines: { color: line + '55' }, horzLines: { color: line + '55' } },
    crosshair: { mode: CrosshairMode.Normal },
    rightPriceScale: { borderColor: line }, timeScale: { borderColor: line, timeVisible: intraday(state.tf), secondsVisible: false, rightOffset: 6 },
  });
  const c = state.candles;
  if (!c.length) return;
  const up = css('--up'), down = css('--down');
  const last = c.at(-1).c, precision = last < 1 ? 6 : last < 100 ? 4 : 2;
  const priceFormat = { type: 'price', precision, minMove: 10 ** -precision };
  const T = (x) => x.t;

  if (state.ctype === 'candle') {
    main = chart.addSeries(CandlestickSeries, { upColor: up, downColor: down, wickUpColor: up, wickDownColor: down, borderVisible: false, priceFormat });
    main.setData(c.map((x) => ({ time: T(x), open: x.o, high: x.h, low: x.l, close: x.c })));
  } else {
    main = chart.addSeries(state.ctype === 'area' ? AreaSeries : LineSeries, state.ctype === 'area'
      ? { lineColor: '#2962ff', topColor: '#2962ff66', bottomColor: '#2962ff05', priceFormat } : { color: '#2962ff', lineWidth: 2, priceFormat });
    main.setData(c.map((x) => ({ time: T(x), value: x.c })));
  }
  const closes = c.map((x) => x.c);
  const overlay = (vals, color, w = 1) => {
    const s = chart.addSeries(LineSeries, { color, lineWidth: w, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
    s.setData(vals.map((v, i) => (v == null ? null : { time: c[i].t, value: v })).filter(Boolean));
  };
  if (state.inds.has('sma20')) overlay(sma(closes, 20), '#f0b90b');
  if (state.inds.has('sma50')) overlay(sma(closes, 50), '#ab47bc');
  if (state.inds.has('sma200')) overlay(sma(closes, 200), '#42a5f5', 2);
  if (state.inds.has('ema21')) overlay(ema(closes, 21), '#ff7043');
  if (state.inds.has('bb')) { const b = bollinger(closes); overlay(b.upper, '#5c6bc0'); overlay(b.mid, '#5c6bc080'); overlay(b.lower, '#5c6bc0'); }
  if (state.inds.has('vol')) {
    volSeries = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: 'vol', priceLineVisible: false, lastValueVisible: false });
    volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    volSeries.setData(c.map((x) => ({ time: x.t, value: x.v, color: (x.c >= x.o ? up : down) + '66' })));
  } else volSeries = null;

  let pane = 1;
  if (state.inds.has('rsi')) {
    const s = chart.addSeries(LineSeries, { color: '#ab47bc', lineWidth: 1.5, priceLineVisible: false }, pane++);
    s.setData(rsi(closes).map((v, i) => (v == null ? null : { time: c[i].t, value: v })).filter(Boolean));
    s.createPriceLine({ price: 70, color: down + '99', lineWidth: 1, lineStyle: 2, axisLabelVisible: false });
    s.createPriceLine({ price: 30, color: up + '99', lineWidth: 1, lineStyle: 2, axisLabelVisible: false });
  }
  if (state.inds.has('macd')) {
    const m = macd(closes);
    const hs = chart.addSeries(HistogramSeries, { priceLineVisible: false, lastValueVisible: false }, pane);
    hs.setData(m.hist.map((v, i) => (v == null ? null : { time: c[i].t, value: v, color: (v >= 0 ? up : down) + '99' })).filter(Boolean));
    const l1 = chart.addSeries(LineSeries, { color: '#2962ff', lineWidth: 1, priceLineVisible: false, lastValueVisible: false }, pane);
    const l2 = chart.addSeries(LineSeries, { color: '#ff7043', lineWidth: 1, priceLineVisible: false, lastValueVisible: false }, pane);
    l1.setData(m.line.map((v, i) => (v == null ? null : { time: c[i].t, value: v })).filter(Boolean));
    l2.setData(m.signal.map((v, i) => (v == null ? null : { time: c[i].t, value: v })).filter(Boolean));
  }
  try { const ps = chart.panes(); ps[0].setStretchFactor(ps.length > 1 ? 3 : 1); } catch {}

  chart.subscribeCrosshairMove((p) => {
    const d = p.seriesData?.get(main);
    const k = d ? (d.open != null ? d : { open: d.value, high: d.value, low: d.value, close: d.value }) : state.candles.at(-1) && toBar(state.candles.at(-1));
    if (!k) return;
    const ch = ((k.close / k.open) - 1) * 100;
    $('#legend').textContent = `O ${fmt(k.open)}  H ${fmt(k.high)}  L ${fmt(k.low)}  C ${fmt(k.close)}  ${pct(ch)}`;
    $('#legend').className = `legend ${cls(ch)}`;
  });
  chart.timeScale().fitContent();
  const n = c.length; if (n > 150) chart.timeScale().setVisibleLogicalRange({ from: n - 120, to: n + 6 });
}
const toBar = (x) => ({ open: x.o, high: x.h, low: x.l, close: x.c });

async function loadSymbol(sym, { keepWatch = true } = {}) {
  state.cur = sym; store.set('cur', sym);
  $('#sym-title').textContent = short(sym.id); $('#sym-sub').textContent = `${sym.name || ''} · ${sym.id.split(':')[0]}`;
  $('#px').textContent = '—'; $('#chg').textContent = ''; $('#legend').textContent = '';
  const msg = $('#chart-msg'); msg.hidden = false; msg.textContent = 'A carregar…';
  try {
    state.candles = await api(`/api/candles?id=${encodeURIComponent(sym.id)}&tf=${state.tf}&limit=600`);
    msg.hidden = !!state.candles.length; msg.textContent = 'Sem dados para este timeframe.';
  } catch (e) { state.candles = []; msg.hidden = false; msg.textContent = `Erro ao obter dados: ${e.message}`; }
  buildChart();
  const q = state.quotes.get(sym.id) || (state.candles.length ? null : null);
  if (q) renderHeader(q); else api(`/api/quotes?ids=${encodeURIComponent(sym.id)}`).then(([x]) => x && (state.quotes.set(x.id, x), renderHeader(x))).catch(() => {});
  document.title = `${short(sym.id)} · Markets Terminal`;
  renderPanel(); connectStream();
}
function renderHeader(q) {
  $('#px').textContent = fmt(q.price);
  $('#chg').textContent = `${q.change >= 0 ? '+' : ''}${fmt(q.change)}  ${pct(q.changePct)}`;
  $('#chg').className = `chg ${cls(q.changePct)}`;
}

// ---------- tempo real (SSE servidor -> browser) ----------
function connectStream() {
  liveStream?.close();
  const ids = [...new Set([state.cur?.id, ...(state.wl || []).map((w) => w.id)].filter(Boolean))];
  if (!ids.length) return;
  liveStream = new EventSource(`/api/stream?ids=${encodeURIComponent(ids.join(','))}`);
  liveStream.addEventListener('quotes', (ev) => {
    setPill('ok', 'LIVE');
    for (const q of JSON.parse(ev.data)) {
      const prev = state.quotes.get(q.id); state.quotes.set(q.id, q);
      if (q.id === state.cur?.id) { renderHeader(q); tickLastBar(q.price); }
      const row = document.querySelector(`[data-id="${CSS.escape(q.id)}"]`);
      if (row) {
        row.querySelector('.p').textContent = fmt(q.price);
        const c = row.querySelector('.c'); c.textContent = pct(q.changePct); c.className = `c ${cls(q.changePct)}`;
        if (prev && prev.price !== q.price) { row.classList.remove('flash-up', 'flash-down'); void row.offsetWidth; row.classList.add(q.price > prev.price ? 'flash-up' : 'flash-down'); }
      }
    }
  });
  liveStream.onerror = () => setPill('bad', 'a reconectar…');
}
function tickLastBar(price) {
  const l = state.candles.at(-1); if (!l || !main) return;
  l.c = price; l.h = Math.max(l.h, price); l.l = Math.min(l.l, price);
  main.update(state.ctype === 'candle' ? { time: l.t, open: l.o, high: l.h, low: l.l, close: l.c } : { time: l.t, value: l.c });
}
function setPill(kind, text) { const p = $('#live'); p.className = `pill ${kind}`; p.textContent = (kind === 'ok' ? '● ' : '') + text + (state.status?.mode === 'demo' ? ' · DEMO' : ''); }

// ---------- painéis laterais ----------
const rowFor = (item, { removable = false, sel = false } = {}) => {
  const q = state.quotes.get(item.id);
  const r = h('div', { class: `row${sel ? ' sel' : ''}`, 'data-id': item.id, role: 'button', tabindex: 0,
    onclick: () => loadSymbol({ id: item.id, name: item.name }), onkeydown: (e) => e.key === 'Enter' && loadSymbol({ id: item.id, name: item.name }) },
    h('div', {}, h('div', { class: 's' }, item.symbol || short(item.id)), h('div', { class: 'n' }, item.name || '')),
    h('div', { class: 'p' }, q ? fmt(q.price) : item.price != null ? fmt(item.price) : '—'),
    h('div', { class: `c ${cls(q?.changePct ?? item.changePct)}` }, pct(q?.changePct ?? item.changePct)));
  if (removable) r.append(h('button', { class: 'x', title: 'Remover', 'aria-label': 'Remover da watchlist',
    onclick: (e) => { e.stopPropagation(); state.wl = state.wl.filter((w) => w.id !== item.id); store.set('wl', state.wl); renderPanel(); connectStream(); } }, '✕'));
  return r;
};
async function renderPanel() {
  const p = $('#panel'); p.replaceChildren();
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === state.tab));
  const guard = state.tab;
  const fail = (e) => state.tab === guard && p.replaceChildren(h('div', { class: 'box muted' }, `Erro: ${e.message}`));
  if (state.tab === 'watch') {
    p.append(...state.wl.map((w) => rowFor(w, { removable: true, sel: w.id === state.cur?.id })));
    if (!state.wl.length) p.append(h('div', { class: 'box muted' }, 'Watchlist vazia. Use Ctrl+K para pesquisar.'));
  } else if (state.tab === 'scan') {
    const f = { type: '', rsi_below: '', rsi_above: '', trend: '', sort: 'change_pct' };
    const out = h('div');
    const run = async () => {
      const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v !== '')); out.replaceChildren(h('div', { class: 'box muted' }, 'A procurar…'));
      try { const rs = await api('/api/scan?' + qs); if (state.tab !== 'scan') return; out.replaceChildren(...rs.map((r) => rowFor(r)), rs.length ? '' : h('div', { class: 'box muted' }, 'Sem resultados (o vigilante pode ainda estar a aquecer).')); } catch (e) { fail(e); }
    };
    const sel = (k, opts) => h('select', { 'aria-label': k, onchange: (e) => { f[k] = e.target.value; run(); } }, opts.map(([v, t]) => h('option', { value: v }, t)));
    const num = (k, ph) => h('input', { type: 'number', placeholder: ph, 'aria-label': ph, onchange: (e) => { f[k] = e.target.value; run(); } });
    p.append(h('div', { class: 'form' }, sel('type', [['', 'Todos'], ['crypto', 'Crypto'], ['stock', 'Ações'], ['etf', 'ETFs'], ['index', 'Índices']]),
      sel('trend', [['', 'Tendência'], ['up', 'Alta'], ['down', 'Baixa'], ['neutral', 'Neutra']]), num('rsi_below', 'RSI <'), num('rsi_above', 'RSI >'),
      sel('sort', [['change_pct', 'Var. 24h'], ['rsi', 'RSI'], ['ret7d', 'Ret. 7d'], ['ret30d', 'Ret. 30d'], ['atr_pct', 'Volatilidade']])), out);
    run();
  } else if (state.tab === 'over') {
    p.append(h('div', { class: 'box muted' }, 'A carregar…'));
    api('/api/overview').then((o) => {
      if (state.tab !== 'over') return;
      const sec = (t, a) => [h('h3', {}, t), ...(a.length ? a.map((r) => rowFor(r)) : [h('div', { class: 'muted' }, '—')])];
      p.replaceChildren(h('div', { class: 'box' }, h('div', { class: 'muted' }, 'Tendência: ', o.trends.map((t) => h('span', { class: 'tag' }, `${t.trend} ${t.n}`))),
        ...sec('Maiores subidas', o.topGainers), ...sec('Maiores quedas', o.topLosers), ...sec('Sobrevendidos (RSI<30)', o.oversold), ...sec('Sobrecomprados (RSI>70)', o.overbought)));
    }).catch(fail);
  } else if (state.tab === 'news') {
    const id = state.cur?.id; if (!id) return;
    const s = short(id), qn = id.startsWith('BINANCE:') ? s.replace(/(USDT|USDC|BTC)$/, '') + '-USD' : s;
    p.append(h('div', { class: 'box muted' }, 'A carregar…'));
    api('/api/news?q=' + encodeURIComponent(qn)).then((ns) => {
      if (state.tab !== 'news') return;
      p.replaceChildren(h('div', { class: 'news' }, ns.length ? ns.map((n) => h('a', { href: /^https?:/.test(n.url) ? n.url : '#', target: '_blank', rel: 'noopener noreferrer' },
        h('div', {}, n.title), h('small', {}, `${n.publisher || ''} · ${n.ts ? new Date(n.ts * 1000).toLocaleString() : ''}`))) : [h('div', { class: 'box muted' }, 'Sem notícias.')]));
    }).catch(fail);
  } else if (state.tab === 'agents') {
    const o = location.origin, st = state.status;
    const ex = `curl -H "Authorization: Bearer $AGENT_API_KEY" \\\n  "${o}/agent/v1/tools/scan_market?rsi_below=30&type=crypto"`;
    p.append(h('div', { class: 'box' },
      h('h3', {}, 'Vigilante 24/7'),
      h('div', {}, st ? `${st.watcher.symbols} ativos monitorizados · ${st.watcher.cycles} ciclos · último: ${st.watcher.lastRun ? new Date(st.watcher.lastRun).toLocaleTimeString() : '—'}` : '…'),
      st?.watcher.lastError ? h('div', { class: 'down' }, 'Último erro: ' + st.watcher.lastError) : '',
      h('div', { class: st?.agentAuth ? 'up' : 'down' }, st?.agentAuth ? 'Autenticação de agentes ativa' : '⚠ AGENT_API_KEY não definida: API de agentes aberta'),
      h('h3', {}, 'MCP (Claude e outros agentes)'), h('pre', {}, `${o}/mcp`), h('div', { class: 'muted' }, 'Ferramentas: search_symbols, get_quote, get_candles, get_indicators, scan_market, market_overview, get_news, create_alert, list_alerts, delete_alert, get_events'),
      h('h3', {}, 'REST'), h('pre', {}, ex),
      h('h3', {}, 'Stream de alertas (SSE)'), h('pre', {}, `curl -N -H "Authorization: Bearer $AGENT_API_KEY" ${o}/agent/v1/events`),
      h('h3', {}, 'Catálogo de ferramentas'), h('pre', {}, `${o}/agent/v1/tools`)));
  }
}

// ---------- pesquisa (Ctrl+K) ----------
const pal = { items: [], i: 0, type: '', timer: 0, seq: 0 };
function openPalette() { $('#palette').hidden = false; $('#q').value = ''; $('#q').focus(); pal.items = []; drawResults(); renderFilters(); if (!$('#q').value) suggest(); }
function closePalette() { $('#palette').hidden = true; }
function renderFilters() {
  $('#filters').replaceChildren(...[['', 'Tudo'], ['stock', 'Ações'], ['crypto', 'Crypto'], ['etf', 'ETFs'], ['index', 'Índices'], ['forex', 'FX']].map(([v, t]) =>
    h('button', { class: pal.type === v ? 'on' : '', onclick: () => { pal.type = v; renderFilters(); doSearch(); } }, t)));
}
function suggest() { pal.items = (state.status?.universe || []).filter((u) => !pal.type || u.type === pal.type).map((u) => ({ id: u.id, symbol: short(u.id), name: u.name, type: u.type, exchange: 'Sugestão' })); pal.i = 0; drawResults(); }
async function doSearch() {
  const q = $('#q').value.trim(); if (!q) return suggest();
  const seq = ++pal.seq;
  try { const r = await api(`/api/search?q=${encodeURIComponent(q)}${pal.type ? '&type=' + pal.type : ''}`); if (seq !== pal.seq) return; pal.items = r; pal.i = 0; drawResults(); } catch (e) { $('#results').replaceChildren(h('li', { class: 'muted' }, 'Erro: ' + e.message)); }
}
function drawResults() {
  $('#results').replaceChildren(...pal.items.map((it, i) => h('li', { class: i === pal.i ? 'on' : '', role: 'option', onclick: (e) => pick(it, e.shiftKey) },
    h('span', { class: 's' }, it.symbol), h('span', {}, it.name), h('span', { class: 't' }, `${it.type} · ${it.exchange}`))));
  if (!pal.items.length && $('#q').value) $('#results').append(h('li', { class: 'muted' }, 'Sem resultados'));
}
function pick(it, add) {
  const item = { id: it.id, name: it.name, symbol: it.symbol };
  if (add || !state.wl.some((w) => w.id === it.id)) { if (!state.wl.some((w) => w.id === it.id)) { state.wl.push(item); store.set('wl', state.wl); } }
  closePalette(); loadSymbol(item);
}

// ---------- arranque ----------
function wire() {
  $('#tf').replaceChildren(...TFS.map((t) => h('button', { 'data-t': t, class: t === state.tf ? 'on' : '', onclick: () => { state.tf = t; store.set('tf', t); document.querySelectorAll('#tf button').forEach((b) => b.classList.toggle('on', b.dataset.t === t)); loadSymbol(state.cur); } }, t)));
  document.querySelectorAll('#ctype button').forEach((b) => b.addEventListener('click', () => {
    state.ctype = b.dataset.t; store.set('ctype', state.ctype); document.querySelectorAll('#ctype button').forEach((x) => x.classList.toggle('on', x === b)); buildChart(); }));
  document.querySelectorAll('#ctype button').forEach((b) => b.classList.toggle('on', b.dataset.t === state.ctype));
  const menu = $('#ind-menu');
  menu.replaceChildren(...Object.entries(INDS).map(([k, t]) => h('label', {}, h('input', { type: 'checkbox', checked: state.inds.has(k), onchange: (e) => { e.target.checked ? state.inds.add(k) : state.inds.delete(k); store.set('inds', [...state.inds]); buildChart(); } }), t)));
  $('#ind-btn').onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; };
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) menu.hidden = true; });
  $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { state.tab = b.dataset.tab; renderPanel(); } });
  $('#search-btn').onclick = openPalette;
  $('#q').addEventListener('input', () => { clearTimeout(pal.timer); pal.timer = setTimeout(doSearch, 180); });
  $('#palette').addEventListener('click', (e) => e.target.id === 'palette' && closePalette());
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
    if ($('#palette').hidden) { if (e.key === '/' && !/INPUT|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openPalette(); } return; }
    if (e.key === 'Escape') closePalette();
    else if (e.key === 'ArrowDown') { e.preventDefault(); pal.i = Math.min(pal.i + 1, pal.items.length - 1); drawResults(); $('#results .on')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pal.i = Math.max(pal.i - 1, 0); drawResults(); $('#results .on')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter' && pal.items[pal.i]) pick(pal.items[pal.i], e.shiftKey);
  });
}
async function refreshStatus() {
  try {
    state.status = await api('/api/status');
    $('#demo-banner').hidden = state.status.mode !== 'demo';
    if (state.tab === 'agents') renderPanel();
  } catch { setPill('bad', 'offline'); }
}
(async function init() {
  wire();
  await refreshStatus(); setInterval(refreshStatus, 30000);
  if (!state.wl?.length) state.wl = (state.status?.universe || []).slice(0, 8).map((u) => ({ id: u.id, name: u.name, symbol: short(u.id) }));
  // Descarta seleção/watchlist guardadas de outro modo de dados (live vs demo).
  const okPrefix = new Set((state.status?.universe || []).map((u) => u.id.split(':')[0]));
  if (okPrefix.size) {
    state.wl = state.wl.filter((w) => okPrefix.has(w.id.split(':')[0]));
    if (!state.cur || !okPrefix.has(state.cur.id.split(':')[0])) state.cur = state.wl[0] ?? null;
  }
  if (state.cur) loadSymbol(state.cur); else openPalette();
})();
