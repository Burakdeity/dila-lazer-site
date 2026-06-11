"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/catalog";
import { HomeProductCard } from "@/components/home/home-product-card";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-item]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <div className="relative group/carousel">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute -left-3 top-[32%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-gray-50 transition-all hidden md:flex"
        aria-label="Önceki ürünler"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute -right-3 top-[32%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:bg-gray-50 transition-all hidden md:flex"
        aria-label="Sonraki ürünler"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 items-stretch"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-item
            className="snap-start shrink-0 w-[168px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
