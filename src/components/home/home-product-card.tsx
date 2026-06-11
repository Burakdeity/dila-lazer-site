"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/catalog";
import { ProductImage } from "@/components/shared/product-image";
import { formatPrice } from "@/lib/utils";

interface HomeProductCardProps {
  product: Product;
}

export function HomeProductCard({ product }: HomeProductCardProps) {
  const price = product.salePrice ?? product.basePrice;
  const hasDiscount = !!product.salePrice;

  const badge = hasDiscount
    ? { label: `%${Math.round((1 - product.salePrice! / product.basePrice) * 100)}`, className: "bg-brand-red text-white" }
    : product.badges.includes("new")
      ? { label: "Yeni", className: "bg-emerald-600 text-white" }
      : product.badges.includes("bestseller")
        ? { label: "Çok Satan", className: "bg-amber-500 text-white" }
        : null;

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col h-full bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:border-brand-red/25 hover:shadow-lg hover:shadow-brand-red/5 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f7f8fa]">
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-contain p-3 sm:p-4"
          sizes="(max-width: 640px) 45vw, 220px"
        />
      </div>

      <div className="flex flex-col flex-1 border-t border-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-300 hidden sm:inline">·</span>
          <span className="text-xs text-gray-400 hidden sm:inline truncate">
            {product.reviewCount} değerlendirme
          </span>
        </div>

        <div className="mt-auto pt-2.5 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-brand-black">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
