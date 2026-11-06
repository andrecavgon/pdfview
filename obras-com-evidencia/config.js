/* Configuração do Supabase.
   Preencha com os valores de Project Settings > API do seu projeto Supabase.
   Enquanto estiver vazio, o site corre em MODO DEMONSTRAÇÃO (dados em memória). */
window.OCE_CONFIG = {
  SUPABASE_URL: '',       // ex.: 'https://abcdxyz.supabase.co'
  SUPABASE_ANON_KEY: '',  // chave "anon public" (segura no browser; a proteção é feita pelo RLS)
  CHATBOT_URL: ''         // opcional: endpoint seu (POST {message,history,lang} → {reply}) que liga a um modelo de IA.
                          // Vazio = assistente de perguntas frequentes integrado. Nunca ponha chaves de IA neste ficheiro.
};
