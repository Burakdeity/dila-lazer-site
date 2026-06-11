"use client";

import { useState } from "react";
import { ProductImage } from "@/components/shared/product-image";
import Link from "next/link";
import {
  Star, Heart, ShoppingBag, Truck, Shield, MessageCircle,
  Minus, Plus, CheckCircle2, RotateCcw, CreditCard,
} from "lucide-react";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import { calculatePrice, calculateInstallments } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { CatalogBreadcrumb } from "@/components/catalog/catalog-breadcrumb";
import { StoreProductCard } from "@/components/catalog/store-product-card";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const materialLabels: Record<string, string> = {
  pleksi: "Pleksi",
  neon: "Neon Flex",
  "3d": "3D CNC",
  led: "LED Modül",
  "kutu-harf": "Kutu Harf",
  mdf: "MDF",
};

const colorLabels: Record<string, string> = {
  beyaz: "Beyaz", kirmizi: "Kırmızı", mavi: "Mavi",
  yesil: "Yeşil", mor: "Mor", altin: "Altın", rgb: "RGB",
  pembe: "Pembe", siyah: "Siyah",
};

export function ProductDetail({ product, relatedProducts }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const defaultSizes = product.sizes.length ? product.sizes : ["60x30 cm"];
  const defaultMaterials = product.materials.length ? product.materials : ["Neon Flex"];
  const defaultColors = product.colors.length ? product.colors : ["Beyaz"];

  const [size, setSize] = useState(defaultSizes[1] || defaultSizes[0]);
  const [material, setMaterial] = useState(defaultMaterials[0]);
  const [color, setColor] = useState(defaultColors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "install" | "faq" | "reviews">("desc");

  const [w, h] = size?.includes("x")
    ? size.split("x").map((s) => parseInt(s))
    : [60, 30];

  const baseForCalc = product.salePrice ?? product.basePrice;
  const price = calculatePrice({
    basePrice: baseForCalc,
    width: w || 60,
    height: h || 30,
    material,
    color,
    quantity,
  });

  const installments = calculateInstallments(price);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      quantity,
      unitPrice: price / quantity,
      size,
      material,
      color,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <CatalogBreadcrumb
            items={[
              { label: "Ürünler", href: "/urunler" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Galeri */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f7f8fa] border border-gray-200 mb-3">
              <ProductImage
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-6"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badges.includes("new") && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold uppercase">
                  Yeni
                </span>
              )}
              {product.salePrice && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-md bg-brand-red text-white text-xs font-bold">
                  İndirim
                </span>
              )}
              {product.stock < 20 && inStock && (
                <span className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-amber-500 text-white text-xs font-medium">
                  Son {product.stock} adet
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-white transition-colors ${
                    selectedImage === i ? "border-brand-red" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ProductImage src={img} alt="" fill className="object-contain p-1" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Satın alma paneli */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} · {product.reviewCount} değerlendirme
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mb-6 leading-relaxed">{product.shortDesc}</p>

            {/* Fiyat kutusu */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-brand-black">{formatPrice(price)}</span>
                {product.salePrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.basePrice * quantity)}</span>
                )}
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">KDV Dahil</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-gray-400" />
                12 taksit × <strong className="text-brand-black">{formatPrice(installments.monthly)}</strong>
              </p>
              {price >= 1500 && (
                <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  Bu üründe ücretsiz kargo
                </p>
              )}
            </div>

            {/* Stok & teslimat */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                inStock ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
              }`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {inStock ? "Stokta var" : "Stokta yok"}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                <Truck className="h-3.5 w-3.5" />
                {product.deliveryDays} iş günü teslimat
              </span>
            </div>

            {/* Seçenekler */}
            <div className="space-y-5 mb-6">
              <div>
                <label className="text-sm font-semibold text-brand-black mb-2.5 block">Ölçü</label>
                <div className="flex flex-wrap gap-2">
                  {defaultSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        size === s
                          ? "bg-brand-red text-white border-brand-red shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {s.includes("cm") ? s : `${s} cm`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-brand-black mb-2.5 block">Malzeme</label>
                <div className="flex flex-wrap gap-2">
                  {defaultMaterials.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMaterial(m)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        material === m
                          ? "bg-brand-red text-white border-brand-red shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {materialLabels[m] || m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-brand-black mb-2.5 block">Renk</label>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                        color === c
                          ? "bg-brand-red text-white border-brand-red shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {colorLabels[c] || c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-brand-black mb-2.5 block">Adet</label>
                <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    aria-label="Azalt"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-base font-semibold w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    aria-label="Artır"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 justify-center" disabled={!inStock}>
                <ShoppingBag className="h-4 w-4" />
                Sepete Ekle
              </Button>
              <Link href="/odeme" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full justify-center" disabled={!inStock}>
                  Hemen Satın Al
                </Button>
              </Link>
              <button className="p-4 rounded-xl border border-gray-200 bg-white hover:border-brand-red hover:text-brand-red transition-colors shrink-0">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <a
              href={getWhatsAppUrl(`${product.name} hakkında sipariş vermek istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-6"
            >
              <Button variant="whatsapp" size="lg" className="w-full justify-center">
                <MessageCircle className="h-4 w-4" />
                WhatsApp ile Sipariş
              </Button>
            </a>

            {/* Güven */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Hızlı Kargo" },
                { icon: Shield, label: "2 Yıl Garanti" },
                { icon: RotateCcw, label: "Kolay İade" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-white border border-gray-200">
                  <Icon className="h-5 w-5 text-brand-red mx-auto mb-1.5" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: "desc" as const, label: "Ürün Açıklaması" },
              { id: "install" as const, label: "Kurulum" },
              { id: "faq" as const, label: "Sık Sorulanlar" },
              { id: "reviews" as const, label: `Yorumlar (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "text-brand-red border-brand-red bg-brand-red/5"
                    : "text-gray-500 border-transparent hover:text-brand-black hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "desc" && (
              <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
            )}
            {activeTab === "install" && (
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {product.installation || "Montaj kılavuzu ve aksesuarlar ürünle birlikte gönderilir."}
              </p>
            )}
            {activeTab === "faq" && (
              <div className="space-y-3 max-w-3xl">
                {[
                  { q: "Özel ölçü yapılabilir mi?", a: "Evet, istediğiniz ölçüde üretim yapıyoruz." },
                  { q: "Dış mekana uygun mu?", a: "IP65 korumalı LED modüller ile dış mekan kullanımına uygundur." },
                  { q: "Montaj dahil mi?", a: "Temel montaj aksesuarları dahildir. Profesyonel montaj opsiyoneldir." },
                ].map((faq) => (
                  <div key={faq.q} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <h4 className="text-brand-black font-semibold text-sm mb-1.5">{faq.q}</h4>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="text-center py-8">
                <Star className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
              </div>
            )}
          </div>
        </div>

        {/* Benzer ürünler */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <StoreProductCard key={p.id} product={p} showQuickAdd />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
