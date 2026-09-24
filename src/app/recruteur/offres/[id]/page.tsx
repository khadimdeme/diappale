import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { getInterestedCandidates, getOffer } from "@/lib/diapale/recruiters";
import TopNav from "@/components/TopNav";

export default async function OffreCandidatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=recruteur");

  const offer = await getOffer(supabase, id);
  if (!offer || offer.recruiter_id !== user.id) notFound();

  // RLS ne laisse remonter ici que les candidats ayant consulté/postulé
  // à CETTE offre — pas un accès libre à toute la base candidats.
  const candidates = await getInterestedCandidates(supabase, id);

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
        {candidates.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Personne n&apos;a encore consulté ou postulé à cette offre.
          </div>
        )}
        {candidates.map(({ interestType, profile, candidateProfile, portfolio }) => (
          <div
            key={profile.id}
            className="rounded-2xl border border-border bg-bg p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="mb-1 inline-block rounded-lg bg-good/10 px-2.5 py-1 text-xs font-bold text-good">
                  {interestType === "postule" ? "✅ A postulé" : "👀 A consulté"}
                </span>
                <h4 className="font-display text-base font-semibold">
                  {profile.full_name || "Candidat"}
                </h4>
                <p className="text-xs text-muted">
                  {candidateProfile?.metier || "Métier non renseigné"} · {profile.ville}
                  {candidateProfile?.cni_verified ? " · ✔ Identité vérifiée" : ""}
                </p>
                {candidateProfile?.competences?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {candidateProfile.competences.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
                {portfolio.length > 0 ? (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-bold text-muted">Réalisations</p>
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
                ) : (
                  <p className="mt-2 text-xs italic text-muted">
                    Aucune réalisation ajoutée — le CV suffit pour ce profil.
                  </p>
                )}
              </div>
              {profile.phone && (
                <a
                  href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  className="rounded-[9px] bg-[#25D366] px-3.5 py-2.5 text-xs font-bold text-[#06210f]"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
