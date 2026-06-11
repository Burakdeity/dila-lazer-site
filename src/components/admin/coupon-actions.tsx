"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

export function CouponActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  if (loading) return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;

  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={toggle} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" title={isActive ? "Pasif yap" : "Aktif yap"}>
        {isActive ? <ToggleRight className="h-4 w-4 text-green-400" /> : <ToggleLeft className="h-4 w-4" />}
      </button>
      <button type="button" onClick={remove} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10" title="Sil">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
