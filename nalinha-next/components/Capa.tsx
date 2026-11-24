import { autoresTxt, type Livro } from '@/lib/livros-tipos';

const CORES = ['#0e4452', '#6b3a2a', '#3d4a2c', '#4a3b5c', '#7a5a1f', '#2f4a5a'];
function hash(t: string) { let h = 0; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h); }

/** Capa desenhada com o título e os autores (a folha não tem imagens de capa). */
export function Capa({ livro }: { livro: Livro }) {
  const cor = CORES[hash(livro.titulo) % CORES.length];
  return (
    <div className="capa">
      <div className="capa-gen" style={{ background: `linear-gradient(160deg,${cor},#1c1912 140%)` }}>
        <i>{autoresTxt(livro)}</i>
        <b>{livro.titulo}</b>
      </div>
    </div>
  );
}
