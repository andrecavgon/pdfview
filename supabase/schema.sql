-- Obras com Evidência — esquema Supabase (Postgres + Auth + Storage)
-- Correr uma vez no SQL Editor do projeto Supabase.
-- Depois: criar a conta da equipa em Authentication > Users e promovê-la com:
--   update profiles set role='staff' where id = '<uuid-do-utilizador>';

create extension if not exists pgcrypto;

-- ---------- tabelas ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'client' check (role in ('client','staff'))
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  address text,
  status text not null default 'running' check (status in ('planned','running','done')),
  start_date date,
  end_date date,
  area text,
  base_budget numeric(12,2) not null default 0,
  manager_name text,
  manager_role text default 'Direção de Obra',
  created_at timestamptz not null default now()
);

create table if not exists phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null default 'custom',      -- dem, str, net, cov, car, fin, custom
  name text,                                -- nome personalizado (opcional)
  sort int not null default 0,
  planned_start date, planned_end date,
  actual_start date,  actual_end date,
  pct int not null default 0 check (pct between 0 and 100),
  status text not null default 'planned' check (status in ('planned','running','done')),
  validated boolean not null default false, -- validação técnica de qualidade
  note text
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  phase_id uuid references phases(id) on delete set null,
  path text not null,                       -- caminho no bucket obra-files
  caption text,
  taken_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists photo_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  photo_id uuid not null references photos(id) on delete cascade,
  author_id uuid not null references profiles(id),
  author_name text,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  cat text not null default 'rev' check (cat in ('rev','car','ban','san')),
  room text,
  name text not null,
  budget_price numeric(10,2) not null default 0,   -- PVP orçamentado
  real_price numeric(10,2),                        -- PVP real selecionado
  unit text not null default 'm2' check (unit in ('m2','un')),
  status text not null default 'analysis' check (status in ('analysis','selected','approved')),
  accepted_extra boolean not null default false,
  decided_at timestamptz
);

create table if not exists addenda (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  description text not null,
  added_on date not null default current_date,
  amount numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','approved'))
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  label text not null,
  paid_on date not null default current_date,
  amount numeric(12,2) not null default 0,
  status text not null default 'paid' check (status in ('paid','open'))
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  sender_name text,
  sender_staff boolean not null default false,
  body text,
  attachment_path text,
  attachment_name text,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category text not null default 'd3',      -- d1 contrato, d2 orçamentos, d3 projetos, d4 licenças
  name text not null,
  path text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null default 'custom',      -- photos, schedule, addendum, custom
  text text,
  created_at timestamptz not null default now()
);

create table if not exists change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_client on projects(client_id);
create index if not exists idx_phases_project on phases(project_id);
create index if not exists idx_photos_project on photos(project_id);
create index if not exists idx_messages_project on messages(project_id, created_at);

-- ---------- funções auxiliares ----------
create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'staff')
$$;

create or replace function owns_project(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from projects where id = pid and client_id = auth.uid())
$$;

-- perfil criado automaticamente (sempre como cliente; a equipa é promovida à mão)
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), 'client')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- confirmação de material pelo cliente (o servidor impõe a aceitação do acréscimo)
create or replace function confirm_material(mid uuid, accept boolean) returns void
language plpgsql security definer set search_path = public as $$
declare m materials;
begin
  select * into m from materials where id = mid;
  if not found or not (is_staff() or owns_project(m.project_id)) then
    raise exception 'não autorizado';
  end if;
  if coalesce(m.real_price, m.budget_price) > m.budget_price and not accept then
    raise exception 'é necessária a confirmação explícita do acréscimo';
  end if;
  update materials
     set status = 'approved',
         accepted_extra = coalesce(m.real_price, m.budget_price) > m.budget_price,
         decided_at = now()
   where id = mid;
end $$;

-- ---------- segurança por linha (RLS) ----------
alter table profiles enable row level security;
drop policy if exists profiles_read on profiles;
create policy profiles_read on profiles for select using (id = auth.uid() or is_staff());
drop policy if exists profiles_staff on profiles;
create policy profiles_staff on profiles for all using (is_staff()) with check (is_staff());

alter table projects enable row level security;
drop policy if exists projects_staff on projects;
create policy projects_staff on projects for all using (is_staff()) with check (is_staff());
drop policy if exists projects_client on projects;
create policy projects_client on projects for select using (client_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['phases','photos','photo_comments','materials','addenda','payments','messages','documents','updates','change_requests']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_staff', t);
    execute format('create policy %I on %I for all using (is_staff()) with check (is_staff())', t || '_staff', t);
    execute format('drop policy if exists %I on %I', t || '_client_read', t);
    execute format('create policy %I on %I for select using (owns_project(project_id))', t || '_client_read', t);
  end loop;
end $$;

-- o cliente só pode ESCREVER: comentários, mensagens e pedidos de alteração (nos seus projetos)
drop policy if exists photo_comments_client_ins on photo_comments;
create policy photo_comments_client_ins on photo_comments for insert
  with check (owns_project(project_id) and author_id = auth.uid());
drop policy if exists messages_client_ins on messages;
create policy messages_client_ins on messages for insert
  with check (owns_project(project_id) and sender_id = auth.uid() and sender_staff = false);
drop policy if exists change_requests_client_ins on change_requests;
create policy change_requests_client_ins on change_requests for insert
  with check (owns_project(project_id) and author_id = auth.uid());

-- ---------- armazenamento (fotos, documentos, anexos) ----------
-- caminho: <project_id>/<pasta>/<ficheiro>
insert into storage.buckets (id, name, public) values ('obra-files', 'obra-files', false)
on conflict (id) do nothing;

drop policy if exists obra_files_staff on storage.objects;
create policy obra_files_staff on storage.objects for all
  using (bucket_id = 'obra-files' and is_staff())
  with check (bucket_id = 'obra-files' and is_staff());

drop policy if exists obra_files_client_read on storage.objects;
create policy obra_files_client_read on storage.objects for select
  using (bucket_id = 'obra-files' and owns_project(((storage.foldername(name))[1])::uuid));

-- o cliente só pode carregar anexos do chat (upload de fotos é exclusivo da empresa)
drop policy if exists obra_files_client_chat on storage.objects;
create policy obra_files_client_chat on storage.objects for insert
  with check (bucket_id = 'obra-files'
              and owns_project(((storage.foldername(name))[1])::uuid)
              and (storage.foldername(name))[2] = 'chat');
