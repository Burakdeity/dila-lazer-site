import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
import { getAllBlogPostsFromStore } from "@/lib/blog-store";
import { getAllProducts, getMainCategories } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages = [
    { path: "", priority: 1 },
    { path: "/urunler", priority: 0.9 },
    { path: "/ozel-tasarim-merkezi", priority: 0.9 },
    { path: "/teklif-al", priority: 0.8 },
    { path: "/portfolyo", priority: 0.8 },
    { path: "/kampanyalar", priority: 0.7 },
    { path: "/sans-carki", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/hakkimizda", priority: 0.7 },
    { path: "/iletisim", priority: 0.7 },
    { path: "/siparis-takip", priority: 0.5 },
    { path: "/gizlilik", priority: 0.3 },
    { path: "/kvkk", priority: 0.3 },
    { path: "/cerez-politikasi", priority: 0.3 },
    { path: "/iade-politikasi", priority: 0.4 },
    { path: "/kargo-teslimat", priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority,
  }));

  const [blogPosts, mainCategories] = await Promise.all([
    getAllBlogPostsFromStore(),
    getMainCategories(),
  ]);

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages = mainCategories.flatMap((c) => [
    {
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...c.subcategories.map((s) => ({
      url: `${baseUrl}/kategori/${c.slug}/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  const products = await getAllProducts();
  const productPages = products.map((p) => ({
    url: `${baseUrl}/urun/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...blogPages, ...categoryPages, ...productPages];
}
