import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  deleteBlogPostInStore,
  getBlogPostBySlugFromStore,
  updateBlogPostInStore,
  type BlogPostInput,
} from "@/lib/blog-store";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { slug } = await params;
  const post = await getBlogPostBySlugFromStore(slug);
  if (!post) return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { slug } = await params;
    const body = (await request.json()) as BlogPostInput;
    const post = await updateBlogPostInStore(slug, body);
    return NextResponse.json(post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yazı güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { slug } = await params;
    await deleteBlogPostInStore(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yazı silinemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
