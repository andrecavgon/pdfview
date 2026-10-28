import { test } from 'node:test';
import assert from 'node:assert/strict';
process.env.DATA_MODE = 'demo';
process.env.DATA_DIR = (await import('node:os')).tmpdir() + '/markets-test-' + process.pid;
const { sma, ema, rsi, macd, bollinger, summarize } = await import('../shared/indicators.mjs');
const { callTool, toolList } = await import('../server/tools.js');
const { providerFor } = await import('../server/providers/index.js');
const { tick } = await import('../server/watcher.js');

test('sma/ema valores conhecidos', () => {
  assert.deepEqual(sma([1, 2, 3, 4, 5], 3), [null, null, 2, 3, 4]);
  assert.equal(ema([1, 2, 3, 4, 5], 3)[2], 2);
});
test('rsi: só subidas = 100, só descidas = 0', () => {
  assert.equal(rsi(Array.from({ length: 30 }, (_, i) => i), 14).at(-1), 100);
  assert.equal(rsi(Array.from({ length: 30 }, (_, i) => 100 - i), 14).at(-1), 0);
});
test('macd e bollinger alinhados com a entrada', () => {
  const v = Array.from({ length: 80 }, (_, i) => 100 + Math.sin(i / 5) * 10);
  assert.equal(macd(v).hist.length, 80);
  const b = bollinger(v);
  assert.ok(b.upper.at(-1) > b.mid.at(-1) && b.mid.at(-1) > b.lower.at(-1));
});
test('summarize recusa histórico curto', () => assert.equal(summarize([{ o: 1, h: 1, l: 1, c: 1 }]), null));
test('ids inválidos são rejeitados', () => assert.throws(() => providerFor('FOO:BAR'), /id inválido/));
test('ferramentas: catálogo, parâmetros obrigatórios e pipeline completo', async () => {
  assert.ok(toolList().length >= 10);
  await assert.rejects(callTool('get_candles', {}), /parâmetro em falta/);
  await assert.rejects(callTool('nope'), /desconhecida/);
  await tick();
  const scan = await callTool('scan_market', { type: 'crypto', sort: 'rsi', order: 'asc', limit: 3 });
  assert.ok(scan.length > 0 && scan.every((r) => r.type === 'crypto'));
  const { alertId } = await callTool('create_alert', { id: 'DEMO:BTCUSDT', condition: 'price_above', value: 1 });
  await tick();
  const ev = await callTool('get_events', {});
  assert.ok(ev.some((e) => e.data.alertId === alertId), 'alerta devia ter disparado');
  assert.equal((await callTool('list_alerts', {})).some((a) => a.id === alertId), false, 'alerta único fica inativo');
});
test('create_alert valida webhook https', async () => {
  await assert.rejects(callTool('create_alert', { id: 'DEMO:BTCUSDT', condition: 'price_above', value: 1, webhook: 'http://x' }), /https/);
});
