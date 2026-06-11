import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { createProductInStore, getAllProductsFromStore, type ProductInput } from "@/lib/product-store";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const products = await getAllProductsFromStore();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as ProductInput;

    if (!body.name?.trim() || !body.categorySlug || !body.subcategorySlug) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    if (!body.images?.length) {
      return NextResponse.json({ error: "En az bir ürün görseli gerekli" }, { status: 400 });
    }

    const product = await createProductInStore(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ürün kaydedilemedi" }, { status: 500 });
  }
}
