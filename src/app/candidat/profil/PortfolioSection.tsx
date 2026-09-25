"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addPortfolioItem, deletePortfolioItem } from "@/lib/diapale/candidates";
import type { PortfolioItem } from "@/lib/diapale/types";

export default function PortfolioSection({
  userId,
  initialItems,
}: {
  userId: string;
  initialItems: PortfolioItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);

    const { error } = await addPortfolioItem(supabase, userId, file, label || "Réalisation");
    setUploading(false);
    if (error) return setError(error.message);

    setLabel("");
    setFile(null);
    router.refresh();
    // Recharge la liste depuis la base pour avoir la vraie ligne (id, url).
    const { data } = await supabase
      .from("portfolio_items")
      .select("id, candidate_id, label, image_url")
      .eq("candidate_id", userId)
      .order("created_at", { ascending: false });
    setItems((data ?? []) as PortfolioItem[]);
  }

  async function handleDelete(item: PortfolioItem) {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    await deletePortfolioItem(supabase, item);
    router.refresh();
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="font-display text-base font-bold">
        Réalisations{" "}
        <span className="text-xs font-normal text-muted">
          (facultatif — jamais bloquant pour ton profil)
        </span>
      </h3>
      <p className="mt-1 text-xs text-muted">
        Des photos de ton travail : une robe cousue, un mur fini, une app livrée…
        Utile pour te démarquer, jamais obligatoire.
      </p>

      {items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((item) => (
            <div key={item.id} className="w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.label}
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
              <p className="mt-1 truncate text-[10px] font-semibold" title={item.label}>
                {item.label}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="text-[10px] font-bold text-danger"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-2.5">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1.5 block text-xs font-bold text-muted">Légende</label>
          <input
            className="w-full rounded-[11px] border border-border bg-bg px-3.5 py-2.5 text-sm"
            placeholder="Ex : Robe wax"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1.5 block text-xs font-bold text-muted">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={uploading || !file}
          className="rounded-full bg-ink px-4 py-2.5 text-xs font-extrabold text-bg disabled:opacity-60"
        >
          {uploading ? "Envoi…" : "Ajouter"}
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
