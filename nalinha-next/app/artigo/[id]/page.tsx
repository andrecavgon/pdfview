import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTIGOS } from "@/lib/dados";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(ARTIGOS).map((id) => ({ id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = ARTIGOS[id];
  return a ? { title: a.t, description: a.sub, openGraph: { title: a.t, description: a.sub, type: "article" } } : {};
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = ARTIGOS[id];
  if (!a) notFound();
  return (
    <article className="artigo" aria-labelledby="art-t">
      <Link className="art-voltar" href="/">← Voltar</Link>
      <p className="art-tag">{a.tag} · Artigo fictício, texto de teste</p>
      <h1 id="art-t">{a.t}</h1>
      <p className="art-sub">{a.sub}</p>
      <p className="art-meta">Por Redação Na Linha · {a.data} · {a.min} min de leitura</p>
      {a.img && (
        <figure className="art-fig">
          <div className={"art-img" + (a.port ? " port" : "")} role="img" aria-label={a.cap || a.t} style={{ backgroundImage: `url(/img/${a.img})` }} />
          {a.cap && <figcaption>{a.cap}</figcaption>}
        </figure>
      )}
      <div className="art-corpo" dangerouslySetInnerHTML={{ __html: a.corpo }} />
      <div className="art-fim"><Link className="art-catalogo" href="/livros/">Ver os livros no catálogo →</Link></div>
    </article>
  );
}
