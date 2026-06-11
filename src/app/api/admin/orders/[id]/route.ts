import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { updateOrderStatus } from "@/lib/order-store";
import type { OrderStatus } from "@/types/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const { status } = (await request.json()) as { status: OrderStatus };

  const order = await updateOrderStatus(id, status);
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  return NextResponse.json(order);
}
