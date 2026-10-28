import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { tmpdir } from 'node:os';

const got = [];
const mock = http.createServer(async (req, res) => {
  let b = ''; for await (const c of req) b += c;
  got.push({ url: req.url, title: req.headers.title, body: b }); res.end('ok');
}).listen(0);
await new Promise((r) => mock.once('listening', r));
process.env.DATA_MODE = 'demo';
process.env.DATA_DIR = `${tmpdir()}/markets-opp-${process.pid}`;
process.env.NTFY_SERVER = `http://localhost:${mock.address().port}`;
process.env.NTFY_TOPIC = 'meu-topico';
process.env.OPPORTUNITY_COOLDOWN_H = '24';

const { detect } = await import('../server/opportunities.js');
const { tick } = await import('../server/watcher.js');
const { callTool } = await import('../server/tools.js');
const { notify } = await import('../server/notify.js');

const base = { price: 100, rsi14: 50, sma50: 95, sma200: 90, trend: 'neutral', signals: [], atrPct: 2, distFromHigh52wPct: -20 };

test('regras: cada sinal só dispara quando as condições se cumprem', () => {
  assert.deepEqual(detect(base, { changePct: 1 }), []);
  assert.equal(detect({ ...base, rsi14: 30 }, null)[0].rule, 'oversold_uptrend');
  assert.deepEqual(detect({ ...base, rsi14: 30, price: 80 }, null), [], 'abaixo da SMA200 não é "recuo em tendência de alta"');
  assert.equal(detect({ ...base, signals: ['MACD cruzamento de alta'] }, null)[0].rule, 'macd_bull_cross');
  assert.equal(detect({ ...base, trend: 'up', rsi14: 65, distFromHigh52wPct: -1 }, null)[0].rule, 'near_high_momentum');
  assert.equal(detect(base, { changePct: -6 })[0].rule, 'abnormal_move');
  assert.deepEqual(detect(null, null), []);
  assert.deepEqual(detect({ ...base, rsi14: 30 }, null, ['abnormal_move']), [], 'regras desligadas não disparam');
});

test('notify: ntfy recebe corpo e título codificado (acentos)', async () => {
  got.length = 0;
  assert.deepEqual(await notify('📈 Oportunidade ação', 'corpo'), []);
  assert.equal(got[0].url, '/meu-topico');
  assert.equal(got[0].body, 'corpo');
  const m = got[0].title.match(/^=\?UTF-8\?B\?(.+)\?=$/);
  assert.equal(Buffer.from(m[1], 'base64').toString(), '📈 Oportunidade ação');
});

test('notify: falha do canal não rebenta e devolve o erro', async () => {
  process.env.NTFY_SERVER = 'http://localhost:1';
  const errs = await notify('t', 'b');
  process.env.NTFY_SERVER = `http://localhost:${mock.address().port}`;
  assert.match(errs[0], /^ntfy:/);
});

test('vigilante: deteta, notifica no máx. 5 por ciclo e não repete dentro do cooldown', async () => {
  got.length = 0;
  await tick();
  const evs = await callTool('get_events', { kind: 'opportunity' });
  assert.ok(evs.length > 0, 'o universo demo devia ter pelo menos uma oportunidade');
  assert.ok(got.length > 0 && got.length <= 5, `pushes=${got.length}`);
  assert.ok(evs.every((e) => e.kind === 'opportunity'));
  const before = evs.length;
  await tick(true);
  assert.equal((await callTool('get_events', { kind: 'opportunity' })).length, before, 'sem repetições no cooldown');
});
test.after(() => mock.close());
