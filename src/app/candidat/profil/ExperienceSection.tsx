"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addExperience, deleteExperience } from "@/lib/diapale/candidates";
import type { CandidateExperience } from "@/lib/diapale/types";

// Découpe la chaîne "YYYY-MM-DD" directement — éviter `new Date(...).getFullYear()`
// qui décale l'année selon le fuseau horaire du navigateur.
function yearOf(dateStr: string) {
  return dateStr.slice(0, 4);
}

function formatPeriod(debut: string | null, fin: string | null) {
  if (!debut) return null;
  return `${yearOf(debut)} → ${fin ? yearOf(fin) : "aujourd'hui"}`;
}

export default function ExperienceSection({
  userId,
  initialItems,
}: {
  userId: string;
  initialItems: CandidateExperience[];
}) {
  const [items, setItems] = useState(initialItems);
  const [poste, setPoste] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await addExperience(supabase, userId, {
      poste,
      entreprise,
      date_debut: dateDebut,
      date_fin: dateFin,
      description: "",
    });
    setSaving(false);
    setPoste("");
    setEntreprise("");
    setDateDebut("");
    setDateFin("");
    setOpen(false);
    router.refresh();
    const { data } = await supabase
      .from("candidate_experiences")
      .select("id, candidate_id, poste, entreprise, date_debut, date_fin, description")
      .eq("candidate_id", userId)
      .order("date_debut", { ascending: false });
    setItems((data ?? []) as CandidateExperience[]);
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteExperience(supabase, id);
    router.refresh();
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-base font-bold">Expériences</h3>
      <p className="mt-1 text-xs text-muted">
        Tes précédents postes — utile pour te démarquer, mais reste facultatif.
      </p>

      {items.length > 0 && (
        <div className="mt-4 grid gap-3">
          {items.map((exp) => (
            <div key={exp.id} className="flex items-start justify-between rounded-xl border border-border bg-bg p-3">
              <div>
                <p className="text-sm font-bold">
                  {exp.poste}
                  {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                </p>
                {formatPeriod(exp.date_debut, exp.date_fin) && (
                  <p className="text-xs text-muted">{formatPeriod(exp.date_debut, exp.date_fin)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(exp.id)}
                className="text-[11px] font-bold text-bloom"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 text-sm font-bold text-ink underline underline-offset-2"
        >
          + Ajouter une expérience
        </button>
      ) : (
        <form onSubmit={handleAdd} className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <input
            required
            className="in"
            placeholder="Poste (ex : Couturière)"
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
          />
          <input
            className="in"
            placeholder="Entreprise / atelier (facultatif)"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
          />
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">Début</label>
            <input
              type="date"
              className="in"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-muted">
              Fin (vide = poste actuel)
            </label>
            <input
              type="date"
              className="in"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-ink px-4 py-2.5 text-xs font-extrabold text-bg disabled:opacity-60"
            >
              {saving ? "Ajout…" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-border px-4 py-2.5 text-xs font-extrabold"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <style jsx>{`
        .in {
          width: 100%;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 0.6rem 0.85rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
