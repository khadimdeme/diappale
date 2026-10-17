// Positions approximatives des villes et quartiers courants, pour la carte des offres.
// Pas de service externe : le champ "ville" d'une offre est du texte libre, on le
// rapproche de cette table. Une ville inconnue n'apparaît simplement pas sur la carte.

export type Place = { name: string; lat: number; lng: number };

const PLACES: Place[] = [
  { name: "Dakar", lat: 14.7167, lng: -17.4677 },
  { name: "Pikine", lat: 14.7549, lng: -17.3985 },
  { name: "Guédiawaye", lat: 14.7692, lng: -17.39 },
  { name: "Rufisque", lat: 14.7167, lng: -17.2731 },
  { name: "Diamniadio", lat: 14.7167, lng: -17.1833 },
  { name: "Keur Massar", lat: 14.7833, lng: -17.3167 },
  { name: "Thiaroye", lat: 14.76, lng: -17.35 },
  { name: "Parcelles Assainies", lat: 14.765, lng: -17.44 },
  { name: "Médina", lat: 14.6847, lng: -17.4469 },
  { name: "Plateau", lat: 14.6708, lng: -17.4381 },
  { name: "Almadies", lat: 14.744, lng: -17.52 },
  { name: "Ngor", lat: 14.75, lng: -17.51 },
  { name: "Ouakam", lat: 14.7208, lng: -17.49 },
  { name: "Yoff", lat: 14.75, lng: -17.4833 },
  { name: "Mermoz", lat: 14.709, lng: -17.47 },
  { name: "Sacré-Cœur", lat: 14.7083, lng: -17.4592 },
  { name: "HLM", lat: 14.7, lng: -17.45 },
  { name: "Grand Yoff", lat: 14.73, lng: -17.46 },
  { name: "Liberté", lat: 14.712, lng: -17.456 },
  { name: "Sicap", lat: 14.711, lng: -17.454 },
  { name: "Fann", lat: 14.694, lng: -17.469 },
  { name: "Hann", lat: 14.72, lng: -17.43 },
  { name: "Thiès", lat: 14.7886, lng: -16.926 },
  { name: "Touba", lat: 14.85, lng: -15.8833 },
  { name: "Mbacké", lat: 14.7903, lng: -15.9083 },
  { name: "Mbour", lat: 14.4198, lng: -16.964 },
  { name: "Saly", lat: 14.4467, lng: -17.0136 },
  { name: "Joal-Fadiouth", lat: 14.1667, lng: -16.8333 },
  { name: "Saint-Louis", lat: 16.0179, lng: -16.4896 },
  { name: "Richard-Toll", lat: 16.4625, lng: -15.7006 },
  { name: "Podor", lat: 16.65, lng: -14.9667 },
  { name: "Louga", lat: 15.6144, lng: -16.2287 },
  { name: "Diourbel", lat: 14.6553, lng: -16.2314 },
  { name: "Bambey", lat: 14.6992, lng: -16.4517 },
  { name: "Tivaouane", lat: 14.95, lng: -16.8167 },
  { name: "Fatick", lat: 14.339, lng: -16.4111 },
  { name: "Kaolack", lat: 14.1652, lng: -16.0726 },
  { name: "Kaffrine", lat: 14.1059, lng: -15.55 },
  { name: "Tambacounda", lat: 13.7707, lng: -13.6673 },
  { name: "Kédougou", lat: 12.5579, lng: -12.1743 },
  { name: "Matam", lat: 15.6559, lng: -13.2554 },
  { name: "Kolda", lat: 12.883, lng: -14.95 },
  { name: "Sédhiou", lat: 12.7081, lng: -15.5569 },
  { name: "Ziguinchor", lat: 12.5681, lng: -16.2719 },
  { name: "Cap Skirring", lat: 12.3933, lng: -16.7461 },
];

const ALIASES: Record<string, string> = {
  parcelles: "Parcelles Assainies",
  "st louis": "Saint-Louis",
  "sacre coeur": "Sacré-Cœur",
  guediawaye: "Guédiawaye",
  thies: "Thiès",
  medina: "Médina",
  mbacke: "Mbacké",
  kedougou: "Kédougou",
  sedhiou: "Sédhiou",
};

function normalize(text: string) {
  return (
    " " +
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/œ/g, "oe")
      .replace(/[^a-z0-9]+/g, " ")
      .trim() +
    " "
  );
}

const KEYS: { key: string; place: Place }[] = [
  ...PLACES.map((place) => ({ key: normalize(place.name), place })),
  ...Object.entries(ALIASES).map(([alias, name]) => ({
    key: normalize(alias),
    place: PLACES.find((p) => p.name === name)!,
  })),
].sort((a, b) => b.key.length - a.key.length);

/** Retrouve la position d'une ville écrite librement ("Dakar, Parcelles Assainies"). */
export function locateVille(ville: string | null | undefined): Place | null {
  if (!ville) return null;
  const text = normalize(ville);
  return KEYS.find(({ key }) => text.includes(key))?.place ?? null;
}
