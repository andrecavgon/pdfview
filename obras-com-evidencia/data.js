/* Camada de dados: Supabase (real) ou demonstração (memória).
   Ambas expõem a mesma API assíncrona em window.DB. */
(function () {
  'use strict';
  const cfg = window.OCE_CONFIG || {};
  const LIVE = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
  const KINDS = ['dem', 'str', 'net', 'cov', 'car', 'fin'];
  const iso = d => d.toISOString().slice(0, 10);
  const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  const diffDays = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
  const safeName = n => String(n).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_');

  // fases por omissão, repartidas entre início e fim da obra
  function defaultPhases(start, end) {
    const total = Math.max(diffDays(start, end), KINDS.length);
    const w = [.14, .24, .18, .16, .14, .14]; let acc = 0;
    return KINDS.map((kind, i) => {
      const ps = addDays(start, Math.round(total * acc)); acc += w[i];
      const pe = addDays(start, Math.round(total * acc) - 1);
      return { kind, name: null, sort: i, ps, pe, as: null, ae: null, pct: 0, status: 'planned', validated: false, note: '' };
    });
  }

  /* =============== DEMONSTRAÇÃO =============== */
  function demo() {
    let seq = 1; const id = () => 'd' + (seq++);
    let me = null; const S = { projects: [], B: {} };
    const t0 = today();
    function seed() {
      const pid = id();
      const start = addDays(t0, -50), end = addDays(t0, 60);
      S.projects.push({ id: pid, name: 'Moradia em Cascais', address: 'Rua das Flores 24, Cascais', status: 'running', start, end, area: '240 m²', base: 120000, mgrName: 'Eng. João Ribeiro', mgrRole: 'Direção de Obra', clientName: 'Álvaro Fernandes', clientId: 'cli1' });
      const ph = defaultPhases(start, end).map(p => ({ ...p, id: id() }));
      const set = (i, o) => Object.assign(ph[i], o);
      set(0, { pct: 100, status: 'done', as: ph[0].ps, ae: ph[0].pe, validated: true, note: 'Demolição concluída.' });
      set(1, { pct: 80, status: 'running', as: ph[1].ps, validated: false, note: 'Trabalhos em execução conforme planeado.' });
      set(2, { pct: 45, status: 'running', as: ph[2].ps, note: 'Trabalhos em andamento conforme planeado.' });
      const cls = ['demo1', 'demo2', 'demo3', 'demo4'];
      const photos = []; let n = 0;
      [0, 1, 2, 3].forEach(pi => { for (let i = 0; i < 3; i++) photos.push({ id: id(), phaseId: ph[pi].id, url: null, cls: cls[(n++) % 4], caption: '', date: addDays(t0, -(pi * 6 + i * 2 + 1)), comments: i === 0 ? [{ id: id(), author: 'Sr. Álvaro', body: 'Podem confirmar a altura do rodapé aqui?', at: addDays(t0, -2) }] : [] }); });
      S.B[pid] = {
        project: S.projects[0], phases: ph, photos,
        materials: [
          { id: id(), cat: 'rev', room: 'Cozinha', name: 'Azulejo – Parede', budget: 30, real: 40, unit: 'm2', status: 'selected', accepted: false, decided: null },
          { id: id(), cat: 'rev', room: 'Sala', name: 'Mosaico Hidráulico – Chão', budget: 60, real: 60, unit: 'm2', status: 'approved', accepted: false, decided: addDays(t0, -18) },
          { id: id(), cat: 'rev', room: 'Sala', name: 'Soalho Sala', budget: 25, real: 30, unit: 'm2', status: 'analysis', accepted: false, decided: null },
          { id: id(), cat: 'car', room: 'Quarto', name: 'Roupeiros Quarto', budget: 6200, real: 6200, unit: 'un', status: 'selected', accepted: false, decided: null },
          { id: id(), cat: 'ban', room: 'Casas de Banho', name: 'Tampo WC – Mármore', budget: 5500, real: 5500, unit: 'un', status: 'approved', accepted: false, decided: addDays(t0, -30) },
          { id: id(), cat: 'san', room: 'Casas de Banho', name: 'Sanita suspensa', budget: 320, real: 380, unit: 'un', status: 'analysis', accepted: false, decided: null }
        ],
        addenda: [
          { id: id(), desc: 'Isolamento acústico adicional', date: addDays(t0, -12), amount: 3000, status: 'approved' },
          { id: id(), desc: 'Mais tomadas e pontos de luz', date: addDays(t0, -20), amount: 2400, status: 'approved' },
          { id: id(), desc: 'Fornecimento e instalação de novo móvel de casa de banho', date: addDays(t0, -33), amount: 4500, status: 'approved' },
          { id: id(), desc: 'Reforço estrutural da parede entre sala e cozinha', date: addDays(t0, -45), amount: 1300, status: 'approved' }
        ],
        payments: [
          { id: id(), label: 'Fatura 011', date: addDays(t0, -40), amount: 25000, status: 'paid' },
          { id: id(), label: 'Fatura 017', date: addDays(t0, -15), amount: 60000, status: 'paid' }
        ],
        messages: [
          { id: id(), staff: true, name: 'Eng. João Ribeiro', body: 'Boa tarde Sr. Álvaro, temos mais uma atualização fotográfica pronta: capturámos o progresso das redes elétricas.', at: new Date(Date.now() - 36e5 * 5).toISOString(), att: null },
          { id: id(), staff: false, name: 'Álvaro Fernandes', body: 'Boa tarde João, as fotos ficaram ótimas, obrigado.', at: new Date(Date.now() - 36e5 * 4.9).toISOString(), att: null },
          { id: id(), staff: true, name: 'Eng. João Ribeiro', body: 'Se precisar de alguma informação adicional, estou ao dispor.', at: new Date(Date.now() - 36e5 * 4.8).toISOString(), att: null }
        ],
        documents: [
          { id: id(), cat: 'd1', name: 'Contrato_Obra.pdf', url: '#', size: 1200000 },
          { id: id(), cat: 'd2', name: 'Orcamento_Base.pdf', url: '#', size: 860000 },
          { id: id(), cat: 'd3', name: 'Projeto_Arquitetura.pdf', url: '#', size: 4800000 },
          { id: id(), cat: 'd4', name: 'Licenca_Obras.pdf', url: '#', size: 410000 }
        ],
        updates: [
          { id: id(), kind: 'photos', text: '', at: new Date().toISOString() },
          { id: id(), kind: 'schedule', text: '', at: new Date(Date.now() - 864e5).toISOString() },
          { id: id(), kind: 'addendum', text: '', at: new Date(Date.now() - 864e5 * 5).toISOString() }
        ],
        requests: []
      };
    }
    seed();
    const get = pid => S.B[pid];
    const fileInfo = f => ({ url: URL.createObjectURL(f), size: f.size, name: f.name });
    const clone = o => o;
    return {
      live: false,
      async init() {},
      user() { return me; },
      async signIn(email) {
        const staff = /equipa|staff|admin/i.test(email);
        me = staff ? { id: 'staff1', email, name: 'Equipa Obras com Evidência', role: 'staff' } : { id: 'cli1', email, name: 'Álvaro Fernandes', role: 'client' };
        return me;
      },
      async signOut() { me = null; },
      async listProjects() { return me.role === 'staff' ? S.projects.slice() : S.projects.filter(p => p.clientId === me.id); },
      async loadBundle(pid) { return get(pid); },
      async addComment(pid, photoId, body) { const p = get(pid).photos.find(x => x.id === photoId); const c = { id: id(), author: me.name, body, at: today() }; p.comments.push(c); return c; },
      async sendMessage(pid, body, file) {
        const m = { id: id(), staff: me.role === 'staff', name: me.name, body, at: new Date().toISOString(), att: file ? fileInfo(file) : null };
        get(pid).messages.push(m); return m;
      },
      async confirmMaterial(pid, mid, accept) {
        const m = get(pid).materials.find(x => x.id === mid);
        if ((m.real ?? m.budget) > m.budget && !accept) throw new Error('É necessária a confirmação explícita do acréscimo.');
        m.status = 'approved'; m.accepted = (m.real ?? m.budget) > m.budget; m.decided = today();
      },
      async requestChange(pid, body) { get(pid).requests.push({ id: id(), body, at: new Date().toISOString(), author: me.name }); },
      async docUrl(d) { return d.url; },
      // ---- equipa ----
      async createClientProject(f) {
        const pid = id(), cid = id();
        const p = { id: pid, name: f.name, address: f.address, status: 'running', start: f.start, end: f.end, area: f.area, base: +f.base || 0, mgrName: f.mgrName, mgrRole: 'Direção de Obra', clientName: f.clientName, clientId: cid };
        S.projects.push(p);
        S.B[pid] = { project: p, phases: defaultPhases(f.start, f.end).map(x => ({ ...x, id: id() })), photos: [], materials: [], addenda: [], payments: [], messages: [], documents: [], updates: [], requests: [] };
        return p;
      },
      async saveProject(pid, patch) { Object.assign(get(pid).project, patch); },
      async savePhase(pid, ph) { Object.assign(get(pid).phases.find(x => x.id === ph.id), ph); },
      async addPhoto(pid, phaseId, file, caption, date) { const b = get(pid); const i = fileInfo(file); const p = { id: id(), phaseId, url: i.url, cls: null, caption, date: date || today(), comments: [] }; b.photos.push(p); return p; },
      async deletePhoto(pid, photoId) { const b = get(pid); b.photos = b.photos.filter(x => x.id !== photoId); },
      async saveMaterial(pid, m) { const b = get(pid); if (m.id) Object.assign(b.materials.find(x => x.id === m.id), m); else b.materials.push({ ...m, id: id(), accepted: false, decided: null }); },
      async deleteMaterial(pid, mid) { const b = get(pid); b.materials = b.materials.filter(x => x.id !== mid); },
      async saveAddendum(pid, a) { const b = get(pid); if (a.id) Object.assign(b.addenda.find(x => x.id === a.id), a); else b.addenda.push({ ...a, id: id() }); },
      async savePayment(pid, a) { const b = get(pid); if (a.id) Object.assign(b.payments.find(x => x.id === a.id), a); else b.payments.push({ ...a, id: id() }); },
      async addDocument(pid, cat, file) { get(pid).documents.push({ id: id(), cat, name: file.name, url: URL.createObjectURL(file), size: file.size }); },
      async deleteDocument(pid, did) { const b = get(pid); b.documents = b.documents.filter(x => x.id !== did); },
      async addUpdate(pid, kind, text) { get(pid).updates.unshift({ id: id(), kind, text, at: new Date().toISOString() }); }
    };
  }

  /* =============== SUPABASE =============== */
  function supa() {
    let sb, me = null; const BUCKET = 'obra-files';
    const loadScript = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('Falha a carregar o Supabase')); document.head.appendChild(s); });
    const chk = r => { if (r.error) throw new Error(r.error.message); return r.data; };
    const num = v => (v === null || v === undefined ? null : +v);
    const mapProject = r => ({ id: r.id, name: r.name, address: r.address, status: r.status, start: r.start_date, end: r.end_date, area: r.area, base: num(r.base_budget) || 0, mgrName: r.manager_name, mgrRole: r.manager_role, clientName: r.client?.name || '', clientId: r.client_id });
    const mapPhase = r => ({ id: r.id, kind: r.kind, name: r.name, sort: r.sort, ps: r.planned_start, pe: r.planned_end, as: r.actual_start, ae: r.actual_end, pct: r.pct, status: r.status, validated: r.validated, note: r.note || '' });
    const mapMat = r => ({ id: r.id, cat: r.cat, room: r.room || '', name: r.name, budget: num(r.budget_price) || 0, real: num(r.real_price), unit: r.unit, status: r.status, accepted: r.accepted_extra, decided: r.decided_at ? r.decided_at.slice(0, 10) : null });
    const signMany = async paths => {
      const list = paths.filter(Boolean); if (!list.length) return {};
      const r = chk(await sb.storage.from(BUCKET).createSignedUrls(list, 3600)); const o = {};
      r.forEach(x => { if (x.path) o[x.path] = x.signedUrl; }); return o;
    };
    async function upload(pid, folder, file) {
      const path = `${pid}/${folder}/${Date.now()}_${safeName(file.name)}`;
      chk(await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined }));
      return path;
    }
    return {
      live: true,
      async init() {
        await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
        sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
        const { data } = await sb.auth.getSession();
        if (data.session) me = await this._profile(data.session.user);
      },
      async _profile(u) {
        const { data } = await sb.from('profiles').select('name,role').eq('id', u.id).maybeSingle();
        return { id: u.id, email: u.email, name: data?.name || u.email, role: data?.role || 'client' };
      },
      user() { return me; },
      async signIn(email, password) { const r = chk(await sb.auth.signInWithPassword({ email, password })); me = await this._profile(r.user); return me; },
      async signOut() { await sb.auth.signOut(); me = null; },
      async listProjects() {
        const r = chk(await sb.from('projects').select('*, client:profiles!client_id(name)').order('created_at', { ascending: false }));
        return r.map(mapProject);
      },
      async loadBundle(pid) {
        const q = (t, o) => { let x = sb.from(t).select('*').eq('project_id', pid); if (o) x = x.order(o[0], { ascending: o[1] }); return x; };
        const [pr, ph, pt, pc, ma, ad, pa, ms, dc, up, rq] = await Promise.all([
          sb.from('projects').select('*, client:profiles!client_id(name)').eq('id', pid).single(),
          q('phases', ['sort', true]), q('photos', ['taken_at', false]), q('photo_comments', ['created_at', true]), q('materials', ['room', true]),
          q('addenda', ['added_on', false]), q('payments', ['paid_on', false]), q('messages', ['created_at', true]), q('documents', ['created_at', false]),
          q('updates', ['created_at', false]), q('change_requests', ['created_at', false])
        ]);
        const photosR = chk(pt), msgR = chk(ms);
        const urls = await signMany([...photosR.map(p => p.path), ...msgR.map(m => m.attachment_path)]);
        const comments = chk(pc);
        return {
          project: mapProject(chk(pr)), phases: chk(ph).map(mapPhase),
          photos: photosR.map(p => ({ id: p.id, phaseId: p.phase_id, path: p.path, url: urls[p.path] || null, cls: null, caption: p.caption || '', date: p.taken_at, comments: comments.filter(c => c.photo_id === p.id).map(c => ({ id: c.id, author: c.author_name || '', body: c.body, at: c.created_at.slice(0, 10) })) })),
          materials: chk(ma).map(mapMat),
          addenda: chk(ad).map(r => ({ id: r.id, desc: r.description, date: r.added_on, amount: num(r.amount), status: r.status })),
          payments: chk(pa).map(r => ({ id: r.id, label: r.label, date: r.paid_on, amount: num(r.amount), status: r.status })),
          messages: msgR.map(m => ({ id: m.id, staff: m.sender_staff, name: m.sender_name, body: m.body, at: m.created_at, att: m.attachment_path ? { url: urls[m.attachment_path], name: m.attachment_name } : null })),
          documents: chk(dc).map(d => ({ id: d.id, cat: d.category, name: d.name, path: d.path, size: d.size_bytes })),
          updates: chk(up).map(u => ({ id: u.id, kind: u.kind, text: u.text, at: u.created_at })),
          requests: chk(rq).map(r => ({ id: r.id, body: r.body, at: r.created_at }))
        };
      },
      async addComment(pid, photoId, body) {
        const r = chk(await sb.from('photo_comments').insert({ project_id: pid, photo_id: photoId, author_id: me.id, author_name: me.name, body }).select().single());
        return { id: r.id, author: me.name, body, at: r.created_at.slice(0, 10) };
      },
      async sendMessage(pid, body, file) {
        let attachment_path = null, attachment_name = null;
        if (file) { attachment_path = await upload(pid, 'chat', file); attachment_name = file.name; }
        const r = chk(await sb.from('messages').insert({ project_id: pid, sender_id: me.id, sender_name: me.name, sender_staff: me.role === 'staff', body, attachment_path, attachment_name }).select().single());
        const u = attachment_path ? (await signMany([attachment_path]))[attachment_path] : null;
        return { id: r.id, staff: r.sender_staff, name: me.name, body, at: r.created_at, att: attachment_path ? { url: u, name: attachment_name } : null };
      },
      async confirmMaterial(pid, mid, accept) { chk(await sb.rpc('confirm_material', { mid, accept })); },
      async requestChange(pid, body) { chk(await sb.from('change_requests').insert({ project_id: pid, author_id: me.id, body })); },
      async docUrl(d) { const u = await signMany([d.path]); return u[d.path]; },
      // ---- equipa ----
      async createClientProject(f) {
        const tmp = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
        const su = await tmp.auth.signUp({ email: f.email, password: f.password, options: { data: { name: f.clientName } } });
        if (su.error) throw new Error(su.error.message);
        if (!su.data.user || (su.data.user.identities && !su.data.user.identities.length)) throw new Error('Este email já tem conta.');
        const row = chk(await sb.from('projects').insert({ client_id: su.data.user.id, name: f.name, address: f.address, start_date: f.start, end_date: f.end, area: f.area, base_budget: +f.base || 0, manager_name: f.mgrName }).select('*, client:profiles!client_id(name)').single());
        chk(await sb.from('phases').insert(defaultPhases(f.start, f.end).map(p => ({ project_id: row.id, kind: p.kind, sort: p.sort, planned_start: p.ps, planned_end: p.pe }))));
        return mapProject(row);
      },
      async saveProject(pid, p) { chk(await sb.from('projects').update({ name: p.name, address: p.address, status: p.status, start_date: p.start, end_date: p.end, area: p.area, base_budget: p.base, manager_name: p.mgrName }).eq('id', pid)); },
      async savePhase(pid, p) { chk(await sb.from('phases').update({ name: p.name || null, planned_start: p.ps || null, planned_end: p.pe || null, actual_start: p.as || null, actual_end: p.ae || null, pct: +p.pct, status: p.status, validated: !!p.validated, note: p.note }).eq('id', p.id)); },
      async addPhoto(pid, phaseId, file, caption, date) {
        const path = await upload(pid, 'fotos', file);
        const r = chk(await sb.from('photos').insert({ project_id: pid, phase_id: phaseId || null, path, caption, taken_at: date || today() }).select().single());
        const u = await signMany([path]);
        return { id: r.id, phaseId, path, url: u[path], cls: null, caption, date: r.taken_at, comments: [] };
      },
      async deletePhoto(pid, photoId, path) { chk(await sb.from('photos').delete().eq('id', photoId)); if (path) await sb.storage.from(BUCKET).remove([path]); },
      async saveMaterial(pid, m) {
        const row = { project_id: pid, cat: m.cat, room: m.room, name: m.name, budget_price: m.budget, real_price: m.real, unit: m.unit, status: m.status };
        chk(m.id ? await sb.from('materials').update(row).eq('id', m.id) : await sb.from('materials').insert(row));
      },
      async deleteMaterial(pid, mid) { chk(await sb.from('materials').delete().eq('id', mid)); },
      async saveAddendum(pid, a) { const row = { project_id: pid, description: a.desc, added_on: a.date, amount: a.amount, status: a.status }; chk(a.id ? await sb.from('addenda').update(row).eq('id', a.id) : await sb.from('addenda').insert(row)); },
      async savePayment(pid, a) { const row = { project_id: pid, label: a.label, paid_on: a.date, amount: a.amount, status: a.status }; chk(a.id ? await sb.from('payments').update(row).eq('id', a.id) : await sb.from('payments').insert(row)); },
      async addDocument(pid, cat, file) { const path = await upload(pid, 'docs', file); chk(await sb.from('documents').insert({ project_id: pid, category: cat, name: file.name, path, size_bytes: file.size })); },
      async deleteDocument(pid, did, path) { chk(await sb.from('documents').delete().eq('id', did)); if (path) await sb.storage.from(BUCKET).remove([path]); },
      async addUpdate(pid, kind, text) { chk(await sb.from('updates').insert({ project_id: pid, kind, text })); }
    };
  }

  window.DB = LIVE ? supa() : demo();
  window.DBU = { today, addDays, diffDays, KINDS, defaultPhases };
})();
