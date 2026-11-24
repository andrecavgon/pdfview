export type Livro = { titulo: string; autores: string; editora: string; tema: string; tema2: string; slug: string };

export const autoresTxt = (l: Livro) => (l.autores || '').split(/[;|]/).map((x) => x.trim()).filter(Boolean).join(', ');
export const temas = (l: Livro) => [l.tema, l.tema2].filter(Boolean);
export const GENEROS = [
  { g: 'ficcao', t: 'Ficção' },
  { g: 'nao-ficcao', t: 'Não Ficção' },
  { g: 'infantil', t: 'Infantil' },
  { g: 'cascais', t: 'Cascais' },
];
