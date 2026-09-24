"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OfferForm({ recruiterId }: { recruiterId: string }) {
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [typeContrat, setTypeContrat] = useState("CDI");
  const [description, setDescription] = useState("");
  const [salaire, setSalaire] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("job_offers").insert({
      recruiter_id: recruiterId,
      titre,
      ville,
      type_contrat: typeContrat,
      description,
      salaire,
      contact_phone: contactPhone,
    });

    setSaving(false);
    if (error) return setError(error.message);
    router.push("/recruteur");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Intitulé du poste">
          <input
            required
            className="in"
            placeholder="Ex : Livreur moto, Comptable, Femme de ménage…"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </Field>
      </div>
      <Field label="Ville">
        <input
          required
          className="in"
          placeholder="Ex : Dakar, Parcelles Assainies"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />
      </Field>
      <Field label="Type de contrat">
        <select
          className="in"
          value={typeContrat}
          onChange={(e) => setTypeContrat(e.target.value)}
        >
          <option>CDI</option>
          <option>CDD</option>
          <option>Journalier</option>
          <option>Stage</option>
        </select>
      </Field>
      <Field label="Salaire proposé (FCFA)">
        <input
          className="in"
          placeholder="Ex : 120 000 / mois"
          value={salaire}
          onChange={(e) => setSalaire(e.target.value)}
        />
      </Field>
      <Field label="Numéro WhatsApp de contact">
        <input
          required
          className="in"
          placeholder="+221 77 000 00 00"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description (2-3 lignes suffisent)">
          <textarea
            rows={3}
            className="in"
            placeholder="Mission, horaires, ce qui compte le plus pour vous…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-lg bg-bloom-bg px-3 py-2 text-sm font-semibold text-bloom sm:col-span-2">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-bg disabled:opacity-60"
        >
          {saving ? "Publication…" : "Publier l'offre"}
        </button>
      </div>

      <style jsx>{`
        .in {
          width: 100%;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          resize: vertical;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted">{label}</span>
      {children}
    </label>
  );
}
