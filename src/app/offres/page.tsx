import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentUserRole } from "@/lib/diapale/auth";
import { getMyBaseProfile, getMyCandidateProfile, listActiveOffers } from "@/lib/diapale/candidates";
import type { CandidateProfile } from "@/lib/diapale/types";
import OffersBrowser from "./OffersBrowser";

export default async function OffresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ville?: string }>;
}) {
  const { q = "", ville = "" } = await searchParams;
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const offers = await listActiveOffers(supabase);

  let candidateId: string | null = null;
  let candidateProfile: CandidateProfile | null = null;
  let candidateVille: string | null = null;
  let candidateName: string | null = null;
  let dashboardHref = "/compte?mode=login";

  if (user) {
    const role = await getCurrentUserRole(supabase, user.id);
    if (role === "recruteur") {
      dashboardHref = "/recruteur";
    } else {
      dashboardHref = "/candidat";
      const profile = await getMyBaseProfile(supabase, user.id);
      candidateId = user.id;
      candidateProfile = await getMyCandidateProfile(supabase, user.id);
      candidateVille = profile?.ville ?? null;
      candidateName = profile?.full_name ?? null;
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-6">
      <div className="flex items-center justify-between gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-ink-2 font-display text-base font-bold text-white">
            D
          </div>
          <span className="truncate font-display text-lg font-bold">Diapalé</span>
        </Link>
        <Link
          href={dashboardHref}
          className="shrink-0 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-sm font-extrabold text-bg"
        >
          {user ? "Mon espace" : "Se connecter"}
        </Link>
      </div>

      <div className="mt-6">
        <p className="text-xs font-extrabold tracking-wide text-ink-text uppercase">
          Offres
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold">
          Toutes les offres actives
        </h1>
        <p className="mt-1 text-sm text-muted">
          Parcours librement, sans compte — un compte est demandé seulement
          au moment de postuler.
        </p>
      </div>

      <OffersBrowser
        initialQ={q}
        initialVille={ville}
        offers={offers}
        candidateId={candidateId}
        candidateProfile={candidateProfile}
        candidateVille={candidateVille}
        candidateName={candidateName}
      />
    </main>
  );
}
