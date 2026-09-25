"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateInterestStatus } from "@/lib/diapale/recruiters";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/diapale/statusLabels";
import type { InterestStatus } from "@/lib/diapale/types";

export default function StatusSelect({
  offerId,
  candidateId,
  currentStatus,
}: {
  offerId: string;
  candidateId: string;
  currentStatus: InterestStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleChange(next: InterestStatus) {
    setStatus(next);
    setSaving(true);
    await updateInterestStatus(supabase, offerId, candidateId, next);
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as InterestStatus)}
      className="rounded-[9px] border border-border bg-surface px-2.5 py-2 text-xs font-bold disabled:opacity-60"
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
