"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deleteCv, uploadCv } from "@/lib/diapale/candidates";

export default function CvSection({
  userId,
  initialCvUrl,
}: {
  userId: string;
  initialCvUrl: string | null;
}) {
  const [cvUrl, setCvUrl] = useState(initialCvUrl);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);

    const { error } = await uploadCv(supabase, userId, file);
    setUploading(false);
    if (error) return setError(error.message);

    const { data } = await supabase
      .from("candidate_profiles")
      .select("cv_url")
      .eq("id", userId)
      .single();
    setCvUrl(data?.cv_url ?? null);
    setFile(null);
    router.refresh();
  }

  async function handleDelete() {
    if (!cvUrl) return;
    setCvUrl(null);
    await deleteCv(supabase, userId, cvUrl);
    router.refresh();
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-base font-bold">
        Mon CV <span className="text-xs font-normal text-muted">(facultatif)</span>
      </h3>
      <p className="mt-1 text-xs text-muted">
        Tu as déjà un CV en PDF, ou juste une photo d&apos;un CV papier ? Dépose-le ici — il
        remplace le CV généré automatiquement, partout où il est affiché. Tu peux le changer
        quand tu veux.
      </p>

      {cvUrl && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-bg p-3">
          <a
            href={cvUrl}
            target="_blank"
            className="flex items-center gap-2 text-sm font-bold text-ink-text underline underline-offset-2"
          >
            Voir mon CV actuel
          </a>
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-bold text-danger"
          >
            Supprimer
          </button>
        </div>
      )}

      <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-end gap-2.5">
        <div className="flex-1 min-w-[180px]">
          <label className="mb-1.5 block text-xs font-bold text-muted">
            {cvUrl ? "Remplacer par un nouveau fichier" : "Fichier (PDF ou photo)"}
          </label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={uploading || !file}
          className="rounded-full bg-ink px-4 py-2.5 text-xs font-extrabold text-bg disabled:opacity-60"
        >
          {uploading ? "Envoi…" : cvUrl ? "Remplacer" : "Déposer mon CV"}
        </button>
      </form>
      {error && (
        <p className="mt-2 rounded-lg bg-danger-bg px-3 py-2 text-xs font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
