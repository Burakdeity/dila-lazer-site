import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogPostsFromStore } from "@/lib/blog-store";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Neon, dekorasyon ve elektronik ürünler hakkında rehberler.",
};

export default async function BlogPage() {
  const blogPosts = await getAllBlogPostsFromStore();

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">Blog</h1>
          <p className="text-gray-500">Rehberler, trendler ve teknik içerikler</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                <Image src={post.cover} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-red text-white text-xs">{post.category}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{post.date} · {post.author}</p>
              <h2 className="text-lg font-semibold text-brand-black group-hover:text-brand-red transition-colors">{post.title}</h2>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
