"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/types/admin";
import { ORDER_STATUS_LABELS } from "@/types/admin";
import { adminSelectClass } from "@/components/admin/admin-ui";

const statuses: OrderStatus[] = [
  "pending", "confirmed", "production", "shipped", "delivered", "cancelled",
];

export function OrderStatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: OrderStatus) => {
    setStatus(next);
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
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
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className={`${adminSelectClass} min-w-[130px] py-1.5 text-xs`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
