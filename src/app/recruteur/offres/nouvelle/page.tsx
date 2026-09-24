import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import TopNav from "@/components/TopNav";
import OfferForm from "./OfferForm";

export default async function NouvelleOffrePage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=recruteur");

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <TopNav label="Publier une offre" />
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h1 className="font-display text-xl font-bold">
          Publier une offre (formulaire simplifié)
        </h1>
        <div className="mt-3 flex gap-2.5 rounded-xl border border-border bg-gold-bg p-3.5 text-sm">
          <span>🧠</span>
          <p>
            <b>Salaire courant pour un poste similaire à Dakar :</b> variable
            selon le secteur — publie une fourchette réaliste pour attirer
            plus de candidatures.
          </p>
        </div>
        <OfferForm recruiterId={user.id} />
      </div>
    </main>
  );
}
