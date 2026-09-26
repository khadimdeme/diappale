import Link from "next/link";
import AuthForm from "./AuthForm";

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const initialRole = params.role === "recruteur" ? "recruteur" : "candidat";
  const initialMode = params.mode === "login" ? "login" : "signup";
  const next = params.next && params.next.startsWith("/") ? params.next : undefined;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-muted">
        ← Retour
      </Link>
      <div className="mt-4 rounded-3xl border border-border bg-surface p-6 shadow-sm md:p-8">
        <p className="text-xs font-extrabold tracking-wide text-ink uppercase">
          Première étape
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold">
          Le rôle se choisit avant tout formulaire
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Un même écran pour créer un compte ou se connecter — comme sur
          Malt ou Fuzu.
        </p>
        <div className="mt-6">
          <AuthForm initialRole={initialRole} initialMode={initialMode} next={next} />
        </div>
      </div>
    </main>
  );
}
