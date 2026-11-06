'use strict';
/* Obras com Evidência — site institucional + Área de Cliente + painel da equipa.
   Dados via window.DB (Supabase ou demonstração). */

const I18N = window.I18N, DB = window.DB, U = window.DBU;
let lang = (navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
try { const s = localStorage.getItem('oce-lang'); if (s) lang = s; } catch (e) {}
const t = k => (I18N[lang][k] ?? k);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const loc = () => (lang === 'pt' ? 'pt-PT' : 'en-GB');
const eur = n => '€ ' + (+n || 0).toLocaleString(loc());
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dm = s => (s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '—');
const dmy = s => (s ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4) : '—');
function toast(m) { const e = $('#toast'); e.textContent = m; e.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('on'), 3000); }
const ST = { dock: true, user: null, projects: [], pid: null, B: null, page: 'dashboard', tab: 'fases', matTab: 'rev', pf: 'all', ps: 'recent', timer: null, testi: 0 };
let testiTimer;
const stopTimers = () => { clearInterval(testiTimer); clearInterval(ST.timer); };

// ---------- logótipo ----------
const LOGO_SRC = 'logo.webp';
const LOGO_DARK = 'logo-dark.webp';
const FORCED_DARK = (() => { try { return matchMedia('(prefers-color-scheme: dark)').matches && matchMedia('(max-width:560px)').matches && !!navigator.userAgentData && navigator.userAgentData.brands.some(b => /Chrom/i.test(b.brand)); } catch (e) { return false; } })();
if (FORCED_DARK) document.documentElement.classList.add('fd');
const logo = (onDark) => `<img class="logo-img" src="${FORCED_DARK || onDark ? LOGO_DARK : LOGO_SRC}" width="900" height="684" alt="Obras com Evidência">`;

// ---------- ícones (SVG de linha, minimalistas e coerentes) ----------
const ICONS = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  trend: '<path d="M3.5 17l5.5-5.5 4 4 7.5-8"/><path d="M15 7.5h5.5V13"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 16l-4.8-4.8L8 19.5"/>',
  layers: '<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/>',
  euro: '<path d="M17.5 6.8a7 7 0 1 0 0 10.4"/><path d="M4.5 10h9.5M4.5 14h9.5"/>',
  chat: '<path d="M20.5 14.5a2.5 2.5 0 0 1-2.5 2.5H8.5L4 20.5V6.5A2.5 2.5 0 0 1 6.5 4H18a2.5 2.5 0 0 1 2.5 2.5z"/>',
  doc: '<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5M9 13h6M9 16.5h6"/>',
  home: '<path d="M4 20.5v-9.2L12 4l8 7.3v9.2"/><path d="M9.5 20.5v-5.5h5v5.5M3 20.5h18"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.3l2.5 2.5 4.6-5"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  send: '<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5L3 9.5z"/>',
  clip: '<path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.5 17.3a1.7 1.7 0 0 1-2.4-2.4L15 7.5"/>',
  download: '<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M4.5 20h15"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pen: '<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M4 8l8 5.5L20 8"/>',
  phone: '<path d="M5 4.5h3.3l1.8 4.4-2.1 1.4a11 11 0 0 0 5.6 5.6l1.4-2.1 4.4 1.8V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.4-3.6-8.5s1.2-6.1 3.6-8.5z"/>',
  alert: '<path d="M12 4.5l8.5 15h-17z"/><path d="M12 10v4.2M12 17v.01"/>',
  chev: '<path d="M7 10l5 5 5-5"/>',
  logout: '<path d="M9 4.5H6.5A2.5 2.5 0 0 0 4 7v10a2.5 2.5 0 0 0 2.5 2.5H9"/><path d="M15 8l4 4-4 4M19 12H9"/>'
};
const ico = (n, s) => `<svg class="svg-i" viewBox="0 0 24 24"${s ? ` width="${s}" height="${s}"` : ''} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[n] || ''}</svg>`;

// textos de demonstração em PT → EN (dados reais do Supabase mantêm-se como foram escritos)
const DEMO_EN = {
  'Moradia em Cascais': 'Villa in Cascais',
  'Demolição concluída.': 'Demolition completed.',
  'Trabalhos em execução conforme planeado.': 'Work in progress as planned.',
  'Trabalhos em andamento conforme planeado.': 'Work in progress as planned.',
  'Podem confirmar a altura do rodapé aqui?': 'Can you confirm the skirting board height here?',
  'Sr. Álvaro': 'Mr. Álvaro',
  'Cozinha': 'Kitchen',
  'Sala': 'Living room',
  'Quarto': 'Bedroom',
  'Casas de Banho': 'Bathrooms',
  'Azulejo – Parede': 'Tile – Wall',
  'Mosaico Hidráulico – Chão': 'Hydraulic Mosaic – Floor',
  'Soalho Sala': 'Living Room Flooring',
  'Roupeiros Quarto': 'Bedroom Wardrobes',
  'Tampo WC – Mármore': 'WC Countertop – Marble',
  'Sanita suspensa': 'Wall-hung toilet',
  'Isolamento acústico adicional': 'Additional acoustic insulation',
  'Mais tomadas e pontos de luz': 'More sockets and light points',
  'Fornecimento e instalação de novo móvel de casa de banho': 'Supply and installation of new bathroom vanity unit',
  'Reforço estrutural da parede entre sala e cozinha': 'Structural reinforcement of the wall between living room and kitchen',
  'Fatura 011': 'Invoice 011',
  'Fatura 017': 'Invoice 017',
  'Direção de Obra': 'Site Management',
  'Boa tarde Sr. Álvaro, temos mais uma atualização fotográfica pronta: capturámos o progresso das redes elétricas.': 'Good afternoon Mr. Álvaro, we have another photo update ready: we captured the progress of the electrical networks.',
  'Boa tarde João, as fotos ficaram ótimas, obrigado.': 'Good afternoon João, the photos look great, thank you.',
  'Se precisar de alguma informação adicional, estou ao dispor.': 'If you need any further information, I am at your disposal.',
};
const tx = s => (lang === 'en' && s && DEMO_EN[s]) || s;

// ---------- modal genérico ----------
function modal(html, wide) {
  const m = document.createElement('div'); m.className = 'modal open';
  m.innerHTML = `<div class="box ${wide ? 'wide' : ''}"><button class="x" aria-label="×">×</button>${html}</div>`;
  document.body.appendChild(m);
  m.result = new Promise(res => { m.close = v => { m.remove(); res(v); }; });
  $('.x', m).onclick = () => m.close(null); m.onclick = e => { if (e.target === m) m.close(null); };
  return m;
}
function ask(title, ph) {
  const m = modal(`<h3>${title}</h3><form class="f" style="margin-top:14px"><textarea rows="4" required placeholder="${esc(ph)}"></textarea><div class="btns"><button class="btn sm">${t('send_b')}</button><button type="button" class="btn ghost" data-c>${t('cancel')}</button></div></form>`);
  const f = $('form', m);
  f.onsubmit = e => { e.preventDefault(); m.close($('textarea', f).value.trim()); }; $('[data-c]', m).onclick = () => m.close(null);
  return m.result;
}
const busy = async (fn, ok) => { try { await fn(); if (ok) toast(ok); return true; } catch (e) { toast((lang === 'pt' ? 'Erro: ' : 'Error: ') + (e.message || e)); return false; } };

