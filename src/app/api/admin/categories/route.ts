import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  createCategoryInStore,
  getAllCategoriesFromStore,
  type CategoryInput,
} from "@/lib/category-store";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();
  return NextResponse.json(await getAllCategoriesFromStore());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as CategoryInput;
    if (!body.name?.trim() || !body.image?.trim()) {
      return NextResponse.json({ error: "Ad ve görsel zorunludur" }, { status: 400 });
    }
    const category = await createCategoryInStore(body);
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kategori kaydedilemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
