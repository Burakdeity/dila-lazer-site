import type { Product } from "@/types/catalog";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCarousel } from "@/components/home/product-carousel";

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  muted?: boolean;
  limit?: number;
}

export function ProductRow({
  title,
  subtitle,
  products,
  viewAllHref,
  muted,
  limit = 8,
}: ProductRowProps) {
  const items = products.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section className={`py-10 sm:py-12 ${muted ? "bg-gray-50" : "bg-white"}`}>
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
        <ProductCarousel products={items} />
      </div>
    </section>
  );
}
