"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/catalog";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const badgeLabels: Record<string, string> = {
  bestseller: "Çok Satan",
  new: "Yeni",
  sale: "İndirim",
  custom: "Kendin Tasarla",
  featured: "Öne Çıkan",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const price = product.salePrice ?? product.basePrice;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
        <Link href={`/urun/${product.slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {product.badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${
                    b === "sale" ? "bg-brand-red text-white" : "bg-white/90 text-brand-black shadow-sm"
                  }`}
                >
                  {badgeLabels[b] || b}
                </span>
              ))}
            </div>
          </div>
        </Link>

        <div className="p-5">
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount})</span>
          </div>

          <Link href={`/urun/${product.slug}`}>
            <h3 className="text-sm font-semibold text-brand-black mb-1 line-clamp-2 group-hover:text-brand-red transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-3">
            <div>
              {product.salePrice && (
                <span className="text-xs text-gray-400 line-through mr-2">
                  {formatPrice(product.basePrice)}
                </span>
              )}
              <span className="text-lg font-bold text-brand-black">{formatPrice(price)}</span>
            </div>
            <div className="flex gap-1.5">
              <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors opacity-0 group-hover:opacity-100" aria-label="Favori">
                <Heart className="h-3.5 w-3.5 text-gray-500" />
              </button>
              <button
                onClick={() =>
                  addItem({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images[0],
                    quantity: 1,
                    unitPrice: price,
                  })
                }
                className="p-2 rounded-xl bg-brand-red hover:bg-brand-red/90 transition-colors"
                aria-label="Sepete ekle"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
