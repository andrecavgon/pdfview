import { slug } from './util';
export type ItemMenu = { t: string; href: string; subs: { t: string; href: string; chave: string }[]; chave: string };
const sec = (top: string, subs: string[]): ItemMenu => ({
  t: top, chave: slug(top), href: `/secao/${slug(top)}/`,
  subs: subs.map((s) => ({ t: s, chave: `${slug(top)}-${slug(s)}`, href: `/secao/${slug(top)}-${slug(s)}/` })),
});
export const MENU: ItemMenu[] = [
  { t: 'Livros', chave: 'livros', href: '/livros/', subs: [
    { t: 'Ficção', chave: 'livros-ficcao', href: '/livros/tema/ficcao/' },
    { t: 'Não Ficção', chave: 'livros-nao-ficcao', href: '/livros/tema/nao-ficcao/' },
    { t: 'Infantil', chave: 'livros-infantil', href: '/livros/tema/infantil/' },
    { t: 'Cascais', chave: 'livros-cascais', href: '/livros/tema/cascais/' },
  ] },
  sec('Leituras', ['Na Imprensa', 'Sugestões', 'Leitores', 'Outras Rúbricas']),
  sec('Local', ['Espaços e Cultura', 'Livros e Escritores', 'Parcerias e Parceiros']),
  sec('Expats', ['Books', 'Reading', 'On Cascais']),
  sec('Sobre nós', ['Corpo Editorial', 'Quem Somos', 'Contactos']),
];
