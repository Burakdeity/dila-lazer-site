import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { blogPosts } from "@/data/catalog/blog";
import { AdminPageHeader, AdminCard, AdminBadge } from "@/components/admin/admin-ui";

export default function AdminBlogPage() {
  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description={`${blogPosts.length} yazı`}
        action={
          <Link href="/blog" target="_blank" className="text-sm text-brand-red hover:underline">
            Blogu görüntüle →
          </Link>
        }
      />

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <AdminCard key={post.slug} className="p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-32 sm:h-auto sm:w-40 flex-shrink-0 bg-black/40">
                <Image src={post.cover} alt="" fill className="object-cover" sizes="160px" />
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <AdminBadge variant="info">{post.category}</AdminBadge>
                    <h3 className="text-white font-semibold mt-2">{post.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{post.excerpt}</p>
                    <p className="text-xs text-gray-500 mt-2">{post.author} · {post.date}</p>
                  </div>
                  <Link href={`/blog`} target="_blank" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
