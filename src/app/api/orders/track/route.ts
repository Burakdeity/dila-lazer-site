import { NextResponse } from "next/server";
import { trackOrder } from "@/lib/order-store";

export async function POST(request: Request) {
  try {
    const { orderNo, email } = (await request.json()) as {
      orderNo?: string;
      email?: string;
    };

    if (!orderNo?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Sipariş numarası ve e-posta gereklidir" },
        { status: 400 }
      );
    }

    const order = await trackOrder(orderNo, email);
    if (!order) {
      return NextResponse.json(
        { error: "Sipariş bulunamadı. Numara ve e-postayı kontrol edin." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNo: order.orderNo,
      productName: order.productName,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,
      shippingCity: order.shippingCity,
      customerName: order.customerName,
    });
  } catch {
    return NextResponse.json({ error: "Sorgulama başarısız" }, { status: 500 });
  }
}
