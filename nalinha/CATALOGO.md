# Catálogo de livros

O menu **Livros** lê o catálogo de uma folha do Google Sheets. Para acrescentar um livro, basta acrescentar uma linha à folha, sem tocar no site.

## Campos de cada livro
Mantém estes nomes de coluna na primeira linha da folha:

`titulo, autores, editora, tema, tema_secundario`

- **titulo**: título do livro.
- **autores**: um ou vários. Separa com `;` (ex.: `Autora Um; Autor Dois`).
- **editora**: nome da editora.
- **tema**: tema principal. Os filtros do menu usam `Ficção`, `Não Ficção`, `Infantil` e `Cascais`.
- **tema_secundario**: tema secundário (opcional). Um livro aparece também no filtro do seu tema secundário.

Não há mais campos: não há preço, ISBN, capa, sinopse nem stock. A capa é desenhada pela página com o título e os autores.

## Montar a folha
No Google Sheets, importa `catalogo-modelo.csv` (Ficheiro → Importar) e substitui as linhas de exemplo pelos teus livros.

## Publicar a folha
1. Ficheiro → Partilhar → **Publicar na Web**.
2. Escolhe a folha e o formato **Valores separados por vírgulas (.csv)** → Publicar.
3. Copia o endereço e cola-o em `index.html`, na linha `const CATALOGO_URL = '';`.
4. Publica o site. A partir daí, as alterações à folha aparecem sozinhas (pode demorar alguns minutos).

Atenção: uma folha publicada é pública. Não coloques lá informação interna.
