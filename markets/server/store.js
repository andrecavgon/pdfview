import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.env.DATA_DIR || join(import.meta.dirname, '..', 'data');
mkdirSync(dir, { recursive: true });
export const db = new DatabaseSync(join(dir, 'markets.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS snapshots (
    id TEXT PRIMARY KEY, symbol TEXT, name TEXT, type TEXT, updated INTEGER,
    price REAL, change_pct REAL, rsi REAL, trend TEXT, ret7d REAL, ret30d REAL, atr_pct REAL,
    dist_high REAL, data TEXT
  );
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, symbol_id TEXT NOT NULL, cond TEXT NOT NULL, value REAL NOT NULL,
    webhook TEXT, note TEXT, repeat INTEGER DEFAULT 0, active INTEGER DEFAULT 1, created INTEGER, triggered INTEGER
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, kind TEXT, symbol_id TEXT, message TEXT, data TEXT
  );
  CREATE TABLE IF NOT EXISTS notified (key TEXT PRIMARY KEY, ts INTEGER);
  CREATE INDEX IF NOT EXISTS ev_ts ON events(ts);
`);

export const upsertSnapshot = db.prepare(`
  INSERT INTO snapshots (id,symbol,name,type,updated,price,change_pct,rsi,trend,ret7d,ret30d,atr_pct,dist_high,data)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(id) DO UPDATE SET updated=excluded.updated, price=excluded.price, change_pct=excluded.change_pct,
    rsi=excluded.rsi, trend=excluded.trend, ret7d=excluded.ret7d, ret30d=excluded.ret30d, atr_pct=excluded.atr_pct,
    dist_high=excluded.dist_high, data=excluded.data`);

export function addEvent(kind, symbol_id, message, data = {}) {
  const ts = Date.now();
  const { lastInsertRowid } = db.prepare('INSERT INTO events (ts,kind,symbol_id,message,data) VALUES (?,?,?,?,?)')
    .run(ts, kind, symbol_id, message, JSON.stringify(data));
  const ev = { id: Number(lastInsertRowid), ts, kind, symbol_id, message, data };
  // Retenção: 30 dias.
  db.prepare('DELETE FROM events WHERE ts < ?').run(ts - 30 * 86400_000);
  return ev;
}
