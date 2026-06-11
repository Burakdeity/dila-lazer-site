import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  createBlogPostInStore,
  getAllBlogPostsFromStore,
  type BlogPostInput,
} from "@/lib/blog-store";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();
  return NextResponse.json(await getAllBlogPostsFromStore());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as BlogPostInput;
    if (!body.title?.trim() || !body.cover?.trim()) {
      return NextResponse.json({ error: "Başlık ve kapak görseli zorunludur" }, { status: 400 });
    }
    const post = await createBlogPostInStore(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yazı kaydedilemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
