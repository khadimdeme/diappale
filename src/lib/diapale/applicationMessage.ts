// Génère le message de candidature pré-rempli (WhatsApp / email) à partir
// du profil du candidat — logique pure, pas d'appel Supabase. L'idée :
// le recruteur reçoit d'emblée une mini-fiche propre plutôt qu'un
// "Bonjour je veux le travail" générique, sans que le candidat tape quoi que ce soit.

import type { CandidateProfile } from "./types";

export function buildApplicationMessage({
  offerTitre,
  candidateName,
  candidateProfile,
}: {
  offerTitre: string;
  candidateName: string | null;
  candidateProfile: CandidateProfile | null;
}): string {
  const lines = [`Bonjour, je suis intéressé(e) par l'offre "${offerTitre}" sur Diapalé.`, ""];

  lines.push(`Nom : ${candidateName || "—"}`);
  if (candidateProfile?.metier) lines.push(`Métier : ${candidateProfile.metier}`);
  if (candidateProfile?.experience_years !== null && candidateProfile?.experience_years !== undefined) {
    lines.push(`Expérience : ${candidateProfile.experience_years} an(s)`);
  }
  if (candidateProfile?.competences?.length) {
    lines.push(`Compétences : ${candidateProfile.competences.join(", ")}`);
  }
  lines.push(candidateProfile?.disponible ? "Disponible immédiatement" : "Disponibilité à préciser");

  return lines.join("\n");
}
