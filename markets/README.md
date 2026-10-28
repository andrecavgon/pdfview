# Markets Terminal

Terminal de mercados (ações, ETFs, índices, FX e crypto) no estilo TradingView, com um **vigilante 24/7** e uma
**API/MCP para agentes**. Zero build: Node ≥ 22.13 + um único pacote npm (`lightweight-charts`, o motor de gráficos do TradingView).

## Arrancar

```bash
npm install
npm run demo          # dados SIMULADOS (offline, para testar) -> http://localhost:3000
npm start             # dados reais (precisa de acesso à Binance e ao Yahoo Finance)
npm test
```

## O que tem

| Área | Detalhe |
|---|---|
| Gráfico | Velas/linha/área, 1m–1w, volume, SMA 20/50/200, EMA 21, Bollinger, RSI e MACD em painéis, preço ao vivo |
| Pesquisa | `Ctrl+K` (ou `/`): ticker ou nome, filtros por classe de ativo, Binance + Yahoo em paralelo |
| Scanner | RSI, tendência, variação, volatilidade sobre o universo vigiado (pré-calculado, resposta instantânea) |
| Vigilante | Recalcula indicadores a cada 5 min, avalia alertas a cada 60 s, guarda tudo em SQLite (`DATA_DIR`) |
| Agentes | MCP (`POST /mcp`), REST (`/agent/v1/tools/:nome`), stream SSE de alertas (`/agent/v1/events`), webhooks |

## Agentes

Defina `AGENT_API_KEY` (sem ela a API de agentes fica **aberta**; o arranque avisa). Depois:

```bash
curl -H "Authorization: Bearer $AGENT_API_KEY" "http://localhost:3000/agent/v1/tools"                      # catálogo
curl -H "Authorization: Bearer $AGENT_API_KEY" "http://localhost:3000/agent/v1/tools/scan_market?type=crypto&rsi_below=30"
curl -N -H "Authorization: Bearer $AGENT_API_KEY" http://localhost:3000/agent/v1/events                     # alertas em tempo real
```

Ligar o Claude Code por MCP: `claude mcp add --transport http markets http://localhost:3000/mcp --header "Authorization: Bearer $AGENT_API_KEY"`

Ferramentas: `search_symbols`, `get_quote`, `get_candles`, `get_indicators`, `scan_market`, `market_overview`,
`get_news`, `create_alert`, `list_alerts`, `delete_alert`, `get_events`. Os ids levam prefixo do fornecedor (`BINANCE:BTCUSDT`, `YAHOO:AAPL`).

## Configuração

| Variável | Default | |
|---|---|---|
| `PORT` | 3000 | |
| `DATA_MODE` | live | `demo` = dados simulados (a UI mostra faixa de aviso) |
| `AGENT_API_KEY` | — | Bearer token da API de agentes e do MCP |
| `DATA_DIR` | ./data | SQLite (snapshots, alertas, eventos) — montar volume persistente |
| `BINANCE_BASE` | api.binance.com | `https://data-api.binance.vision` se a região bloquear |
| `WATCH_INTERVAL_MS` / `SNAPSHOT_INTERVAL_MS` | 60 s / 5 min | |

## 24/7 em produção

O vigilante só corre enquanto o processo estiver vivo, por isso hospede-o num serviço que não adormeça
(VPS, Fly.io, Railway, Render *paid*): `docker build -t markets . && docker run -p 3000:3000 -v mkt:/data -e AGENT_API_KEY=… markets`.
Ponha atrás de HTTPS (Caddy/Cloudflare).

## Limitações conhecidas (honestas)

- **Yahoo Finance é não oficial**: sem SLA e com atraso de ~15 min em algumas bolsas. Para dados profissionais, implementar a mesma interface
  (`search/quotes/candles/news`) para Polygon, Finnhub, IEX ou Databento em `server/providers/`.
- O "tempo real" é *polling* do servidor (1,5–2,5 s) distribuído por SSE, não WebSocket de exchange.
- Sem ferramentas de desenho nem contas de utilizador/watchlists na cloud (a watchlist fica no `localStorage`).
- Não é aconselhamento financeiro; os sinais são indicadores técnicos simples.
