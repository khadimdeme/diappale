"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut as signOutService } from "@/lib/diapale/auth";

export default function TopNav({ label }: { label: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await signOutService(supabase);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-[9px] bg-ink-2 font-display text-base font-bold text-white">
          D
        </div>
        <span className="font-display text-lg font-bold">Diapalé</span>
        <span className="ml-1 hidden text-xs font-bold text-muted sm:inline">
          · {label}
        </span>
      </Link>
      <button
        onClick={signOut}
        className="rounded-full border border-border px-4 py-1.5 text-sm font-bold text-muted hover:text-text"
      >
        Se déconnecter
      </button>
    </div>
  );
}
