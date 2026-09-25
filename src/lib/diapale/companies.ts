// Couche service — fiche entreprise publique (lecture, des deux côtés).
// Les mutations (modifier sa propre entreprise) restent dans recruiters.ts.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Company, JobOffer } from "./types";

const OFFER_COLUMNS =
  "id, recruiter_id, titre, ville, secteur, type_contrat, description, salaire, contact_phone, contact_email, is_active, created_at, experience_level, niveau_etude_requis, competences_requises";

export async function getCompany(supabase: SupabaseClient, id: string) {
  const { data } = await supabase
    .from("companies")
    .select("id, company_name, secteur, contact_phone, ville, about")
    .eq("id", id)
    .single();
  return data as Company | null;
}

export async function listCompanyOffers(supabase: SupabaseClient, recruiterId: string) {
  const { data } = await supabase
    .from("job_offers")
    .select(OFFER_COLUMNS)
    .eq("recruiter_id", recruiterId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as JobOffer[];
}

/** Entreprises à découvrir — un candidat peut les contacter directement. */
export async function listCompaniesHiring(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("companies")
    .select("id, company_name, secteur, contact_phone, ville, about")
    .order("updated_at", { ascending: false })
    .limit(30);
  return (data ?? []) as Company[];
}
