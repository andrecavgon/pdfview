// Entrega de notificações ao utilizador. Canais ativos conforme as variáveis de ambiente:
//   Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
//   ntfy.sh : NTFY_TOPIC (+ NTFY_SERVER, default https://ntfy.sh; NTFY_TOKEN para tópicos protegidos)
// Falhas nunca interrompem o vigilante: devolvem a lista de erros.
const post = (url, init) => fetch(url, { method: 'POST', signal: AbortSignal.timeout(8000), ...init })
  .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); });

export const channels = () => [
  process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && 'telegram',
  process.env.NTFY_TOPIC && 'ntfy',
].filter(Boolean);

export async function notify(title, body) {
  const errors = [];
  const jobs = [];
  if (channels().includes('telegram')) {
    jobs.push(post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: `${title}\n\n${body}`, disable_web_page_preview: true }),
    }).catch((e) => errors.push(`telegram: ${e.message}`)));
  }
  if (channels().includes('ntfy')) {
    const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/$/, '');
    jobs.push(post(`${server}/${encodeURIComponent(process.env.NTFY_TOPIC)}`, {
      // Cabeçalhos HTTP só aceitam latin1: o título vai codificado (RFC 2047) para suportar acentos/emojis.
      headers: { title: `=?UTF-8?B?${Buffer.from(title).toString('base64')}?=`, ...(process.env.NTFY_TOKEN && { authorization: `Bearer ${process.env.NTFY_TOKEN}` }) },
      body,
    }).catch((e) => errors.push(`ntfy: ${e.message}`)));
  }
  await Promise.all(jobs);
  return errors;
}
