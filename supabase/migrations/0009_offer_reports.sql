-- Signalement d'une offre par un utilisateur connecté (arnaque, fausse annonce…).
-- Aucune lecture depuis le site : les signalements se consultent dans Supabase.

create table public.offer_reports (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.job_offers(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (offer_id, reporter_id)
);

alter table public.offer_reports enable row level security;

create policy "offer_reports: insert own" on public.offer_reports
  for insert to authenticated
  with check (reporter_id = auth.uid());
