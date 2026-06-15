import { NextResponse } from "next/server";
import { getCustomerSession, customerUnauthorized } from "@/lib/customer-auth";
import { getUserWalletCoupons } from "@/lib/user-coupon-store";

export async function GET() {
  const session = await getCustomerSession();
  if (!session?.user?.id) return customerUnauthorized();

  const coupons = await getUserWalletCoupons(session.user.id);
  return NextResponse.json(coupons);
}
