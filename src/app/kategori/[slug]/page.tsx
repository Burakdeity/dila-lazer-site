import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { getCategoryBySlug, getProductsByCategory, getMainCategories } from "@/lib/catalog";
import { ProductCatalog } from "@/components/catalog/product-catalog";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Kategori Bulunamadı" };
  return buildPageMetadata({
    title: cat.name,
    description: cat.description,
    path: `/kategori/${slug}`,
    image: cat.image,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(slug);
  const categories = await getMainCategories();

  const subcategoryLinks = category.subcategories.map((sub) => ({
    name: sub.name,
    slug: sub.slug,
    href: `/kategori/${slug}/${sub.slug}`,
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: category.name, path: `/kategori/${slug}` },
        ])}
      />
      <ProductCatalog
        products={products}
        categories={categories}
        title={category.name}
        description={category.description}
        breadcrumbs={[
          { label: "Ürünler", href: "/urunler" },
          { label: category.name },
        ]}
        activeCategorySlug={slug}
        subcategoryLinks={subcategoryLinks}
      />
    </Suspense>
  );
}
