import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { getMyCompany } from "@/lib/diapale/recruiters";
import TopNav from "@/components/TopNav";
import CompanyForm from "./CompanyForm";

export default async function EntrepriseRecruteurPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=recruteur");

  const company = await getMyCompany(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <TopNav label="Mon entreprise" />
      <Link href="/recruteur" className="mt-4 inline-block text-sm font-bold text-muted">
        ← Retour à mon espace
      </Link>

      <div className="mt-3 rounded-2xl border border-border bg-surface p-6">
        <h1 className="font-display text-xl font-bold">Fiche entreprise</h1>
        <p className="mt-1 text-sm text-muted">
          Visible publiquement par les candidats — c&apos;est ta vitrine sur Diapalé.
        </p>
        <CompanyForm
          userId={user.id}
          initial={{
            company_name: company?.company_name ?? "",
            secteur: company?.secteur ?? "",
            ville: company?.ville ?? "",
            contact_phone: company?.contact_phone ?? "",
            about: company?.about ?? "",
          }}
        />
      </div>
    </main>
  );
}
