"use client";

import Link from "next/link";
import { ProductImage } from "@/components/shared/product-image";
import { Heart, Star, ShoppingCart, Truck, Eye } from "lucide-react";
import type { Product } from "@/types/catalog";
import { formatPrice } from "@/lib/utils";
import { calculateInstallments } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";

interface StoreProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

function getBrandName(categorySlug: string): string {
  const brands: Record<string, string> = {
    "neon-led-tabelalar": "Neon Pro",
    "mdf-urunler": "MDF Craft",
    "pleksi-urunler": "Pleksix",
    "3d-urunler": "3D Studio",
    "elektronik-urunler": "LED Tech",
  };
  return brands[categorySlug] || "Dila Lazer";
}

export function StoreProductCard({ product, showQuickAdd = false }: StoreProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const price = product.salePrice ?? product.basePrice;
  const hasDiscount = !!product.salePrice;
  const discountPct = hasDiscount
    ? Math.round((1 - product.salePrice! / product.basePrice) * 100)
    : 0;
  const installments = calculateInstallments(price);
  const isBestseller = product.badges.includes("bestseller");
  const freeShipping = price >= 1500;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "",
      quantity: 1,
      unitPrice: price,
      size: product.sizes[0] || "Standart",
      material: product.materials[0] || "Neon Flex",
      color: product.colors[0] || "Beyaz",
    });
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(213,0,0,0.12)] hover:border-brand-red/30 transition-all duration-300 group relative flex flex-col h-full">
      {/* Rozetler */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.badges.includes("new") && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
            Yeni
          </span>
        )}
        {isBestseller && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
            Çok Satan
          </span>
        )}
      </div>
      {hasDiscount && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          %{discountPct}
        </span>
      )}

      {/* Görsel */}
      <div className="relative">
        <Link href={`/urun/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-[#f7f8fa]">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-3 sm:p-4"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </Link>

        {/* Hover aksiyonları */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <Link
            href={`/urun/${product.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg text-xs font-semibold text-brand-black hover:border-brand-red hover:text-brand-red transition-colors shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            İncele
          </Link>
          {showQuickAdd && (
            <button
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red/90 transition-colors shadow-sm"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Ekle
            </button>
          )}
        </div>

        <button
          className="absolute bottom-14 right-2.5 w-8 h-8 rounded-full bg-white/95 border border-gray-200 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-brand-red hover:text-brand-red transition-all z-10"
          aria-label="Favorilere ekle"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bilgi */}
      <div className="p-3.5 flex flex-col flex-1 border-t border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {getBrandName(product.categorySlug)}
        </p>
        <Link href={`/urun/${product.slug}`} className="flex-1">
          <h3 className="text-sm text-gray-800 font-medium line-clamp-2 hover:text-brand-red transition-colors leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="mt-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-brand-black">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            12 taksit × {formatPrice(installments.monthly)}
          </p>
        </div>

        {freeShipping && (
          <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            <Truck className="h-3 w-3" />
            Ücretsiz Kargo
          </div>
        )}
      </div>
    </article>
  );
}
