-- Suivi de candidature (statut) + champs optionnels pour un matching plus fin.

-- 1. Statut de candidature, mis à jour par le recruteur.
alter table public.offer_interests
  add column status text not null default 'nouveau'
  check (status in ('nouveau','vue','preselectionne','entretien','accepte','refuse'));

create policy "offer_interests: recruiter updates status on own offers" on public.offer_interests
  for update using (
    exists (
      select 1 from public.job_offers jo
      where jo.id = offer_id and jo.recruiter_id = auth.uid()
    )
  );

-- 2. Profil recherché (facultatif) sur l'offre, pour calculer un score de compatibilité.
alter table public.job_offers
  add column experience_level text check (experience_level in ('aucune','1-2','3-5','5+')),
  add column niveau_etude_requis text,
  add column competences_requises text[] not null default '{}';
