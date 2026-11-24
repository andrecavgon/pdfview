"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Capa } from "./Capa";
import { autoresTxt, GENEROS, temas, type Livro } from "@/lib/livros-tipos";
import { norm, slug } from "@/lib/util";

export function Catalogo({ livros, filtro }: { livros: Livro[]; filtro: string }) {
  const [q, setQ] = useState("");
  const [ordem, setOrdem] = useState("novos");

  const lista = useMemo(() => {
    const termo = norm(q);
    const l = livros.filter((x) => {
      if (filtro !== "todos" && !temas(x).map(slug).includes(filtro)) return false;
      if (termo && !norm([x.titulo, x.autores, x.editora, x.tema, x.tema2].join(" ")).includes(termo)) return false;
      return true;
    });
    const idx = (x: Livro) => livros.indexOf(x);
    l.sort((a, b) => {
      if (ordem === "titulo") return norm(a.titulo).localeCompare(norm(b.titulo), "pt");
      if (ordem === "autor") return norm(a.autores).localeCompare(norm(b.autores), "pt");
      return idx(b) - idx(a);
    });
    return l;
  }, [livros, filtro, q, ordem]);

  return (
    <section className="catalogo" aria-labelledby="cat-titulo">
      <div className="cat-head"><h1 id="cat-titulo">Livros</h1></div>
      <div className="cat-tools">
        <label className="cat-search"><span className="sr">Pesquisar livros</span>
          <input type="search" placeholder="Pesquisar por título, autor, editora ou tema" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="cat-sort"><span className="sr">Ordenar</span>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
            <option value="novos">Mais recentes</option>
            <option value="titulo">Título (A–Z)</option>
            <option value="autor">Autor (A–Z)</option>
          </select>
        </label>
      </div>
      <div className="cat-chips" role="group" aria-label="Filtrar por género">
        <Link href="/livros/" className={filtro === "todos" ? "on" : ""} aria-pressed={filtro === "todos"}>Todos</Link>
        {GENEROS.map((g) => (
          <Link key={g.g} href={`/livros/tema/${g.g}/`} className={filtro === g.g ? "on" : ""} aria-pressed={filtro === g.g}>{g.t}</Link>
        ))}
      </div>
      <p className="cat-count" aria-live="polite">{lista.length} {lista.length === 1 ? "livro" : "livros"}</p>
      <div className="cat-grid">
        {lista.map((l) => (
          <Link key={l.slug} href={`/livros/${l.slug}/`} className="livro">
            <Capa livro={l} />
            <span className="t">{l.titulo}</span>
            <span className="a">{autoresTxt(l)}</span>
            {l.editora && <span className="ed">{l.editora}</span>}
            <span className="m">{temas(l).map((t) => <span key={t} className="pill">{t}</span>)}</span>
          </Link>
        ))}
      </div>
      {lista.length === 0 && <p className="cat-vazio">Não encontrámos livros com estes critérios.</p>}
    </section>
  );
}
