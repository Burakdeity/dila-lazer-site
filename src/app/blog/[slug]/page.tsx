import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getBlogPostBySlug } from "@/data/catalog/blog";
import { Container } from "@/components/ui/container";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pt-8 pb-16 bg-gray-50 min-h-screen">
      <Container size="narrow">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Blog&apos;a dön
        </Link>

        <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-[16/9]">
            <Image src={post.cover} alt={post.title} fill className="object-cover" sizes="800px" priority />
          </div>
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-brand-red/10 text-brand-red font-medium">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.author}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">{post.title}</h1>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {post.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
