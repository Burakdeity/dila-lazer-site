import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getCategoryByIdFromStore } from "@/lib/category-store";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryByIdFromStore(id);
  if (!category) notFound();

  return (
    <div>
      <AdminPageHeader title={category.name} description="Kategoriyi düzenleyin" />
      <CategoryForm category={category} />
    </div>
  );
}
