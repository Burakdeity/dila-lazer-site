import { NextResponse } from "next/server";
import { getCustomerSession, customerUnauthorized } from "@/lib/customer-auth";
import { validateUserCoupon } from "@/lib/user-coupon-store";

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session?.user?.id) return customerUnauthorized();

  try {
    const body = await request.json();
    const code = String(body.code ?? "");
    const subtotal = Number(body.subtotal ?? 0);

    if (!code.trim()) {
      return NextResponse.json({ error: "Kupon kodu girin" }, { status: 400 });
    }

    const result = await validateUserCoupon(session.user.id, code, subtotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ coupon: result.coupon });
  } catch {
    return NextResponse.json({ error: "Kupon doğrulanamadı" }, { status: 500 });
  }
}
