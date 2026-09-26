import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentUserRole } from "@/lib/diapale/auth";
import { getMyBaseProfile, getMyCandidateProfile, getPublicOffer } from "@/lib/diapale/candidates";
import { getCompany } from "@/lib/diapale/companies";
import ApplyButtons from "@/components/ApplyButtons";

export default async function OffreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const offer = await getPublicOffer(supabase, id);
  if (!offer) notFound();

  const company = await getCompany(supabase, offer.recruiter_id);
  const user = await getCurrentUser(supabase);

  let candidateId: string | null = null;
  let candidateProfile = null;
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
      candidateName = profile?.full_name ?? null;
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
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

      <Link href="/offres" className="mt-4 inline-block text-sm font-bold text-muted">
        ← Toutes les offres
      </Link>

      <div className="mt-3 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap gap-2.5 text-xs text-muted">
          <span>📍 {offer.ville}</span>
          {offer.secteur && <span>{offer.secteur}</span>}
          {offer.type_contrat && <span>{offer.type_contrat}</span>}
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold">{offer.titre}</h1>
        {company && (
          <Link
            href={`/entreprises/${company.id}`}
            className="mt-1 inline-block text-sm font-bold text-ink underline underline-offset-2"
          >
            🏢 {company.company_name}
          </Link>
        )}
        {offer.salaire && (
          <div className="mt-3 font-display text-lg font-semibold">
            {offer.salaire}
          </div>
        )}

        {offer.description && (
          <div className="mt-5">
            <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
              Description
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-text">
              {offer.description}
            </p>
          </div>
        )}

        {(offer.experience_level ||
          offer.niveau_etude_requis ||
          offer.competences_requises?.length > 0) && (
          <div className="mt-5">
            <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
              Profil recherché
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {offer.experience_level && (
                <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold">
                  {offer.experience_level === "aucune"
                    ? "Aucune expérience requise"
                    : `${offer.experience_level} ans d'expérience`}
                </span>
              )}
              {offer.niveau_etude_requis && (
                <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold">
                  🎓 {offer.niveau_etude_requis}
                </span>
              )}
              {offer.competences_requises?.length > 0 && (
                <span className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-bold">
                  🛠️ {offer.competences_requises.join(", ")}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <p className="mb-2 text-xs font-extrabold tracking-wide text-ink uppercase">
            Postuler
          </p>
          <ApplyButtons
            offer={offer}
            candidateId={candidateId}
            candidateProfile={candidateProfile}
            candidateName={candidateName}
            loginHref={`/compte?mode=login&role=candidat&next=${encodeURIComponent(`/offres/${offer.id}`)}`}
          />
        </div>
      </div>
    </main>
  );
}