// ---------- router ----------
async function route() {
  stopTimers();
  const h = location.hash.replace(/^#\/?/, '');
  ST.user = DB.user();
  if (h.startsWith('gestao')) {
    if (!ST.user || ST.user.role !== 'staff') { location.hash = '#/'; setTimeout(openLogin, 60); return; }
    return staffRoute(h.split('/').slice(1));
  }
  if (h.startsWith('area')) {
    if (!ST.user) { location.hash = '#/'; setTimeout(openLogin, 60); return; }
    if (ST.user.role === 'staff') { location.hash = '#/gestao'; return; }
    $('#app').innerHTML = `<p style="padding:40px;text-align:center">${t('loading')}</p>`;
    try {
      ST.projects = await DB.listProjects();
      if (!ST.projects.find(p => p.id === ST.pid)) ST.pid = ST.projects[0]?.id;
      ST.B = ST.pid ? await DB.loadBundle(ST.pid) : null;
    } catch (e) { toast(e.message); }
    ST.page = h.split('/')[1] || 'dashboard';
    if (!MENU.some(m => m[0] === ST.page)) ST.page = 'dashboard';
    return renderClient();
  }
  renderPublic();
  if (h) requestAnimationFrame(() => { const el = document.getElementById(h); el && el.scrollIntoView(); });
}
window.addEventListener('hashchange', route);
document.addEventListener('click', e => {
  const l = e.target.closest('a.logo, a.top-logo, .ftr .logo-img'); if (!l) return;
  e.preventDefault();
  if (location.hash === '#/' || location.hash === '' || location.hash === '#') { route(); window.scrollTo(0, 0); }
  else { location.hash = '#/'; window.scrollTo(0, 0); }
});
function setLang(l) { lang = l; try { localStorage.setItem('oce-lang', l); } catch (e) {} const h = location.hash; if (h.startsWith('#/area')) renderClient(); else route(); }
const banner = () => (DB.live ? '' : `<div class="banner">${t('demo_banner')}</div>`);
const homeFor = u => (u.role === 'staff' ? '#/gestao' : '#/area/dashboard');

/* ===================== SITE PÚBLICO ===================== */
const TESTI = [['Patrícia Moura', 'A área de cliente deu-me uma tranquilidade total durante toda a obra.', 'PM'], ['Ricardo & Sofia Almeida', 'Sempre soubemos o estado da obra e quanto custava cada decisão. Zero surpresas.', 'RS'], ['Miguel Tavares', 'Método e transparência raros no setor. Recomendo sem hesitar.', 'MT'], ['Helena Costa', 'As fotografias semanais e o chat direto substituíram dezenas de chamadas.', 'HC']];
const TESTI_EN = ['The client area gave me total peace of mind throughout the project.', 'We always knew the project status and what every decision cost. Zero surprises.', 'Method and transparency that are rare in the industry. I recommend without hesitation.', 'The weekly photos and the direct chat replaced dozens of phone calls.'];

function renderPublic() {
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
  $('#app').innerHTML = `${banner()}
  <header class="hdr"><div class="wrap">
    <a class="logo" href="#/" aria-label="Obras com Evidência">${logo(true)}</a>
    <nav class="nav" id="nav"><a href="#about">${t('nav_about')}</a><a href="#services">${t('nav_services')}</a><a href="#projects">${t('nav_projects')}</a><a href="#contact">${t('nav_contact')}</a></nav>
    <div class="hdr-r"><div class="lang"><button data-l="pt" class="${lang === 'pt' ? 'on' : ''}">PT</button>|<button data-l="en" class="${lang === 'en' ? 'on' : ''}">EN</button></div>
      <button class="btn sm" id="loginBtn" style="font-family:var(--font-serif);font-size:1.05rem">${t('client')}</button><button class="burger" id="burger" aria-label="Menu">${ico('menu', 24)}</button></div></div></header>

  <section class="hero"><div class="wrap">
    <div><h1>${t('hero1')}</h1><p>${t('hero2')}</p><button class="btn" data-login>${t('client')}</button></div>
    <div class="mock" aria-hidden="true">
      <div class="mk-top"><div class="mk-brand"><img src="${LOGO_SRC}" alt=""><span><b>Obras com Evidência</b><small>${t('client').toUpperCase()}</small></span></div><div class="mk-tabs"><u>Dashboard</u><span>${t('clients_tab')}</span></div><i class="mk-av">C</i></div>
      <div class="mk-body">
        <div class="mk-side">${MENU.map(([k, l, ic], i) => `<span class="${i === 0 ? 'on' : ''}">${ico(ic)}<em>${t(l)}</em></span>`).join('')}<div class="mk-user"><i class="mk-av">C</i><em>${t('mock_user')}</em></div><span class="mk-out">${ico('logout')}<em>${t('logout')}</em></span></div>
        <div class="mk-main">
          <h4>${t('mock_hi')}</h4><small>${t('obra')}</small><div class="mk-st"><i></i>${t('running')} · 45%</div>
          <div class="mk-grid">
            <div class="mock-card"><b>${t('prog_obra')}</b><div class="mini-bar big"><b style="width:45%"></b></div><div class="row"><span>${t('next')}</span><span>${t('ph_cov')}</span></div></div>
            <div class="mock-card"><b>${t('last_upd')}</b><div class="row"><span>${ico('image', 12)} ${t('u1')}</span><span>${t('today')}</span></div><div class="row"><span>${ico('calendar', 12)} ${t('u2')}</span><span>${t('yest')}</span></div></div>
          </div>
          <div class="mock-card"><b>${t('sched')}</b>
            <div class="row"><span>${t('ph_dem')}</span><span>100%</span></div><div class="mini-bar"><b style="width:100%"></b></div>
            <div class="row"><span>${t('ph_str')}</span><span>80%</span></div><div class="mini-bar"><b style="width:80%"></b></div>
            <div class="row"><span>${t('ph_net')}</span><span>45%</span></div><div class="mini-bar"><b style="width:45%"></b></div></div>
        </div>
      </div>
    </div>
  </div></section>

  <section class="sec testi" id="testimonials"><div class="wrap"><h2>${t('testi')}</h2><div style="height:30px"></div>
    <div class="carousel"><button class="arrow" id="tPrev" aria-label="‹">‹</button><div class="slide" id="slide"></div><button class="arrow" id="tNext" aria-label="›">›</button></div><div class="dots" id="dots"></div></div></section>

  <section class="sec alt" id="about"><div class="wrap about"><div><span class="eyebrow" style="text-align:left">${t('about_e')}</span><h2>${t('about_t')}</h2><p>${t('about_p1')}</p><p>${t('about_p2')}</p></div>
    <div class="pillars">${[1, 2, 3, 4].map(i => `<div class="pillar"><b>${t('p' + i)}</b><span>${t('p' + i + 's')}</span></div>`).join('')}</div></div></section>

  <section class="sec" id="services"><div class="wrap"><span class="eyebrow">${t('nav_services')}</span><h2>${t('serv_t')}</h2><p class="lead">${t('serv_l')}</p>
    <div class="grid3">${[['home', 1], ['pen', 2], ['check', 3]].map(([i, n]) => `<div class="card"><div class="ico">${ico(i)}</div><h3>${t('s' + n)}</h3><p>${t('s' + n + 'd')}</p></div>`).join('')}</div></div></section>

  <section class="sec alt" id="projects"><div class="wrap"><span class="eyebrow">${t('nav_projects')}</span><h2>${t('proj_t')}</h2><p class="lead">${t('proj_l')}</p>
    <div class="grid3">${[['Moradia em Cascais', 'Cascais · 2024'], ['Apartamento Chiado', 'Lisboa · 2023'], ['Villa Comporta', 'Comporta · 2023']].map(p => `<div class="proj"><div class="img"></div><div class="t"><h3>${p[0]}</h3><span>${p[1]}</span></div></div>`).join('')}</div></div></section>

  <section class="sec" id="contact"><div class="wrap contact"><div><span class="eyebrow" style="text-align:left">${t('nav_contact')}</span><h2>${t('cont_t')}</h2><p style="color:var(--color-text-muted);font-weight:300;font-size:1.1rem">${t('cont_l')}</p>
    <ul><li>${ico('mail', 18)} geral@obrascomevidencia.com</li><li>${ico('phone', 18)} +351 000 000 000</li><li>${ico('pin', 18)} Lisboa, Portugal</li><li>${ico('globe', 18)} www.obrascomevidencia.com</li></ul></div>
    <form class="f" id="quoteForm"><label>${t('name')}<input required name="n"></label><label>${t('email')}<input required type="email" name="e"></label><label>${t('phone')}<input name="p"></label><label>${t('msg')}<textarea rows="4" name="m"></textarea></label><button class="btn" style="justify-self:start">${t('send')}</button></form></div></section>

  <footer class="ftr"><div class="wrap">${logo()}<div>${t('footer')}</div></div></footer>
  <a class="btn float-cta" href="#contact">${t('quote')}</a><div id="bot"></div>`;
  $$('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  $('#loginBtn').onclick = enterArea; $$('[data-login]').forEach(b => b.onclick = enterArea);
  $('#quoteForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast(t('sent')); };
  $('#burger').onclick = () => $('#nav').classList.toggle('open');
  $$('#nav a').forEach(a => a.onclick = () => $('#nav').classList.remove('open'));
  const hdr = $('.hdr'); const onS = () => hdr.classList.toggle('sc', scrollY > 10); onS(); addEventListener('scroll', onS, { passive: true });
  const show = i => {
    ST.testi = (i + TESTI.length) % TESTI.length; const [n, q, ini] = TESTI[ST.testi];
    $('#slide').innerHTML = `<div class="avatar">${ini}</div><q>${lang === 'pt' ? q : TESTI_EN[ST.testi]}</q><cite>${n}</cite>`;
    $('#dots').innerHTML = TESTI.map((_, k) => `<button class="${k === ST.testi ? 'on' : ''}" data-i="${k}" aria-label="${k + 1}"></button>`).join('');
    $$('#dots button').forEach(b => b.onclick = () => { show(+b.dataset.i); auto(); });
  };
  const auto = () => { clearInterval(testiTimer); testiTimer = setInterval(() => ($('#slide') ? show(ST.testi + 1) : clearInterval(testiTimer)), 6000); };
  $('#tPrev').onclick = () => { show(ST.testi - 1); auto(); }; $('#tNext').onclick = () => { show(ST.testi + 1); auto(); };
  show(ST.testi); auto();
  botMount();
}
function enterArea() { const u = DB.user(); if (u) location.hash = homeFor(u); else openLogin(); }
function openLogin() {
  const demo = !DB.live;
  const m = modal(`<h3>${t('login_t')}</h3><p class="sub">${t('login_s')}</p>
    <form class="f" id="loginForm"><label>${t('email')}<input name="u" type="email" required autocomplete="username" value="${demo ? 'cliente@demo.pt' : ''}"></label>
    <label>${t('pass')}<input name="p" type="password" required autocomplete="current-password" value="${demo ? 'demo1234' : ''}"></label>
    <div class="err" id="lerr"></div><button class="btn" style="justify-content:center">${t('enter')}</button></form>
    ${demo ? `<div class="demo-links"><button type="button" id="asStaff">${t('staff_enter')}</button></div><p class="hint">${t('demo')}</p>` : ''}`);
  const f = $('#loginForm', m);
  f.onsubmit = async e => {
    e.preventDefault(); $('#lerr', m).textContent = '';
    try { const u = await DB.signIn(f.u.value.trim(), f.p.value); ST.dock = true; m.close(); const h = homeFor(u); if (location.hash === h) route(); else location.hash = h; }
    catch (er) { $('#lerr', m).textContent = t('login_err') + ' ' + (er.message || ''); }
  };
  if (demo) $('#asStaff', m).onclick = () => { f.u.value = 'equipa@demo.pt'; f.requestSubmit(); };
}


/* ===================== CHATBOT (canto inferior direito) ===================== */
const BOT_RULES = [ // ordem importa: a primeira que corresponder responde
  ['quote', /or[cç]ament|pre[cç]o|quanto|custa|quote|price|cost|budget|estimate/i, 'contact'],
  ['client', /cliente|login|acesso|portal|client|access|sign.?in|dashboard/i, 'login'],
  ['serv', /servi[cç]|remodel|reabilit|design|interior|obra|renov|service|works?/i, null],
  ['contact', /contact|telefone|telem|email|morada|falar|ligar|phone|address|reach|call/i, 'contact']
];
ST.bot = ST.bot || { open: false, msgs: [], busy: false };
function botReply(text) {
  for (const [k, re, act] of BOT_RULES) if (re.test(text)) return { text: t('bot_r_' + k), act };
  return { text: /^(ol[aá]|bom|boa|oi|hello|hi|hey)\b/i.test(text.trim()) ? t('bot_hi') : t('bot_r_default'), act: null };
}
async function botAnswer(text) {
  const url = (window.OCE_CONFIG || {}).CHATBOT_URL;
  if (url) { // endpoint próprio (IA no servidor); em falha, cai nas respostas integradas
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: ST.bot.msgs.slice(-10), lang }) });
      if (r.ok) { const d = await r.json(); if (d && d.reply) return { text: String(d.reply), act: null }; }
    } catch (e) { /* usa respostas integradas */ }
  }
  return botReply(text);
}
function botDraw() {
  const b = ST.bot, root = $('#bot'); if (!root) return;
  const msgs = b.msgs.length ? b.msgs : [{ role: 'bot', text: t('bot_hi') }];
  root.innerHTML = `
  <button class="bot-fab" id="botFab" aria-label="${b.open ? t('bot_close') : t('bot_open')}" aria-expanded="${b.open}" aria-controls="botPanel">${b.open ? ico('x', 22) : ico('chat', 24)}</button>
  <section class="bot-panel ${b.open ? 'open' : ''}" id="botPanel" role="dialog" aria-label="${t('bot_title')}" ${b.open ? '' : 'hidden'}>
    <header><div class="bot-av" aria-hidden="true">E</div><div><b>${t('bot_title')}</b><small>${t('bot_sub')}</small></div><button id="botX" aria-label="${t('bot_close')}">${ico('x', 18)}</button></header>
    <div class="bot-msgs" id="botMsgs" aria-live="polite">${msgs.map(m => `<div class="bot-m ${m.role}">${esc(m.text)}${m.act ? `<button class="bot-act" data-act="${m.act}">${t(m.act === 'login' ? 'bot_a_login' : 'bot_a_contact')}</button>` : ''}</div>`).join('')}${b.busy ? `<div class="bot-m bot typing" aria-label="${t('bot_typing')}"><i></i><i></i><i></i></div>` : ''}</div>
    <div class="bot-chips">${[['bot_c1', 'serv'], ['bot_c2', 'quote'], ['bot_c3', 'client'], ['bot_c4', 'contact']].map(([k, q]) => `<button data-q="${q}">${t(k)}</button>`).join('')}</div>
    <form class="bot-f" id="botF"><input id="botI" type="text" placeholder="${t('bot_ph')}" autocomplete="off" maxlength="300" aria-label="${t('bot_ph')}"><button aria-label="${t('bot_send')}">${ico('send', 18)}</button></form>
  </section>`;
  const box = $('#botMsgs'); box.scrollTop = box.scrollHeight;
  const toggle = o => { b.open = o; botDraw(); if (o) $('#botI').focus(); };
  $('#botFab').onclick = () => toggle(!b.open); $('#botX').onclick = () => toggle(false);
  $('#botPanel').onkeydown = e => { if (e.key === 'Escape') toggle(false); };
  const send = async text => {
    if (!text || b.busy) return; b.msgs = (b.msgs.length ? b.msgs : [{ role: 'bot', text: t('bot_hi') }]).concat({ role: 'user', text }); b.busy = true; botDraw(); $('#botI').focus();
    const [ans] = await Promise.all([botAnswer(text), new Promise(r => setTimeout(r, 550))]);
    b.busy = false; b.msgs.push({ role: 'bot', text: ans.text, act: ans.act }); botDraw(); $('#botI').focus();
  };
  $('#botF').onsubmit = e => { e.preventDefault(); const v = $('#botI').value.trim(); if (v) send(v); };
  $$('.bot-chips button').forEach(c => c.onclick = () => send({ serv: t('bot_c1'), quote: t('bot_c2'), client: t('bot_c3'), contact: t('bot_c4') }[c.dataset.q]));
  $$('.bot-act').forEach(a => a.onclick = () => { if (a.dataset.act === 'login') { toggle(false); openLogin(); } else { toggle(false); const el = document.getElementById('contact'); el && el.scrollIntoView({ behavior: 'smooth' }); } });
}
function botMount() { botDraw(); }

