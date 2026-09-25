"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateMyCompany, type CompanyUpdate } from "@/lib/diapale/recruiters";

export default function CompanyForm({
  userId,
  initial,
}: {
  userId: string;
  initial: CompanyUpdate;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  function set<K extends keyof CompanyUpdate>(key: K, value: CompanyUpdate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateMyCompany(supabase, userId, form);
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Nom de l'entreprise">
          <input className="in" value={form.company_name} onChange={(e) => set("company_name", e.target.value)} />
        </Field>
      </div>
      <Field label="Secteur">
        <input className="in" placeholder="Ex : Agroalimentaire, Tech…" value={form.secteur} onChange={(e) => set("secteur", e.target.value)} />
      </Field>
      <Field label="Ville">
        <input className="in" value={form.ville} onChange={(e) => set("ville", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Numéro WhatsApp public">
          <input className="in" placeholder="+221 77 000 00 00" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Présentation (visible des candidats)">
          <textarea rows={4} className="in" placeholder="Qui vous êtes, ce que vous faites…" value={form.about} onChange={(e) => set("about", e.target.value)} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={saving} className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-bg disabled:opacity-60">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {saved && <span className="ml-3 text-sm font-semibold text-good">✔ Enregistré</span>}
      </div>

      <style jsx>{`
        .in {
          width: 100%;
          border-radius: 11px;
          border: 1px solid var(--border);
          background: var(--bg);
          padding: 0.7rem 0.85rem;
          font-size: 0.875rem;
          resize: vertical;
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
