// Deteção de "oportunidades" sobre o resumo técnico diário (shared/indicators.summarize).
// São sinais técnicos simples e ruidosos: servem para chamar a atenção, não para decidir compras.
const RULES = {
  oversold_uptrend: {
    label: 'Sobrevenda dentro de tendência de longo prazo em alta',
    test: (s) => s.rsi14 != null && s.rsi14 <= 35 && s.sma200 != null && s.price > s.sma200,
    why: (s) => `RSI ${s.rsi14} (≤35) com preço acima da SMA200 (${s.sma200}): possível recuo a comprar dentro de tendência de alta.`,
  },
  macd_bull_cross: {
    label: 'Cruzamento de alta do MACD acima da SMA50',
    test: (s) => s.signals.includes('MACD cruzamento de alta') && s.sma50 != null && s.price > s.sma50,
    why: (s) => `MACD cruzou para cima com preço acima da SMA50 (${s.sma50}); RSI ${s.rsi14}.`,
  },
  near_high_momentum: {
    label: 'Perto do máximo de 52 semanas com momentum',
    test: (s) => s.distFromHigh52wPct != null && s.distFromHigh52wPct >= -2 && s.rsi14 >= 55 && s.rsi14 < 75 && s.trend === 'up',
    why: (s) => `A ${Math.abs(s.distFromHigh52wPct)}% do máximo de 52s, tendência de alta e RSI ${s.rsi14}: possível rompimento.`,
  },
  abnormal_move: {
    label: 'Movimento anormal',
    test: (s, q) => q?.changePct != null && s.atrPct > 0 && Math.abs(q.changePct) >= 2.5 * s.atrPct,
    why: (s, q) => `Variação de ${q.changePct.toFixed(2)}% em 24h, ${(Math.abs(q.changePct) / s.atrPct).toFixed(1)}× a volatilidade diária típica (ATR ${s.atrPct}%).`,
  },
};
export const ruleNames = Object.keys(RULES);

export function detect(summary, quote, enabled = ruleNames) {
  if (!summary) return [];
  return enabled.filter((k) => RULES[k]?.test(summary, quote))
    .map((k) => ({ rule: k, label: RULES[k].label, why: RULES[k].why(summary, quote) }));
}
