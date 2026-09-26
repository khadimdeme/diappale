import type { InterestStatus } from "./types";

export const STATUS_LABEL: Record<InterestStatus, string> = {
  nouveau: "Candidature envoyée",
  vue: "Profil consulté",
  preselectionne: "Présélectionné(e)",
  entretien: "Entretien proposé",
  accepte: "Candidature acceptée",
  refuse: "Candidature non retenue",
};

export const STATUS_DOT: Record<InterestStatus, string> = {
  nouveau: "#b8860b",
  vue: "#2f6fb8",
  preselectionne: "#7c3fb8",
  entretien: "#2f8f3a",
  accepte: "#1e7a52",
  refuse: "#9a9a92",
};

export const STATUS_ORDER: InterestStatus[] = [
  "nouveau",
  "vue",
  "preselectionne",
  "entretien",
  "accepte",
  "refuse",
];
