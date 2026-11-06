# Obras com Evidência — site + Área de Cliente

Site institucional (PT/EN) com Área de Cliente privada e painel da equipa, conforme o briefing funcional.

## Modo demonstração (por omissão)
Abra `index.html` no browser. Sem configuração, corre com dados em memória (não guarda nada).
- Cliente: botão **Área de Cliente** → entrar (qualquer email/palavra-passe).
- Equipa: no mesmo diálogo, **Entrar como equipa** (ou um email que contenha `equipa`).

## Modo real (Supabase)
1. Crie um projeto em <https://supabase.com>.
2. No **SQL Editor**, execute `../supabase/schema.sql` (tabelas, permissões RLS, bucket `obra-files`).
3. **Authentication → Providers → Email**: desative *Confirm email* (a equipa cria as contas dos clientes).
4. Preencha `config.js` com `SUPABASE_URL` e `SUPABASE_ANON_KEY` (Project Settings → API).
5. Crie a conta da equipa em **Authentication → Users** e promova-a:
   ```sql
   update profiles set role = 'staff' where id = '<uuid-do-utilizador>';
   ```
6. Entre com essa conta → **Painel da equipa** → *Nova obra / cliente*. O cliente entra com o email e palavra-passe definidos.

## O que cada perfil pode fazer
| | Cliente | Equipa |
|---|---|---|
| Ver a sua obra (dashboard, cronograma, progresso, fotos, materiais, financeiro, documentos) | ✔ (só a sua) | ✔ (todas) |
| Atualizar fases, %, estado e validação de qualidade | ✘ | ✔ |
| Carregar fotografias e documentos | ✘ | ✔ |
| Comentar fotografias | ✔ | ✔ |
| Definir PVP orçamentado / real dos materiais | ✘ | ✔ |
| Confirmar material (com aceitação explícita do acréscimo, validada no servidor) | ✔ | ✔ |
| Registar adendas e pagamentos | ✘ | ✔ |
| Pedir alteração / novo pedido | ✔ | vê os pedidos |
| Chat com anexos | ✔ | ✔ |

A segurança é imposta pela base de dados (RLS), não pelo código do site: mesmo um cliente que manipule o browser não consegue ver outra obra nem escrever onde não deve.

## Publicar
É um site estático: basta alojar a pasta (GitHub Pages, Netlify, Vercel, …). A chave `anon` é pública por desenho.

## Design tokens
`tokens.css` tem duas camadas:
- **Primitivos** (`--terra-600`, `--petrol-500`, `--cream-50`…): a paleta bruta. Só aparecem nesse ficheiro.
- **Semânticos** (`--color-action`, `--color-brand`, `--color-text`, `--color-surface`…): o que cada cor *faz*. O `styles.css` e o `app.js` usam **apenas** estes — nunca um primitivo nem um hex direto.

Cor de ação (botões principais, separador ativo, CTA): `--color-action: var(--terra-600)` e `--color-action-hover: var(--terra-700)`.
Para re-tematizar, altere os primitivos ou o mapeamento semântico em `tokens.css`; nada mais precisa de mudar.
