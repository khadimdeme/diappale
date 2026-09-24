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
    options: { data: { role } },
  });
}

export async function signIn(
  supabase: SupabaseClient,
  { email, password }: { email: string; password: string }
) {
  return supabase.auth.signInWithPassword({ email, password });
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
