'use strict';
/* Obras com Evidência — website + Área de Cliente (demo estática, sem backend) */

// ---------- i18n ----------
const I18N = {
  pt: {
    nav_about:'Sobre Nós', nav_services:'Os Nossos Serviços', nav_projects:'Projetos', nav_contact:'Contactos', client:'Área de Cliente',
    hero1:'Trabalhar connosco é ter uma Área de Cliente.', hero2:'Acompanhe a sua obra em tempo real, com planeamento, progresso e total transparência.',
    testi:'Opiniões dos Clientes', quote:'Pedir Orçamento',
    about_t:'Método, confiança e transparência', about_e:'Sobre Nós',
    about_p1:'Somos uma empresa de construção e design que acompanha cada obra de forma estruturada, do planeamento à fase final, em modelo chave-na-mão.',
    about_p2:'Pensado para clientes exigentes, o nosso processo dispensa o contacto constante: tudo fica documentado, visível e organizado na sua Área de Cliente.',
    p1:'Confiança', p1s:'Compromisso em cada fase', p2:'Método', p2s:'Processos estruturados', p3:'Transparência', p3s:'Valores e prazos claros', p4:'Chave-na-mão', p4s:'Acompanhamento total',
    serv_t:'Os Nossos Serviços', serv_l:'Da primeira demolição ao último acabamento, uma equipa, um método.',
    s1:'Remodelações Integrais', s1d:'Gestão completa de obra: demolições, estrutura, redes técnicas, revestimentos, carpintarias e acabamentos.',
    s2:'Design & Interiores', s2d:'Projeto e seleção de materiais com teto de PVP definido, para decisões informadas e sem surpresas.',
    s3:'Gestão e Fiscalização', s3d:'Direção de obra, validação técnica por especialidade e controlo financeiro rigoroso.',
    proj_t:'Projetos', proj_l:'Uma seleção de obras recentes.',
    cont_t:'Contactos', cont_l:'Fale connosco e peça um orçamento sem compromisso.', name:'Nome', email:'Email', phone:'Telefone', msg:'Mensagem', send:'Enviar pedido', sent:'Pedido enviado. Entraremos em contacto brevemente.',
    login_t:'Área de Cliente', login_s:'Aceda à sua obra com o seu login individual.', user:'Utilizador', pass:'Palavra-passe', enter:'Entrar', demo:'Demonstração: qualquer dados funcionam.',
    welcome:'Bem-vindo, Sr. Álvaro Fernandes', logout:'Sair',
    m_dashboard:'Dashboard', m_plan:'Planeamento', m_prog:'Progresso', m_photos:'Fotografias', m_mat:'Materiais', m_fin:'Financeiro', m_comm:'Comunicação', m_docs:'Documentos', m_data:'Dados da Obra',
    obra:'Moradia em Cascais', running:'Em execução', done:'Concluído', planned:'Planeado', approved:'Aprovado', approvedF:'Aprovada', paid:'Pago',
    send_contact:'Enviar contacto', prog_obra:'Progresso da Obra', next:'Próxima Etapa', cur_spec:'Especialidade em curso', sched:'Cronograma', see_full:'Ver detalhe completo',
    last_upd:'Últimas Atualizações', u1:'Fotografias atualizadas', u2:'Cronograma ajustado', u3:'Adenda aprovada', today:'hoje', yest:'ontem', may2:'2 de maio',
    val_note:'A validação técnica garante que os trabalhos cumpriram os padrões de qualidade.',
    ph_dem:'Demolições', ph_str:'Estrutura / BETÃO / Aço', ph_net:'Redes Técnicas', ph_cov:'Revestimentos', ph_car:'Carpintarias', ph_fin:'Acabamentos',
    plan_t:'Planeamento da Obra', plan_s:'Cronograma técnico com acompanhamento em tempo real.', start:'Data de Início', end:'Conclusão Prevista', state:'Estado',
    expected:'Previsto', actual:'Atual', exec:'Em execução', plan_note:'Cronograma atualizado semanalmente pela equipa técnica.', today_l:'Hoje',
    prog_t:'Progresso por Especialidade', prog_s:'Evolução e validação das principais especialidades.', check_detail:'Verificar detalhe completo',
    d_dem:'Demolição concluída.', d_str:'Estrutura validada pela equipa técnica.', d_net:'Trabalhos em andamento conforme planeado.', d_next:'A iniciar brevemente.',
    ph_t:'Fotografias', ph_s:'Evolução visual detalhada da obra em Cascais.', ba:'Ver comparação Antes/Depois', all:'Todas', all_dates:'Todas as datas', recent:'Mais recentes', oldest:'Mais antigas',
    week:'Atualização desta semana', add_cm:'Adicionar comentário…', photos:'fotos', ba_msg:'Comparação Antes/Depois disponível quando a fase estiver concluída.',
    mat_t:'Materiais', mat_s:'Seleção e aprovação de acabamentos para a sua obra.', kitchen:'Cozinha', bath:'Casas de Banho', living:'Sala',
    analysis:'Em análise', selected:'Selecionado', pvp_b:'PVP orçamentado', pvp_r:'PVP real selecionado', exceeds:'Este material excede o PVP orçamentado.', accept:'Aceito o acréscimo de', above:'acima do PVP orçamentado',
    confirm:'Confirmar', within:'dentro do PVP', over:'excede o PVP', hist_dec:'Histórico das Decisões', confirmed:'Escolha confirmada.',
    r1:'Sem estimativas globais', r2:'Sem valores intermédios confusos', r3:'Apenas valores claros por material',
    fin_t:'Financeiro', fin_s:'Gestão financeira detalhada da obra em Cascais.', k1:'Orçamento Inicial', k2:'Adendas Aprovadas', k3:'Valor Total Atual', k4:'Valor Pago', k5:'Valor em Aberto',
    base:'Orçamento Base', base_s:'Contrato inicial aprovado em 8 de janeiro de 2024', detail:'Ver detalhe', add_t:'Adendas / Trabalhos Adicionais', req:'Solicitar alteração / novo pedido', req_ok:'Pedido enviado à equipa técnica.',
    hist_f:'Histórico Financeiro', contract_ok:'Contrato aprovado', invoice:'Fatura', init_b:'Orçamento Inicial',
    a1:'Isolamento acústico adicional', a2:'Mais tomadas e pontos de luz', a3:'Fornecimento e instalação de novo móvel de casa de banho', a4:'Reforço estrutural da parede entre sala e cozinha',
    comm_t:'Comunicação', comm_s:'Comunicação direta com o responsável de obra.', online:'Online', role:'Direção de Obra', conv:'Histórico de Conversas', msgs:'mensagens', compose:'Enviar uma fotografia, documento ou mensagem…',
    c1:'Dúvidas sobre materiais', c2:'Planeamento da estrutura', c3:'Projeto redes técnicas', c4:'Detalhes das demolições', c5:'Novo orçamento', c6:'Boas vindas à obra',
    m_a:'Boa tarde Sr. Álvaro, temos mais uma atualização fotográfica pronta: capturámos o progresso das redes elétricas.',
    m_b:'Boa tarde João, as fotos ficaram ótimas, obrigado.', m_c:'Se precisar de alguma informação adicional, estou ao dispor. Como estão a correr as reuniões sobre o orçamento da cozinha?',
    m_d:'Sobre a cozinha, as reuniões estão a correr bem, só preciso de esclarecer uma dúvida com a minha esposa sobre os eletrodomésticos. Amanhã dou feedback.', m_e:'Muito bem. Aguardo então a sua decisão. Obrigado Sr. Álvaro.',
    auto:'Recebido. A equipa técnica responderá em breve.', attach_ok:'Anexo adicionado (demonstração).',
    docs_t:'Documentos', docs_s:'Documentos e PDFs da obra, centralizados.', dl:'Descarregar', dl_ok:'Download simulado (demonstração).',
    d1:'Contrato', d2:'Orçamentos', d3:'Projetos', d4:'Licenças', d5:'PDFs descarregáveis',
    data_t:'Dados da Obra', data_s:'Dados do cliente e da obra centralizados.', cli:'Cliente', addr:'Morada da obra', resp:'Responsável de obra', typ:'Tipologia', area:'Área de intervenção', stt:'Estado',
    clients_tab:'Cliente', footer:'Obras com Evidência — Build & Design by Ella'
  },
  en: {
    nav_about:'About Us', nav_services:'Our Services', nav_projects:'Projects', nav_contact:'Contact', client:'Client Area',
    hero1:'Working with us means having a Client Area.', hero2:'Follow your project in real time, with scheduling, progress and total transparency.',
    testi:'Client Reviews', quote:'Request a Quote',
    about_t:'Method, trust and transparency', about_e:'About Us',
    about_p1:'We are a construction and design company that follows every project in a structured way, from planning to completion, on a turnkey basis.',
    about_p2:'Designed for demanding clients, our process removes the need for constant contact: everything is documented, visible and organised in your Client Area.',
    p1:'Trust', p1s:'Commitment at every phase', p2:'Method', p2s:'Structured processes', p3:'Transparency', p3s:'Clear costs and deadlines', p4:'Turnkey', p4s:'Full follow-up',
    serv_t:'Our Services', serv_l:'From the first demolition to the last finish: one team, one method.',
    s1:'Full Renovations', s1d:'Complete site management: demolition, structure, technical networks, finishes, joinery and fit-out.',
    s2:'Design & Interiors', s2d:'Design and material selection with a defined price ceiling, for informed decisions and no surprises.',
    s3:'Management & Supervision', s3d:'Site direction, technical validation per trade and rigorous financial control.',
    proj_t:'Projects', proj_l:'A selection of recent works.',
    cont_t:'Contact', cont_l:'Talk to us and request a no-obligation quote.', name:'Name', email:'Email', phone:'Phone', msg:'Message', send:'Send request', sent:'Request sent. We will be in touch shortly.',
    login_t:'Client Area', login_s:'Access your project with your individual login.', user:'Username', pass:'Password', enter:'Sign in', demo:'Demo: any credentials work.',
    welcome:'Welcome, Mr. Álvaro Fernandes', logout:'Sign out',
    m_dashboard:'Dashboard', m_plan:'Schedule', m_prog:'Progress', m_photos:'Photos', m_mat:'Materials', m_fin:'Financial', m_comm:'Communication', m_docs:'Documents', m_data:'Project Data',
    obra:'Villa in Cascais', running:'In progress', done:'Completed', planned:'Planned', approved:'Approved', approvedF:'Approved', paid:'Paid',
    send_contact:'Send message', prog_obra:'Project Progress', next:'Next Stage', cur_spec:'Trade in progress', sched:'Schedule', see_full:'View full detail',
    last_upd:'Latest Updates', u1:'Photos updated', u2:'Schedule adjusted', u3:'Addendum approved', today:'today', yest:'yesterday', may2:'May 2',
    val_note:'Technical validation ensures the work meets quality standards.',
    ph_dem:'Demolition', ph_str:'Structure / CONCRETE / Steel', ph_net:'Technical Networks', ph_cov:'Coverings', ph_car:'Joinery', ph_fin:'Finishes',
    plan_t:'Project Schedule', plan_s:'Technical schedule with real-time follow-up.', start:'Start Date', end:'Expected Completion', state:'Status',
    expected:'Planned', actual:'Actual', exec:'In progress', plan_note:'Schedule updated weekly by the technical team.', today_l:'Today',
    prog_t:'Progress by Trade', prog_s:'Evolution and validation of the main trades.', check_detail:'View full detail',
    d_dem:'Demolition completed.', d_str:'Structure validated by the technical team.', d_net:'Work in progress as planned.', d_next:'Starting soon.',
    ph_t:'Photos', ph_s:'Detailed visual evolution of the Cascais project.', ba:'View Before/After comparison', all:'All', all_dates:'All dates', recent:'Most recent', oldest:'Oldest',
    week:"This week's update", add_cm:'Add a comment…', photos:'photos', ba_msg:'Before/After comparison available once the phase is complete.',
    mat_t:'Materials', mat_s:'Selection and approval of finishes for your project.', kitchen:'Kitchen', bath:'Bathrooms', living:'Living room',
    analysis:'Under review', selected:'Selected', pvp_b:'Budgeted price', pvp_r:'Selected price', exceeds:'This material exceeds the budgeted price.', accept:'I accept the extra', above:'above the budgeted price',
    confirm:'Confirm', within:'within budget', over:'over budget', hist_dec:'Decision History', confirmed:'Choice confirmed.',
    r1:'No global estimates', r2:'No confusing intermediate values', r3:'Only clear values per material',
    fin_t:'Financial', fin_s:'Detailed financial management of the Cascais project.', k1:'Initial Budget', k2:'Approved Addenda', k3:'Current Total', k4:'Amount Paid', k5:'Outstanding',
    base:'Base Budget', base_s:'Initial contract approved on 8 January 2024', detail:'View detail', add_t:'Addenda / Additional Works', req:'Request change / new order', req_ok:'Request sent to the technical team.',
    hist_f:'Financial History', contract_ok:'Contract approved', invoice:'Invoice', init_b:'Initial Budget',
    a1:'Additional acoustic insulation', a2:'More sockets and light points', a3:'Supply and installation of new bathroom vanity unit', a4:'Structural reinforcement of the wall between living room and kitchen',
    comm_t:'Communication', comm_s:'Direct communication with the site manager.', online:'Online', role:'Site Management', conv:'Conversation History', msgs:'messages', compose:'Send a photo, document or message…',
    c1:'Questions about materials', c2:'Structure planning', c3:'Technical networks project', c4:'Demolition details', c5:'New quote', c6:'Welcome to the project',
    m_a:'Good afternoon Mr. Álvaro, we have another photo update ready: we captured the progress of the electrical networks.',
    m_b:'Good afternoon João, the photos look great, thank you.', m_c:'If you need any further information, I am at your disposal. How are the kitchen budget meetings going?',
    m_d:'About the kitchen, the meetings are going well, I just need to clear up a question with my wife about the appliances. I will give feedback tomorrow.', m_e:'Very good. I will await your decision then. Thank you Mr. Álvaro.',
    auto:'Received. The technical team will reply shortly.', attach_ok:'Attachment added (demo).',
    docs_t:'Documents', docs_s:'Project documents and PDFs, centralised.', dl:'Download', dl_ok:'Simulated download (demo).',
    d1:'Contract', d2:'Quotes', d3:'Designs', d4:'Permits', d5:'Downloadable PDFs',
    data_t:'Project Data', data_s:'Client and project data, centralised.', cli:'Client', addr:'Site address', resp:'Site manager', typ:'Type', area:'Work area', stt:'Status',
    clients_tab:'Client', footer:'Obras com Evidência — Build & Design by Ella'
  }
};
let lang = (navigator.language||'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
try{ const s=localStorage.getItem('oce-lang'); if(s) lang=s; }catch(e){}
const t = k => (I18N[lang][k] ?? k);
const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const eur = n => '€ ' + n.toLocaleString(lang==='pt'?'pt-PT':'en-GB');
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2600)}

