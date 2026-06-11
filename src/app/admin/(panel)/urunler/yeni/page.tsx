import { ProductForm } from "@/components/admin/product-form";
import { getMainCategories } from "@/lib/catalog";

export default function NewProductPage() {
  const categories = getMainCategories();
  return <ProductForm categories={categories} />;
}
