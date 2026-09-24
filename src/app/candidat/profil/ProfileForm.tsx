"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateMyProfile } from "@/lib/diapale/candidates";

type Initial = {
  full_name: string;
  phone: string;
  ville: string;
  metier: string;
  competences: string;
  experience_years: number | "";
  niveau_etude: string;
  disponible: boolean;
};

export default function ProfileForm({
  userId,
  initial,
}: {
  userId: string;
  initial: Initial;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await updateMyProfile(
      supabase,
      userId,
      { full_name: form.full_name, phone: form.phone, ville: form.ville },
      {
        metier: form.metier,
        competences: form.competences,
        experience_years: form.experience_years,
        niveau_etude: form.niveau_etude,
        disponible: form.disponible,
      }
    );

    setSaving(false);
    setSaved(true);
    router.refresh();

    // Laisse voir la confirmation un instant, puis retour au tableau de bord.
    setTimeout(() => router.push("/candidat"), 700);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Nom complet">
        <input
          className="in"
          value={form.full_name}
          onChange={(e) => set("full_name", e.target.value)}
        />
      </Field>
      <Field label="Téléphone (WhatsApp)">
        <input
          className="in"
          placeholder="+221 77 000 00 00"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
        />
      </Field>
      <Field label="Ville">
        <input
          className="in"
          value={form.ville}
          onChange={(e) => set("ville", e.target.value)}
        />
      </Field>
      <Field label="Métier recherché">
        <input
          className="in"
          value={form.metier}
          onChange={(e) => set("metier", e.target.value)}
        />
      </Field>
      <Field label="Années d'expérience">
        <input
          type="number"
          min={0}
          className="in"
          value={form.experience_years}
          onChange={(e) =>
            set(
              "experience_years",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </Field>
      <Field label="Niveau d'étude">
        <input
          className="in"
          value={form.niveau_etude}
          onChange={(e) => set("niveau_etude", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Compétences (séparées par des virgules)">
          <input
            className="in"
            value={form.competences}
            onChange={(e) => set("competences", e.target.value)}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={(e) => set("disponible", e.target.checked)}
        />
        Disponible immédiatement
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-bg disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && (
          <span className="ml-3 text-sm font-semibold text-good">
            ✔ Enregistré
          </span>
        )}
      </div>

      <style jsx>{`
        .in {
          width: 100%;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-muted">{label}</span>
      {children}
    </label>
  );
}
