"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { markInterest } from "@/lib/diapale/candidates";
import type { JobOffer } from "@/lib/diapale/types";

export default function JobList({
  offers,
  candidateId,
}: {
  offers: JobOffer[];
  candidateId: string;
}) {
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("");
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  const villes = useMemo(
    () => Array.from(new Set(offers.map((o) => o.ville))).sort(),
    [offers]
  );

  const filtered = offers.filter(
    (o) =>
      (!q || o.titre.toLowerCase().includes(q.toLowerCase())) &&
      (!ville || o.ville === ville)
  );

  async function postuler(offer: JobOffer) {
    await markInterest(supabase, {
      offerId: offer.id,
      candidateId,
      type: "postule",
    });
    setApplied((a) => ({ ...a, [offer.id]: true }));

    if (offer.contact_phone) {
      const msg = encodeURIComponent(
        `Bonjour, je suis intéressé(e) par l'offre "${offer.titre}" sur Diapalé.`
      );
      window.open(
        `https://wa.me/${offer.contact_phone.replace(/\D/g, "")}?text=${msg}`,
        "_blank"
      );
    }
  }

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
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            Aucune offre pour ces filtres pour l&apos;instant.
          </p>
        )}
        {filtered.map((o) => (
          <div
            key={o.id}
            className="grid gap-2 rounded-2xl border border-border bg-bg p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-display text-base font-semibold">
                  {o.titre}
                </h4>
                <div className="mt-1 flex flex-wrap gap-2.5 text-xs text-muted">
                  <span>📍 {o.ville}</span>
                  {o.secteur && <span>{o.secteur}</span>}
                  {o.type_contrat && <span>{o.type_contrat}</span>}
                </div>
              </div>
            </div>
            {o.salaire && (
              <div className="font-display text-sm font-semibold">
                {o.salaire}
              </div>
            )}
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                onClick={() => postuler(o)}
                disabled={applied[o.id]}
                className="rounded-[9px] bg-[#25D366] px-3.5 py-2.5 text-xs font-bold text-[#06210f] disabled:opacity-60"
              >
                {applied[o.id] ? "✅ Candidature envoyée" : "💬 Postuler via WhatsApp"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
