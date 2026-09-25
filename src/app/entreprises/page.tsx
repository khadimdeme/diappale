import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listCompaniesHiring } from "@/lib/diapale/companies";

export default async function EntreprisesPage() {
  const supabase = await createClient();
  const companies = await listCompaniesHiring(supabase);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-6">
      <div className="pt-2">
        <div className="flex items-center justify-between rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[9px] bg-ink-2 font-display text-base font-bold text-white">
              D
            </div>
            <span className="font-display text-lg font-bold">Diapalé</span>
          </Link>
          <Link href="/candidat" className="text-sm font-bold text-muted">
            ← Mon espace
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
          Découvrir
        </p>
        <h1 className="font-display text-2xl font-bold">Entreprises qui recrutent</h1>
        <p className="mt-1 text-sm text-muted">
          Tu peux contacter une entreprise directement, sans attendre une réponse à une candidature.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {companies.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Aucune entreprise pour l&apos;instant.
          </div>
        )}
        {companies.map((c) => (
          <Link
            key={c.id}
            href={`/entreprises/${c.id}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex size-12 flex-none items-center justify-center rounded-xl bg-ink-2 font-display text-base font-bold text-white">
              {c.company_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="font-display text-base font-semibold">{c.company_name}</h4>
              <p className="text-xs text-muted">
                {c.secteur || "Secteur non renseigné"}
                {c.ville ? ` · 📍 ${c.ville}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
