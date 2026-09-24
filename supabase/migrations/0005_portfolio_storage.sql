-- Stockage des photos de réalisations (facultatif, table portfolio_items déjà en place).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Une candidate ne peut déposer que dans son propre dossier : portfolio/{user_id}/...
create policy "portfolio storage: candidate uploads own folder"
on storage.objects for insert
with check (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "portfolio storage: candidate deletes own"
on storage.objects for delete
using (
  bucket_id = 'portfolio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "portfolio storage: public read"
on storage.objects for select
using (bucket_id = 'portfolio');
