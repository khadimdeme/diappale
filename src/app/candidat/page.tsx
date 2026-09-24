import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/TopNav";
import JobList from "./JobList";

export default async function CandidatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/compte?mode=login&role=candidat");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, ville")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "candidat") redirect("/recruteur");

  const { data: candidateProfile } = await supabase
    .from("candidate_profiles")
    .select("metier, competences, experience_years, niveau_etude, cni_verified")
    .eq("id", user.id)
    .single();

  const { data: offers } = await supabase
    .from("job_offers")
    .select("id, titre, ville, secteur, type_contrat, salaire, contact_phone, created_at")
    .eq("is_active", true)
    .order("boosted_until", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(30);

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
          <Link
            href="/candidat/profil"
            className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-bg"
          >
            Modifier mon profil
          </Link>
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
      </div>

      <div className="mt-8">
        <p className="text-xs font-extrabold tracking-wide text-bloom uppercase">
          Offres
        </p>
        <h2 className="mt-1 font-display text-xl font-bold">
          Rechercher un emploi
        </h2>
      </div>
      <JobList offers={offers ?? []} candidateId={user.id} />
    </main>
  );
}