// ---------- logo ----------
const logo = (dark=false) => `<svg viewBox="0 0 330 190" role="img" aria-label="Obras com Evidência — Build & Design">
<path d="M10 70 L115 12 L115 12 L215 12 L320 70 L254 70 L115 20 Z" fill="none"/>
<polygon points="115,14 215,14 318,70 250,70" fill="#d3191f"/><polyline points="12,72 113,14" stroke="#d3191f" stroke-width="3" fill="none"/>
<g fill="${dark?'#fff':'#1c2733'}" font-family="Jost,sans-serif" text-anchor="middle">
<line x1="10" y1="92" x2="52" y2="92" stroke="${dark?'#fff':'#1c2733'}" stroke-width="1.5"/><line x1="208" y1="92" x2="320" y2="92" stroke="${dark?'#fff':'#1c2733'}" stroke-width="1.5"/>
<text x="130" y="102" font-size="34" font-weight="300">Obras com</text>
<text x="165" y="152" font-size="50" font-weight="300" letter-spacing="1">EVIDÊNCIA</text>
<line x1="10" y1="172" x2="48" y2="172" stroke="${dark?'#fff':'#1c2733'}" stroke-width="1.5"/><line x1="290" y1="172" x2="320" y2="172" stroke="${dark?'#fff':'#1c2733'}" stroke-width="1.5"/>
<text x="168" y="178" font-size="12" letter-spacing="6" fill="#8c6f4e">BUILD &amp; DESIGN</text></g></svg>`;

