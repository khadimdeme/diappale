-- Diapalé — Row Level Security
-- Règle centrale : un recruteur ne peut voir le profil complet d'un candidat
-- QUE si ce candidat a postulé/consulté une de ses offres (table offer_interests).
-- Pas de parcours libre des profils candidats.

alter table public.profiles enable row level security;
alter table public.candidate_profiles enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.companies enable row level security;
alter table public.job_offers enable row level security;
alter table public.offer_interests enable row level security;

-- Petite fonction utilitaire : la ligne interest existe-t-elle
-- entre ce candidat et une offre de ce recruteur ?
create or replace function public.has_offer_interest(p_candidate_id uuid, p_recruiter_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.offer_interests oi
    join public.job_offers jo on jo.id = oi.offer_id
    where oi.candidate_id = p_candidate_id
      and jo.recruiter_id = p_recruiter_id
  );
$$;

-- ---------- profiles ----------
create policy "profiles: own row" on public.profiles
  for select using (id = auth.uid());

create policy "profiles: recruiters are public" on public.profiles
  for select using (role = 'recruteur');

create policy "profiles: visible to recruiter after interest" on public.profiles
  for select using (
    role = 'candidat'
    and public.has_offer_interest(id, auth.uid())
  );

create policy "profiles: insert own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

-- ---------- candidate_profiles ----------
create policy "candidate_profiles: own row" on public.candidate_profiles
  for select using (id = auth.uid());

create policy "candidate_profiles: visible to recruiter after interest" on public.candidate_profiles
  for select using (public.has_offer_interest(id, auth.uid()));

create policy "candidate_profiles: insert own" on public.candidate_profiles
  for insert with check (id = auth.uid());

create policy "candidate_profiles: update own" on public.candidate_profiles
  for update using (id = auth.uid());

-- ---------- portfolio_items ----------
create policy "portfolio_items: own" on public.portfolio_items
  for select using (candidate_id = auth.uid());

create policy "portfolio_items: visible to recruiter after interest" on public.portfolio_items
  for select using (public.has_offer_interest(candidate_id, auth.uid()));

create policy "portfolio_items: manage own" on public.portfolio_items
  for all using (candidate_id = auth.uid()) with check (candidate_id = auth.uid());

-- ---------- companies (publiques : un candidat peut contacter une entreprise direct) ----------
create policy "companies: public read" on public.companies
  for select using (true);

create policy "companies: manage own" on public.companies
  for all using (id = auth.uid()) with check (id = auth.uid());

-- ---------- job_offers (publiques : tout le monde peut chercher un emploi) ----------
create policy "job_offers: public read active" on public.job_offers
  for select using (is_active = true or recruiter_id = auth.uid());

create policy "job_offers: manage own" on public.job_offers
  for all using (recruiter_id = auth.uid()) with check (recruiter_id = auth.uid());

-- ---------- offer_interests ----------
create policy "offer_interests: candidate creates own" on public.offer_interests
  for insert with check (candidate_id = auth.uid());

create policy "offer_interests: candidate reads own" on public.offer_interests
  for select using (candidate_id = auth.uid());

create policy "offer_interests: recruiter reads interests on own offers" on public.offer_interests
  for select using (
    exists (
      select 1 from public.job_offers jo
      where jo.id = offer_id and jo.recruiter_id = auth.uid()
    )
  );
