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
  nouveau: "🟡",
  vue: "🔵",
  preselectionne: "🟣",
  entretien: "🟢",
  accepte: "✅",
  refuse: "⚪",
};

export const STATUS_ORDER: InterestStatus[] = [
  "nouveau",
  "vue",
  "preselectionne",
  "entretien",
  "accepte",
  "refuse",
];
