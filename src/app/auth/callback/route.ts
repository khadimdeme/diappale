import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureRole } from "@/lib/diapale/auth";
import type { Role } from "@/lib/diapale/types";

// Point d'arrivée après un clic sur le lien de l'email de confirmation,
// ou après une connexion Google réussie. Échange le code contre une
// session, puis envoie la personne au bon endroit.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role") as Role | null;
  const next = searchParams.get("next");
  // On ne redirige que vers un chemin interne, jamais vers une URL externe.
  const safeNext = next && next.startsWith("/") ? next : null;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await ensureRole(
        supabase,
        data.user.id,
        role,
        data.user.user_metadata?.full_name ?? data.user.user_metadata?.name
      );
      return NextResponse.redirect(`${origin}${safeNext || "/tableau-de-bord"}`);
    }
  }

  return NextResponse.redirect(`${origin}/compte?mode=login&error=callback`);
}
