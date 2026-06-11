import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/product-detail";
import { JsonLd, breadcrumbSchema, productSchema } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  return buildPageMetadata({
    title: product.name,
    description: product.shortDesc || product.description,
    path: `/urun/${slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(slug);

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            name: product.name,
            description: product.description,
            image: product.images[0],
            price: product.salePrice ?? product.basePrice,
            slug: product.slug,
            rating: product.rating,
            reviewCount: product.reviewCount,
          }),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Ürünler", path: "/urunler" },
            { name: product.name, path: `/urun/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}
