// Score de compatibilité — logique pure (pas d'appel Supabase ici).
// Un score honnête basé sur des règles simples, pas une "IA" : métier, ville,
// expérience minimum et compétences en commun. Affiché des deux côtés, mais
// toujours dans le respect de la règle "pas de fouille libre" — côté
// recruteur, uniquement sur des candidats déjà intéressés par SON offre.

import type { CandidateProfile, ExperienceLevel, JobOffer } from "./types";

const EXPERIENCE_MIN: Record<ExperienceLevel, number> = {
  aucune: 0,
  "1-2": 1,
  "3-5": 3,
  "5+": 5,
};

function normalize(s: string | null | undefined) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function computeMatchScore(
  candidate: CandidateProfile | null,
  offer: JobOffer,
  candidateVille?: string | null
): number {
  if (!candidate) return 0;

  let score = 0;

  // Métier (40 pts) — le métier du candidat apparaît dans le titre ou le secteur.
  const metier = normalize(candidate.metier);
  const titre = normalize(offer.titre);
  const secteur = normalize(offer.secteur);
  if (metier && (titre.includes(metier) || metier.includes(titre) || secteur.includes(metier))) {
    score += 40;
  }

  // Ville (20 pts)
  if (candidateVille && normalize(candidateVille) === normalize(offer.ville)) {
    score += 20;
  }

  // Expérience (20 pts) — le candidat a au moins le minimum demandé (ou rien de demandé).
  const required = offer.experience_level ? EXPERIENCE_MIN[offer.experience_level] : null;
  if (required === null || (candidate.experience_years ?? 0) >= required) {
    score += 20;
  }

  // Compétences en commun (20 pts)
  if (offer.competences_requises.length > 0) {
    const mine = new Set(candidate.competences.map(normalize));
    const overlap = offer.competences_requises.some((c) => mine.has(normalize(c)));
    if (overlap) score += 20;
  } else {
    score += 20; // rien de précisé -> pas de pénalité
  }

  return score;
}

export function matchLabel(score: number): string {
  if (score >= 80) return "Très bonne compatibilité";
  if (score >= 50) return "Bonne compatibilité";
  return "Compatibilité partielle";
}
