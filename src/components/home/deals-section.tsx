import Link from "next/link";
import { Percent, ArrowRight } from "lucide-react";
import type { Product } from "@/types/catalog";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCarousel } from "@/components/home/product-carousel";

interface DealsSectionProps {
  title?: string;
  products: Product[];
  viewAllHref?: string;
}

export function DealsSection({
  title = "Fırsat Ürünleri",
  products,
  viewAllHref = "/kampanyalar",
}: DealsSectionProps) {
  const items = products.slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-10 sm:py-12 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8 items-start">
          <Link
            href="/kampanyalar"
            className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0 p-5 lg:p-6 rounded-2xl bg-gradient-to-br from-brand-red to-red-800 text-white hover:shadow-xl hover:shadow-brand-red/20 transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center lg:mb-4 shrink-0">
              <Percent className="h-5 w-5" />
            </div>
            <div className="flex-1 lg:flex-none">
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-75">Kampanya</p>
              <p className="text-lg lg:text-xl font-bold mt-0.5">Fırsat Ürünleri</p>
              <p className="text-xs text-white/70 mt-1 hidden lg:block">İndirimli seçili ürünler</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-full lg:mt-5">
              Keşfet <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          <div className="min-w-0">
            <SectionHeader title={title} subtitle="Sınırlı süreli indirimler" viewAllHref={viewAllHref} />
            <ProductCarousel products={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
