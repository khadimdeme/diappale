"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createOffer } from "@/lib/diapale/recruiters";
import type { ExperienceLevel } from "@/lib/diapale/types";

const TYPES_CONTRAT = ["CDI", "CDD", "Stage", "Alternance", "Mission", "Journalier", "Freelance"];

export default function OfferForm({ recruiterId }: { recruiterId: string }) {
  const [titre, setTitre] = useState("");
  const [ville, setVille] = useState("");
  const [typeContrat, setTypeContrat] = useState("CDI");
  const [description, setDescription] = useState("");
  const [salaire, setSalaire] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");
  const [niveauEtude, setNiveauEtude] = useState("");
  const [competences, setCompetences] = useState<string[]>([]);
  const [competenceDraft, setCompetenceDraft] = useState("");
  const [showProfil, setShowProfil] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  function addCompetences(raw: string) {
    const items = raw
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c && !competences.some((x) => x.toLowerCase() === c.toLowerCase()));
    if (items.length) setCompetences((list) => [...list, ...items]);
    setCompetenceDraft("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await createOffer(supabase, recruiterId, {
      titre,
      ville,
      type_contrat: typeContrat,
      description,
      salaire,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      experience_level: experienceLevel,
      niveau_etude_requis: niveauEtude,
      competences_requises: competences.join(", "),
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
          {TYPES_CONTRAT.map((t) => (
            <option key={t}>{t}</option>
          ))}
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
      <Field label="Email de contact (facultatif)">
        <input
          type="email"
          className="in"
          placeholder="recrutement@entreprise.sn"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
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

      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={() => setShowProfil((s) => !s)}
          className="text-sm font-bold text-ink-text underline underline-offset-2"
        >
          {showProfil ? "− Masquer" : "+ Préciser le profil recherché"}{" "}
          <span className="font-normal text-muted">(facultatif)</span>
        </button>
      </div>

      {showProfil && (
        <>
          <Field label="Niveau d'expérience">
            <select
              className="in"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel | "")}
            >
              <option value="">Peu importe</option>
              <option value="aucune">Aucune expérience</option>
              <option value="1-2">1–2 ans</option>
              <option value="3-5">3–5 ans</option>
              <option value="5+">5 ans et plus</option>
            </select>
          </Field>
          <Field label="Niveau d'étude">
            <input
              className="in"
              placeholder="Ex : Bac+2, BFEM, pas obligatoire…"
              value={niveauEtude}
              onChange={(e) => setNiveauEtude(e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Compétences recherchées">
              <div className="in flex flex-wrap items-center gap-1.5">
                {competences.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full bg-surface-2 py-1 pr-1.5 pl-3 text-xs font-bold"
                  >
                    {c}
                    <button
                      type="button"
                      aria-label={`Retirer ${c}`}
                      onClick={() => setCompetences((list) => list.filter((x) => x !== c))}
                      className="flex size-4 items-center justify-center rounded-full text-muted hover:text-text"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
                  placeholder={competences.length ? "Ajouter…" : "Ex : Excel, Permis B (Entrée pour ajouter)"}
                  value={competenceDraft}
                  onChange={(e) => {
                    if (e.target.value.endsWith(",")) addCompetences(e.target.value);
                    else setCompetenceDraft(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCompetences(competenceDraft);
                    } else if (e.key === "Backspace" && !competenceDraft && competences.length) {
                      setCompetences((list) => list.slice(0, -1));
                    }
                  }}
                  onBlur={() => competenceDraft && addCompetences(competenceDraft)}
                />
              </div>
            </Field>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-semibold text-danger sm:col-span-2">
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
