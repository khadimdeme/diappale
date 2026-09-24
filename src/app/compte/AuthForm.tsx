"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signIn, signInWithGoogle, signUp } from "@/lib/diapale/auth";
import type { Role } from "@/lib/diapale/types";

type Mode = "signup" | "login";

export default function AuthForm({
  initialRole,
  initialMode,
}: {
  initialRole: Role;
  initialMode: Mode;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const roleLabel = role === "candidat" ? "Je cherche un emploi" : "Je recrute";

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle(supabase, role);
    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
    // En cas de succès, le navigateur est redirigé vers Google puis
    // vers /auth/callback — rien d'autre à faire ici.
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await signUp(supabase, { email, password, role });
      setLoading(false);
      if (error) return setError(error.message);
      if (!data.session) {
        // Confirmation email requise avant de pouvoir se connecter.
        setCheckEmail(true);
        return;
      }
      router.push("/tableau-de-bord");
      router.refresh();
    } else {
      const { error } = await signIn(supabase, { email, password });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/tableau-de-bord");
      router.refresh();
    }
  }

  if (checkEmail) {
    return (
      <div className="rounded-2xl border border-border bg-gold-bg p-5 text-sm">
        <p className="font-bold">📧 Vérifie ta boîte mail</p>
        <p className="mt-1.5 text-muted">
          On a envoyé un lien de confirmation à <b>{email}</b>. Clique dessus
          pour activer ton compte {roleLabel === "Je recrute" ? "recruteur" : "candidat"}.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={() => setRole("candidat")}
          className={`rounded-2xl border-2 p-5 text-left ${
            role === "candidat"
              ? "border-ink bg-gold-bg"
              : "border-border bg-surface"
          }`}
        >
          <div className="text-2xl">🔍</div>
          <h4 className="mt-2 font-display text-base font-bold">
            Je cherche un emploi
          </h4>
          <p className="mt-1 text-xs text-muted">
            Gratuit. Profil en 5 min, CV généré.
          </p>
        </button>
        <button
          type="button"
          onClick={() => setRole("recruteur")}
          className={`rounded-2xl border-2 p-5 text-left ${
            role === "recruteur"
              ? "border-ink bg-gold-bg"
              : "border-border bg-surface"
          }`}
        >
          <div className="text-2xl">🏢</div>
          <h4 className="mt-2 font-display text-base font-bold">
            Je recrute
          </h4>
          <p className="mt-1 text-xs text-muted">
            Gratuit pour publier. Boost en option.
          </p>
        </button>
      </div>

      <div className="mt-5 flex max-w-xs gap-1.5 rounded-[11px] bg-surface-2 p-1.5">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-lg py-2 text-sm font-extrabold ${
            mode === "signup" ? "bg-surface text-ink shadow-sm" : "text-muted"
          }`}
        >
          Créer un compte
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 text-sm font-extrabold ${
            mode === "login" ? "bg-surface text-ink shadow-sm" : "text-muted"
          }`}
        >
          Se connecter
        </button>
      </div>

      <div className="mt-4 max-w-md">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-surface py-3 text-sm font-bold disabled:opacity-60"
        >
          <GoogleIcon />
          {googleLoading
            ? "Un instant…"
            : mode === "signup"
              ? "Continuer avec Google"
              : "Se connecter avec Google"}
        </button>
        <div className="my-4 flex items-center gap-3 text-xs font-bold text-muted">
          <span className="h-px flex-1 bg-border" />
          ou par email
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className="w-full rounded-[11px] border border-border bg-bg px-3.5 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-muted">
            Mot de passe
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full rounded-[11px] border border-border bg-bg px-3.5 py-3 text-sm"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-bloom-bg px-3 py-2 text-sm font-semibold text-bloom">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink py-3.5 text-sm font-extrabold text-bg disabled:opacity-60"
        >
          {loading
            ? "Un instant…"
            : mode === "signup"
              ? `Créer mon compte — ${roleLabel}`
              : `Me connecter — ${roleLabel}`}
        </button>

        <p className="text-xs text-muted">
          Le numéro de téléphone est demandé juste après, pour le contact
          WhatsApp — pas de SMS de vérification payant.
        </p>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
    </svg>
  );
}
