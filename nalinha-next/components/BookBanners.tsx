import Link from "next/link";
import type { CSSProperties } from "react";
import { Capa } from "./Capa";
import { autoresTxt, type Livro } from "@/lib/livros-tipos";

/**
 * TAMANHO DE CADA BANNER (editar aqui):
 *   --bn-largura       largura relativa no computador (1 = todos iguais; 2 = o dobro)
 *   --bn-altura        altura no computador
 *   --bn-capa          largura da capa no computador
 *   --bn-largura-tlm   largura no telemóvel
 *   --bn-altura-tlm    altura no telemóvel
 *   --bn-capa-tlm      largura da capa no telemóvel
 * Cada banner mostra o livro com o seu número na lista dos mais recentes.
 */
const TAMANHOS: Record<string, string | number>[] = [1, 2, 3, 4, 5, 6].map(() => ({
  "--bn-largura": 1,
  "--bn-altura": "300px",
  "--bn-capa": "138px",
  "--bn-largura-tlm": "172px",
  "--bn-altura-tlm": "310px",
  "--bn-capa-tlm": "142px",
}));

export function BookBanners({ livros }: { livros: Livro[] }) {
  const recentes = [...livros].reverse().slice(0, 6);
  return (
    <div className="bn-row" role="list" aria-labelledby="lb-t">
      {TAMANHOS.map((estilo, k) => {
        const l = recentes[k];
        return (
          <div key={k} className="bn" role="listitem" style={estilo as CSSProperties}>
            <div className="bn-body">
              {l && (
                <Link href={`/livros/${l.slug}/`} className="lb-item">
                  <Capa livro={l} />
                  <span className="t">{l.titulo}</span>
                  <span className="a">{autoresTxt(l)}</span>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
