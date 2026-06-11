"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import type { MainCategory, SubCategory } from "@/types/catalog";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { adminInputClass, adminLabelClass, adminSelectClass } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/utils";

const ICON_OPTIONS = ["Zap", "Layers", "Box", "Cuboid", "Cpu", "Star", "Sparkles"];

interface CategoryFormProps {
  category?: MainCategory;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "Box");
  const [subcategories, setSubcategories] = useState<SubCategory[]>(category?.subcategories ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addSub = () => {
    setSubcategories([...subcategories, { id: crypto.randomUUID(), name: "", slug: "" }]);
  };

  const updateSub = (index: number, field: keyof SubCategory, value: string) => {
    const next = [...subcategories];
    next[index] = { ...next[index], [field]: value };
    if (field === "name" && !next[index].slug) {
      next[index].slug = slugify(value);
    }
    setSubcategories(next);
  };

  const removeSub = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      image,
      icon,
      subcategories: subcategories.filter((s) => s.name.trim()),
    };

    const url = isEdit ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/kategoriler");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Kayıt başarısız");
    }
  };

  const handleDelete = async () => {
    if (!category || !confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/kategoriler");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Link href="/admin/kategoriler" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Kategorilere dön
      </Link>

      {error && (
        <div className="p-3 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/30">{error}</div>
      )}

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-lg font-semibold text-white">Kategori Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>Kategori Adı *</label>
            <input className={adminInputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={adminLabelClass}>Slug (URL)</label>
            <input className={adminInputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="otomatik oluşur" />
          </div>
        </div>
        <div>
          <label className={adminLabelClass}>Açıklama</label>
          <textarea className={`${adminInputClass} resize-y`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>İkon</label>
            <select className={adminSelectClass} value={icon} onChange={(e) => setIcon(e.target.value)}>
              {ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <SingleImageUpload value={image} onChange={setImage} label="Kategori Görseli *" />
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Alt Kategoriler</h2>
          <button type="button" onClick={addSub} className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline">
            <Plus className="h-4 w-4" /> Ekle
          </button>
        </div>
        {subcategories.map((sub, index) => (
          <div key={sub.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className={adminLabelClass}>Alt Kategori Adı</label>
              <input className={adminInputClass} value={sub.name} onChange={(e) => updateSub(index, "name", e.target.value)} />
            </div>
            <div>
              <label className={adminLabelClass}>Slug</label>
              <input className={adminInputClass} value={sub.slug} onChange={(e) => updateSub(index, "slug", e.target.value)} />
            </div>
            <button type="button" onClick={() => removeSub(index)} className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
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
