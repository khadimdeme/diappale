-- Manquait : le droit de supprimer SA PROPRE ligne candidate_profiles.
-- Nécessaire pour /auth/callback (ensureRole) quand une personne connectée
-- via Google avait en fait choisi "recruteur" — on bascule candidate_profiles
-- vers companies.
create policy "candidate_profiles: delete own" on public.candidate_profiles
  for delete using (id = auth.uid());
