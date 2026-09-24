// Types partagés entre les pages (design) et la couche service (données).
// Rien ici n'appelle Supabase — juste la forme des données.

export type Role = "candidat" | "recruteur";

export type Profile = {
  id: string;
  role: Role;
  full_name: string | null;
  phone: string | null;
  ville: string | null;
};

export type CandidateProfile = {
  id: string;
  metier: string | null;
  competences: string[];
  experience_years: number | null;
  niveau_etude: string | null;
  disponible: boolean;
  cni_verified: boolean;
};

export type Company = {
  id: string;
  company_name: string;
  secteur: string | null;
  contact_phone: string | null;
};

export type JobOffer = {
  id: string;
  recruiter_id: string;
  titre: string;
  ville: string;
  secteur: string | null;
  type_contrat: string | null;
  description: string | null;
  salaire: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
};

export type OfferInterest = {
  offer_id: string;
  candidate_id: string;
  type: "consulte" | "postule";
  created_at: string;
};

export type PortfolioItem = {
  id: string;
  candidate_id: string;
  label: string;
  image_url: string;
};

export type CandidateWithInterest = {
  interestType: "consulte" | "postule";
  profile: Profile;
  candidateProfile: CandidateProfile | null;
  portfolio: PortfolioItem[];
};
