// Couche service — tout ce qui concerne le côté "recruteur".
// Les pages appellent ces fonctions, jamais `supabase.from(...)` directement.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CandidateWithInterest, Company, JobOffer } from "./types";

export async function getMyCompany(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("companies")
    .select("id, company_name, secteur, contact_phone")
    .eq("id", userId)
    .single();
  return data as Company | null;
}

export async function listMyOffers(supabase: SupabaseClient, recruiterId: string) {
  const { data } = await supabase
    .from("job_offers")
    .select("id, recruiter_id, titre, ville, secteur, type_contrat, description, salaire, contact_phone, is_active, created_at")
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

export type NewOfferInput = {
  titre: string;
  ville: string;
  type_contrat: string;
  description: string;
  salaire: string;
  contact_phone: string;
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
  });
}

export async function getOffer(supabase: SupabaseClient, offerId: string) {
  const { data } = await supabase
    .from("job_offers")
    .select("id, recruiter_id, titre, ville, secteur, type_contrat, description, salaire, contact_phone, is_active, created_at")
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
    .select("type, created_at, candidate_id")
    .eq("offer_id", offerId)
    .order("created_at", { ascending: false });

  const candidateIds = Array.from(new Set((interests ?? []).map((i) => i.candidate_id)));
  if (!candidateIds.length) return [];

  const [{ data: profiles }, { data: candidateProfiles }] = await Promise.all([
    supabase.from("profiles").select("id, role, full_name, phone, ville").in("id", candidateIds),
    supabase
      .from("candidate_profiles")
      .select("id, metier, competences, experience_years, niveau_etude, disponible, cni_verified")
      .in("id", candidateIds),
  ]);

  const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const candidateById = Object.fromEntries((candidateProfiles ?? []).map((c) => [c.id, c]));

  return (interests ?? [])
    .filter((i) => profileById[i.candidate_id])
    .map((i) => ({
      interestType: i.type as "consulte" | "postule",
      profile: profileById[i.candidate_id],
      candidateProfile: candidateById[i.candidate_id] ?? null,
    }));
}
