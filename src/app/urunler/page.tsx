import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getAllProducts, getMainCategories } from "@/lib/catalog";
import { ProductCatalog } from "@/components/catalog/product-catalog";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sakarya Neon Ürünleri",
  description: "Sakarya ve Türkiye geneline neon LED, MDF, pleksi, 3D ürünler. Filtreleyin, sıralayın ve güvenle sipariş verin.",
  path: "/urunler",
});

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getMainCategories();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductCatalog
        products={products}
        categories={categories}
        title="Tüm Ürünler"
        description="Neon, dekorasyon ve elektronik ürünlerde geniş koleksiyon. İstediğiniz kategoriye göre filtreleyin veya arama yapın."
        breadcrumbs={[{ label: "Ürünler" }]}
      />
    </Suspense>
  );
}
