"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { adminInputClass, adminLabelClass, adminSelectClass } from "@/components/admin/admin-ui";

export function CouponForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) return setError("Kupon kodu gerekli");

    setSaving(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrder: minOrder ? Number(minOrder) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        expiresAt: expiresAt || undefined,
        isActive: true,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Kayıt başarısız");
      return;
    }
    router.push("/admin/kuponlar");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

      <div>
        <label className={adminLabelClass}>Kupon Kodu *</label>
        <input className={adminInputClass} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="NEON20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>İndirim Tipi</label>
          <select className={adminSelectClass} value={discountType} onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}>
            <option value="percent">Yüzde (%)</option>
            <option value="fixed">Sabit Tutar (₺)</option>
          </select>
        </div>
        <div>
          <label className={adminLabelClass}>İndirim Değeri *</label>
          <input type="number" className={adminInputClass} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={adminLabelClass}>Min. Sipariş (₺)</label>
          <input type="number" className={adminInputClass} value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
        </div>
        <div>
          <label className={adminLabelClass}>Kullanım Limiti</label>
          <input type="number" className={adminInputClass} value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} />
        </div>
      </div>
      <div>
        <label className={adminLabelClass}>Son Kullanma Tarihi</label>
        <input type="date" className={adminInputClass} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
      </div>
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90 disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Kupon Oluştur
      </button>
    </form>
  );
}
