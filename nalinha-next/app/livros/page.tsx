import type { Metadata } from "next";
import { Catalogo } from "@/components/Catalogo";
import { getLivros } from "@/lib/livros";

export const metadata: Metadata = { title: "Livros", description: "O catálogo de livros do Na Linha." };

export default async function Page() {
  return <Catalogo livros={await getLivros()} filtro="todos" />;
}
