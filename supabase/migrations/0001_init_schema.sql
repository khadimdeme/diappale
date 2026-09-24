-- Diapalé — schéma initial
create extension if not exists "pgcrypto";

-- Profil de base, un par utilisateur auth
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('candidat','recruteur')),
  full_name text,
  phone text,
  ville text,
  created_at timestamptz not null default now()
);

-- Détails spécifiques au profil candidat
create table public.candidate_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  metier text,
  competences text[] not null default '{}',
  experience_years int,
  niveau_etude text,
  disponible boolean not null default true,
  cni_verified boolean not null default false,
  boosted_until timestamptz,
  updated_at timestamptz not null default now()
);

-- Photos de réalisations (facultatif)
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
  label text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

-- Détails spécifiques au profil recruteur / entreprise
create table public.companies (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  secteur text,
  -- numéro WhatsApp public de contact, séparé de profiles.phone (privé) :
  -- un candidat peut toujours contacter une entreprise directement.
  contact_phone text,
  updated_at timestamptz not null default now()
);

-- Offres publiées par un recruteur
create table public.job_offers (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  titre text not null,
  ville text not null,
  secteur text,
  type_contrat text,
  description text,
  salaire text,
  -- numéro WhatsApp public sur l'annonce, pour "Postuler via WhatsApp"
  -- sans exposer profiles.phone (privé) au grand public.
  contact_phone text,
  is_active boolean not null default true,
  boosted_until timestamptz,
  created_at timestamptz not null default now()
);

-- Un candidat consulte ou postule à une offre -> c'est ce qui "débloque" son profil pour ce recruteur
create table public.offer_interests (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.job_offers(id) on delete cascade,
  candidate_id uuid not null references public.candidate_profiles(id) on delete cascade,
  type text not null check (type in ('consulte','postule')),
  created_at timestamptz not null default now(),
  unique (offer_id, candidate_id, type)
);

create index on public.job_offers (ville);
create index on public.job_offers (secteur);
create index on public.offer_interests (candidate_id);
create index on public.offer_interests (offer_id);
