/** "Publiée aujourd'hui", "Publiée il y a 3 jours"… à partir de created_at. */
export function publishedLabel(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (Number.isNaN(days) || days < 0) return null;
  if (days === 0) return "Publiée aujourd'hui";
  if (days === 1) return "Publiée hier";
  if (days < 7) return `Publiée il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `Publiée il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  return `Publiée il y a ${months} mois`;
}
