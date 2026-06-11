"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, X } from "lucide-react";
import type { HeroSlide, SiteBanner } from "@/types/admin";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

interface CmsContentEditorProps {
  heroSlides: HeroSlide[];
  banners: SiteBanner[];
}

export function CmsContentEditor({ heroSlides, banners }: CmsContentEditorProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(heroSlides);
  const [bannerList, setBannerList] = useState(banners);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: crypto.randomUUID(),
        eyebrow: "",
        title: "",
        subtitle: "",
        image: "",
        ctaLabel: "İncele",
        ctaHref: "/",
        secondaryLabel: "Detay",
        secondaryHref: "/",
        isActive: true,
      },
    ]);
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string | boolean) => {
    const next = [...slides];
    next[index] = { ...next[index], [field]: value };
    setSlides(next);
  };

  const removeSlide = (index: number) => setSlides(slides.filter((_, i) => i !== index));

  const addBanner = () => {
    setBannerList([
      ...bannerList,
      { id: crypto.randomUUID(), title: "", subtitle: "", image: "", link: "/", isActive: true },
    ]);
  };

  const updateBanner = (index: number, field: keyof SiteBanner, value: string | boolean) => {
    const next = [...bannerList];
    next[index] = { ...next[index], [field]: value };
    setBannerList(next);
  };

  const removeBanner = (index: number) => setBannerList(bannerList.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroSlides: slides, banners: bannerList }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("İçerik kaydedildi");
      router.refresh();
    } else {
      setMessage("Kayıt başarısız");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message && (
        <div className={`p-3 rounded-xl text-sm ${message.includes("başarısız") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/30"}`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Ana Sayfa Slaytları (Hero)</h2>
          <button type="button" onClick={addSlide} className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline">
            <Plus className="h-4 w-4" /> Slayt Ekle
          </button>
        </div>
        {slides.map((slide, index) => (
          <div key={slide.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Slayt {index + 1}</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={slide.isActive} onChange={(e) => updateSlide(index, "isActive", e.target.checked)} />
                  Aktif
                </label>
                <button type="button" onClick={() => removeSlide(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={adminLabelClass}>Üst Etiket</label>
                <input className={adminInputClass} value={slide.eyebrow} onChange={(e) => updateSlide(index, "eyebrow", e.target.value)} />
              </div>
              <div>
                <label className={adminLabelClass}>Başlık</label>
                <input className={adminInputClass} value={slide.title} onChange={(e) => updateSlide(index, "title", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={adminLabelClass}>Alt Başlık</label>
              <textarea className={`${adminInputClass} resize-y`} rows={2} value={slide.subtitle} onChange={(e) => updateSlide(index, "subtitle", e.target.value)} />
            </div>
            <SingleImageUpload value={slide.image} onChange={(url) => updateSlide(index, "image", url)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={adminLabelClass}>Birincil Buton</label>
                <input className={adminInputClass} placeholder="Etiket" value={slide.ctaLabel} onChange={(e) => updateSlide(index, "ctaLabel", e.target.value)} />
                <input className={`${adminInputClass} mt-2`} placeholder="Link" value={slide.ctaHref} onChange={(e) => updateSlide(index, "ctaHref", e.target.value)} />
              </div>
              <div>
                <label className={adminLabelClass}>İkincil Buton</label>
                <input className={adminInputClass} placeholder="Etiket" value={slide.secondaryLabel} onChange={(e) => updateSlide(index, "secondaryLabel", e.target.value)} />
                <input className={`${adminInputClass} mt-2`} placeholder="Link" value={slide.secondaryHref} onChange={(e) => updateSlide(index, "secondaryHref", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Promosyon Bannerları</h2>
          <button type="button" onClick={addBanner} className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline">
            <Plus className="h-4 w-4" /> Banner Ekle
          </button>
        </div>
        {bannerList.map((banner, index) => (
          <div key={banner.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Banner {index + 1}</h3>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={banner.isActive} onChange={(e) => updateBanner(index, "isActive", e.target.checked)} />
                  Aktif
                </label>
                <button type="button" onClick={() => removeBanner(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={adminLabelClass}>Başlık</label>
                <input className={adminInputClass} value={banner.title} onChange={(e) => updateBanner(index, "title", e.target.value)} />
              </div>
              <div>
                <label className={adminLabelClass}>Link</label>
                <input className={adminInputClass} value={banner.link} onChange={(e) => updateBanner(index, "link", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={adminLabelClass}>Alt Başlık</label>
              <input className={adminInputClass} value={banner.subtitle} onChange={(e) => updateBanner(index, "subtitle", e.target.value)} />
            </div>
            <SingleImageUpload value={banner.image} onChange={(url) => updateBanner(index, "image", url)} />
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Kaydet
      </button>
    </form>
  );
}