// ---------- state ----------
const state = {
  authed: (()=>{try{return sessionStorage.getItem('oce-auth')==='1'}catch(e){return false}})(),
  mat: { tab:'rev', ok:{} , acc:{} },
  photoFilter:'all', photoSort:'recent', comments:{},
  chat: null, testi:0
};
const PHASES = [
  {k:'ph_dem',pct:100,s:0,e:16,st:'done',pl:'12/03 – 16/03',ac:'12/03 – 16/03'},
  {k:'ph_str',pct:80,s:16,e:38,st:'run',pl:'18/03 – 06/04',ac:'18/03 – 02/05'},
  {k:'ph_net',pct:45,s:36,e:56,st:'run',pl:'03/05 – 17/05',ac:'03/05 – 20/05'},
  {k:'ph_cov',pct:0,s:52,e:74,st:'plan',pl:'20/05 – 14/06',ac:'—'},
  {k:'ph_car',pct:0,s:64,e:86,st:'plan',pl:'01/06 – 20/06',ac:'—'},
  {k:'ph_fin',pct:0,s:76,e:98,st:'plan',pl:'10/06 – 17/06',ac:'—'}
];
const MENU = [['dashboard','m_dashboard','⌂'],['plan','m_plan','▤'],['prog','m_prog','◔'],['photos','m_photos','▣'],['mat','m_mat','▦'],['fin','m_fin','€'],['comm','m_comm','✉'],['docs','m_docs','❏'],['data','m_data','☰']];

