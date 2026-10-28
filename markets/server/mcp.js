// MCP (Model Context Protocol) sobre HTTP, transporte "Streamable HTTP" sem estado (JSON-RPC 2.0).
import { callTool, toolList } from './tools.js';

const INFO = { name: 'markets-terminal', version: '1.0.0' };

export async function handleMcp(msg) {
  const { id, method, params } = msg;
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  const err = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
  try {
    switch (method) {
      case 'initialize':
        return ok({ protocolVersion: params?.protocolVersion ?? '2025-03-26', capabilities: { tools: {} }, serverInfo: INFO,
          instructions: 'Dados de mercado (ações, ETFs, índices, FX, crypto). Comece por search_symbols para obter ids; scan_market/market_overview usam dados pré-calculados 24/7.' });
      case 'ping': return ok({});
      case 'tools/list': return ok({ tools: toolList() });
      case 'tools/call': {
        try {
          const out = await callTool(params.name, params.arguments);
          return ok({ content: [{ type: 'text', text: JSON.stringify(out) }] });
        } catch (e) { return ok({ isError: true, content: [{ type: 'text', text: e.message }] }); }
      }
      default:
        return id === undefined ? null : err(-32601, `método não suportado: ${method}`);
    }
  } catch (e) { return err(-32603, e.message); }
}
