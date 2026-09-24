-- À l'inscription (auth.users), on crée automatiquement la ligne profiles
-- correspondante, avec le rôle choisi sur l'écran d'inscription
-- (passé via options.data lors du supabase.auth.signUp côté client).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, ville)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'candidat'),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'ville'
  );

  if coalesce(new.raw_user_meta_data ->> 'role', 'candidat') = 'recruteur' then
    insert into public.companies (id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', 'Mon entreprise'));
  else
    insert into public.candidate_profiles (id)
    values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
