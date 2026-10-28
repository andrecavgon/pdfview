// Cache TTL com deduplicação de pedidos em voo (evita rate-limit nos fornecedores).
const store = new Map();
export async function cached(key, ttlMs, fn) {
  const hit = store.get(key);
  const now = Date.now();
  if (hit && hit.exp > now) return hit.p;
  const p = fn().catch((e) => { if (store.get(key)?.p === p) store.delete(key); throw e; });
  store.set(key, { p, exp: now + ttlMs });
  if (store.size > 2000) for (const [k, v] of store) if (v.exp < now) store.delete(k);
  return p;
}
export async function getJSON(url, { headers = {}, timeout = 10000 } = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (markets-terminal)', accept: 'application/json', ...headers },
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${new URL(url).host}`);
  return res.json();
}
