import { NextResponse } from "next/server";
import { getCustomerSession, customerUnauthorized } from "@/lib/customer-auth";
import { markUserCouponUsed } from "@/lib/user-coupon-store";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session?.user?.id) return customerUnauthorized();

  try {
    const body = await request.json();
    const code = String(body.code ?? "").trim();
    if (!code) {
      return NextResponse.json({ error: "Kupon kodu gerekli" }, { status: 400 });
    }

    const result = await markUserCouponUsed(session.user.id, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kupon kullanılamadı" }, { status: 500 });
  }
}
