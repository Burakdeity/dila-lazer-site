import { randomUUID } from "crypto";
import type { Product, ProductBadge } from "@/types/catalog";
import { products as seedProducts } from "@/data/catalog/products";
import { slugify } from "@/lib/utils";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "products";

async function ensureProducts(): Promise<Product[]> {
  const products = await loadJsonStore<Product[]>(STORE_KEY, [...seedProducts]);
  if (!Array.isArray(products) || products.length === 0) {
    await saveJsonStore(STORE_KEY, seedProducts);
    return [...seedProducts];
  }
  return products.map((p) => ({
    ...p,
    sizes: p.sizes?.length ? p.sizes : ["60x30 cm"],
    materials: p.materials?.length ? p.materials : ["Neon Flex"],
    colors: p.colors?.length ? p.colors : ["Beyaz"],
    images: (p.images ?? []).filter(Boolean),
  }));
}

export async function getAllProductsFromStore(): Promise<Product[]> {
  return ensureProducts();
}

export async function getProductByIdFromStore(id: string): Promise<Product | null> {
  const products = await ensureProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function getProductBySlugFromStore(slug: string): Promise<Product | null> {
  const products = await ensureProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export type ProductInput = {
  name: string;
  slug?: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  categorySlug: string;
  subcategorySlug: string;
  images: string[];
  badges?: ProductBadge[];
  isFeatured?: boolean;
  isCustomDesign?: boolean;
  stock: number;
  deliveryDays: number;
  rating?: number;
  reviewCount?: number;
  sizes: string[];
  materials: string[];
  colors: string[];
  installation?: string;
};

function normalizeProductInput(input: ProductInput, existing?: Product): Product {
  const slug = slugify(input.slug?.trim() || input.name);
  return {
    id: existing?.id ?? randomUUID(),
    name: input.name.trim(),
    slug,
    shortDesc: input.shortDesc.trim(),
    description: input.description.trim(),
    basePrice: Number(input.basePrice),
    salePrice: input.salePrice ? Number(input.salePrice) : undefined,
    categorySlug: input.categorySlug,
    subcategorySlug: input.subcategorySlug,
    images: input.images.filter(Boolean),
    videos: existing?.videos ?? [],
    badges: input.badges ?? [],
    isFeatured: !!input.isFeatured,
    isCustomDesign: !!input.isCustomDesign,
    stock: Number(input.stock),
    deliveryDays: Number(input.deliveryDays),
    rating: input.rating ?? existing?.rating ?? 5,
    reviewCount: input.reviewCount ?? existing?.reviewCount ?? 0,
    sizes: input.sizes.length ? input.sizes : ["60x30 cm"],
    materials: input.materials.length ? input.materials : ["Neon Flex"],
    colors: input.colors.length ? input.colors : ["Beyaz"],
    installation: input.installation?.trim() || undefined,
    createdAt: existing?.createdAt ?? new Date().toISOString().split("T")[0],
  };
}

export async function createProductInStore(input: ProductInput): Promise<Product> {
  const products = await ensureProducts();
  const product = normalizeProductInput(input);

  if (products.some((p) => p.slug === product.slug)) {
    product.slug = `${product.slug}-${Date.now().toString(36)}`;
  }

  products.unshift(product);
  await saveJsonStore(STORE_KEY, products);
  return product;
}

export async function updateProductInStore(id: string, input: ProductInput): Promise<Product | null> {
  const products = await ensureProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated = normalizeProductInput(input, products[index]);
  if (products.some((p) => p.slug === updated.slug && p.id !== id)) {
    throw new Error("SLUG_EXISTS");
  }

  products[index] = updated;
  await saveJsonStore(STORE_KEY, products);
  return updated;
}

export async function deleteProductFromStore(id: string): Promise<boolean> {
  const products = await ensureProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await saveJsonStore(STORE_KEY, next);
  return true;
}
