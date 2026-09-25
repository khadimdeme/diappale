// Couche service — tout ce qui concerne le côté "recruteur".
// Les pages appellent ces fonctions, jamais `supabase.from(...)` directement.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CandidateWithInterest, Company, ExperienceLevel, InterestStatus, JobOffer } from "./types";

const OFFER_COLUMNS =
  "id, recruiter_id, titre, ville, secteur, type_contrat, description, salaire, contact_phone, contact_email, is_active, created_at, experience_level, niveau_etude_requis, competences_requises";

export async function getMyCompany(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("companies")
    .select("id, company_name, secteur, contact_phone, ville, about")
    .eq("id", userId)
    .single();
  return data as Company | null;
}

export type CompanyUpdate = {
  company_name: string;
  secteur: string;
  ville: string;
  contact_phone: string;
  about: string;
};

export async function updateMyCompany(
  supabase: SupabaseClient,
  userId: string,
  company: CompanyUpdate
) {
  return supabase
    .from("companies")
    .update({
      company_name: company.company_name,
      secteur: company.secteur,
      ville: company.ville,
      contact_phone: company.contact_phone,
      about: company.about,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export async function listMyOffers(supabase: SupabaseClient, recruiterId: string) {
  const { data } = await supabase
    .from("job_offers")
    .select(OFFER_COLUMNS)
    .eq("recruiter_id", recruiterId)
    .order("created_at", { ascending: false });
  return (data ?? []) as JobOffer[];
}

/** Nombre de candidats intéressés, par offre — pour l'affichage en liste. */
export async function countInterestsByOffer(supabase: SupabaseClient, offerIds: string[]) {
  if (!offerIds.length) return {} as Record<string, number>;
  const { data } = await supabase
    .from("offer_interests")
    .select("offer_id")
    .in("offer_id", offerIds);

  return (data ?? []).reduce<Record<string, number>>((acc, i) => {
    acc[i.offer_id] = (acc[i.offer_id] ?? 0) + 1;
    return acc;
  }, {});
}

/** Stats globales pour le tableau de bord ("3 offres actives, 18 candidatures…"). */
export async function getRecruiterStats(supabase: SupabaseClient, recruiterId: string) {
  const { data: offers } = await supabase
    .from("job_offers")
    .select("id, is_active")
    .eq("recruiter_id", recruiterId);

  const offerIds = (offers ?? []).map((o) => o.id);
  const activeOffers = (offers ?? []).filter((o) => o.is_active).length;

  if (!offerIds.length) {
    return { activeOffers: 0, totalCandidatures: 0, preselectionnes: 0 };
  }

  const { data: interests } = await supabase
    .from("offer_interests")
    .select("status")
    .in("offer_id", offerIds);

  const totalCandidatures = interests?.length ?? 0;
  const preselectionnes =
    interests?.filter((i) =>
      ["preselectionne", "entretien", "accepte"].includes(i.status)
    ).length ?? 0;

  return { activeOffers, totalCandidatures, preselectionnes };
}

export type NewOfferInput = {
  titre: string;
  ville: string;
  type_contrat: string;
  description: string;
  salaire: string;
  contact_phone: string;
  contact_email?: string;
  experience_level?: ExperienceLevel | "";
  niveau_etude_requis?: string;
  competences_requises?: string; // saisie brute, séparée par des virgules
};

export async function createOffer(
  supabase: SupabaseClient,
  recruiterId: string,
  offer: NewOfferInput
) {
  return supabase.from("job_offers").insert({
    recruiter_id: recruiterId,
    titre: offer.titre,
    ville: offer.ville,
    type_contrat: offer.type_contrat,
    description: offer.description,
    salaire: offer.salaire,
    contact_phone: offer.contact_phone,
    contact_email: offer.contact_email || null,
    experience_level: offer.experience_level || null,
    niveau_etude_requis: offer.niveau_etude_requis || null,
    competences_requises: (offer.competences_requises ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  });
}

export async function getOffer(supabase: SupabaseClient, offerId: string) {
  const { data } = await supabase
    .from("job_offers")
    .select(OFFER_COLUMNS)
    .eq("id", offerId)
    .single();
  return data as JobOffer | null;
}

/**
 * Candidats intéressés par une offre — RLS ne renvoie que ceux qui ont
 * réellement consulté/postulé à CETTE offre (pas d'accès libre à la base).
 */
export async function getInterestedCandidates(
  supabase: SupabaseClient,
  offerId: string
): Promise<CandidateWithInterest[]> {
  const { data: interests } = await supabase
    .from("offer_interests")
    .select("type, status, created_at, candidate_id")
    .eq("offer_id", offerId)
    .order("created_at", { ascending: false });

  const candidateIds = Array.from(new Set((interests ?? []).map((i) => i.candidate_id)));
  if (!candidateIds.length) return [];

  const [{ data: profiles }, { data: candidateProfiles }, { data: portfolioItems }] = await Promise.all([
    supabase.from("profiles").select("id, role, full_name, phone, ville").in("id", candidateIds),
    supabase
      .from("candidate_profiles")
      .select("id, metier, competences, experience_years, niveau_etude, disponible, cni_verified, cv_url")
      .in("id", candidateIds),
    supabase
      .from("portfolio_items")
      .select("id, candidate_id, label, image_url")
      .in("candidate_id", candidateIds),
  ]);

  const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const candidateById = Object.fromEntries((candidateProfiles ?? []).map((c) => [c.id, c]));

  return (interests ?? [])
    .filter((i) => profileById[i.candidate_id])
    .map((i) => ({
      interestType: i.type as "consulte" | "postule",
      status: i.status as InterestStatus,
      profile: profileById[i.candidate_id],
      candidateProfile: candidateById[i.candidate_id] ?? null,
      portfolio: (portfolioItems ?? []).filter((p) => p.candidate_id === i.candidate_id),
    }));
}

/** Fait avancer une candidature dans le suivi (nouveau -> vue -> présélectionné -> …). */
export async function updateInterestStatus(
  supabase: SupabaseClient,
  offerId: string,
  candidateId: string,
  status: InterestStatus
) {
  return supabase
    .from("offer_interests")
    .update({ status })
    .eq("offer_id", offerId)
    .eq("candidate_id", candidateId);
}
