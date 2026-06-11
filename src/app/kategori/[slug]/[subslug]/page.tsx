import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getCategoryBySlug, getProductsBySubcategory, getMainCategories } from "@/lib/catalog";
import { ProductCatalog } from "@/components/catalog/product-catalog";

interface Props {
  params: Promise<{ slug: string; subslug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subslug } = await params;
  const cat = getCategoryBySlug(slug);
  const sub = cat?.subcategories.find((s) => s.slug === subslug);
  return { title: sub?.name || "Alt Kategori" };
}

export default async function SubcategoryPage({ params }: Props) {
  const { slug, subslug } = await params;
  const category = getCategoryBySlug(slug);
  const subcategory = category?.subcategories.find((s) => s.slug === subslug);
  if (!category || !subcategory) notFound();

  const products = await getProductsBySubcategory(subslug);
  const categories = getMainCategories();

  const subcategoryLinks = category.subcategories.map((sub) => ({
    name: sub.name,
    slug: sub.slug,
    href: `/kategori/${slug}/${sub.slug}`,
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ProductCatalog
        products={products}
        categories={categories}
        title={subcategory.name}
        description={`${category.name} — ${subcategory.name} ürünleri`}
        breadcrumbs={[
          { label: "Ürünler", href: "/urunler" },
          { label: category.name, href: `/kategori/${slug}` },
          { label: subcategory.name },
        ]}
        activeCategorySlug={slug}
        activeSubcategorySlug={subslug}
        subcategoryLinks={subcategoryLinks}
      />
    </Suspense>
  );
}
