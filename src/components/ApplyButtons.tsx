"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { markInterest } from "@/lib/diapale/candidates";
import { buildApplicationMessage } from "@/lib/diapale/applicationMessage";
import type { CandidateProfile, JobOffer } from "@/lib/diapale/types";

export default function ApplyButtons({
  offer,
  candidateId,
  candidateProfile,
  candidateName,
  loginHref,
}: {
  offer: JobOffer;
  /** null = pas connecté (ou pas candidat) — le clic renvoie vers loginHref. */
  candidateId: string | null;
  candidateProfile: CandidateProfile | null;
  candidateName: string | null;
  loginHref: string;
}) {
  const [applied, setApplied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function postuler(channel: "whatsapp" | "email") {
    if (!candidateId) {
      router.push(loginHref);
      return;
    }

    const message = buildApplicationMessage({
      offerTitre: offer.titre,
      candidateName,
      candidateProfile,
    });

    // window.open doit rester la toute première chose déclenchée par le
    // clic — dès qu'on attend un appel réseau avant, Safari/Chrome le
    // bloquent comme pop-up. L'enregistrement de l'intérêt part après,
    // sans attendre sa réponse.
    if (channel === "whatsapp" && offer.contact_phone) {
      window.open(
        `https://wa.me/${offer.contact_phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (channel === "email" && offer.contact_email) {
      const subject = encodeURIComponent(`Candidature — ${offer.titre} (via Diapalé)`);
      window.open(
        `mailto:${offer.contact_email}?subject=${subject}&body=${encodeURIComponent(message)}`,
        "_blank"
      );
    }

    setApplied(true);
    markInterest(supabase, { offerId: offer.id, candidateId, type: "postule" });
  }

  return (
    <div className="mt-1 flex flex-wrap gap-2">
      <button
        onClick={() => postuler("whatsapp")}
        disabled={applied}
        className="rounded-[9px] bg-[#25D366] px-3.5 py-2.5 text-xs font-bold text-[#06210f] disabled:opacity-60"
      >
        {applied ? "Candidature envoyée" : "💬 Postuler via WhatsApp"}
      </button>
      {offer.contact_email && (
        <button
          onClick={() => postuler("email")}
          disabled={applied}
          className="rounded-[9px] border border-border bg-surface px-3.5 py-2.5 text-xs font-bold disabled:opacity-60"
        >
          Postuler par email
        </button>
      )}
    </div>
  );
}
