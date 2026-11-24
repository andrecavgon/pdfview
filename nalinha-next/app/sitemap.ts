import type { MetadataRoute } from "next";
import { ARTIGOS, SECOES } from "@/lib/dados";
import { GENEROS, getLivros } from "@/lib/livros";

export const dynamic = "force-static";
const SITE = process.env.SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const livros = await getLivros();
  const rotas = [
    "/", "/livros/",
    ...GENEROS.map((g) => `/livros/tema/${g.g}/`),
    ...livros.map((l) => `/livros/${l.slug}/`),
    ...Object.keys(ARTIGOS).map((id) => `/artigo/${id}/`),
    ...Object.keys(SECOES).map((k) => `/secao/${k}/`),
  ];
  return rotas.map((r) => ({ url: SITE + r }));
}
