import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getMainCategories } from "@/lib/catalog";
import { getProductByIdFromStore } from "@/lib/product-store";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductByIdFromStore(id);
  if (!product) notFound();

  const categories = getMainCategories();
  return <ProductForm categories={categories} product={product} />;
}
