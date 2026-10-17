"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { REPORT_REASONS, reportOffer } from "@/lib/diapale/candidates";

export default function ReportOffer({
  offerId,
  loggedIn,
  loginHref,
}: {
  offerId: string;
  loggedIn: boolean;
  loginHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const router = useRouter();
  const supabase = createClient();

  if (state === "done") {
    return <p className="text-xs font-bold text-ink-text">Merci, on vérifie cette offre.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => (loggedIn ? setOpen(true) : router.push(loginHref))}
        className="text-xs font-bold text-muted underline underline-offset-2 hover:text-text"
      >
        Signaler cette offre
      </button>
    );
  }

  async function send() {
    setState("sending");
    const { error } = await reportOffer(supabase, offerId, reason);
    setState(error ? "error" : "done");
  }

  return (
    <div className="grid max-w-sm gap-2 rounded-xl border border-border bg-bg p-3">
      <label className="text-xs font-bold text-muted" htmlFor="report-reason">
        Pourquoi signaler cette offre ?
      </label>
      <select
        id="report-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="rounded-[9px] border border-border bg-surface px-3 py-2.5 text-sm"
      >
        {REPORT_REASONS.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      {state === "error" && (
        <p className="text-xs font-semibold text-danger">
          Le signalement n&apos;a pas pu être envoyé. Réessaie dans un instant.
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={state === "sending"}
          className="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-bg disabled:opacity-60"
        >
          {state === "sending" ? "Envoi…" : "Envoyer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-border px-4 py-2 text-xs font-bold"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
