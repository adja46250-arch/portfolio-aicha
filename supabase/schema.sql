-- =========================================================
-- PORTFOLIO - SCHÉMA SUPABASE
-- =========================================================

-- =========================================================
-- 1. TABLES
-- =========================================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('dev', 'design')),
  status text not null default 'live' check (status in ('live', 'wip')),
  description text not null,
  stack text[] default '{}',
  link text,
  image text,
  images text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists settings (
  id int primary key default 1,
  hero_image text,
  constraint single_row check (id = 1)
);

-- Ligne de configuration unique
insert into settings (id, hero_image)
values (1, null)
on conflict (id) do nothing;


-- =========================================================
-- 2. ROW LEVEL SECURITY
-- =========================================================

alter table projects enable row level security;
alter table messages enable row level security;
alter table settings enable row level security;


-- =========================================================
-- 3. NETTOYAGE DES ANCIENNES POLICIES
-- =========================================================

drop policy if exists "Lecture publique des projets" on projects;
drop policy if exists "Écriture des projets réservée aux connectés" on projects;

drop policy if exists "N'importe qui peut envoyer un message" on messages;
drop policy if exists "Lecture des messages réservée aux connectés" on messages;

drop policy if exists "Lecture publique des réglages" on settings;
drop policy if exists "Écriture des réglages réservée aux connectés" on settings;


-- =========================================================
-- 4. PROJECTS
-- =========================================================

-- Tout le monde peut consulter les projets du portfolio.
create policy "projects_public_read"
on projects
for select
to anon, authenticated
using (true);


-- Seul TON compte peut créer un projet.
create policy "projects_admin_insert"
on projects
for insert
to authenticated
with check (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);


-- Seul TON compte peut modifier un projet.
create policy "projects_admin_update"
on projects
for update
to authenticated
using (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
)
with check (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);


-- Seul TON compte peut supprimer un projet.
create policy "projects_admin_delete"
on projects
for delete
to authenticated
using (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);


-- =========================================================
-- 5. MESSAGES
-- =========================================================

-- Les visiteurs peuvent envoyer un message.
create policy "messages_public_insert"
on messages
for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 100
  and length(trim(email)) between 5 and 254
  and length(trim(message)) between 1 and 5000
);


-- Seul TON compte peut consulter les messages.
create policy "messages_admin_read"
on messages
for select
to authenticated
using (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);


-- =========================================================
-- 6. SETTINGS
-- =========================================================

-- La page d'accueil peut récupérer la photo publiquement.
create policy "settings_public_read"
on settings
for select
to anon, authenticated
using (true);


-- Seul TON compte peut modifier les réglages.
create policy "settings_admin_update"
on settings
for update
to authenticated
using (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
)
with check (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);


-- Seul TON compte peut créer la ligne de settings si nécessaire.
create policy "settings_admin_insert"
on settings
for insert
to authenticated
with check (
  auth.uid() = 'cecb2e8e-571b-4e2f-bc2e-30e2a5870f37'::uuid
);