import { BlogForm } from "@/components/admin/blog-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export default function NewBlogPage() {
  return (
    <div>
      <AdminPageHeader title="Yeni Blog Yazısı" description="Blog içeriği oluşturun" />
      <BlogForm />
    </div>
  );
}
