import { ProductForm } from "@/components/admin/product-form";
import { getMainCategories } from "@/lib/catalog";

export default async function NewProductPage() {
  const categories = await getMainCategories();
  return <ProductForm categories={categories} />;
}
