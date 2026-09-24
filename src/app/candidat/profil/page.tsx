import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/diapale/auth";
import { getMyBaseProfile, getMyCandidateProfile, listMyPortfolio } from "@/lib/diapale/candidates";
import TopNav from "@/components/TopNav";
import ProfileForm from "./ProfileForm";
import PortfolioSection from "./PortfolioSection";

export default async function ProfilPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login&role=candidat");

  const profile = await getMyBaseProfile(supabase, user.id);
  const candidateProfile = await getMyCandidateProfile(supabase, user.id);
  const portfolio = await listMyPortfolio(supabase, user.id);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <TopNav label="Mon profil" />
      <Link href="/candidat" className="mt-4 inline-block text-sm font-bold text-muted">
        ← Retour à mon espace
      </Link>
      <div className="mt-3 rounded-2xl border border-border bg-surface p-6">
        <h1 className="font-display text-xl font-bold">Mon profil</h1>
        <p className="mt-1 text-sm text-muted">
          Le numéro de téléphone sert uniquement au contact WhatsApp — pas
          de vérification par SMS.
        </p>
        <ProfileForm
          userId={user.id}
          initial={{
            full_name: profile?.full_name ?? "",
            phone: profile?.phone ?? "",
            ville: profile?.ville ?? "",
            metier: candidateProfile?.metier ?? "",
            competences: (candidateProfile?.competences ?? []).join(", "),
            experience_years: candidateProfile?.experience_years ?? "",
            niveau_etude: candidateProfile?.niveau_etude ?? "",
            disponible: candidateProfile?.disponible ?? true,
          }}
        />
        <PortfolioSection userId={user.id} initialItems={portfolio} />
      </div>
    </main>
  );
}
