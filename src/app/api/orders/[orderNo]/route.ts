import { NextResponse } from "next/server";
import { getOrderByOrderNo } from "@/lib/order-store";

type Params = { params: Promise<{ orderNo: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { orderNo } = await params;
  const order = await getOrderByOrderNo(decodeURIComponent(orderNo));

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    orderNo: order.orderNo,
    status: order.status,
    amount: order.amount,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    productName: order.productName,
    items: order.items,
    paymentMethod: order.paymentMethod,
    carrier: order.carrier,
    customerName: order.customerName,
    shippingCity: order.shippingCity,
    createdAt: order.createdAt,
  });
}
