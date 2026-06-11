import { CategoryForm } from "@/components/admin/category-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default function NewCategoryPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Kategori" description="Kategori ve alt kategorileri ekleyin" />
      <CategoryForm />
    </div>
  );
}
