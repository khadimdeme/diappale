import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TopNav from "@/components/TopNav";
import ProfileForm from "./ProfileForm";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/compte?mode=login&role=candidat");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, ville")
    .eq("id", user.id)
    .single();

  const { data: candidateProfile } = await supabase
    .from("candidate_profiles")
    .select("metier, competences, experience_years, niveau_etude, disponible")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-6">
      <TopNav label="Mon profil" />
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
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
      </div>
    </main>
  );
}
