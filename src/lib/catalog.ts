import {
  getAllCategoriesFromStore,
  getCategoryBySlugFromStore,
} from "@/lib/category-store";
import {
  getAllProductsFromStore,
  getProductBySlugFromStore,
} from "@/lib/product-store";
import type { Product, MainCategory } from "@/types/catalog";

export async function getMainCategories(): Promise<MainCategory[]> {
  return getAllCategoriesFromStore();
}

export async function getCategoryBySlug(slug: string): Promise<MainCategory | undefined> {
  const cat = await getCategoryBySlugFromStore(slug);
  return cat ?? undefined;
}

export async function getSubcategory(parentSlug: string, subSlug: string) {
  const cat = await getCategoryBySlug(parentSlug);
  return cat?.subcategories.find((s) => s.slug === subSlug);
}

export async function getAllSubcategories() {
  const categories = await getAllCategoriesFromStore();
  return categories.flatMap((c) =>
    c.subcategories.map((s) => ({ ...s, parentSlug: c.slug, parentName: c.name }))
  );
}

export async function getAllProducts(): Promise<Product[]> {
  return getAllProductsFromStore();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await getProductBySlugFromStore(slug);
  return product ?? undefined;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return products.filter((p) => p.subcategorySlug === subcategorySlug);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return products.filter((p) => p.badges.includes("bestseller")).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter((p) => p.badges.includes("new"))
    .slice(0, limit);
}

export async function getCustomDesignProducts(limit = 6): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return products.filter((p) => p.isCustomDesign).slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const products = await getAllProductsFromStore();
  const product = products.find((p) => p.slug === slug);
  if (!product) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  const products = await getAllProductsFromStore();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
