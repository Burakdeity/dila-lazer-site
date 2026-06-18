"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import type { MainCategory } from "@/types/catalog";

function buildCarouselItems(categories: MainCategory[]) {
  return categories.flatMap((cat) =>
    cat.subcategories.slice(0, 2).map((sub) => ({
      name: sub.name,
      href: `/kategori/${cat.slug}/${sub.slug}`,
      image: cat.image,
    }))
  ).slice(0, 12);
}

export function CategoryCarousel({ categories }: { categories: MainCategory[] }) {
  const carouselItems = buildCarouselItems(categories);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-black">Kategoriler</h2>
          <Link href="/urunler" className="text-sm font-medium text-brand-red hover:text-brand-red/80">
            Tümünü Gör →
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide px-8 py-1"
          >
            {carouselItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2.5 shrink-0 w-[88px] group"
              >
                <div className="relative w-[72px] h-[72px] rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 shadow-sm group-hover:border-brand-red group-hover:shadow-[0_0_16px_rgba(213,0,0,0.25)] transition-all">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] text-center text-gray-600 font-medium leading-tight group-hover:text-brand-red transition-colors line-clamp-2">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
