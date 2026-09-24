// Couche service — tout ce qui concerne le côté "candidat".
// Les pages appellent ces fonctions, jamais `supabase.from(...)` directement.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CandidateProfile, JobOffer, Profile } from "./types";

export async function getMyBaseProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, ville")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

export async function getMyCandidateProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("candidate_profiles")
    .select("id, metier, competences, experience_years, niveau_etude, disponible, cni_verified")
    .eq("id", userId)
    .single();
  return data as CandidateProfile | null;
}

export type ProfileUpdate = {
  full_name: string;
  phone: string;
  ville: string;
};

export type CandidateProfileUpdate = {
  metier: string;
  competences: string; // saisie brute, séparée par des virgules
  experience_years: number | "";
  niveau_etude: string;
  disponible: boolean;
};

export async function updateMyProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: ProfileUpdate,
  candidate: CandidateProfileUpdate
) {
  const [profileRes, candidateRes] = await Promise.all([
    supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        ville: profile.ville,
      })
      .eq("id", userId),
    supabase
      .from("candidate_profiles")
      .update({
        metier: candidate.metier,
        competences: candidate.competences
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        experience_years:
          candidate.experience_years === "" ? null : Number(candidate.experience_years),
        niveau_etude: candidate.niveau_etude,
        disponible: candidate.disponible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId),
  ]);

  return { profileRes, candidateRes };
}

export type OfferFilters = {
  ville?: string;
  q?: string;
};

export async function listActiveOffers(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("job_offers")
    .select(
      "id, recruiter_id, titre, ville, secteur, type_contrat, description, salaire, contact_phone, is_active, created_at"
    )
    .eq("is_active", true)
    .order("boosted_until", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []) as JobOffer[];
}

/** Enregistre l'intérêt du candidat pour une offre (vue ou candidature). */
export async function markInterest(
  supabase: SupabaseClient,
  {
    offerId,
    candidateId,
    type,
  }: { offerId: string; candidateId: string; type: "consulte" | "postule" }
) {
  return supabase.from("offer_interests").upsert(
    { offer_id: offerId, candidate_id: candidateId, type },
    { onConflict: "offer_id,candidate_id,type" }
  );
}

export async function listCompaniesHiring(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("companies")
    .select("id, company_name, secteur, contact_phone")
    .limit(20);
  return data ?? [];
}
