import fs from 'node:fs';
import path from 'node:path';
import { norm, slug } from './util';
import type { Livro } from './livros-tipos';

export type { Livro } from './livros-tipos';
export { autoresTxt, temas, GENEROS } from './livros-tipos';


function parseCSV(txt: string): Record<string, string>[] {
  txt = txt.replace(/^﻿/, '');
  const first = txt.split(/\r?\n/)[0] || '';
  const d = first.split(';').length > first.split(',').length ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === d) { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.length > 1 || row[0] !== '') rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.length > 1 || row[0] !== '') rows.push(row);
  if (!rows.length) return [];
  const alias: Record<string, string> = { autor: 'autores', 'tema secundario': 'tema2', temasecundario: 'tema2' };
  const h = rows[0].map((k) => { k = norm(k).replace(/_/g, ' '); return alias[k] || k; });
  return rows.slice(1).map((r) => { const o: Record<string, string> = {}; h.forEach((k, i) => { o[k] = (r[i] || '').trim(); }); return o; }).filter((o) => o.titulo);
}

/** Lê o catálogo da folha do Google Sheets (CATALOGO_URL, no momento da compilação) ou, se não houver, de data/catalogo.csv. */
export async function getLivros(): Promise<Livro[]> {
  let txt = '';
  const url = process.env.CATALOGO_URL;
  if (url) {
    try { const r = await fetch(url); if (r.ok) txt = await r.text(); } catch { /* usa o ficheiro local */ }
  }
  if (!txt) txt = fs.readFileSync(path.join(process.cwd(), 'data', 'catalogo.csv'), 'utf8');
  const usados = new Set<string>();
  return parseCSV(txt).map((o) => {
    let s = slug(o.titulo) || 'livro', n = 2; const base = s;
    while (usados.has(s)) s = base + '-' + n++;
    usados.add(s);
    return { titulo: o.titulo, autores: o.autores || '', editora: o.editora || '', tema: o.tema || '', tema2: o.tema2 || '', slug: s };
  });
}
