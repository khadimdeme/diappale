import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCompany, listCompanyOffers } from "@/lib/diapale/companies";

export default async function EntreprisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const company = await getCompany(supabase, id);
  if (!company) notFound();

  const offers = await listCompanyOffers(supabase, id);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <Link href="/entreprises" className="text-sm font-bold text-muted">
        ← Entreprises
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-none items-center justify-center rounded-2xl bg-ink-2 font-display text-lg font-bold text-white">
            {company.company_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{company.company_name}</h1>
            <p className="text-sm text-muted">
              {company.secteur || "Secteur non renseigné"}
              {company.ville ? ` · 📍 ${company.ville}` : ""}
            </p>
          </div>
        </div>

        {company.about && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-extrabold text-muted uppercase">À propos</p>
            <p className="mt-1.5 text-sm">{company.about}</p>
          </div>
        )}

        {company.contact_phone && (
          <div className="mt-4">
            <a
              href={`https://wa.me/${company.contact_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Bonjour, je vous contacte via Diapalé au sujet d'une opportunité chez ${company.company_name}.`
              )}`}
              target="_blank"
              className="inline-block rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-[#06210f]"
            >
              💬 Contacter sur WhatsApp
            </a>
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-extrabold tracking-wide text-bloom uppercase">
          Offres
        </p>
        <h2 className="font-display text-xl font-bold">
          {offers.length} offre{offers.length > 1 ? "s" : ""} disponible{offers.length > 1 ? "s" : ""}
        </h2>
      </div>

      <div className="mt-4 grid gap-3">
        {offers.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface-2 p-5 text-sm text-muted">
            Aucune offre active pour l&apos;instant.
          </div>
        )}
        {offers.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-surface p-4">
            <h4 className="font-display text-base font-semibold">{o.titre}</h4>
            <p className="text-xs text-muted">
              📍 {o.ville} {o.type_contrat && `· ${o.type_contrat}`}
            </p>
            {o.salaire && <p className="mt-1 font-display text-sm font-semibold">{o.salaire}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
