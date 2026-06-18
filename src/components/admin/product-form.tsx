"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Product, ProductBadge, MainCategory } from "@/types/catalog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/utils";

const BADGE_OPTIONS: { value: ProductBadge; label: string }[] = [
  { value: "bestseller", label: "Çok Satan" },
  { value: "new", label: "Yeni" },
  { value: "sale", label: "İndirimli" },
  { value: "custom", label: "Kendin Tasarla" },
  { value: "featured", label: "Öne Çıkan" },
];

interface ProductFormProps {
  categories: MainCategory[];
  product?: Product;
}

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(String(product?.basePrice ?? ""));
  const [salePrice, setSalePrice] = useState(product?.salePrice ? String(product.salePrice) : "");
  const defaultCategory = product?.categorySlug ?? categories[0]?.slug ?? "";
  const defaultCategoryObj = categories.find((c) => c.slug === defaultCategory) ?? categories[0];
  const [categorySlug, setCategorySlug] = useState(defaultCategory);
  const [subcategorySlug, setSubcategorySlug] = useState(
    product?.subcategorySlug ?? defaultCategoryObj?.subcategories[0]?.slug ?? ""
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [badges, setBadges] = useState<ProductBadge[]>(product?.badges ?? []);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isCustomDesign, setIsCustomDesign] = useState(product?.isCustomDesign ?? false);
  const [stock, setStock] = useState(String(product?.stock ?? "10"));
  const [deliveryDays, setDeliveryDays] = useState(String(product?.deliveryDays ?? "5"));
  const [sizes, setSizes] = useState(product?.sizes.join(", ") ?? "");
  const [materials, setMaterials] = useState(product?.materials.join(", ") ?? "");
  const [colors, setColors] = useState(product?.colors.join(", ") ?? "");
  const [installation, setInstallation] = useState(product?.installation ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subcategories = useMemo(() => {
    const cat = categories.find((c) => c.slug === categorySlug);
    return cat?.subcategories ?? [];
  }, [categories, categorySlug]);

  const toggleBadge = (badge: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Ürün adı zorunludur");
    if (!images.length) return setError("En az bir görsel yükleyin");
    if (!categorySlug || !subcategorySlug) return setError("Kategori seçin");

    const payload = {
      name,
      slug: slug.trim() || slugify(name),
      shortDesc,
      description,
      basePrice: Number(basePrice),
      salePrice: salePrice ? Number(salePrice) : null,
      categorySlug,
      subcategorySlug,
      images,
      badges,
      isFeatured,
      isCustomDesign,
      stock: Number(stock),
      deliveryDays: Number(deliveryDays),
      sizes: parseList(sizes),
      materials: parseList(materials),
      colors: parseList(colors),
      installation: installation || undefined,
    };

    setSaving(true);
    const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Kayıt başarısız");
      return;
    }

    router.push("/admin/urunler");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin/urunler"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Ürünlere dön
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90 disabled:opacity-50 neon-btn-glow"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Güncelle" : "Ürünü Kaydet"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Temel Bilgiler</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Ürün Adı *</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEdit && !slug) setSlug(slugify(e.target.value));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="Örn: Cafe Neon LED"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">URL Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none font-mono text-sm"
                  placeholder="cafe-neon"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Kısa Açıklama</label>
                <input
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="Ürün kartında görünecek kısa metin"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Detaylı Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none resize-y"
                  placeholder="Ürün detay sayfasında görünecek açıklama..."
                />
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Ürün Görselleri *</h2>
            <ImageUploader images={images} onChange={setImages} />
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Özellikler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Boyutlar (virgülle)</label>
                <input
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="40x20 cm, 60x30 cm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Malzemeler</label>
                <input
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="Neon Flex, Pleksi"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Renkler</label>
                <input
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="Kırmızı, Mavi, Beyaz"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Montaj Bilgisi</label>
                <input
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  placeholder="Duvara montaj dahil"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Fiyat & Stok</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Liste Fiyatı (₺) *</label>
                <input
                  type="number"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">İndirimli Fiyat (₺)</label>
                <input
                  type="number"
                  min="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Teslimat (gün)</label>
                  <input
                    type="number"
                    min="1"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Kategori</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Ana Kategori *</label>
                <select
                  value={categorySlug}
                  onChange={(e) => {
                    setCategorySlug(e.target.value);
                    const cat = categories.find((c) => c.slug === e.target.value);
                    setSubcategorySlug(cat?.subcategories[0]?.slug ?? "");
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Alt Kategori *</label>
                <select
                  value={subcategorySlug}
                  onChange={(e) => setSubcategorySlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white focus:border-brand-red focus:outline-none"
                >
                  {subcategories.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Etiketler</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {BADGE_OPTIONS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => toggleBadge(b.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    badges.includes(b.value)
                      ? "bg-brand-red/20 border-brand-red text-brand-red"
                      : "border-white/15 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-white/20"
              />
              Ana sayfada öne çıkar
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomDesign}
                onChange={(e) => setIsCustomDesign(e.target.checked)}
                className="rounded border-white/20"
              />
              Özel tasarım ürünü
            </label>
          </section>
        </div>
      </div>
    </form>
  );
}
