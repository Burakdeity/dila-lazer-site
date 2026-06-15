"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, X } from "lucide-react";
import type { SpinSegment, SpinWheelConfig } from "@/types/spin-wheel";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

interface Winner {
  id: string;
  prizeLabel: string;
  couponCode: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null };
}

interface SpinWheelSettingsFormProps {
  config: SpinWheelConfig;
  stats: { totalSpins: number; totalWinners: number; todaySpins: number };
  winners: Winner[];
}

export function SpinWheelSettingsForm({ config, stats, winners }: SpinWheelSettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(config);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateSegment = (index: number, field: keyof SpinSegment, value: string | number) => {
    const segments = [...form.segments];
    segments[index] = { ...segments[index], [field]: value };
    setForm({ ...form, segments });
  };

  const addSegment = () => {
    setForm({
      ...form,
      segments: [
        ...form.segments,
        {
          id: crypto.randomUUID(),
          label: "Yeni Dilim",
          type: "retry" as const,
          weight: 1,
        },
      ],
    });
  };

  const removeSegment = (index: number) => {
    if (form.segments.length <= 2) return;
    setForm({ ...form, segments: form.segments.filter((_, i) => i !== index) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/spin-wheel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Ayarlar kaydedildi");
      router.refresh();
    } else {
      setMessage("Kayıt başarısız");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-2xl font-bold text-white">{stats.totalSpins}</p>
          <p className="text-sm text-gray-400">Toplam Çevirme</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-2xl font-bold text-emerald-400">{stats.totalWinners}</p>
          <p className="text-sm text-gray-400">Kupon Kazanan</p>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-2xl font-bold text-blue-400">{stats.todaySpins}</p>
          <p className="text-sm text-gray-400">Bugün</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message && (
          <div className={`p-3 rounded-xl text-sm ${message.includes("başarısız") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
            {message}
          </div>
        )}

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">Genel Ayarlar</h2>
          <label className="flex items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded"
            />
            Çark aktif
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={adminLabelClass}>Çevirme limiti (saat)</label>
              <input
                type="number"
                min={1}
                className={adminInputClass}
                value={form.cooldownHours}
                onChange={(e) => setForm({ ...form, cooldownHours: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Kupon geçerlilik (gün)</label>
              <input
                type="number"
                min={1}
                className={adminInputClass}
                value={form.couponValidDays}
                onChange={(e) => setForm({ ...form, couponValidDays: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Çark Dilimleri ({form.segments.length})</h2>
            <button type="button" onClick={addSegment} className="text-sm text-brand-red hover:underline inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Dilim Ekle
            </button>
          </div>
          {form.segments.map((seg, index) => (
            <div key={seg.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_100px_auto] gap-3 items-end p-3 rounded-xl bg-black/20">
              <div>
                <label className={adminLabelClass}>Etiket</label>
                <input className={adminInputClass} value={seg.label} onChange={(e) => updateSegment(index, "label", e.target.value)} />
              </div>
              <div>
                <label className={adminLabelClass}>Tip</label>
                <select
                  className={adminInputClass}
                  value={seg.type}
                  onChange={(e) => updateSegment(index, "type", e.target.value)}
                >
                  <option value="discount">İndirim</option>
                  <option value="retry">Tekrar Dene</option>
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>İndirim %</label>
                <input
                  type="number"
                  className={adminInputClass}
                  value={seg.discountPercent ?? ""}
                  disabled={seg.type !== "discount"}
                  onChange={(e) => updateSegment(index, "discountPercent", Number(e.target.value))}
                />
              </div>
              <div>
                <label className={adminLabelClass}>Kupon</label>
                <input
                  className={adminInputClass}
                  value={seg.couponCode ?? ""}
                  disabled={seg.type !== "discount"}
                  onChange={(e) => updateSegment(index, "couponCode", e.target.value)}
                />
              </div>
              <button type="button" onClick={() => removeSegment(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg mb-0.5">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Kaydet
        </button>
      </form>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Son Kazananlar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10">
                <th className="text-left py-2">Kullanıcı</th>
                <th className="text-left py-2">Ödül</th>
                <th className="text-left py-2">Kupon</th>
                <th className="text-left py-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {winners.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">Henüz kazanan yok</td></tr>
              ) : (
                winners.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 text-gray-300">
                    <td className="py-2">{w.user.name || w.user.email || "—"}</td>
                    <td className="py-2">{w.prizeLabel}</td>
                    <td className="py-2 font-mono text-amber-300">{w.couponCode || "—"}</td>
                    <td className="py-2">{new Date(w.createdAt).toLocaleString("tr-TR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
