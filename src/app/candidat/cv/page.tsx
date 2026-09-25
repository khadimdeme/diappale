import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { getMyBaseProfile, getMyCandidateProfile, listMyExperiences, listMyPortfolio } from "@/lib/diapale/candidates";
import PrintButton from "./PrintButton";

export default async function CvPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=candidat");

  const profile = await getMyBaseProfile(supabase, user.id);
  const candidateProfile = await getMyCandidateProfile(supabase, user.id);
  const portfolio = await listMyPortfolio(supabase, user.id);
  const experiences = await listMyExperiences(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6 print:max-w-none print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/candidat" className="text-sm font-bold text-muted">
          ← Retour à mon espace
        </Link>
        <PrintButton />
      </div>

      {candidateProfile?.cv_url && (
        <div className="mt-5 rounded-2xl border border-border bg-surface p-6 print:hidden">
          <p className="text-xs font-extrabold text-muted uppercase">CV déposé</p>
          <p className="mt-1 text-sm text-muted">
            Le fichier que tu as envoyé toi-même — c&apos;est celui-là que les recruteurs voient en premier.
          </p>
          {candidateProfile.cv_url.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={candidateProfile.cv_url}
              className="mt-3 h-[480px] w-full rounded-xl border border-border"
              title="Mon CV"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={candidateProfile.cv_url}
              alt="Mon CV"
              className="mt-3 max-h-[480px] w-full rounded-xl border border-border object-contain"
            />
          )}
          <a
            href={candidateProfile.cv_url}
            target="_blank"
            className="mt-3 inline-block text-sm font-bold text-ink underline underline-offset-2"
          >
            Ouvrir dans un nouvel onglet
          </a>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-surface p-8 print:rounded-none print:border-none print:p-0">
        {candidateProfile?.cv_url && (
          <p className="mb-4 text-xs font-extrabold text-muted uppercase print:hidden">
            Profil complet (généré automatiquement)
          </p>
        )}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {profile?.full_name || "Candidat Diapalé"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {candidateProfile?.metier || "Métier non renseigné"} · {profile?.ville || "Ville non renseignée"}
            </p>
          </div>
          {candidateProfile?.cni_verified && (
            <span className="rounded-full bg-gold-bg px-3 py-1.5 text-xs font-extrabold text-gold-deep">
              ✔ Identité vérifiée
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-extrabold text-muted uppercase">Téléphone</p>
            <p>{profile?.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold text-muted uppercase">Disponibilité</p>
            <p>{candidateProfile?.disponible ? "Disponible immédiatement" : "À préciser"}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold text-muted uppercase">Expérience</p>
            <p>{candidateProfile?.experience_years ? `${candidateProfile.experience_years} ans` : "—"}</p>
          </div>
          <div>
            <p className="text-xs font-extrabold text-muted uppercase">Niveau d&apos;étude</p>
            <p>{candidateProfile?.niveau_etude || "—"}</p>
          </div>
        </div>

        {candidateProfile?.competences && candidateProfile.competences.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-extrabold text-muted uppercase">Compétences</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidateProfile.competences.map((c) => (
                <span key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-extrabold text-muted uppercase">Expériences</p>
            <div className="mt-2 grid gap-2">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <p className="text-sm font-bold">
                    {exp.poste}
                    {exp.entreprise ? ` — ${exp.entreprise}` : ""}
                  </p>
                  {exp.date_debut && (
                    <p className="text-xs text-muted">
                      {exp.date_debut.slice(0, 4)} →{" "}
                      {exp.date_fin ? exp.date_fin.slice(0, 4) : "aujourd'hui"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {portfolio.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-extrabold text-muted uppercase">Réalisations</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {portfolio.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.image_url}
                  alt={p.label}
                  className="h-20 w-20 rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-[11px] text-muted print:mt-10">
          Généré automatiquement par Diapalé à partir du profil — mis à jour à chaque modification.
        </p>
      </div>
    </main>
  );
}
