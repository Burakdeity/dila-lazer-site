"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, X } from "lucide-react";
import type { SiteMenus, MenuLink } from "@/types/admin";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

interface MenuEditorProps {
  menus: SiteMenus;
}

function LinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string;
  links: MenuLink[];
  onChange: (links: MenuLink[]) => void;
}) {
  const add = () => {
    onChange([...links, { id: crypto.randomUUID(), label: "", href: "/", isActive: true }]);
  };

  const update = (index: number, field: keyof MenuLink, value: string | boolean) => {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const remove = (index: number) => onChange(links.filter((_, i) => i !== index));

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline">
          <Plus className="h-4 w-4" /> Ekle
        </button>
      </div>
      {links.map((link, index) => (
        <div key={link.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center p-3 rounded-xl bg-black/20">
          <input className={adminInputClass} placeholder="Etiket" value={link.label} onChange={(e) => update(index, "label", e.target.value)} />
          <input className={adminInputClass} placeholder="/link" value={link.href} onChange={(e) => update(index, "href", e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
            <input type="checkbox" checked={link.isActive} onChange={(e) => update(index, "isActive", e.target.checked)} />
            Aktif
          </label>
          <button type="button" onClick={() => remove(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg justify-self-end">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function MenuEditor({ menus }: MenuEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState(menus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menus: form }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Menüler kaydedildi");
      router.refresh();
    } else {
      setMessage("Kayıt başarısız");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-xl text-sm ${message.includes("başarısız") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>
          {message}
        </div>
      )}

      <LinkListEditor
        title="Üst Bilgi Çubuğu"
        links={form.topBarLinks}
        onChange={(topBarLinks) => setForm({ ...form, topBarLinks })}
      />
      <LinkListEditor
        title="Ana Menü Ek Linkler (Kendin Tasarla, Teklif Al vb.)"
        links={form.extraNavLinks}
        onChange={(extraNavLinks) => setForm({ ...form, extraNavLinks })}
      />
      <LinkListEditor
        title="Footer — Kurumsal"
        links={form.footerCorporateLinks}
        onChange={(footerCorporateLinks) => setForm({ ...form, footerCorporateLinks })}
      />
      <LinkListEditor
        title="Footer — Müşteri Hizmetleri"
        links={form.footerServiceLinks}
        onChange={(footerServiceLinks) => setForm({ ...form, footerServiceLinks })}
      />

      <p className={adminLabelClass}>Kategori menüsü otomatik olarak Kategoriler bölümünden gelir.</p>

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Menüleri Kaydet
      </button>
    </form>
  );
}
