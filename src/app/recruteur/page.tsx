import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentUserRole } from "@/lib/diapale/auth";
import { countInterestsByOffer, getMyCompany, getRecruiterStats, listMyOffers } from "@/lib/diapale/recruiters";
import TopNav from "@/components/TopNav";

export default async function RecruteurPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=recruteur");

  const role = await getCurrentUserRole(supabase, user.id);
  if (role !== "recruteur") redirect("/candidat");

  const company = await getMyCompany(supabase, user.id);
  const offers = await listMyOffers(supabase, user.id);
  const interestCounts = await countInterestsByOffer(supabase, offers.map((o) => o.id));
  const stats = await getRecruiterStats(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-6">
      <TopNav label="Espace recruteur" />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5">
        <div>
          <p className="text-xs font-extrabold text-muted uppercase">
            Entreprise
          </p>
          <h1 className="font-display text-xl font-bold">
            {company?.company_name || "Mon entreprise"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {company?.secteur || "Secteur non renseigné"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/recruteur/entreprise"
            className="rounded-full border border-border px-4 py-2 text-sm font-extrabold"
          >
            Modifier l&apos;entreprise
          </Link>
          <Link
            href="/recruteur/offres/nouvelle"
            className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-bg"
          >
            Publier une offre
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatTile label="Offres actives" value={stats.activeOffers} />
        <StatTile label="Candidatures" value={stats.totalCandidatures} />
        <StatTile label="Présélectionnés" value={stats.preselectionnes} />
      </div>

      <div className="mt-8">
        <p className="text-xs font-extrabold tracking-wide text-ink-text uppercase">
          Vos offres
        </p>
        <h2 className="mt-1 font-display text-xl font-bold">
          Candidats intéressés
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pas d&apos;offre publiée = pas de candidats ici. Le recruteur ne
          parcourt pas les profils librement.
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {offers.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Aucune offre publiée pour l&apos;instant.{" "}
            <Link href="/recruteur/offres/nouvelle" className="font-bold text-ink-text underline">
              Publier une offre
            </Link>
          </div>
        )}
        {offers.map((o) => (
          <Link
            key={o.id}
            href={`/recruteur/offres/${o.id}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <div>
              <h4 className="font-display text-base font-semibold">
                {o.titre}
              </h4>
              <p className="text-xs text-muted">{o.ville}</p>
            </div>
            <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-extrabold text-ink-text">
              {interestCounts[o.id] ?? 0} candidat(s)
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center">
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-[11px] font-bold text-muted">{label}</div>
    </div>
  );
}
