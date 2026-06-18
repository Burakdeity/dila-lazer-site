import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { ProductImage } from "@/components/shared/product-image";
import { getAllBlogPostsFromStore } from "@/lib/blog-store";
import { AdminPageHeader, AdminCard, AdminBadge } from "@/components/admin/admin-ui";

export default async function AdminBlogPage() {
  const blogPosts = await getAllBlogPostsFromStore();

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description={`${blogPosts.length} yazı`}
        action={
          <div className="flex items-center gap-3">
            <Link href="/blog" target="_blank" className="text-sm text-gray-400 hover:text-white">
              Blogu görüntüle →
            </Link>
            <Link href="/admin/blog/yeni" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-medium rounded-xl hover:bg-brand-red/90">
              <Plus className="h-4 w-4" /> Yeni Yazı
            </Link>
          </div>
        }
      />

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <AdminCard key={post.slug} className="p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-32 sm:h-auto sm:w-40 flex-shrink-0 bg-black/40">
                <ProductImage src={post.cover} alt={post.title} fill className="object-cover" sizes="160px" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <AdminBadge variant="info">{post.category}</AdminBadge>
                    <h3 className="text-white font-semibold mt-2">{post.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{post.excerpt}</p>
                    <p className="text-xs text-gray-500 mt-2">{post.author} · {post.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/blog/${post.slug}`} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" title="Düzenle">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
