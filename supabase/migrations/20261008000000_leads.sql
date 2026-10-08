-- Demandes reçues par le site (mini-audit, rappel, assistant).
-- Écriture uniquement côté serveur (app/api/contact/route.ts) avec la clé service :
-- RLS activé et aucune politique, donc aucun accès avec la clé publique.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null,
  source text,
  name text,
  company text,
  email text,
  phone text,
  contact text not null,
  timing text,
  estimate jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'nouveau'
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
