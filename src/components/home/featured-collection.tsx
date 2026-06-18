import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/catalog";
import { HomeProductCard } from "@/components/home/home-product-card";

interface FeaturedCollectionProps {
  products: Product[];
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const items = featured.length >= 4 ? featured : products.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Küratörlü Seçim
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-black tracking-tight">
              Öne Çıkan Koleksiyon
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              En popüler neon ürünlerimizden özenle seçilmiş parçalar.
            </p>
          </div>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:gap-3 transition-all"
          >
            Tüm ürünleri keşfet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {items.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
