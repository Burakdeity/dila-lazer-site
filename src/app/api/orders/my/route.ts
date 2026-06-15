import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrdersByEmail } from "@/lib/order-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const orders = await getOrdersByEmail(session.user.email);
  return NextResponse.json(orders);
}
