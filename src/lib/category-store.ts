import { randomUUID } from "crypto";
import type { MainCategory, SubCategory } from "@/types/catalog";
import { mainCategories as seedCategories } from "@/data/catalog/categories";
import { slugify } from "@/lib/utils";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "categories";

async function ensureCategories(): Promise<MainCategory[]> {
  const categories = await loadJsonStore<MainCategory[]>(STORE_KEY, [...seedCategories]);
  if (!Array.isArray(categories) || categories.length === 0) {
    await saveJsonStore(STORE_KEY, seedCategories);
    return [...seedCategories];
  }
  return categories;
}

export async function getAllCategoriesFromStore(): Promise<MainCategory[]> {
  return ensureCategories();
}

export async function getCategoryBySlugFromStore(slug: string): Promise<MainCategory | null> {
  const categories = await ensureCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryByIdFromStore(id: string): Promise<MainCategory | null> {
  const categories = await ensureCategories();
  return categories.find((c) => c.id === id) ?? null;
}

export type CategoryInput = {
  name: string;
  slug?: string;
  description: string;
  image: string;
  icon: string;
  subcategories: SubCategory[];
};

function normalizeCategory(input: CategoryInput, existing?: MainCategory): MainCategory {
  const slug = slugify(input.slug?.trim() || input.name);
  return {
    id: existing?.id ?? randomUUID(),
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    image: input.image.trim(),
    icon: input.icon.trim() || "Box",
    subcategories: (input.subcategories ?? []).map((sub) => ({
      id: sub.id || randomUUID(),
      name: sub.name.trim(),
      slug: slugify(sub.slug?.trim() || sub.name),
    })),
  };
}

export async function createCategoryInStore(input: CategoryInput): Promise<MainCategory> {
  const categories = await ensureCategories();
  const category = normalizeCategory(input);
  if (categories.some((c) => c.slug === category.slug)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }
  categories.push(category);
  await saveJsonStore(STORE_KEY, categories);
  return category;
}

export async function updateCategoryInStore(id: string, input: CategoryInput): Promise<MainCategory> {
  const categories = await ensureCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Kategori bulunamadı");

  const updated = normalizeCategory(input, categories[index]);
  if (categories.some((c) => c.slug === updated.slug && c.id !== id)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }
  categories[index] = updated;
  await saveJsonStore(STORE_KEY, categories);
  return updated;
}

export async function deleteCategoryInStore(id: string): Promise<void> {
  const categories = await ensureCategories();
  const next = categories.filter((c) => c.id !== id);
  if (next.length === categories.length) throw new Error("Kategori bulunamadı");
  await saveJsonStore(STORE_KEY, next);
}
