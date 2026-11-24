import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Capa } from "@/components/Capa";
import { autoresTxt, GENEROS, getLivros } from "@/lib/livros";
import { slug as mkSlug } from "@/lib/util";

export const dynamicParams = false;
export async function generateStaticParams() { return (await getLivros()).map((l) => ({ slug: l.slug })); }

async function achar(slug: string) { return (await getLivros()).find((l) => l.slug === slug); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await achar(slug);
  if (!l) return {};
  return { title: l.titulo, description: `${l.titulo}, de ${autoresTxt(l)}${l.editora ? ` (${l.editora})` : ""}.` };
}

function Tema({ t }: { t: string }) {
  const g = GENEROS.find((x) => x.g === mkSlug(t));
  return g ? <Link href={`/livros/tema/${g.g}/`}>{t}</Link> : <>{t}</>;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await achar(slug);
  if (!l) notFound();
  return (
    <article className="livro-pag">
      <Link className="art-voltar" href="/livros/">← Livros</Link>
      <div className="dlg-body">
        <Capa livro={l} />
        <div>
          <h1>{l.titulo}</h1>
          <dl>
            <dt>Autor(es)</dt><dd>{autoresTxt(l)}</dd>
            {l.editora && (<><dt>Editora</dt><dd>{l.editora}</dd></>)}
            {l.tema && (<><dt>Tema</dt><dd><Tema t={l.tema} /></dd></>)}
            {l.tema2 && (<><dt>Tema secundário</dt><dd><Tema t={l.tema2} /></dd></>)}
          </dl>
        </div>
      </div>
    </article>
  );
}
