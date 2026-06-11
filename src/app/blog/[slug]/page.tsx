import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllBlogPostsFromStore, getBlogPostBySlugFromStore } from "@/lib/blog-store";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromStore(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromStore(slug);
  if (!post) notFound();

  return (
    <div className="pt-8 pb-16 bg-gray-50 min-h-screen">
      <Container size="narrow">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red mb-8">
          <ArrowLeft className="h-4 w-4" /> Bloga dön
        </Link>

        <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-[16/9]">
            <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="800px" priority />
          </div>
          <div className="p-6 sm:p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black">{post.title}</h1>
            <p className="text-sm text-gray-400 mt-3">{post.date} · {post.author}</p>
            <div className="mt-8 space-y-4 text-gray-600 leading-relaxed">
              {post.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
