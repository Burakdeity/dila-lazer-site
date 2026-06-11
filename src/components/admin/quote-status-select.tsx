"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { QuoteStatus } from "@/types/admin";
import { QUOTE_STATUS_LABELS } from "@/types/admin";
import { adminSelectClass } from "@/components/admin/admin-ui";

const statuses: QuoteStatus[] = ["new", "reviewing", "quoted", "accepted", "rejected"];

export function QuoteStatusSelect({ quoteId, current }: { quoteId: string; current: QuoteStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: QuoteStatus) => {
    setStatus(next);
    setLoading(true);
    await fetch(`/api/admin/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as QuoteStatus)}
      className={`${adminSelectClass} min-w-[130px] py-1.5 text-xs`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{QUOTE_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
