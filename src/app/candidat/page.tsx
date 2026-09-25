import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { getMyBaseProfile, getMyCandidateProfile, listActiveOffers, listMyPortfolio } from "@/lib/diapale/candidates";
import TopNav from "@/components/TopNav";
import JobList from "./JobList";

export default async function CandidatPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=candidat");

  const profile = await getMyBaseProfile(supabase, user.id);
  if (profile?.role !== "candidat") redirect("/recruteur");

  const candidateProfile = await getMyCandidateProfile(supabase, user.id);
  const offers = await listActiveOffers(supabase);
  const portfolio = await listMyPortfolio(supabase, user.id);

  const completeness = [
    candidateProfile?.metier,
    candidateProfile?.experience_years,
    candidateProfile?.niveau_etude,
    profile?.ville,
  ].filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-6">
      <TopNav label="Espace candidat" />

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold text-muted uppercase">
              Mon profil
            </p>
            <h1 className="font-display text-xl font-bold">
              {profile?.full_name || "Complète ton profil"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {candidateProfile?.metier || "Métier non renseigné"} ·{" "}
              {profile?.ville || "Ville non renseignée"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/candidat/candidatures"
              className="rounded-full border border-border px-4 py-2 text-sm font-extrabold"
            >
              📩 Mes candidatures
            </Link>
            <Link
              href="/candidat/cv"
              className="rounded-full border border-border px-4 py-2 text-sm font-extrabold"
            >
              📄 Voir mon CV
            </Link>
            <Link
              href="/candidat/profil"
              className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-bg"
            >
              Modifier mon profil
            </Link>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-3.5">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span>🧠 Profil complété à {Math.round((completeness / 4) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-good"
              style={{ width: `${Math.round((completeness / 4) * 100)}%` }}
            />
          </div>
        </div>
        {portfolio.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-extrabold text-muted uppercase">
              Réalisations
            </p>
            <div className="flex flex-wrap gap-2">
              {portfolio.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.image_url}
                  alt={p.label}
                  title={p.label}
                  className="h-16 w-16 rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
            Offres
          </p>
          <h2 className="mt-1 font-display text-xl font-bold">
            Rechercher un emploi
          </h2>
        </div>
        <Link href="/entreprises" className="text-sm font-bold text-ink underline underline-offset-2">
          🏢 Découvrir les entreprises
        </Link>
      </div>
      <JobList
        offers={offers}
        candidateId={user.id}
        candidateProfile={candidateProfile}
        candidateVille={profile?.ville ?? null}
        candidateName={profile?.full_name ?? null}
      />
    </main>
  );
}
