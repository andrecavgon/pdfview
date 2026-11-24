import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTIGOS, SECOES } from "@/lib/dados";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(SECOES).map((chave) => ({ chave })); }

export async function generateMetadata({ params }: { params: Promise<{ chave: string }> }): Promise<Metadata> {
  const { chave } = await params;
  const s = SECOES[chave];
  return s ? { title: s.t, description: s.intro } : {};
}

export default async function Page({ params }: { params: Promise<{ chave: string }> }) {
  const { chave } = await params;
  const c = SECOES[chave];
  if (!c) notFound();
  const pai = c.pai ? SECOES[c.pai] : null;
  const ids = Object.keys(ARTIGOS).filter((id) => { const s = ARTIGOS[id].secao; return s === chave || s.startsWith(chave + "-"); });
  return (
    <section className="artigo secao" aria-labelledby="sec-t">
      <Link className="art-voltar" href="/">← Voltar</Link>
      <p className="art-tag">{pai ? pai.t : "Secção"}</p>
      <h1 id="sec-t">{c.t}</h1>
      <p className="art-sub">{c.intro}</p>
      {c.subs && (
        <div className="sec-subs">
          {c.subs.map((k) => SECOES[`${chave}-${k}`] && <Link key={k} href={`/secao/${chave}-${k}/`}>{SECOES[`${chave}-${k}`].t}</Link>)}
        </div>
      )}
      {c.corpo && <div className="art-corpo" dangerouslySetInnerHTML={{ __html: c.corpo }} />}
      <div className="sec-cards">
        {ids.map((id) => (
          <Link key={id} className="sec-card" href={`/artigo/${id}/`}>
            <span className="im" style={ARTIGOS[id].img ? { backgroundImage: `url(/img/${ARTIGOS[id].img})` } : undefined} />
            <span className="tg">{ARTIGOS[id].tag}</span>
            <span className="tt">{ARTIGOS[id].t}</span>
          </Link>
        ))}
        {!ids.length && !c.corpo && !c.subs && <p className="sec-vazio">Em breve. Esta secção ainda não tem artigos.</p>}
      </div>
    </section>
  );
}
