"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "candidat" | "recruteur";
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
  const router = useRouter();
  const supabase = createClient();

  const roleLabel = role === "candidat" ? "Je cherche un emploi" : "Je recrute";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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

      <form onSubmit={handleSubmit} className="mt-4 max-w-md space-y-3">
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
