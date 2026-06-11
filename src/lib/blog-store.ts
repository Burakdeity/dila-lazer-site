import type { BlogPost } from "@/data/catalog/blog";
import { blogPosts as seedPosts } from "@/data/catalog/blog";
import { slugify } from "@/lib/utils";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "blog";

async function ensureBlogPosts(): Promise<BlogPost[]> {
  const posts = await loadJsonStore<BlogPost[]>(STORE_KEY, [...seedPosts]);
  if (!Array.isArray(posts) || posts.length === 0) {
    await saveJsonStore(STORE_KEY, seedPosts);
    return [...seedPosts];
  }
  return posts;
}

export async function getAllBlogPostsFromStore(): Promise<BlogPost[]> {
  return ensureBlogPosts();
}

export async function getBlogPostBySlugFromStore(slug: string): Promise<BlogPost | null> {
  const posts = await ensureBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export type BlogPostInput = {
  title: string;
  slug?: string;
  excerpt: string;
  cover: string;
  category: string;
  date: string;
  author: string;
  content: string[];
};

function normalizePost(input: BlogPostInput, existing?: BlogPost): BlogPost {
  const slug = slugify(input.slug?.trim() || input.title);
  return {
    slug: existing?.slug ?? slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    cover: input.cover.trim(),
    category: input.category.trim(),
    date: input.date.trim(),
    author: input.author.trim(),
    content: input.content.filter((p) => p.trim()),
  };
}

export async function createBlogPostInStore(input: BlogPostInput): Promise<BlogPost> {
  const posts = await ensureBlogPosts();
  const post = normalizePost(input);
  if (posts.some((p) => p.slug === post.slug)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }
  posts.unshift(post);
  await saveJsonStore(STORE_KEY, posts);
  return post;
}

export async function updateBlogPostInStore(slug: string, input: BlogPostInput): Promise<BlogPost> {
  const posts = await ensureBlogPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) throw new Error("Yazı bulunamadı");

  const nextSlug = slugify(input.slug?.trim() || input.title);
  if (posts.some((p) => p.slug === nextSlug && p.slug !== slug)) {
    throw new Error("Bu slug zaten kullanılıyor");
  }

  const updated = { ...normalizePost(input, posts[index]), slug: nextSlug };
  posts[index] = updated;
  await saveJsonStore(STORE_KEY, posts);
  return updated;
}

export async function deleteBlogPostInStore(slug: string): Promise<void> {
  const posts = await ensureBlogPosts();
  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) throw new Error("Yazı bulunamadı");
  await saveJsonStore(STORE_KEY, next);
}
