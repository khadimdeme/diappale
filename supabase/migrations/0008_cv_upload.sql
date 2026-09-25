-- CV déposé par le candidat (PDF ou photo), un seul à la fois, remplaçable.
alter table public.candidate_profiles
  add column cv_url text;

insert into storage.buckets (id, name, public)
values ('cv', 'cv', true)
on conflict (id) do nothing;

create policy "cv storage: candidate uploads own folder"
on storage.objects for insert
with check (
  bucket_id = 'cv'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cv storage: candidate deletes own"
on storage.objects for delete
using (
  bucket_id = 'cv'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "cv storage: public read"
on storage.objects for select
using (bucket_id = 'cv');
