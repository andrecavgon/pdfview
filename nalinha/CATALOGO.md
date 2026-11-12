# Catálogo de livros

O menu **Livros** lê o catálogo de uma folha do Google Sheets. Para acrescentar um livro, basta acrescentar uma linha à folha, sem tocar no site.

## Montar a folha
1. No Google Sheets, importa `catalogo-modelo.csv` (Ficheiro → Importar) ou copia os cabeçalhos.
2. Mantém os nomes das colunas na primeira linha:
   `titulo, autor, editora, ano, isbn, genero, preco, capa, sinopse, stock`
3. **genero**: usa `Ficção`, `Não Ficção`, `Infantil` e/ou `Cascais`. Para vários, separa com `;` (ex.: `Infantil; Cascais`).
4. **preco**: número com vírgula ou ponto (ex.: `14,90`).
5. **capa**: endereço (URL) de uma imagem. Se ficar vazio, a página desenha uma capa com o título.
6. **stock**: `sim` ou `não`.

## Publicar a folha
1. Ficheiro → Partilhar → **Publicar na Web**.
2. Escolhe a folha e o formato **Valores separados por vírgulas (.csv)** → Publicar.
3. Copia o endereço e cola-o em `index.html`, na linha `const CATALOGO_URL = '';`.
4. Publica o site. A partir daí, as alterações à folha aparecem sozinhas (pode demorar alguns minutos).

Atenção: uma folha publicada é pública. Não coloques lá informação interna.
