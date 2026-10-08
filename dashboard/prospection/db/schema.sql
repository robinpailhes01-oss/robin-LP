-- Prospection Luma : schéma de la base (Supabase / Postgres).
-- À appliquer une seule fois, dans le projet Supabase choisi par Robin, après sa validation.
-- Tables préfixées « prospection_ » pour ne jamais entrer en collision avec d'autres tables du projet.
-- RLS activé sans aucune règle : seule la clé secrète (scripts et dashboard côté serveur) peut lire ou écrire.

create table if not exists prospection_leads (
  id                  uuid primary key default gen_random_uuid(),
  nom                 text not null,
  activite            text not null,                 -- restaurant, spa, hôtel, gîte, école de ski…
  segment             text not null check (segment in ('montagne', 'pme')),
  zone                text not null,                 -- station ou ville
  site_web            text,
  emails              text[] not null default '{}',
  telephone           text,
  adresse             text,
  nb_avis             integer,
  note_google         numeric(2, 1),
  source              text not null default 'outscraper',
  source_id           text unique,                   -- identifiant Google du lieu : sert au dédoublonnage
  score               smallint check (score between 0 and 10),
  score_justification text,
  variante            text check (variante in ('1', '2')),  -- tirée au hasard 50/50 dans chaque segment
  statut              text not null default 'nouveau'
                        check (statut in ('nouveau', 'contacte', 'repondu', 'rdv', 'refus', 'desinscrit')),
  notes               text not null default '',
  collecte_le         timestamptz not null default now(),
  maj_le              timestamptz not null default now()
);

create table if not exists prospection_messages (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references prospection_leads (id) on delete cascade,
  lot          text not null,                        -- ex. 2026-10-15-lot1
  type         text not null check (type in ('premier', 'relance')),
  variante     text not null check (variante in ('1', '2')),
  destinataire text not null,
  objet        text not null,
  corps        text not null,
  statut       text not null default 'brouillon' check (statut in ('brouillon', 'envoye', 'erreur')),
  resend_id    text,
  erreur       text,
  envoye_le    timestamptz,
  cree_le      timestamptz not null default now()
);
create index if not exists prospection_messages_lead_id on prospection_messages (lead_id);

-- Toute adresse ici ne reçoit plus jamais rien. Toujours en minuscules.
create table if not exists prospection_suppressions (
  email   text primary key,
  raison  text not null default 'desinscription',
  cree_le timestamptz not null default now()
);

-- Historique d'un lead : changements de statut, notes.
create table if not exists prospection_evenements (
  id      bigint generated always as identity primary key,
  lead_id uuid not null references prospection_leads (id) on delete cascade,
  type    text not null check (type in ('statut', 'note')),
  detail  text not null default '',
  cree_le timestamptz not null default now()
);
create index if not exists prospection_evenements_lead_id on prospection_evenements (lead_id);

alter table prospection_leads        enable row level security;
alter table prospection_messages     enable row level security;
alter table prospection_suppressions enable row level security;
alter table prospection_evenements   enable row level security;
