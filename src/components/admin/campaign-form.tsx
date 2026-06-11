"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import type { Campaign } from "@/types/catalog";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

interface CampaignFormProps {
  campaign?: Campaign;
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter();
  const isEdit = !!campaign;

  const [title, setTitle] = useState(campaign?.title ?? "");
  const [subtitle, setSubtitle] = useState(campaign?.subtitle ?? "");
  const [image, setImage] = useState(campaign?.image ?? "");
  const [link, setLink] = useState(campaign?.link ?? "/kampanyalar");
  const [discount, setDiscount] = useState(campaign?.discount ? String(campaign.discount) : "");
  const [endsAt, setEndsAt] = useState(campaign?.endsAt ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      subtitle,
      image,
      link,
      discount: discount ? Number(discount) : null,
      endsAt: endsAt || null,
    };

    const url = isEdit ? `/api/admin/campaigns/${campaign.id}` : "/api/admin/campaigns";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/kampanyalar");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Kayıt başarısız");
    }
  };

  const handleDelete = async () => {
    if (!campaign || !confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/campaigns/${campaign.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/kampanyalar");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Link href="/admin/kampanyalar" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Kampanyalara dön
      </Link>

      {error && (
        <div className="p-3 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/30">{error}</div>
      )}

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div>
          <label className={adminLabelClass}>Başlık *</label>
          <input className={adminInputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className={adminLabelClass}>Alt Başlık</label>
          <input className={adminInputClass} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>Link</label>
            <input className={adminInputClass} value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <div>
            <label className={adminLabelClass}>İndirim (%)</label>
            <input className={adminInputClass} type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={adminLabelClass}>Bitiş Tarihi</label>
          <input className={adminInputClass} type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </div>
        <SingleImageUpload value={image} onChange={setImage} label="Kampanya Görseli *" />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Güncelle" : "Kaydet"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl">
            <Trash2 className="h-4 w-4" /> Sil
          </button>
        )}
      </div>
    </form>
  );
}
