import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { listMyApplications } from "@/lib/diapale/candidates";
import { STATUS_DOT, STATUS_LABEL } from "@/lib/diapale/statusLabels";
import TopNav from "@/components/TopNav";

export default async function MesCandidaturesPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=candidat");

  const applications = await listMyApplications(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <TopNav label="Mes candidatures" />
      <Link href="/candidat" className="mt-4 inline-block text-sm font-bold text-muted">
        ← Retour à mon espace
      </Link>

      <div className="mt-3">
        <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
          Suivi
        </p>
        <h1 className="font-display text-xl font-bold">Mes candidatures</h1>
      </div>

      <div className="mt-4 grid gap-3">
        {applications.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Tu n&apos;as pas encore postulé — retourne à la recherche d&apos;emploi.
          </div>
        )}
        {applications.map((app) => (
          <div key={app.offerId} className="rounded-2xl border border-border bg-surface p-4">
            <h4 className="font-display text-base font-semibold">{app.offer.titre}</h4>
            <p className="text-xs text-muted">
              {app.companyName || "Entreprise"} · {app.offer.ville}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span
                className="size-2 rounded-full"
                style={{ background: STATUS_DOT[app.status] }}
              />
              <span className="text-sm font-bold">{STATUS_LABEL[app.status]}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Candidature envoyée le{" "}
              {new Date(app.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