/* ===================== ÁREA DE CLIENTE ===================== */
const MENU = [['dashboard', 'm_dashboard', 'grid'], ['plan', 'm_plan', 'calendar'], ['prog', 'm_prog', 'trend'], ['photos', 'm_photos', 'image'], ['mat', 'm_mat', 'layers'], ['fin', 'm_fin', 'euro'], ['comm', 'm_comm', 'chat'], ['docs', 'm_docs', 'doc'], ['data', 'm_data', 'home']];
const phName = p => p.name || t('ph_' + p.kind);
const stLbl = s => t(s === 'running' ? 'running' : s === 'done' ? 'done' : 'planned');
const gPct = B => (B.phases.length ? Math.round(B.phases.reduce((a, p) => a + p.pct, 0) / B.phases.length) : 0);
const first = s => (s || '').split(' ')[0];
function rel(at) {
  const d = String(at).slice(0, 10), td = U.today();
  if (d === td) return t('today'); if (d === U.addDays(td, -1)) return t('yest'); return dm(d);
}
const head = (title, sub, extra = '') => `<div class="page-h"><div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;
const noteH = () => `<div class="note">${t('val_note')}</div>`;
const barRow = p => { const st = p.status; return `<div class="ph"><div class="n"><span class="chk ${st === 'done' ? 'done' : st === 'running' ? 'run' : ''}">${st === 'done' ? '✓' : st === 'running' ? '●' : ''}</span>${esc(phName(p))}</div><div class="bar ${st === 'planned' ? 's' : ''}"><b style="width:${st === 'planned' ? 30 : p.pct}%"></b></div><div class="v">${st === 'done' ? t('done') : st === 'planned' ? `<span class="tag">${t('planned')}</span>` : p.pct + '%'}</div></div>`; };
const accepted = {};

const PAGES = {
  dashboard(B) {
    const P = B.project, cur = B.phases.find(p => p.status === 'running'), nxt = B.phases.find(p => p.status === 'planned'), g = gPct(B);
    const upd = B.updates.slice(0, 5).map(u => `<li><span class="ic">${ico(u.kind === 'photos' ? 'image' : u.kind === 'schedule' ? 'calendar' : u.kind === 'addendum' ? 'check' : 'bell')}</span>${esc(u.kind === 'photos' ? t('u1') : u.kind === 'schedule' ? t('u2') : u.kind === 'addendum' ? t('u3') : u.text)}<em>${rel(u.at)}</em></li>`).join('');
    return `<div class="page-h"><div><h1 style="font-size:2rem">${lang === 'pt' ? 'Bem-vindo, Sr. ' : 'Welcome, Mr. '}${esc(ST.user.name)}</h1><h1 style="font-size:2rem;margin-top:4px">${esc(tx(P.name))}</h1><div class="status"><span class="dot"></span>${stLbl(P.status)} · ${g}%</div></div>
      <button class="btn ghost" id="contactBtn">${ico('user')} ${t('send_contact')}</button></div>
    <div class="cols"><div class="stack">
      <div class="panel"><h3>${t('prog_obra')}</h3><div class="pbar"><div class="bar"><b style="width:${g}%"></b></div><div class="big">${g}%</div></div>
        <div class="two"><div><small>${t('next')}</small><b>${nxt ? esc(phName(nxt)) : '—'}</b></div><div><small>${t('cur_spec')}</small><b>${cur ? esc(phName(cur)) : '—'}</b></div></div></div>
      <div class="panel"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3>${t('sched')}</h3><a class="link" href="#/area/plan">${t('see_full')} ›</a></div>${B.phases.slice(0, 4).map(barRow).join('') || t('no_items')}</div>${noteH()}</div>
      <div class="panel"><h3>${t('last_upd')}</h3><ul class="upd">${upd || `<li>${t('no_items')}</li>`}</ul></div></div>`;
  },
  plan(B) {
    const P = B.project, ph = B.phases;
    const dates = ph.flatMap(p => [p.ps, p.pe, p.as, p.ae]).filter(Boolean).sort();
    const s0 = P.start || dates[0], e0 = P.end || dates[dates.length - 1] || s0;
    const tot = Math.max(U.diffDays(s0, e0), 1);
    const pos = d => Math.max(0, Math.min(100, (U.diffDays(s0, d) / tot) * 100));
    const months = []; const d0 = new Date(s0 + 'T00:00:00'); let y = d0.getFullYear(), mo = d0.getMonth();
    for (let n = 0; n < 36; n++) { const ds = `${y}-${String(mo + 1).padStart(2, '0')}-01`; if (ds > e0) break; months.push([pos(ds), new Date(y, mo, 1).toLocaleDateString(loc(), { month: 'short' })]); mo++; if (mo > 11) { mo = 0; y++; } }
    const td = U.today(), showToday = td >= s0 && td <= e0;
    return `${head(t('plan_t'), t('plan_s'), `<div class="meta"><div>${t('start')}: <b>${dmy(P.start)}</b></div><div>${t('end')}: <b>${dmy(P.end)}</b></div><div>${t('state')}: ${stLbl(P.status)}</div></div>`)}
    <div class="panel"><div class="legend"><span><i class="sw" style="background:var(--color-success)"></i>${t('done')}</span><span><i class="sw" style="background:var(--color-brand-2)"></i>${t('running')}</span><span><i class="sw" style="background:var(--color-accent-soft)"></i>${t('planned')}</span></div>
    <div class="gantt"><div class="g-in" id="gantt"><div class="g-head"><div></div><div class="g-scale" style="display:block;position:relative;height:26px;border:0">${months.map(([p, l]) => `<span style="position:absolute;left:${p}%;border:0;border-left:1px dashed var(--color-border)">${l}</span>`).join('')}</div></div>
      ${ph.map((p, i) => { const bs = p.as || p.ps, be = p.ae || p.pe; const L = bs ? pos(bs) : 0, W = bs && be ? Math.max(pos(be) - L, 2) : 0; const cls = p.status === 'done' ? 'done' : p.status === 'running' ? 'run' : 'plan';
        return `<div class="g-row"><div class="n"><span class="chk ${p.status === 'done' ? 'done' : p.status === 'running' ? 'run' : ''}">${p.status === 'done' ? '✓' : p.status === 'running' ? '●' : ''}</span>${esc(phName(p))}</div>
        <div class="g-track" style="background:none">${W ? `<div class="g-bar ${cls}" data-i="${i}" tabindex="0" style="left:${L}%;width:${W}%">${dm(bs)} – ${dm(be)}</div>` : ''}${p.pct ? `<span class="g-pct" style="left:${Math.min(L + W + 1, 92)}%">${p.pct}%</span>` : ''}${showToday ? `<div class="g-today" style="left:${pos(td)}%" title="${t('today_l')}"></div>` : ''}</div></div>`; }).join('')}
      <div class="g-tip" id="gtip"></div></div></div></div><div class="note">${t('plan_note')}</div>`;
  },
  prog(B) {
    return `${head(t('prog_t'), t('prog_s'))}<div class="pg">${B.phases.map((p, i) => `<div class="panel sp ${i === 0 ? 'full' : ''}"><header><h3>${esc(phName(p))}</h3>${p.status === 'planned' ? `<span class="tag">${t('planned')}</span>` : `<span class="pc">${p.pct}%</span>`}</header>
      <div class="bar ${p.pct === 100 ? 'g' : p.status === 'planned' ? 's' : ''}"><b style="width:${p.pct}%"></b></div>
      <div class="row"><span>${esc(tx(p.note) || (p.status === 'planned' ? t('d_next') : ''))}</span>${p.validated ? `<span class="ok">${t('approved')}</span>` : ''}</div>
      <a class="link" href="#/area/plan">${t('check_detail')} ›</a></div>`).join('')}</div>${noteH()}`;
  },
  photos(B) {
    const kinds = [['all', t('all')], ...B.phases.map(p => [p.id, phName(p)])];
    const counts = B.phases.map(p => [p, B.photos.filter(x => x.phaseId === p.id).length]).filter(([, n]) => n);
    return `${head(t('ph_t'), t('ph_s').replace('Cascais', tx(B.project.name)), `<button class="btn ghost" id="baBtn">${t('ba')}</button>`)}
    <div class="filters"><div class="seg" id="pf">${kinds.map(([k, l]) => `<button data-k="${k}" class="${ST.pf === k ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>
      <select class="sel" id="ps"><option value="recent" ${ST.ps === 'recent' ? 'selected' : ''}>${t('recent')}</option><option value="old" ${ST.ps === 'old' ? 'selected' : ''}>${t('oldest')}</option></select></div>
    <div class="stats">${counts.map(([p, n]) => `<div class="stat" data-k="${p.id}"><h4>${esc(phName(p))}</h4><span>${n} ${t('photos')}</span></div>`).join('')}</div><div id="pgrid"></div>`;
  },
  mat(B) {
    const cats = { rev: t('ph_cov'), car: t('ph_car'), ban: lang === 'pt' ? 'Bancadas' : 'Countertops', san: lang === 'pt' ? 'Sanitários' : 'Sanitary ware' };
    const items = B.materials.filter(m => m.cat === ST.matTab), rooms = [...new Set(items.map(m => m.room || '—'))];
    const hist = B.materials.filter(m => m.status === 'approved' || m.decided).sort((a, b) => (b.decided || '').localeCompare(a.decided || ''));
    const f = (m, v) => (m.unit === 'm2' ? `€${v}/m²` : eur(v));
    return `${head(t('mat_t'), t('mat_s'))}<div class="mtabs" id="mt">${Object.entries(cats).map(([k, l]) => `<button data-k="${k}" class="${ST.matTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div class="mat-cols"><div>${rooms.map(r => `<div class="room"><button>${esc(tx(r))} <span>${ico('chev', 18)}</span></button>${items.filter(m => (m.room || '—') === r).map(matRow).join('')}</div>`).join('') || `<p class="tag">${t('no_items')}</p>`}</div>
    <div class="panel"><h3>${t('hist_dec')}</h3><ul class="hist">${hist.map(m => { const r = m.real ?? m.budget, d = r - m.budget; return `<li><div>${esc(tx(m.name))}<small>${dmy(m.decided)}</small></div><div class="${d > 0 ? 'over' : 'good'}">${f(m, r)}${d > 0 ? `<small class="over">+ ${f(m, d)}</small>` : ''}</div></li>`; }).join('') || `<li>${t('no_items')}</li>`}</ul>
    <div class="rule"><span>❌ ${t('r1')}</span><span>❌ ${t('r2')}</span><span>✅ ${t('r3')}</span></div></div></div>`;
  },
  fin(B) {
    const base = B.project.base, add = B.addenda.filter(a => a.status === 'approved').reduce((s, a) => s + a.amount, 0), tot = base + add, paid = B.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    return `${head(t('fin_t'), t('fin_s').replace('Cascais', tx(B.project.name)))}
    <div class="kpis"><div class="kpi"><b>${eur(base)}</b><small>${t('k1')}</small></div><div class="kpi"><b style="color:var(--color-text-muted)">${eur(add)}</b><small>${t('k2')}</small></div><div class="kpi"><b>${eur(tot)}</b><small>${t('k3')}</small></div><div class="kpi g"><b>${eur(paid)}</b><small>${t('k4')}</small></div><div class="kpi"><b>${eur(tot - paid)}</b><small>${t('k5')}</small></div></div>
    <div class="panel"><div><h3 style="margin:0">${t('base')}</h3><small class="tag">${t('base_s')}</small></div><table class="tbl"><tr><td>${t('base')}</td><td class="r">${eur(base)}</td><td class="r"><span class="ok">${t('approved')}</span></td></tr></table></div>
    <div class="sec-h"><h3>${t('add_t')}</h3><button class="btn ghost" id="reqBtn">${t('req')}</button></div>
    <div class="panel"><table class="tbl">${B.addenda.map(a => `<tr><td>▸ ${esc(tx(a.desc))}</td><td class="tag">${dmy(a.date)}</td><td class="r">${eur(a.amount)}</td><td class="r">${a.status === 'approved' ? `<span class="ok">${t('approvedF')}</span>` : `<span class="tag">${lang === 'pt' ? 'Pendente' : 'Pending'}</span>`}</td></tr>`).join('') || `<tr><td>${t('no_items')}</td></tr>`}</table></div>
    <div class="sec-h"><h3>${t('hist_f')}</h3></div>
    <div class="panel"><table class="tbl">${B.payments.map(p => `<tr><td>${esc(tx(p.label))}</td><td class="tag">${dmy(p.date)}</td><td class="r">${eur(p.amount)}</td><td class="r">${p.status === 'paid' ? `<span class="ok">${t('paid')}</span>` : `<span class="tag">${lang === 'pt' ? 'Em aberto' : 'Open'}</span>`}</td></tr>`).join('')}
      <tr><td>${t('init_b')}</td><td class="tag">${dmy(B.project.start)}</td><td class="r">${eur(base)}</td><td class="r tag">${ico('doc', 16)} ${t('contract_ok')}</td></tr></table></div>`;
  },
  comm(B) {
    const P = B.project, days = {};
    B.messages.forEach(m => { const d = m.at.slice(0, 10); days[d] = (days[d] || 0) + 1; });
    const ini = (P.mgrName || 'R').split(' ').filter(w => /^[A-ZÁÉÍÓÚ]/.test(w)).slice(-2).map(w => w[0]).join('') || 'R';
    return `${head(t('comm_t'), t('comm_s'))}<div class="chat"><div class="chat-m"><div class="chat-h"><div class="avatar">${esc(ini)}</div><div><b>${esc(tx(P.mgrName) || '—')}</b> – <span class="tag">${esc(tx(P.mgrRole) || t('role'))}</span><small><span class="dot"></span>${t('online')}</small></div></div>
      <div class="msgs" id="msgs">${B.messages.map(chatMsg).join('')}</div>
      <form class="composer" id="cf"><label class="att" title="+"><input type="file" id="cfile" hidden>${ico('clip', 18)}</label><input type="text" id="ci" placeholder="${t('compose')}" autocomplete="off"><button class="btn sm">${ico('send', 18)}</button></form></div>
      <aside class="chat-s"><h3>${t('conv')}</h3><ul>${Object.entries(days).sort().reverse().map(([d, n]) => `<li><div>${dmy(d)}<small>${n} ${t('msgs')}</small></div></li>`).join('')}</ul></aside></div>`;
  },
  docs(B) {
    return `${head(t('docs_t'), t('docs_s'))}<div class="docs">${B.documents.map(d => `<div class="doc"><div class="ic">${esc((d.name.split('.').pop() || 'FILE').toUpperCase().slice(0, 4))}</div><div>${esc(d.name)}<small>${t(d.cat)} · ${d.size ? (d.size / 1048576).toFixed(1) + ' MB' : ''}</small></div><button class="btn ghost" data-doc="${d.id}">${ico('download', 16)} ${t('dl')}</button></div>`).join('') || `<p class="tag">${t('no_items')}</p>`}</div>`;
  },
  data(B) {
    const P = B.project;
    return `${head(t('data_t'), t('data_s'))}<div class="panel"><dl class="dl"><div><dt>${t('cli')}</dt><dd>${esc(P.clientName || ST.user.name)}</dd><dt>${t('addr')}</dt><dd>${esc(tx(P.address) || '—')}</dd><dt>${t('typ')}</dt><dd>${esc(tx(P.name))}</dd></div>
      <div><dt>${t('resp')}</dt><dd>${esc(tx(P.mgrName) || '—')}</dd><dt>${t('area')}</dt><dd>${esc(P.area || '—')}</dd><dt>${t('stt')}</dt><dd>${stLbl(P.status)} · ${gPct(B)}%</dd></div>
      <div><dt>${t('start')}</dt><dd>${dmy(P.start)}</dd><dt>${t('end')}</dt><dd>${dmy(P.end)}</dd></div></dl></div>`;
  }
};
function chatMsg(m) {
  const mine = ST.user && (ST.user.role === 'staff' ? m.staff : !m.staff);
  const hm = new Date(m.at).toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' });
  return `<div class="msg ${mine ? 'me' : ''}"><span class="nm">${esc(tx(m.name) || '')}</span>${esc(tx(m.body) || '')}${m.att ? `<br><a class="att" href="${esc(m.att.url || '#')}" target="_blank" rel="noopener">${ico('clip', 18)} ${esc(m.att.name)}</a>` : ''}<time>${hm}</time></div>`;
}
function matRow(m) {
  const real = m.real ?? m.budget, diff = real - m.budget, over = diff > 0, ok = m.status === 'approved', f = v => (m.unit === 'm2' ? `€${v}/m²` : eur(v));
  const stl = ok ? `<span class="state ap">✓ ${t('approved')}</span>` : m.status === 'selected' ? `<span class="state sel">${t('selected')}</span>` : `<span class="state">${t('analysis')}</span>`;
  const acc = !!accepted[m.id];
  return `<div class="mat"><div class="sw2"></div><div class="bd"><div class="tt">${esc(tx(m.name))}${stl}</div>
    <div class="pv"><span>${t('pvp_b')} <b>${f(m.budget)}</b></span><span>${t('pvp_r')} <b class="${over ? 'over' : ''}">${f(real)}</b></span>${over ? `<span class="balance over">+ ${f(diff)} ${t('over')}</span>` : `<span class="balance good">✓ ${t('within')}</span>`}</div>
    ${!ok && over ? `<div class="warnbox"><div>${ico('alert', 18)} ${t('exceeds')}</div><label><input type="checkbox" data-acc="${m.id}" ${acc ? 'checked' : ''}> ${t('accept')} <b class="over">+${f(diff)}</b> ${t('above')}</label><button class="btn sm" style="justify-self:end" data-ok="${m.id}" ${acc ? '' : 'disabled'}>${t('confirm')}</button></div>` : ''}
    ${!ok && !over ? `<div style="text-align:right"><button class="btn sm" data-ok="${m.id}">${t('confirm')}</button></div>` : ''}</div></div>`;
}

function renderClient() {
  stopTimers(); ST.user = DB.user(); if (!ST.user) return route();
  document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
  const B = ST.B, page = ST.page;
  if (!B) { $('#app').innerHTML = `${banner()}<p style="padding:60px;text-align:center">${t('no_items')} <a class="link" href="#/">←</a></p>`; return; }
  const ini = ST.user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const anim = ST.lastView !== page ? ' enter' : ''; ST.lastView = page;   // animação só quando a página muda
  $('#app').innerHTML = `${banner()}<div class="ca"><aside class="side${ST.dock ? ' open' : ''}" id="side"><a class="logo" href="#/">${logo()}</a>
    <nav class="menu"><button class="dock-toggle" id="dockT" aria-label="Menu" aria-expanded="${ST.dock}"><span class="t-closed">${ico('menu')}</span><span class="t-open">${ico('x')}</span></button>${MENU.map(([k, l, ic]) => `<a href="#/area/${k}" class="${k === page ? 'on' : ''}"><span class="i">${ico(ic)}</span><span class="lbl">${t(l)}</span></a>`).join('')}
      <div class="user"><div class="avatar">${esc(ini)}</div><span class="uname">${esc(first(ST.user.name))}<br>${esc(ST.user.name.split(' ').slice(1).join(' '))}</span><button id="logout" aria-label="${t('logout')}">${ico('logout')}<span class="lbl">${t('logout')}</span></button></div></nav></aside>
    <main class="main"><div class="topbar"><div style="display:flex;align-items:center"><button class="mburger" id="mb" aria-label="Menu">${ico('menu', 24)}</button><a class="top-logo" href="#/">${logo(true)}</a><div class="top-title"><b>Obras com Evidência</b><small>${t('client')}</small></div><div class="tabs"><span class="on">Dashboard</span><span>${t('clients_tab')}</span>${ST.projects.length > 1 ? `<select id="pSel" class="sel" style="margin-left:16px">${ST.projects.map(p => `<option value="${p.id}" ${p.id === ST.pid ? 'selected' : ''}>${esc(tx(p.name))}</option>`).join('')}</select>` : ''}</div></div>
      <div class="top-r"><div class="lang"><button data-l="pt" class="${lang === 'pt' ? 'on' : ''}">PT</button>/<button data-l="en" class="${lang === 'en' ? 'on' : ''}">EN</button></div><div class="avatar">${esc(ini)}</div></div></div>
      <div class="view${anim}">${PAGES[page](B)}</div></main></div>`;
  $('#logout').onclick = async () => { await DB.signOut(); ST.B = null; location.hash = '#/'; route(); };
  $$('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  $('#mb').onclick = () => $('#side').classList.toggle('open');
  { const dt = $('#dockT'), sd = $('#side'), mob = () => matchMedia('(max-width:980px)').matches, setDock = o => { ST.dock = o; sd.classList.toggle('open', o); dt.setAttribute('aria-expanded', o); };
    dt.onclick = e => { e.stopPropagation(); setDock(!sd.classList.contains('open')); };
    $('.main').addEventListener('click', () => { if (mob()) setDock(false); });            // no telemóvel, tocar fora fecha
    $$('.menu a').forEach(a => a.addEventListener('click', () => { if (mob()) setDock(false); })); }
  const ps = $('#pSel'); if (ps) ps.onchange = async () => { ST.pid = ps.value; ST.B = await DB.loadBundle(ST.pid); renderClient(); };
  const dk = $('.menu'), da = $('.menu a.on'); /* dockScroll */ if (dk && da) dk.scrollTop = da.offsetTop - dk.clientHeight / 2 + da.offsetHeight / 2;
  (BIND[page] || (() => {}))(B); scrollTo(0, 0);
}
const reload = async () => { ST.B = await DB.loadBundle(ST.pid); renderClient(); };

const BIND = {
  dashboard() { $('#contactBtn').onclick = () => { location.hash = '#/area/comm'; }; },
  plan(B) {
    const tip = $('#gtip'), box = $('#gantt');
    $$('.g-bar', box).forEach(b => {
      const p = B.phases[+b.dataset.i];
      const show = () => { tip.innerHTML = `<div><span>${t('expected')}:</span><b>${dm(p.ps)} – ${dm(p.pe)}</b></div><div><span>${t('actual')}:</span><b>${p.as ? dm(p.as) : '—'} – ${p.ae ? dm(p.ae) : '—'}</b></div><div><span>${stLbl(p.status)}:</span><b>${p.pct}%</b></div>${p.note ? `<div style="color:var(--color-text-muted)">${esc(p.note)}</div>` : ''}`;
        const r = b.getBoundingClientRect(), br = box.getBoundingClientRect(); tip.style.display = 'block'; tip.style.left = Math.max(0, Math.min(r.left - br.left + 20, br.width - 230)) + 'px'; tip.style.top = (r.bottom - br.top + 6) + 'px'; };
      b.onmouseenter = b.onfocus = show; b.onmouseleave = b.onblur = () => (tip.style.display = 'none');
    });
  },
  photos(B) {
    const draw = () => {
      const L = B.photos.filter(p => ST.pf === 'all' || p.phaseId === ST.pf).sort((a, b) => (ST.ps === 'recent' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
      const wk = U.addDays(U.today(), -7), recent = L.filter(p => p.date >= wk), rest = L.filter(p => p.date < wk);
      const card = p => { const ph = B.phases.find(x => x.id === p.phaseId);
        return `<div class="photo"><div class="im ${p.cls || ''}">${p.url ? `<img loading="lazy" src="${esc(p.url)}" alt="">` : ''}<span class="c">${ico('chat', 14)} ${p.comments.length}</span></div><div class="b"><div class="cap"><span>${esc(ph ? phName(ph) : '')}</span><span class="tag">${dm(p.date)}</span></div>${p.caption ? `<div class="tag">${esc(p.caption)}</div>` : ''}
        <ul class="cl">${p.comments.map(c => `<li><b>${esc(tx(c.author))}:</b> ${esc(tx(c.body))}</li>`).join('')}</ul><form class="cm" data-id="${p.id}"><input placeholder="${t('add_cm')}" aria-label="${t('add_cm')}"><button>${ico('send', 18)}</button></form></div></div>`; };
      const sec = (title, arr) => (arr.length ? `<h3 style="font-size:1.5rem;margin:6px 0 14px">${title}</h3><div class="ph-grid" style="margin-bottom:26px">${arr.map(card).join('')}</div>` : '');
      $('#pgrid').innerHTML = (sec(t('week_sec'), recent) + sec(t('all_sec'), rest)) || `<p class="tag">${t('no_photos')}</p>`;
      $$('.cm').forEach(f => f.onsubmit = async e => { e.preventDefault(); const v = f.firstElementChild.value.trim(); if (!v) return;
        const ok = await busy(async () => { const c = await DB.addComment(ST.pid, f.dataset.id, v); const ph = B.photos.find(x => x.id === f.dataset.id); if (!ph.comments.find(x => x.id === c.id)) ph.comments.push(c); }); if (ok) draw(); });
      $$('#pf button').forEach(b => b.classList.toggle('on', b.dataset.k === ST.pf));
    };
    $$('#pf button').forEach(b => b.onclick = () => { ST.pf = b.dataset.k; draw(); });
    $$('.stat').forEach(s => s.onclick = () => { ST.pf = s.dataset.k; draw(); });
    $('#ps').onchange = e => { ST.ps = e.target.value; draw(); };
    $('#baBtn').onclick = () => {
      const L = B.photos.filter(p => ST.pf === 'all' || p.phaseId === ST.pf).sort((a, b) => a.date.localeCompare(b.date));
      if (L.length < 2) return toast(t('ba_need'));
      const fig = (p, l) => `<figure><div class="im ${p.cls || ''}">${p.url ? `<img src="${esc(p.url)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ''}</div><figcaption>${l} · ${dmy(p.date)}</figcaption></figure>`;
      modal(`<h3>${t('ba')}</h3><div class="ba">${fig(L[0], t('before'))}${fig(L[L.length - 1], t('after'))}</div>`, true);
    };
    draw();
  },
  mat() {
    $$('#mt button').forEach(b => b.onclick = () => { ST.matTab = b.dataset.k; renderClient(); });
    $$('[data-acc]').forEach(c => c.onchange = () => { accepted[c.dataset.acc] = c.checked; renderClient(); });
    $$('[data-ok]').forEach(b => b.onclick = async () => { const id = b.dataset.ok; if (await busy(() => DB.confirmMaterial(ST.pid, id, !!accepted[id]), t('confirmed'))) reload(); });
  },
  fin() { $('#reqBtn').onclick = async () => { const v = await ask(t('req_title'), t('req_ph')); if (v) busy(() => DB.requestChange(ST.pid, v), t('req_ok')); }; },
  comm(B) {
    const box = $('#msgs'); box.scrollTop = box.scrollHeight;
    const send = async (body, file) => { const m = await DB.sendMessage(ST.pid, body, file); if (!B.messages.find(x => x.id === m.id)) B.messages.push(m); box.innerHTML = B.messages.map(chatMsg).join(''); box.scrollTop = box.scrollHeight; };
    $('#cf').onsubmit = e => { e.preventDefault(); const i = $('#ci'), v = i.value.trim(); if (!v) return; i.value = ''; busy(() => send(v)); };
    $('#cfile').onchange = e => { const f = e.target.files[0]; if (f) busy(() => send('', f), t('attach_ok')); };
    ST.timer = setInterval(async () => { try { const nb = await DB.loadBundle(ST.pid); if (nb.messages.length !== B.messages.length && $('#msgs')) { B.messages = nb.messages; box.innerHTML = B.messages.map(chatMsg).join(''); box.scrollTop = box.scrollHeight; } } catch (e) {} }, 8000);
  },
  docs(B) { $$('[data-doc]').forEach(b => b.onclick = async () => { const d = B.documents.find(x => x.id === b.dataset.doc); try { const u = await DB.docUrl(d); if (u && u !== '#') window.open(u, '_blank', 'noopener'); else toast(t('dl_ok')); } catch (e) { toast(e.message); } }); }
};

