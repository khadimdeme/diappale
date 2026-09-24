import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getCurrentUserRole } from "@/lib/diapale/auth";

export default async function TableauDeBord() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) redirect("/compte?mode=login");

  const role = await getCurrentUserRole(supabase, user.id);
  if (role === "recruteur") redirect("/recruteur");
  redirect("/candidat");
}
