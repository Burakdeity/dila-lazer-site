import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { StoreHero } from "@/components/home/store-hero";
import { JsonLd, homePageSchemas } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { PromoBanner } from "@/components/home/promo-banner";
import { DealsSection } from "@/components/home/deals-section";
import { ProductRow } from "@/components/home/product-row";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { StatsSection } from "@/components/home/stats-section";
import { Testimonials } from "@/components/home/testimonials";
import { CtaSection } from "@/components/home/cta-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { BlogPreview } from "@/components/home/blog-preview";
import { NeonTicker } from "@/components/effects/neon-ticker";
import { SpinWheelSection } from "@/components/home/spin-wheel-section";
import {
  getBestSellers,
  getNewArrivals,
  getFeaturedProducts,
  getAllProducts,
  getMainCategories,
} from "@/lib/catalog";
import { getAllBlogPostsFromStore } from "@/lib/blog-store";
import { getSettings } from "@/lib/settings-store";

export const metadata: Metadata = buildPageMetadata({
  title: "Neon Tabela, LED & Lazer Kesim",
  path: "/",
});

export default async function HomePage() {
  const [bestSellers, newArrivals, featured, allProducts, categories, blogPosts, settings] = await Promise.all([
    getBestSellers(8),
    getNewArrivals(8),
    getFeaturedProducts(8),
    getAllProducts(),
    getMainCategories(),
    getAllBlogPostsFromStore(),
    getSettings(),
  ]);

  const dealProducts = allProducts
    .filter((p) => p.salePrice || p.badges.includes("bestseller"))
    .slice(0, 8);

  return (
    <div className="bg-gray-50">
      <JsonLd data={homePageSchemas()} />
      <StoreHero slides={settings.heroSlides} />
      <SpinWheelSection />
      <NeonTicker />
      <TrustBar />
      <CategoryCarousel categories={categories} />
      <FeaturedCollection products={featured.length ? featured : bestSellers} />
      <ProcessSection />
      <DealsSection products={dealProducts.length > 0 ? dealProducts : bestSellers} />
      <ProductRow
        title="En Çok Satanlar"
        subtitle="Müşterilerimizin favori tercihleri"
        products={bestSellers}
        viewAllHref="/urunler?sort=bestseller"
      />
      <PromoBanner />
      <ProductRow
        title="Yeni Gelenler"
        subtitle="Kataloğa yeni eklenen ürünler"
        products={newArrivals}
        viewAllHref="/urunler?sort=new"
        muted
      />
      <StatsSection />
      <ProjectsSection />
      <Testimonials />
      <BlogPreview posts={blogPosts} />
      <CtaSection />
    </div>
  );
}
