import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { deleteCoupon, updateCoupon } from "@/lib/coupon-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const body = await request.json();
  const coupon = await updateCoupon(id, body);
  if (!coupon) return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  return NextResponse.json(coupon);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const ok = await deleteCoupon(id);
  if (!ok) return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 });
  return NextResponse.json({ success: true });
}
