import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { getBlogPostBySlugFromStore } from "@/lib/blog-store";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromStore(slug);
  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title={post.title} description="Blog yazısını düzenleyin" />
      <BlogForm post={post} />
    </div>
  );
}
