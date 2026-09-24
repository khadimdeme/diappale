import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/TopNav";

export default async function OffreCandidatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/compte?mode=login&role=recruteur");

  const { data: offer } = await supabase
    .from("job_offers")
    .select("id, titre, ville, recruiter_id")
    .eq("id", id)
    .single();

  if (!offer || offer.recruiter_id !== user.id) notFound();

  // RLS ne laisse remonter ici que les candidats ayant consulté/postulé
  // à CETTE offre — pas un accès libre à toute la base candidats.
  const { data: interests } = await supabase
    .from("offer_interests")
    .select("type, created_at, candidate_id")
    .eq("offer_id", id)
    .order("created_at", { ascending: false });

  const candidateIds = Array.from(
    new Set((interests ?? []).map((i) => i.candidate_id))
  );

  const { data: profiles } = candidateIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, ville, phone")
        .in("id", candidateIds)
    : { data: [] };

  const { data: candidateProfiles } = candidateIds.length
    ? await supabase
        .from("candidate_profiles")
        .select("id, metier, competences, experience_years, cni_verified")
        .in("id", candidateIds)
    : { data: [] };

  const profileById = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const candidateById = Object.fromEntries(
    (candidateProfiles ?? []).map((c) => [c.id, c])
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-6">
      <TopNav label="Candidats intéressés" />
      <Link href="/recruteur" className="mt-4 inline-block text-sm font-bold text-muted">
        ← Vos offres
      </Link>

      <div className="mt-3 rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs font-extrabold text-muted uppercase">Offre</p>
        <h1 className="font-display text-xl font-bold">{offer.titre}</h1>
        <p className="text-sm text-muted">📍 {offer.ville}</p>
      </div>

      <div className="mt-6 grid gap-3">
        {(interests ?? []).length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Personne n&apos;a encore consulté ou postulé à cette offre.
          </div>
        )}
        {(interests ?? []).map((i) => {
          const p = profileById[i.candidate_id];
          const c = candidateById[i.candidate_id];
          if (!p) return null;
          return (
            <div
              key={i.candidate_id + i.type}
              className="rounded-2xl border border-border bg-bg p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="mb-1 inline-block rounded-lg bg-good/10 px-2.5 py-1 text-xs font-bold text-good">
                    {i.type === "postule" ? "✅ A postulé" : "👀 A consulté"}
                  </span>
                  <h4 className="font-display text-base font-semibold">
                    {p.full_name || "Candidat"}
                  </h4>
                  <p className="text-xs text-muted">
                    {c?.metier || "Métier non renseigné"} · {p.ville}
                    {c?.cni_verified ? " · ✔ Identité vérifiée" : ""}
                  </p>
                  {c?.competences?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.competences.map((s: string) => (
                        <span
                          key={s}
                          className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {p.phone && (
                  <a
                    href={`https://wa.me/${p.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    className="rounded-[9px] bg-[#25D366] px-3.5 py-2.5 text-xs font-bold text-[#06210f]"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
