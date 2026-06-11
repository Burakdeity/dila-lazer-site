import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { createCoupon, getAllCoupons } from "@/lib/coupon-store";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();
  return NextResponse.json(await getAllCoupons());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = await request.json();
    const coupon = await createCoupon(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "CODE_EXISTS") {
      return NextResponse.json({ error: "Bu kupon kodu zaten var" }, { status: 409 });
    }
    return NextResponse.json({ error: "Kupon oluşturulamadı" }, { status: 500 });
  }
}