/* ===================== PAINEL DA EQUIPA (PT) ===================== */
const fld = (label, name, val = '', type = 'text', extra = '') => `<label>${label}<input name="${name}" type="${type}" value="${esc(val)}" ${extra}></label>`;
const sel = (label, name, opts, val) => `<label>${label}<select name="${name}">${opts.map(([v, l]) => `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
const STAT = [['planned', 'Planeado'], ['running', 'Em execução'], ['done', 'Concluído']];
const CATS = [['rev', 'Revestimentos'], ['car', 'Carpintarias'], ['ban', 'Bancadas'], ['san', 'Sanitários']];
const DOCCATS = [['d1', 'Contrato'], ['d2', 'Orçamentos'], ['d3', 'Projetos'], ['d4', 'Licenças']];
const STABS = [['fases', 'Fases e cronograma'], ['fotos', 'Fotografias'], ['mat', 'Materiais'], ['fin', 'Financeiro'], ['docs', 'Documentos'], ['msg', 'Mensagens'], ['ped', 'Pedidos'], ['dados', 'Dados da obra']];

async function staffRoute(parts) {
  $('#app').innerHTML = `<p style="padding:40px;text-align:center">${t('loading')}</p>`;
  try { ST.projects = await DB.listProjects(); } catch (e) { toast(e.message); }
  const [a, tab] = parts;
  if (a && a !== 'nova') { ST.pid = a; ST.tab = tab || 'fases'; try { ST.B = await DB.loadBundle(a); } catch (e) { toast(e.message); ST.B = null; } }
  staffRender(a || 'lista');
}
function staffShell(inner, active) {
  const ini = ST.user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const vk = active + '/' + ST.tab, anim = ST.lastStaff !== vk ? ' enter' : ''; ST.lastStaff = vk;
  return `${banner()}<div class="ca st"><aside class="side${ST.dock ? ' open' : ''}" id="side"><a class="logo" href="#/">${logo()}</a><nav class="menu"><button class="dock-toggle" id="dockT" aria-label="Menu" aria-expanded="${ST.dock}"><span class="t-closed">${ico('menu')}</span><span class="t-open">${ico('x')}</span></button>
    <a href="#/gestao" class="${active !== 'nova' ? 'on' : ''}"><span class="i">${ico('grid')}</span><span class="lbl">Obras</span></a><a href="#/gestao/nova" class="${active === 'nova' ? 'on' : ''}"><span class="i">${ico('plus')}</span><span class="lbl">Nova obra / cliente</span></a>
    <div class="user"><div class="avatar">${esc(ini)}</div><span class="uname">Equipa<br>técnica</span><button id="logout" aria-label="Sair">${ico('logout')}<span class="lbl">Sair</span></button></div></nav></aside>
    <main class="main"><div class="topbar"><div style="display:flex;align-items:center"><button class="mburger" id="mb">${ico('menu', 24)}</button><a class="top-logo" href="#/">${logo(true)}</a><div class="top-title"><b>Obras com Evidência</b><small>Painel da equipa</small></div><div class="tabs"><span class="on">Painel da equipa</span></div></div><div class="top-r"><span class="tag">${esc(ST.user.name)}</span></div></div><div class="view${anim}">${inner}</div></main></div>`;
}
function staffRender(a) {
  document.documentElement.lang = 'pt-PT';
  let inner = '';
  if (a === 'lista') inner = `<div class="page-h"><div><h1>Obras</h1><p>Todas as obras e clientes.</p></div><a class="btn" href="#/gestao/nova">＋ Nova obra</a></div><div class="plist">${ST.projects.map(p => `<a class="pcard" href="#/gestao/${p.id}"><div><b>${esc(p.name)}</b><small>${esc(p.address || '')}</small></div><div><small>Cliente</small>${esc(p.clientName)}</div><div><small>Estado</small>${stLbl(p.status)}</div><span class="link">Abrir ›</span></a>`).join('') || '<p class="tag">Ainda não há obras. Crie a primeira.</p>'}</div>`;
  else if (a === 'nova') inner = `<div class="page-h"><div><h1>Nova obra e cliente</h1><p>Cria o login do cliente e a obra com as 6 fases standard.</p></div></div><form class="f panel" data-act="novo"><div class="fgrid">
      ${fld('Nome do cliente', 'clientName', '', 'text', 'required')}${fld('Email (login)', 'email', '', 'email', 'required')}${fld('Palavra-passe inicial', 'password', '', 'text', 'required minlength="6"')}
      ${fld('Nome da obra', 'name', '', 'text', 'required')}${fld('Morada da obra', 'address')}${fld('Área de intervenção', 'area')}${fld('Início', 'start', U.today(), 'date', 'required')}${fld('Conclusão prevista', 'end', U.addDays(U.today(), 120), 'date', 'required')}${fld('Orçamento base (€)', 'base', '', 'number', 'min="0" step="0.01"')}${fld('Responsável de obra', 'mgrName')}</div>
      <p class="hint2">O cliente entra com este email e palavra-passe. Peça-lhe que a altere depois.</p><button class="btn" style="justify-self:start">Criar obra e cliente</button></form>`;
  else if (ST.B) inner = staffProject();
  else inner = '<p class="tag">Obra não encontrada.</p>';
  $('#app').innerHTML = staffShell(inner, a);
  $('#logout').onclick = async () => { await DB.signOut(); location.hash = '#/'; route(); };
  $('#mb').onclick = () => $('#side').classList.toggle('open');
  { const dt = $('#dockT'), sd = $('#side'), mob = () => matchMedia('(max-width:980px)').matches, setDock = o => { ST.dock = o; sd.classList.toggle('open', o); dt.setAttribute('aria-expanded', o); };
    dt.onclick = e => { e.stopPropagation(); setDock(!sd.classList.contains('open')); };
    $('.main').addEventListener('click', () => { if (mob()) setDock(false); }); $$('.menu a').forEach(a => a.addEventListener('click', () => { if (mob()) setDock(false); })); }
  bindStaff();
}
function staffProject() {
  const B = ST.B, P = B.project, tab = ST.tab;
  const body = STAFF[tab] ? STAFF[tab](B) : '';
  return `<div class="page-h"><div><h1>${esc(P.name)}</h1><p>${esc(P.clientName)} · ${stLbl(P.status)} · ${gPct(B)}%</p></div><a class="btn ghost" href="#/gestao">← Obras</a></div>
  <div class="stbar">${STABS.map(([k, l]) => `<a href="#/gestao/${ST.pid}/${k}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</div>${body}`;
}
const btns = del => `<div class="btns"><button class="btn sm">Guardar</button>${del ? `<button type="button" class="btn sm danger" data-del="${del}">Apagar</button>` : ''}</div>`;
const STAFF = {
  fases(B) {
    return `<div class="panel" style="margin-bottom:20px"><h3>Publicar atualização</h3><form class="f" data-act="update"><textarea name="text" rows="2" required placeholder="Ex.: Concluída a instalação elétrica do piso 1."></textarea><button class="btn sm" style="justify-self:start">Publicar no dashboard do cliente</button></form></div>
    ${B.phases.map(p => `<form class="f row-card" data-act="phase" data-id="${p.id}"><h4>${esc(phName(p))}</h4><div class="fgrid">
      ${sel('Estado', 'status', STAT, p.status)}${fld('Execução (%)', 'pct', p.pct, 'number', 'min="0" max="100"')}${fld('Previsto: início', 'ps', p.ps || '', 'date')}${fld('Previsto: fim', 'pe', p.pe || '', 'date')}${fld('Real: início', 'as', p.as || '', 'date')}${fld('Real: fim', 'ae', p.ae || '', 'date')}
      <label class="wide2">Nota para o cliente<input name="note" value="${esc(p.note)}"></label><label class="chkl"><input type="checkbox" name="validated" ${p.validated ? 'checked' : ''}> Validação de qualidade (V verde)</label></div>${btns()}</form>`).join('')}`;
  },
  fotos(B) {
    return `<form class="f panel" data-act="photo"><h3>Carregar fotografias</h3><div class="fgrid">${fld('Ficheiros', 'files', '', 'file', 'multiple accept="image/*" required')}${sel('Especialidade', 'phaseId', B.phases.map(p => [p.id, phName(p)]), '')}${fld('Data', 'date', U.today(), 'date')}${fld('Legenda (opcional)', 'caption')}</div><button class="btn sm" style="justify-self:start">Carregar</button></form>
    <div class="sgal">${B.photos.map(p => `<div class="photo"><div class="im ${p.cls || ''}" style="position:relative">${p.url ? `<img src="${esc(p.url)}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ''}</div><div class="b"><div class="cap"><span>${esc(phName(B.phases.find(x => x.id === p.phaseId) || { kind: 'custom' }))}</span><span class="tag">${dm(p.date)}</span></div><button class="btn sm danger" data-del="photo:${p.id}">Apagar</button></div></div>`).join('')}</div>`;
  },
  mat(B) {
    const row = m => `<form class="f row-card" data-act="mat" data-id="${m?.id || ''}"><h4>${m ? esc(m.name) : 'Novo material'}</h4><div class="fgrid">${fld('Nome', 'name', m?.name || '', 'text', 'required')}${fld('Divisão (Cozinha, WC…)', 'room', m?.room || '')}${sel('Especialidade', 'cat', CATS, m?.cat || 'rev')}${sel('Unidade', 'unit', [['m2', '€/m²'], ['un', '€ (total)']], m?.unit || 'm2')}
      ${fld('PVP orçamentado', 'budget', m?.budget ?? '', 'number', 'step="0.01" required')}${fld('PVP real selecionado', 'real', m?.real ?? '', 'number', 'step="0.01"')}${sel('Estado', 'status', [['analysis', 'Em análise'], ['selected', 'Selecionado'], ['approved', 'Aprovado']], m?.status || 'analysis')}</div>
      ${m ? `<div class="hint2">${m.accepted ? '✔ Cliente aceitou o acréscimo' : ''}</div>` : ''}${btns(m ? 'mat:' + m.id : '')}</form>`;
    return `${row(null)}${B.materials.map(row).join('')}`;
  },
  fin(B) {
    const arow = a => `<form class="f row-card" data-act="add" data-id="${a?.id || ''}"><div class="fgrid">${fld('Descrição', 'desc', a?.desc || '', 'text', 'required')}${fld('Data', 'date', a?.date || U.today(), 'date')}${fld('Valor (€)', 'amount', a?.amount ?? '', 'number', 'step="0.01" required')}${sel('Estado', 'status', [['pending', 'Pendente'], ['approved', 'Aprovada']], a?.status || 'pending')}</div>${btns()}</form>`;
    const prow = a => `<form class="f row-card" data-act="pay" data-id="${a?.id || ''}"><div class="fgrid">${fld('Descrição (ex.: Fatura 018)', 'label', a?.label || '', 'text', 'required')}${fld('Data', 'date', a?.date || U.today(), 'date')}${fld('Valor (€)', 'amount', a?.amount ?? '', 'number', 'step="0.01" required')}${sel('Estado', 'status', [['paid', 'Pago'], ['open', 'Em aberto']], a?.status || 'paid')}</div>${btns()}</form>`;
    return `<form class="f panel" data-act="base" style="margin-bottom:20px"><h3>Orçamento base</h3><div class="fgrid">${fld('Valor (€)', 'base', B.project.base, 'number', 'step="0.01" min="0"')}</div><button class="btn sm" style="justify-self:start">Guardar</button></form>
      <h3 style="font-size:1.4rem;margin:18px 0 10px">Adendas / trabalhos adicionais</h3>${arow(null)}${B.addenda.map(arow).join('')}
      <h3 style="font-size:1.4rem;margin:18px 0 10px">Pagamentos</h3>${prow(null)}${B.payments.map(prow).join('')}`;
  },
  docs(B) {
    return `<form class="f panel" data-act="doc"><h3>Carregar documento</h3><div class="fgrid">${sel('Tipo', 'cat', DOCCATS, 'd3')}${fld('Ficheiro', 'file', '', 'file', 'required')}</div><button class="btn sm" style="justify-self:start">Carregar</button></form>
    <div class="docs" style="margin-top:16px">${B.documents.map(d => `<div class="doc"><div class="ic">${esc((d.name.split('.').pop() || '').toUpperCase().slice(0, 4))}</div><div>${esc(d.name)}<small>${t(d.cat)}</small></div><button class="btn ghost" data-doc="${d.id}">Abrir</button><button class="btn sm danger" data-del="doc:${d.id}">Apagar</button></div>`).join('')}</div>`;
  },
  msg(B) {
    return `<div class="chat" style="grid-template-columns:1fr"><div class="chat-m"><div class="msgs" id="smsgs" style="min-height:360px">${B.messages.map(chatMsg).join('') || '<p class="tag">Sem mensagens.</p>'}</div><form class="composer" id="scf"><label class="att"><input type="file" id="sfile" hidden>${ico('clip', 18)}</label><input type="text" id="sci" placeholder="Responder ao cliente…" autocomplete="off"><button class="btn sm">${ico('send', 18)}</button></form></div></div>`;
  },
  ped(B) {
    return `<div class="panel"><h3>Pedidos de alteração do cliente</h3><ul class="hist">${B.requests.map(r => `<li><div>${esc(r.body)}<small>${dmy(String(r.at).slice(0, 10))}</small></div></li>`).join('') || '<li>Sem pedidos.</li>'}</ul></div>`;
  },
  dados(B) {
    const P = B.project;
    return `<form class="f panel" data-act="proj"><div class="fgrid">${fld('Nome da obra', 'name', P.name, 'text', 'required')}${fld('Morada', 'address', P.address || '')}${fld('Área', 'area', P.area || '')}${fld('Responsável de obra', 'mgrName', P.mgrName || '')}${fld('Início', 'start', P.start || '', 'date')}${fld('Conclusão prevista', 'end', P.end || '', 'date')}${sel('Estado da obra', 'status', STAT, P.status)}</div><button class="btn sm" style="justify-self:start">Guardar</button></form>`;
  }
};
async function mut(fn, ok = 'Guardado.') {
  if (!(await busy(fn, ok))) return;
  try { ST.B = await DB.loadBundle(ST.pid); } catch (e) { toast(e.message); }
  staffRender(ST.pid);
}
const numOrNull = v => (v === '' || v == null ? null : +v);
const ACT = {
  async novo(fd) { let p; if (await busy(async () => { p = await DB.createClientProject(fd); }, 'Obra e cliente criados.')) location.hash = '#/gestao/' + p.id; },
  update: fd => mut(() => DB.addUpdate(ST.pid, 'custom', fd.text), 'Atualização publicada.'),
  phase: (fd, f) => mut(() => { const old = ST.B.phases.find(x => x.id === f.dataset.id); return DB.savePhase(ST.pid, { ...old, ...fd, id: old.id, pct: +fd.pct || 0, validated: f.validated.checked, ps: fd.ps || null, pe: fd.pe || null, as: fd.as || null, ae: fd.ae || null }).then(() => DB.addUpdate(ST.pid, 'schedule', '')); }),
  photo: (fd, f) => mut(async () => { const files = [...f.files.files]; for (const file of files) await DB.addPhoto(ST.pid, fd.phaseId, file, fd.caption, fd.date); await DB.addUpdate(ST.pid, 'photos', ''); }, 'Fotografias carregadas.'),
  mat: (fd, f) => mut(() => DB.saveMaterial(ST.pid, { id: f.dataset.id || undefined, name: fd.name, room: fd.room, cat: fd.cat, unit: fd.unit, budget: +fd.budget, real: numOrNull(fd.real), status: fd.status })),
  add: (fd, f) => mut(async () => { await DB.saveAddendum(ST.pid, { id: f.dataset.id || undefined, desc: fd.desc, date: fd.date, amount: +fd.amount, status: fd.status }); if (fd.status === 'approved') await DB.addUpdate(ST.pid, 'addendum', ''); }),
  pay: (fd, f) => mut(() => DB.savePayment(ST.pid, { id: f.dataset.id || undefined, label: fd.label, date: fd.date, amount: +fd.amount, status: fd.status })),
  base: fd => mut(() => DB.saveProject(ST.pid, { ...ST.B.project, base: +fd.base || 0 })),
  proj: fd => mut(() => DB.saveProject(ST.pid, { ...ST.B.project, ...fd })),
  doc: (fd, f) => mut(() => DB.addDocument(ST.pid, fd.cat, f.file.files[0]), 'Documento carregado.')
};
function bindStaff() {
  $$('form[data-act]').forEach(f => f.onsubmit = e => { e.preventDefault(); ACT[f.dataset.act](Object.fromEntries(new FormData(f)), f); });
  $$('[data-del]').forEach(b => b.onclick = () => {
    const [k, id] = b.dataset.del.split(':'); if (!confirm('Apagar este item?')) return; const B = ST.B;
    mut(() => (k === 'photo' ? DB.deletePhoto(ST.pid, id, B.photos.find(x => x.id === id)?.path) : k === 'mat' ? DB.deleteMaterial(ST.pid, id) : DB.deleteDocument(ST.pid, id, B.documents.find(x => x.id === id)?.path)), 'Apagado.');
  });
  $$('[data-doc]').forEach(b => b.onclick = async () => { const d = ST.B.documents.find(x => x.id === b.dataset.doc); try { const u = await DB.docUrl(d); if (u && u !== '#') window.open(u, '_blank', 'noopener'); } catch (e) { toast(e.message); } });
  const cf = $('#scf'); if (cf) {
    const box = $('#smsgs'); box.scrollTop = box.scrollHeight;
    const send = async (body, file) => { await DB.sendMessage(ST.pid, body, file); ST.B = await DB.loadBundle(ST.pid); box.innerHTML = ST.B.messages.map(chatMsg).join(''); box.scrollTop = box.scrollHeight; };
    cf.onsubmit = e => { e.preventDefault(); const i = $('#sci'), v = i.value.trim(); if (!v) return; i.value = ''; busy(() => send(v)); };
    $('#sfile').onchange = e => { const f = e.target.files[0]; if (f) busy(() => send('', f), 'Anexo enviado.'); };
  }
}

/* ===================== arranque ===================== */
(async function boot() {
  $('#app').innerHTML = `<p style="padding:60px;text-align:center;font-family:var(--font-serif);font-size:1.4rem">${t('loading')}</p>`;
  try { await DB.init(); } catch (e) { toast(e.message); }
  route();
})();
