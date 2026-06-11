import { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getAllProducts, getMainCategories } from "@/lib/catalog";
import { ProductCatalog } from "@/components/catalog/product-catalog";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Neon LED, MDF, pleksi, 3D ve elektronik ürünlerimizi keşfedin. Filtreleyin, sıralayın ve güvenle sipariş verin.",
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = await getMainCategories();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductCatalog
        products={products}
        categories={categories}
        title="Tüm Ürünler"
        description="Neon tabela, dekorasyon ve elektronik ürünlerde geniş koleksiyon. İstediğiniz kategoriye göre filtreleyin veya arama yapın."
        breadcrumbs={[{ label: "Ürünler" }]}
      />
    </Suspense>
  );
}
