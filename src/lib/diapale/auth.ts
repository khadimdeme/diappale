// Couche service — Authentification.
// Les composants (pages, formulaires) n'appellent que ces fonctions,
// jamais `supabase.auth.*` directement. Même logique que côté Flutter :
// un service dédié, des écrans qui ne font que du design.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Role } from "./types";

export async function signUp(
  supabase: SupabaseClient,
  { email, password, role }: { email: string; password: string; role: Role }
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      // Le lien dans l'email de confirmation ramène ici — cette route
      // échange le code contre une session, puis renvoie vers le site.
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function signIn(
  supabase: SupabaseClient,
  { email, password }: { email: string; password: string }
) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Connexion / inscription via Google. Le rôle choisi est transmis dans
 * l'URL de retour (queryParam) car Google ne permet pas d'envoyer nos
 * propres métadonnées comme un signUp classique — /auth/callback s'en
 * sert pour finir de configurer le profil (candidat ou recruteur).
 */
export async function signInWithGoogle(supabase: SupabaseClient, role: Role) {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
    },
  });
}

export async function signOut(supabase: SupabaseClient) {
  return supabase.auth.signOut();
}

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getCurrentUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<Role | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as Role) ?? null;
}

/**
 * Appelée juste après une connexion Google réussie (dans /auth/callback).
 * Le déclencheur SQL a déjà créé un profil par défaut ("candidat") — si
 * la personne avait en fait choisi "recruteur" sur l'écran d'inscription,
 * on corrige le rôle et on bascule candidate_profiles -> companies.
 * Ne fait rien si le rôle est déjà le bon (cas normal de reconnexion).
 */
export async function ensureRole(
  supabase: SupabaseClient,
  userId: string,
  wantedRole: Role | null,
  fullName?: string | null
) {
  if (!wantedRole) return;

  const current = await getCurrentUserRole(supabase, userId);
  if (current === wantedRole) return;

  await supabase.from("profiles").update({ role: wantedRole }).eq("id", userId);

  if (wantedRole === "recruteur") {
    await supabase.from("candidate_profiles").delete().eq("id", userId);
    await supabase
      .from("companies")
      .upsert({ id: userId, company_name: fullName || "Mon entreprise" });
  } else {
    await supabase.from("companies").delete().eq("id", userId);
    await supabase.from("candidate_profiles").upsert({ id: userId });
  }
}
