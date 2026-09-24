import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/TopNav";

export default async function RecruteurPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/compte?mode=login&role=recruteur");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "recruteur") redirect("/candidat");

  const { data: company } = await supabase
    .from("companies")
    .select("company_name, secteur")
    .eq("id", user.id)
    .single();

  const { data: offers } = await supabase
    .from("job_offers")
    .select("id, titre, ville, is_active, created_at")
    .eq("recruiter_id", user.id)
    .order("created_at", { ascending: false });

  const offerIds = (offers ?? []).map((o) => o.id);
  let interestCounts: Record<string, number> = {};
  if (offerIds.length) {
    const { data: interests } = await supabase
      .from("offer_interests")
      .select("offer_id")
      .in("offer_id", offerIds);
    interestCounts = (interests ?? []).reduce<Record<string, number>>(
      (acc, i) => {
        acc[i.offer_id] = (acc[i.offer_id] ?? 0) + 1;
        return acc;
      },
      {}
    );
  }

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
        <Link
          href="/recruteur/offres/nouvelle"
          className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-bg"
        >
          📝 Publier une offre
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-xs font-extrabold tracking-wide text-bloom uppercase">
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
        {(offers ?? []).length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Aucune offre publiée pour l&apos;instant.{" "}
            <Link href="/recruteur/offres/nouvelle" className="font-bold text-ink underline">
              Publier une offre
            </Link>
          </div>
        )}
        {(offers ?? []).map((o) => (
          <Link
            key={o.id}
            href={`/recruteur/offres/${o.id}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
          >
            <div>
              <h4 className="font-display text-base font-semibold">
                {o.titre}
              </h4>
              <p className="text-xs text-muted">📍 {o.ville}</p>
            </div>
            <span className="rounded-full bg-gold-bg px-3 py-1.5 text-xs font-extrabold text-gold-deep">
              {interestCounts[o.id] ?? 0} candidat(s)
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
