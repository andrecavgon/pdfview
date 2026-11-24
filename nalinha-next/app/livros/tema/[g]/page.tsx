import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogo } from "@/components/Catalogo";
import { GENEROS, getLivros } from "@/lib/livros";

export const dynamicParams = false;
export function generateStaticParams() { return GENEROS.map((g) => ({ g: g.g })); }

export async function generateMetadata({ params }: { params: Promise<{ g: string }> }): Promise<Metadata> {
  const { g } = await params;
  const t = GENEROS.find((x) => x.g === g)?.t;
  return { title: t ? `Livros · ${t}` : "Livros" };
}

export default async function Page({ params }: { params: Promise<{ g: string }> }) {
  const { g } = await params;
  if (!GENEROS.some((x) => x.g === g)) notFound();
  return <Catalogo livros={await getLivros()} filtro={g} />;
}
