-- 1. Expériences du candidat (liste, comme un vrai CV).
create table public.candidate_experiences (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
  poste text not null,
  entreprise text,
  date_debut date,
  date_fin date, -- null = poste actuel
  description text,
  created_at timestamptz not null default now()
);

alter table public.candidate_experiences enable row level security;

create policy "candidate_experiences: own" on public.candidate_experiences
  for select using (candidate_id = auth.uid());

create policy "candidate_experiences: visible to recruiter after interest" on public.candidate_experiences
  for select using (public.has_offer_interest(candidate_id, auth.uid()));

create policy "candidate_experiences: manage own" on public.candidate_experiences
  for all using (candidate_id = auth.uid()) with check (candidate_id = auth.uid());

-- 2. Fiche entreprise publique : ville + présentation.
alter table public.companies
  add column ville text,
  add column about text;

-- 3. Un deuxième canal de candidature, au choix du recruteur.
alter table public.job_offers
  add column contact_email text;
