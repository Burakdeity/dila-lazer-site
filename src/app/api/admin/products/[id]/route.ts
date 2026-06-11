import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  deleteProductFromStore,
  getProductByIdFromStore,
  updateProductInStore,
  type ProductInput,
} from "@/lib/product-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const product = await getProductByIdFromStore(id);
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;

  try {
    const body = (await request.json()) as ProductInput;
    const product = await updateProductInStore(id, body);
    if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    return NextResponse.json(product);
  } catch (e) {
    if (e instanceof Error && e.message === "SLUG_EXISTS") {
      return NextResponse.json({ error: "Bu URL slug zaten kullanılıyor" }, { status: 409 });
    }
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const ok = await deleteProductFromStore(id);
  if (!ok) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json({ success: true });
}
