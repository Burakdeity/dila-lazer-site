"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import type { SiteSettings } from "@/types/admin";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

type SettingsSection = "seo" | "shipping" | "contact" | "all";

interface SettingsFormProps {
  settings: SiteSettings;
  section?: SettingsSection;
}

export function SettingsForm({ settings, section = "all" }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload: Partial<SiteSettings> = {};
    if (section === "seo" || section === "all") payload.seo = form.seo;
    if (section === "shipping" || section === "all") payload.shipping = form.shipping;
    if (section === "contact" || section === "all") payload.contact = form.contact;
    if (section === "all") payload.banners = form.banners;

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Ayarlar kaydedildi");
      router.refresh();
    } else {
      setMessage("Kayıt başarısız");
    }
  };

  const showSeo = section === "seo" || section === "all";
  const showShipping = section === "shipping" || section === "all";
  const showContact = section === "contact" || section === "all";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-xl text-sm ${message.includes("başarısız") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>
          {message}
        </div>
      )}

      {showSeo && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">SEO Ayarları</h2>
          <div>
            <label className={adminLabelClass}>Site Başlığı</label>
            <input className={adminInputClass} value={form.seo.title} onChange={(e) => setForm({ ...form, seo: { ...form.seo, title: e.target.value } })} />
          </div>
          <div>
            <label className={adminLabelClass}>Meta Açıklama</label>
            <textarea className={`${adminInputClass} resize-y`} rows={3} value={form.seo.description} onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} />
          </div>
          <div>
            <label className={adminLabelClass}>Anahtar Kelimeler</label>
            <input className={adminInputClass} value={form.seo.keywords} onChange={(e) => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value } })} />
          </div>
        </div>
      )}

      {showShipping && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">Kargo Ayarları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={adminLabelClass}>Ücretsiz Kargo Alt Limiti (₺)</label>
              <input type="number" className={adminInputClass} value={form.shipping.freeShippingMin} onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, freeShippingMin: Number(e.target.value) } })} />
            </div>
            <div>
              <label className={adminLabelClass}>Varsayılan Teslimat Süresi (gün)</label>
              <input type="number" className={adminInputClass} value={form.shipping.defaultDeliveryDays} onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, defaultDeliveryDays: Number(e.target.value) } })} />
            </div>
          </div>
          <div>
            <label className={adminLabelClass}>Kargo Firmaları (virgülle)</label>
            <input className={adminInputClass} value={form.shipping.carriers.join(", ")} onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, carriers: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} />
          </div>
        </div>
      )}

      {showContact && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={adminLabelClass}>Telefon</label>
              <input className={adminInputClass} value={form.contact.phone} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} />
            </div>
            <div>
              <label className={adminLabelClass}>E-posta</label>
              <input className={adminInputClass} value={form.contact.email} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} />
            </div>
            <div>
              <label className={adminLabelClass}>WhatsApp</label>
              <input className={adminInputClass} value={form.contact.whatsapp} onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })} />
            </div>
            <div>
              <label className={adminLabelClass}>Adres</label>
              <input className={adminInputClass} value={form.contact.address} onChange={(e) => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} />
            </div>
          </div>
        </div>
      )}

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90 disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Kaydet
      </button>
    </form>
  );
}
