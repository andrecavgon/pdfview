import Link from "next/link";
import { BookBanners } from "@/components/BookBanners";
import { getLivros } from "@/lib/livros";

export default async function Home() {
  const livros = await getLivros();
  return (
    <>
      <div id="home">
<section className="grid hero">
      <article className="card c1">
        <span className="tag">Livros</span>
        <h2>O prazer<br />de voltar<br />às livrarias</h2>
        <p>Porque é que os livros continuam a ser um refúgio.</p>
        <span className="more">Ler mais</span>
        <Link className="card-link" href="/artigo/prazer-de-voltar-as-livrarias/" aria-label="Ler o artigo: O prazer de voltar às livrarias"></Link>
      </article>
      <article className="card c2">
        <span className="tag">Local</span>
        <h2>Cascais<br />e os livros</h2>
        <p>Uma cidade que lê,<br />dentro e fora das livrarias.</p>
        <span className="more">Ler mais</span>
              <Link className="card-link" href="/artigo/cascais-e-os-livros/" aria-label="Ler o artigo: Cascais e os livros"></Link>
      </article>
    </section>

    <section className="grid row2">
      <article className="card small s1">
        <div className="txt">
          <span className="tag">Literatura</span>
          <h2>O regresso<br />de Maggie<br />O’Farrell</h2>
          <p>Uma nova história sobre a memória.</p>
          <span className="more">Ler mais</span>
        </div>
        <div className="pic"></div>
              <Link className="card-link" href="/artigo/o-regresso-de-maggie-ofarrell/" aria-label="Ler o artigo: O regresso de Maggie O’Farrell"></Link>
      </article>
      <article className="card small s2">
        <div className="txt">
          <span className="tag">Críticas</span>
          <h2>Dois finalistas<br />do Booker 2025</h2>
          <p>Uma escolha<br />que celebra a diversidade.</p>
          <span className="more">Ler mais</span>
        </div>
        <div className="pic"></div>
              <Link className="card-link" href="/artigo/dois-finalistas-do-booker-2025/" aria-label="Ler o artigo: Dois finalistas do Booker 2025"></Link>
      </article>
      <article className="card small s3">
        <div className="txt">
          <span className="tag">Leitura</span>
          <h2>A importância<br />da leitura hoje</h2>
          <p>Reflexões sobre uma sociedade pós-literata.</p>
          <span className="more">Ler mais</span>
        </div>
        <div className="pic"></div>
              <Link className="card-link" href="/artigo/a-importancia-da-leitura-hoje/" aria-label="Ler o artigo: A importância da leitura hoje"></Link>
      </article>
    </section>

    <section className="grid row3">
      <article className="card kids">
        <span className="tag">Infanto-juvenil</span>
        <h2>Histórias<br />para todas<br />as idades</h2>
        <p>Da primeira infância aos jovens leitores.</p>
        <span className="more">Ler mais</span>
              <Link className="card-link" href="/artigo/historias-para-todas-as-idades/" aria-label="Ler o artigo: Histórias para todas as idades"></Link>
      </article>
      <article className="card big">
        <span className="tag">Livros</span>
        <h2>Novidades<br />de História</h2>
        <p>Grandes narrativas para compreender o nosso tempo.</p>
        <span className="more">Ler mais</span>
              <Link className="card-link" href="/artigo/novidades-de-historia/" aria-label="Ler o artigo: Novidades de História"></Link>
      </article>
    </section>

    <section className="emais">
      <div className="head">E mais...</div>
      <div className="thumbs">
        <figure><div style={{ backgroundImage: "url(/img/feiras.jpg)" }}></div><h3>Feiras do Livro<br />em Cascais</h3><Link className="card-link" href="/artigo/feiras-do-livro-em-cascais/" aria-label="Ler o artigo: Feiras do Livro em Cascais"></Link></figure>
        <figure><div style={{ backgroundImage: "url(/img/sugestoes.jpg)" }}></div><h3>Sugestões da Equipa</h3><Link className="card-link" href="/artigo/sugestoes-da-equipa/" aria-label="Ler o artigo: Sugestões da Equipa"></Link></figure>
        <figure><div style={{ backgroundImage: "url(/img/noticias.jpg)" }}></div><h3>Notícias do Mundo<br />da Literatura</h3><Link className="card-link" href="/artigo/noticias-do-mundo-da-literatura/" aria-label="Ler o artigo: Notícias do Mundo da Literatura"></Link></figure>
        <figure><div style={{ backgroundImage: "url(/img/vida.jpg)" }}></div><h3>A vida em Cascais<br />através dos livros</h3><Link className="card-link" href="/artigo/a-vida-em-cascais-atraves-dos-livros/" aria-label="Ler o artigo: A vida em Cascais através dos livros"></Link></figure>
      </div>
    </section>
        <section className="grid row5">
          <h2 className="sec-titulo" id="lb-t"><Link className="sec-link" href="/livros/">Livros</Link></h2>
          <BookBanners livros={livros} />
        </section>
      </div>
    </>
  );
}