// ---------- router ----------
function route(){
  const h = location.hash.replace(/^#\/?/,'');
  if(h.startsWith('area')){
    if(!state.authed){ location.hash='#/'; setTimeout(openLogin,50); return; }
    const page = h.split('/')[1] || 'dashboard';
    renderClient(MENU.some(m=>m[0]===page)?page:'dashboard');
  } else { renderPublic(); const a=h; if(a) requestAnimationFrame(()=>{const el=document.getElementById(a); el&&el.scrollIntoView()}); }
}
window.addEventListener('hashchange',route);

// ---------- PUBLIC ----------
const TESTI = [
  ['Patrícia Moura','A área de cliente deu-me uma tranquilidade total durante toda a obra.','PM'],
  ['Ricardo & Sofia Almeida','Sempre soubemos o estado da obra e quanto custava cada decisão. Zero surpresas.','RS'],
  ['Miguel Tavares','Método e transparência raros no setor. Recomendo sem hesitar.','MT'],
  ['Helena Costa','As fotografias semanais e o chat direto substituíram dezenas de chamadas.','HC']
];
const TESTI_EN = [
  'The client area gave me total peace of mind throughout the project.',
  'We always knew the project status and what every decision cost. Zero surprises.',
  'Method and transparency that are rare in the industry. I recommend without hesitation.',
  'The weekly photos and the direct chat replaced dozens of phone calls.'
];
let testiTimer;
function renderPublic(){
  document.documentElement.lang = lang==='pt'?'pt-PT':'en';
  $('#app').innerHTML = `
  <header class="hdr"><div class="wrap">
    <a class="logo" href="#/" aria-label="Obras com Evidência">${logo()}</a>
    <nav class="nav" id="nav">
      <a href="#about">${t('nav_about')}</a><a href="#services">${t('nav_services')}</a><a href="#projects">${t('nav_projects')}</a><a href="#contact">${t('nav_contact')}</a>
    </nav>
    <div class="hdr-r">
      <div class="lang"><button data-l="pt" class="${lang==='pt'?'on':''}">PT</button>|<button data-l="en" class="${lang==='en'?'on':''}">EN</button></div>
      <button class="btn sm" id="loginBtn" style="font-family:var(--serif);font-size:1.05rem">${t('client')}</button>
      <button class="burger" id="burger" aria-label="Menu">☰</button>
    </div></div></header>

  <section class="hero"><div class="wrap">
    <div><h1>${t('hero1')}</h1><p>${t('hero2')}</p><button class="btn" data-login>${t('client')}</button></div>
    <div class="mock" aria-hidden="true">
      <div class="mock-side"><b style="font-family:var(--serif);font-size:.95rem;padding:4px 8px 12px">EVIDÊNCIA</b><i class="on">Dashboard</i><i>${t('m_plan')}</i><i>${t('m_prog')}</i><i>${t('m_photos')}</i><i>${t('m_mat')}</i><i>${t('m_fin')}</i><i>${t('m_comm')}</i></div>
      <div class="mock-main"><small>${t('welcome')}</small><h4>${t('obra')}</h4><small>● ${t('running')} · 45%</small>
        <div class="mock-card"><b style="font-family:var(--serif);font-size:1rem">${t('sched')}</b>
          <div class="row"><span>${t('ph_dem')}</span><span>100%</span></div><div class="mini-bar"><b style="width:100%"></b></div>
          <div class="row"><span>${t('ph_str')}</span><span>80%</span></div><div class="mini-bar"><b style="width:80%"></b></div>
          <div class="row"><span>${t('ph_net')}</span><span>45%</span></div><div class="mini-bar"><b style="width:45%"></b></div></div>
        <div class="mock-card"><b style="font-family:var(--serif);font-size:1rem">${t('m_photos')}</b>
          <div style="display:flex;gap:6px;margin-top:8px"><i style="flex:1;height:54px;border-radius:5px;background:linear-gradient(135deg,#a9a49a,#6f6b64)"></i><i style="flex:1;height:54px;border-radius:5px;background:linear-gradient(135deg,#b8b2a6,#7c8a93)"></i><i style="flex:1;height:54px;border-radius:5px;background:linear-gradient(135deg,#c2b8a8,#8a7a66)"></i></div></div>
      </div></div>
  </div></section>

  <section class="sec testi" id="testimonials"><div class="wrap">
    <h2>${t('testi')}</h2><div style="height:30px"></div>
    <div class="carousel"><button class="arrow" id="tPrev" aria-label="‹">‹</button><div class="slide" id="slide"></div><button class="arrow" id="tNext" aria-label="›">›</button></div>
    <div class="dots" id="dots"></div>
  </div></section>

  <section class="sec alt" id="about"><div class="wrap about">
    <div><span class="eyebrow" style="text-align:left">${t('about_e')}</span><h2>${t('about_t')}</h2><p>${t('about_p1')}</p><p>${t('about_p2')}</p></div>
    <div class="pillars">${[1,2,3,4].map(i=>`<div class="pillar"><b>${t('p'+i)}</b><span>${t('p'+i+'s')}</span></div>`).join('')}</div>
  </div></section>

  <section class="sec" id="services"><div class="wrap">
    <span class="eyebrow">${t('nav_services')}</span><h2>${t('serv_t')}</h2><p class="lead">${t('serv_l')}</p>
    <div class="grid3">${[['⌂',1],['✎',2],['✓',3]].map(([i,n])=>`<div class="card"><div class="ico">${i}</div><h3>${t('s'+n)}</h3><p>${t('s'+n+'d')}</p></div>`).join('')}</div>
  </div></section>

  <section class="sec alt" id="projects"><div class="wrap">
    <span class="eyebrow">${t('nav_projects')}</span><h2>${t('proj_t')}</h2><p class="lead">${t('proj_l')}</p>
    <div class="grid3">${[['Moradia em Cascais','Cascais · 2024'],['Apartamento Chiado','Lisboa · 2023'],['Villa Comporta','Comporta · 2023']].map(p=>`<div class="proj"><div class="img"></div><div class="t"><h3>${p[0]}</h3><span>${p[1]}</span></div></div>`).join('')}</div>
  </div></section>

  <section class="sec" id="contact"><div class="wrap contact">
    <div><span class="eyebrow" style="text-align:left">${t('nav_contact')}</span><h2>${t('cont_t')}</h2><p style="color:var(--muted);font-weight:300;font-size:1.1rem">${t('cont_l')}</p>
      <ul><li>✉ geral@obrascomevidencia.com</li><li>☎ +351 000 000 000</li><li>⌖ Lisboa, Portugal</li><li>🌐 www.obrascomevidencia.com</li></ul></div>
    <form class="f" id="quoteForm">
      <label>${t('name')}<input required name="n"></label>
      <label>${t('email')}<input required type="email" name="e"></label>
      <label>${t('phone')}<input name="p"></label>
      <label>${t('msg')}<textarea rows="4" name="m"></textarea></label>
      <button class="btn" style="justify-self:start">${t('send')}</button>
    </form>
  </div></section>

  <footer class="ftr"><div class="wrap">${logo(true)}<div>${t('footer')}</div></div></footer>
  <a class="btn float-cta" href="#contact">${t('quote')}</a>

  <div class="modal" id="loginModal"><div class="box">
    <button class="x" aria-label="Fechar" data-close>×</button>
    <h3>${t('login_t')}</h3><p class="sub">${t('login_s')}</p>
    <form class="f" id="loginForm">
      <label>${t('user')}<input name="u" value="alvaro.fernandes" autocomplete="username" required></label>
      <label>${t('pass')}<input name="p" type="password" value="demo1234" autocomplete="current-password" required></label>
      <button class="btn" style="justify-content:center">${t('enter')}</button>
    </form><p class="hint">${t('demo')}</p>
  </div></div>`;
  bindPublic();
}
function openLogin(){ const m=$('#loginModal'); if(m) m.classList.add('open'); }
function bindPublic(){
  $$('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
  $('#loginBtn').onclick=openLogin; $$('[data-login]').forEach(b=>b.onclick=openLogin);
  $('[data-close]').onclick=()=>$('#loginModal').classList.remove('open');
  $('#loginModal').onclick=e=>{if(e.target.id==='loginModal')e.currentTarget.classList.remove('open')};
  $('#loginForm').onsubmit=e=>{e.preventDefault();state.authed=true;try{sessionStorage.setItem('oce-auth','1')}catch(_){}location.hash='#/area/dashboard'};
  $('#quoteForm').onsubmit=e=>{e.preventDefault();e.target.reset();toast(t('sent'))};
  $('#burger').onclick=()=>$('#nav').classList.toggle('open');
  $$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
  const hdr=$('.hdr'); const onS=()=>hdr.classList.toggle('sc',scrollY>10); onS(); addEventListener('scroll',onS,{passive:true});
  // testimonials carousel (auto, 1 at a time)
  const show=i=>{
    state.testi=(i+TESTI.length)%TESTI.length; const [n,q,ini]=TESTI[state.testi];
    $('#slide').innerHTML=`<div class="avatar">${ini}</div><q>${lang==='pt'?q:TESTI_EN[state.testi]}</q><cite>${n}</cite>`;
    $('#dots').innerHTML=TESTI.map((_,k)=>`<button class="${k===state.testi?'on':''}" data-i="${k}" aria-label="${k+1}"></button>`).join('');
    $$('#dots button').forEach(b=>b.onclick=()=>{show(+b.dataset.i);auto()});
  };
  const auto=()=>{clearInterval(testiTimer);testiTimer=setInterval(()=>$('#slide')?show(state.testi+1):clearInterval(testiTimer),6000)};
  $('#tPrev').onclick=()=>{show(state.testi-1);auto()}; $('#tNext').onclick=()=>{show(state.testi+1);auto()};
  show(state.testi); auto();
}
function setLang(l){ lang=l; try{localStorage.setItem('oce-lang',l)}catch(e){} route(); }

// ---------- CLIENT AREA ----------
function renderClient(page){
  clearInterval(testiTimer);
  document.documentElement.lang = lang==='pt'?'pt-PT':'en';
  const body = PAGES[page]();
  $('#app').innerHTML = `
  <div class="ca">
    <aside class="side" id="side">
      <a class="logo" href="#/">${logo()}</a>
      <nav class="menu">
        ${MENU.map(([k,lbl,ic])=>`<a href="#/area/${k}" class="${k===page?'on':''}"><span class="i">${ic}</span>${t(lbl)}</a>`).join('')}
        <div class="user"><div class="avatar">AF</div><span>Sr. Álvaro<br>Fernandes</span><button id="logout">${t('logout')}</button></div>
      </nav>
    </aside>
    <main class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center"><button class="mburger" id="mb" aria-label="Menu">☰</button>
          <div class="tabs"><span class="on">Dashboard</span><span>${t('clients_tab')}</span></div></div>
        <div class="top-r"><div class="lang"><button data-l="pt" class="${lang==='pt'?'on':''}">PT</button>/<button data-l="en" class="${lang==='en'?'on':''}">EN</button></div><div class="avatar">AF</div></div>
      </div>
      ${body}
    </main>
  </div>`;
  $('#logout').onclick=()=>{state.authed=false;try{sessionStorage.removeItem('oce-auth')}catch(e){}location.hash='#/'};
  $$('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
  $('#mb').onclick=()=>$('#side').classList.toggle('open');
  $$('.menu a').forEach(a=>a.addEventListener('click',()=>$('#side').classList.remove('open')));
  (BIND[page]||(()=>{}))();
  scrollTo(0,0);
}
const head=(title,sub,extra='')=>`<div class="page-h"><div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;
const note=()=>`<div class="note">${t('val_note')}</div>`;
const barRow=(k,p,st)=>`<div class="ph"><div class="n"><span class="chk ${st}">${st==='done'?'✓':st==='run'?'●':''}</span>${t(k)}</div><div class="bar ${st==='plan'?'s':''}"><b style="width:${st==='plan'?30:p}%"></b></div><div class="v">${st==='done'?t('done'):st==='plan'?`<span class="tag">${t('planned')}</span>`:p+'%'}</div></div>`;

const PAGES = {
dashboard:()=>`
  <div class="page-h"><div><h1 style="font-size:2rem">${t('welcome')}</h1><h1 style="font-size:2rem;margin-top:4px">${t('obra')}</h1><div class="status"><span class="dot"></span>${t('running')} · 45%</div></div>
    <button class="btn ghost" id="contactBtn">👤 ${t('send_contact')}</button></div>
  <div class="cols"><div class="stack">
    <div class="panel"><h3>${t('prog_obra')}</h3><div class="pbar"><div class="bar"><b style="width:45%"></b></div><div class="big">45%</div></div>
      <div class="two"><div><small>${t('next')}</small><b>${t('ph_cov')}</b></div><div><small>${t('cur_spec')}</small><b>${t('ph_net')}</b></div></div></div>
    <div class="panel"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3>${t('sched')}</h3><a class="link" href="#/area/plan">${t('see_full')} ›</a></div>
      ${PHASES.slice(0,4).map(p=>barRow(p.k,p.pct,p.st)).join('')}</div>
    ${note()}</div>
  <div class="panel"><h3>${t('last_upd')}</h3><ul class="upd">
    <li><span class="ic">▣</span>${t('u1')}<em>${t('today')}</em></li><li><span class="ic">▤</span>${t('u2')}<em>${t('yest')}</em></li><li><span class="ic">✓</span>${t('u3')}<em>${t('may2')}</em></li></ul></div></div>`,

plan:()=>`${head(t('plan_t'),t('plan_s'),`<div class="meta"><div>${t('start')}: <b>10/03/2024</b></div><div>${t('end')}: <b>17/06/2024</b></div><div>${t('state')}: ${t('running')}</div></div>`)}
  <div class="panel"><div class="legend"><span><i class="sw" style="background:var(--green)"></i>${t('done')}</span><span><i class="sw" style="background:var(--petrol-2)"></i>${t('running')}</span><span><i class="sw" style="background:var(--sand)"></i>${t('planned')}</span></div>
    <div class="gantt"><div class="g-in" id="gantt">
      <div class="g-head"><div></div><div class="g-scale">${['Mar','','Abr','','Mai','','Jun','','','','',''].map((m,i)=>`<span>${m||''}</span>`).join('')}</div></div>
      ${PHASES.map((p,i)=>`<div class="g-row"><div class="n"><span class="chk ${p.st}">${p.st==='done'?'✓':p.st==='run'?'●':''}</span>${t(p.k)}</div>
        <div class="g-track"><div class="g-bar ${p.st}" data-i="${i}" style="left:${p.s}%;width:${p.e-p.s}%">${p.pl.replace(/ /g,'')}</div>${p.pct?`<span class="g-pct" style="left:${p.e+1}%">${p.pct}%</span>`:''}${i===1?'<div class="g-today" title="'+t('today_l')+'"></div>':''}</div></div>`).join('')}
      <div class="g-tip" id="gtip"></div></div></div></div>
  <div class="note">${t('plan_note')}</div>`,

prog:()=>`${head(t('prog_t'),t('prog_s'))}
  <div class="pg">${[['ph_dem',100,'d_dem',1],['ph_str',100,'d_str',1],['ph_net',60,'d_net',0],['ph_cov',0,'d_next',0],['ph_car',0,'d_next',0],['ph_fin',0,'d_next',0]].map(([k,p,d,ok],i)=>`
    <div class="panel sp ${i===0?'full':''}"><header><h3>${t(k)}</h3>${p?`<span class="pc">${p}%</span>`:`<span class="tag">${t('planned')}</span>`}</header>
      <div class="bar ${p===100?'g':p?'':'s'}"><b style="width:${p}%"></b></div>
      <div class="row"><span>${t(d)}</span>${ok?`<span class="ok">${t('approved')}</span>`:''}</div>
      <button class="link" data-detail="${k}">${t('check_detail')} ›</button></div>`).join('')}</div>${note()}`,

photos:()=>`${head(t('ph_t'),t('ph_s'),`<button class="btn ghost" id="baBtn">${t('ba')}</button>`)}
  <div class="filters"><div class="seg" id="pf">${[['all',t('all')],['ph_dem',t('ph_dem')],['ph_str',t('ph_str')],['ph_net',t('ph_net')],['ph_cov',t('ph_cov')]].map(([k,l])=>`<button data-k="${k}" class="${state.photoFilter===k?'on':''}">${l}</button>`).join('')}</div>
    <select class="sel" id="ps"><option value="recent" ${state.photoSort==='recent'?'selected':''}>${t('recent')}</option><option value="old" ${state.photoSort==='old'?'selected':''}>${t('oldest')}</option></select></div>
  <div class="stats">${[['ph_dem',12],['ph_str',16],['ph_net',22],['ph_cov',8]].map(([k,n])=>`<div class="stat" data-k="${k}"><h4>${t(k)}</h4><span>${n} ${t('photos')}</span></div>`).join('')}</div>
  <h3 style="font-size:1.5rem;margin-bottom:14px">${t('week')}</h3><div class="ph-grid" id="pgrid"></div>`,

mat:()=>{
  const sets={rev:[['kitchen',[{id:'k1',n:'Azulejo – Parede',b:30,r:40,st:'sel'}]],['living',[{id:'k2',n:'Mosaico Hidráulico – Chão',b:60,r:60,st:'ap'},{id:'k3',n:'Soalho Sala',b:25,r:30,st:'an'}]]],car:[['kitchen',[{id:'c1',n:'Roupeiros Quarto',b:6200,r:6200,st:'sel',u:'€'}]]],ban:[['bath',[{id:'b1',n:'Tampo WC – Mármore',b:5500,r:5500,st:'ap',u:'€'}]]],san:[['bath',[{id:'s1',n:'Sanita suspensa',b:320,r:380,st:'an',u:'€'}]]]};
  const tabs={rev:t('ph_cov'),car:t('ph_car'),ban:lang==='pt'?'Bancadas':'Countertops',san:lang==='pt'?'Sanitários':'Sanitary ware'};
  const list=sets[state.mat.tab].map(([room,items])=>`<div class="room"><button>${t(room)} <span>⌄</span></button>${items.map(matRow).join('')}</div>`).join('');
  return `${head(t('mat_t'),t('mat_s'))}
  <div class="mtabs" id="mt">${Object.entries(tabs).map(([k,l])=>`<button data-k="${k}" class="${state.mat.tab===k?'on':''}">${l}</button>`).join('')}</div>
  <div class="mat-cols"><div>${list}</div>
   <div class="panel"><h3>${t('hist_dec')}</h3><ul class="hist" id="hist">
     <li><div>Azulejo Cozinha – Parede<small>20 mar 2024</small></div><div class="over">€ 40/m²<small class="over">+ 10 €/m²</small></div></li>
     <li><div>Mosaico Hidráulico – Chão<small>18 abr 2024</small></div><div>€ 60/m²</div></li>
     <li><div>Soalho Sala<small>15 mar 2024</small></div><div>€ 25/m²<small class="over">+ 5 €/m²</small></div></li>
     <li><div>Mármore WC<small>15 mar 2024</small></div><div class="good">${t('approved')}</div></li></ul>
     <div class="rule"><span>❌ ${t('r1')}</span><span>❌ ${t('r2')}</span><span>✅ ${t('r3')}</span></div></div></div>`;
},

fin:()=>`${head(t('fin_t'),t('fin_s'))}
  <div class="kpis"><div class="kpi"><b>${eur(120000)}</b><small>${t('k1')}</small></div><div class="kpi"><b style="color:var(--muted)">${eur(11200)}</b><small>${t('k2')}</small></div><div class="kpi"><b>${eur(131200)}</b><small>${t('k3')}</small></div><div class="kpi g"><b>${eur(85000)}</b><small>${t('k4')} <span class="ok" style="gap:0"></span></small></div><div class="kpi"><b>${eur(46200)}</b><small>${t('k5')}</small></div></div>
  <div class="panel"><div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="margin:0">${t('base')}</h3><small class="tag">${t('base_s')}</small></div><button class="btn ghost" data-toast="${t('base')}: ${eur(120000)}">${t('detail')} ›</button></div>
    <table class="tbl"><tr><td>${t('base')}</td><td class="r">${eur(120000)}</td><td><span class="ok">${t('approved')}</span></td></tr></table></div>
  <div class="sec-h"><h3>${t('add_t')}</h3><button class="btn ghost" id="reqBtn">${t('req')}</button></div>
  <div class="panel"><table class="tbl">${[['a1','25 abr 2024',3000],['a2','16 abr 2024',2400],['a3','4 abr 2024',4500],['a4','22 mar 2024',1300]].map(([k,d,v])=>`<tr><td>▸ ${t(k)}</td><td class="tag">${d}</td><td class="r">${eur(v)}</td><td class="r"><span class="ok">${t('approvedF')}</span></td></tr>`).join('')}</table></div>
  <div class="sec-h"><h3>${t('hist_f')}</h3></div>
  <div class="panel"><table class="tbl"><tr><td>${t('invoice')} 017</td><td class="tag">10 abr 2024</td><td class="r">${eur(50000)}</td><td class="r"><span class="ok">${t('paid')}</span></td></tr>
    <tr><td>${t('invoice')} 011</td><td class="tag">2 mar 2024</td><td class="r">${eur(25000)}</td><td class="r"><span class="ok">${t('paid')}</span></td></tr>
    <tr><td>${t('init_b')}</td><td class="tag">8 jan 2024</td><td class="r">${eur(120000)}</td><td class="r tag">📄 ${t('contract_ok')}</td></tr></table></div>`,

comm:()=>{ if(!state.chat) state.chat=[['in','m_a','14:03',1],['out','m_b','14:08'],['in','m_c','14:08'],['out','m_d','14:03'],['in','m_e','14:10']];
  return `${head(t('comm_t'),t('comm_s'))}
  <div class="chat"><div class="chat-m"><div class="chat-h"><div class="avatar">JR</div><div><b>Eng. João Ribeiro</b> – <span class="tag">${t('role')}</span><small><span class="dot"></span>${t('online')}</small></div></div>
    <div class="msgs" id="msgs">${state.chat.map(chatMsg).join('')}</div>
    <form class="composer" id="cf"><label class="att" title="+"><input type="file" id="cfile" hidden>📎</label><input type="text" id="ci" placeholder="${t('compose')}" autocomplete="off"><button class="btn sm">➤</button></form></div>
    <aside class="chat-s"><h3>${t('conv')}</h3><ul>${[['c1',2,'13 abr 2024'],['c2',4,'6 abr 2024'],['c3',5,'2 abr 2024'],['c4',9,'18 fev 2024'],['c5',3,'5 fev 2024'],['c6',3,'8 jan 2024']].map(([k,n,d])=>`<li><div>${t(k)}<small>${n} ${t('msgs')}</small></div><small>${d}</small></li>`).join('')}</ul></aside></div>`;},

docs:()=>`${head(t('docs_t'),t('docs_s'))}<div class="docs">${[['d1','Contrato_Obra.pdf','1,2 MB'],['d2','Orcamento_Base.pdf','860 KB'],['d3','Projeto_Arquitetura.pdf','4,8 MB'],['d3','Projeto_Redes_Tecnicas.pdf','3,1 MB'],['d4','Licenca_Obras.pdf','410 KB']].map(([k,f,s])=>`<div class="doc"><div class="ic">PDF</div><div>${f}<small>${t(k)} · ${s}</small></div><button class="btn ghost" data-toast="${t('dl_ok')}">⬇ ${t('dl')}</button></div>`).join('')}</div>`
};
PAGES.data=()=>`${head(t('data_t'),t('data_s'))}<div class="panel"><dl class="dl">
  <div><dt>${t('cli')}</dt><dd>Álvaro Fernandes</dd><dt>${t('addr')}</dt><dd>Rua das Flores 24, Cascais</dd><dt>${t('typ')}</dt><dd>${t('obra')}</dd></div>
  <div><dt>${t('resp')}</dt><dd>Eng. João Ribeiro</dd><dt>${t('area')}</dt><dd>240 m²</dd><dt>${t('stt')}</dt><dd>${t('running')} · 45%</dd></div>
  <div><dt>${t('start')}</dt><dd>10/03/2024</dd><dt>${t('end')}</dt><dd>17/06/2024</dd></div></dl></div>`;

function chatMsg([d,k,time,th]){ return `<div class="msg ${d==='out'?'me':''}">${k.startsWith('m_')?esc(t(k)):esc(k)}${th?'<div class="th"><i></i><i></i><i></i></div>':''}<time>${time}</time></div>`; }
function matRow(m){
  const u=m.u||'€/m²', diff=m.r-m.b, over=diff>0, ok=state.mat.ok[m.id]||m.st==='ap', acc=state.mat.acc[m.id];
  const f=v=>u==='€'?eur(v):`€${v}/m²`;
  const stLbl=ok?`<span class="state ap">✓ ${t('approved')}</span>`:m.st==='sel'?`<span class="state sel">${t('selected')}</span>`:`<span class="state">${t('analysis')}</span>`;
  const bal=over?`<span class="balance over">+ ${u==='€'?eur(diff):diff+' €/m²'} ${t('over')}</span>`:`<span class="balance good">✓ ${t('within')}</span>`;
  return `<div class="mat"><div class="sw2"></div><div class="bd"><div class="tt">${m.n}${stLbl}</div>
    <div class="pv"><span>${t('pvp_b')} <b>${f(m.b)}</b></span><span>${t('pvp_r')} <b class="${over?'over':''}">${f(m.r)}</b></span>${bal}</div>
    ${!ok&&over?`<div class="warnbox"><div>⚠ ${t('exceeds')}</div><label><input type="checkbox" data-acc="${m.id}" ${acc?'checked':''}> ${t('accept')} <b class="over">+${u==='€'?eur(diff):diff+' €/m²'}</b> ${t('above')}</label><button class="btn sm" style="justify-self:end" data-ok="${m.id}" ${acc?'':'disabled'}>${t('confirm')}</button></div>`:''}
    ${!ok&&!over?`<div style="text-align:right"><button class="btn sm" data-ok="${m.id}">${t('confirm')}</button></div>`:''}</div></div>`;
}

// ---------- bindings per page ----------
const BIND = {
dashboard(){ $('#contactBtn').onclick=()=>{location.hash='#/area/comm'}; },
plan(){
  const tip=$('#gtip'), box=$('#gantt');
  $$('.g-bar',box).forEach(b=>{
    const p=PHASES[+b.dataset.i];
    b.onmouseenter=b.onfocus=()=>{ tip.innerHTML=`<div><span>${t('expected')}:</span><b>${p.pl}</b></div><div><span>${t('actual')}:</span><b>${p.ac}</b></div><div><span>${t(p.st==='done'?'done':p.st==='run'?'exec':'planned')}:</span><b>${p.pct}%</b></div>`;
      const r=b.getBoundingClientRect(), br=box.getBoundingClientRect(); tip.style.display='block'; tip.style.left=Math.min(r.left-br.left+20,br.width-220)+'px'; tip.style.top=(r.bottom-br.top+6)+'px'; };
    b.onmouseleave=b.onblur=()=>tip.style.display='none';
  });
},
prog(){ $$('[data-detail]').forEach(b=>b.onclick=()=>{location.hash='#/area/plan'}); },
photos(){
  const imgs=['demo1','demo2','demo3','demo4'];
  const data=[]; ['ph_dem','ph_str','ph_net','ph_cov'].forEach((k,gi)=>{ for(let i=0;i<3;i++) data.push({id:k+i,k,cls:imgs[(gi+i)%4],d:20240500-gi*7-i,n:(gi+i)%4+1}); });
  const draw=()=>{
    let L=data.filter(p=>state.photoFilter==='all'||p.k===state.photoFilter).sort((a,b)=>state.photoSort==='recent'?b.d-a.d:a.d-b.d);
    $('#pgrid').innerHTML=L.map(p=>{const cs=state.comments[p.id]||[];return `<div class="photo"><div class="im ${p.cls}"><span class="c">💬 ${p.n+cs.length}</span></div><div class="b"><div class="cap"><span>${t(p.k)}</span><span class="tag">${String(p.d).slice(6)}/05</span></div>
      <ul class="cl">${cs.map(c=>`<li><b>Sr. Álvaro:</b> ${esc(c)}</li>`).join('')}</ul>
      <form class="cm" data-id="${p.id}"><input placeholder="${t('add_cm')}" aria-label="${t('add_cm')}"><button>➤</button></form></div></div>`}).join('');
    $$('.cm').forEach(f=>f.onsubmit=e=>{e.preventDefault();const v=f.firstElementChild.value.trim();if(!v)return;(state.comments[f.dataset.id]??=[]).push(v);draw()});
    $$('#pf button').forEach(b=>b.classList.toggle('on',b.dataset.k===state.photoFilter));
  };
  $$('#pf button').forEach(b=>b.onclick=()=>{state.photoFilter=b.dataset.k;draw()});
  $$('.stat').forEach(s=>s.onclick=()=>{state.photoFilter=s.dataset.k;draw()});
  $('#ps').onchange=e=>{state.photoSort=e.target.value;draw()};
  $('#baBtn').onclick=()=>toast(t('ba_msg')); draw();
},
mat(){
  $$('#mt button').forEach(b=>b.onclick=()=>{state.mat.tab=b.dataset.k;route()});
  $$('[data-acc]').forEach(c=>c.onchange=()=>{state.mat.acc[c.dataset.acc]=c.checked;route()});
  $$('[data-ok]').forEach(b=>b.onclick=()=>{state.mat.ok[b.dataset.ok]=true;route();toast(t('confirmed'))});
},
fin(){ $('#reqBtn').onclick=()=>toast(t('req_ok')); $$('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast)); },
comm(){
  const box=$('#msgs'); box.scrollTop=box.scrollHeight;
  const now=()=>new Date().toLocaleTimeString(lang==='pt'?'pt-PT':'en-GB',{hour:'2-digit',minute:'2-digit'});
  const push=(m)=>{state.chat.push(m);box.insertAdjacentHTML('beforeend',chatMsg(m));box.scrollTop=box.scrollHeight};
  $('#cf').onsubmit=e=>{e.preventDefault();const i=$('#ci'),v=i.value.trim();if(!v)return;push(['out',v,now()]);i.value='';setTimeout(()=>push(['in','auto',now()]),900)};
  $('#cfile').onchange=e=>{if(e.target.files[0]){push(['out','📎 '+e.target.files[0].name,now()]);toast(t('attach_ok'))}};
},
docs(){ $$('[data-toast]').forEach(b=>b.onclick=()=>toast(b.dataset.toast)); }
};

// service worker not registered intentionally (demo)
route();
