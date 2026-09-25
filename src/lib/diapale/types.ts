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
  cv_url: string | null;
};

export type Company = {
  id: string;
  company_name: string;
  secteur: string | null;
  contact_phone: string | null;
  ville: string | null;
  about: string | null;
};

export type CandidateExperience = {
  id: string;
  candidate_id: string;
  poste: string;
  entreprise: string | null;
  date_debut: string | null;
  date_fin: string | null;
  description: string | null;
};

export type ExperienceLevel = "aucune" | "1-2" | "3-5" | "5+";

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
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
  // Profil recherché — facultatif, sert au score de compatibilité.
  experience_level: ExperienceLevel | null;
  niveau_etude_requis: string | null;
  competences_requises: string[];
};

export type InterestStatus =
  | "nouveau"
  | "vue"
  | "preselectionne"
  | "entretien"
  | "accepte"
  | "refuse";

export type OfferInterest = {
  offer_id: string;
  candidate_id: string;
  type: "consulte" | "postule";
  status: InterestStatus;
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
  status: InterestStatus;
  profile: Profile;
  candidateProfile: CandidateProfile | null;
  portfolio: PortfolioItem[];
};

/** Une candidature vue depuis l'espace candidat : "Mes candidatures". */
export type MyApplication = {
  offerId: string;
  offer: JobOffer;
  companyName: string | null;
  status: InterestStatus;
  createdAt: string;
};
