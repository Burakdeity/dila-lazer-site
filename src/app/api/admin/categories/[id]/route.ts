import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  deleteCategoryInStore,
  getCategoryByIdFromStore,
  updateCategoryInStore,
  type CategoryInput,
} from "@/lib/category-store";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await params;
  const category = await getCategoryByIdFromStore(id);
  if (!category) return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { id } = await params;
    const body = (await request.json()) as CategoryInput;
    const category = await updateCategoryInStore(id, body);
    return NextResponse.json(category);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kategori güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { id } = await params;
    await deleteCategoryInStore(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kategori silinemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
