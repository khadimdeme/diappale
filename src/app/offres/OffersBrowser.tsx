"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeMatchScore } from "@/lib/diapale/matching";
import ApplyButtons from "@/components/ApplyButtons";
import type { CandidateProfile, JobOffer } from "@/lib/diapale/types";

const TYPES_CONTRAT = ["CDI", "CDD", "Stage", "Alternance", "Mission", "Journalier", "Freelance"];

export default function OffersBrowser({
  offers,
  candidateId,
  candidateProfile,
  candidateVille,
  candidateName,
}: {
  offers: JobOffer[];
  /** null = visiteur non connecté (ou connecté en tant que recruteur). */
  candidateId: string | null;
  candidateProfile: CandidateProfile | null;
  candidateVille: string | null;
  candidateName: string | null;
}) {
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("");
  const [typeContrat, setTypeContrat] = useState("");

  const villes = useMemo(
    () => Array.from(new Set(offers.map((o) => o.ville))).sort(),
    [offers]
  );

  const filtered = offers.filter(
    (o) =>
      (!q || o.titre.toLowerCase().includes(q.toLowerCase())) &&
      (!ville || o.ville === ville) &&
      (!typeContrat || o.type_contrat === typeContrat)
  );

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap gap-2.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Métier, mot-clé…"
          className="min-w-[150px] flex-1 rounded-[11px] border border-border bg-bg px-3.5 py-3 text-sm"
        />
        <select
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="rounded-[11px] border border-border bg-bg px-3.5 py-3 text-sm"
        >
          <option value="">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={typeContrat}
          onChange={(e) => setTypeContrat(e.target.value)}
          className="rounded-[11px] border border-border bg-bg px-3.5 py-3 text-sm"
        >
          <option value="">Tous types</option>
          {TYPES_CONTRAT.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            Aucune offre pour ces filtres pour l&apos;instant.
          </p>
        )}
        {filtered.map((o) => {
          const score = candidateProfile
            ? computeMatchScore(candidateProfile, o, candidateVille)
            : 0;
          return (
            <div
              key={o.id}
              className="grid gap-2 rounded-2xl border border-border bg-bg p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/offres/${o.id}`}
                    className="font-display text-base font-semibold hover:underline"
                  >
                    {o.titre}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-2.5 text-xs text-muted">
                    <span>📍 {o.ville}</span>
                    {o.secteur && <span>{o.secteur}</span>}
                    {o.type_contrat && <span>{o.type_contrat}</span>}
                  </div>
                </div>
                {candidateProfile?.metier && score >= 40 && (
                  <span className="whitespace-nowrap rounded-full bg-gold-bg px-2.5 py-1 text-xs font-extrabold text-gold-deep">
                    ✨ {score}% compatible
                  </span>
                )}
              </div>
              {o.description && (
                <p className="line-clamp-2 text-sm text-muted">{o.description}</p>
              )}
              {o.salaire && (
                <div className="font-display text-sm font-semibold">
                  {o.salaire}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <ApplyButtons
                  offer={o}
                  candidateId={candidateId}
                  candidateProfile={candidateProfile}
                  candidateName={candidateName}
                  loginHref={`/compte?mode=login&role=candidat&next=${encodeURIComponent(`/offres/${o.id}`)}`}
                />
                <Link
                  href={`/offres/${o.id}`}
                  className="text-xs font-bold text-ink underline underline-offset-2"
                >
                  Voir les détails →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
