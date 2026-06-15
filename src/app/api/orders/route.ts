import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calcGrandTotal, calcShipping, summarizeProductName } from "@/lib/checkout";
import { createOrder } from "@/lib/order-store";
import type { OrderLineItem } from "@/types/admin";

export type CreateOrderBody = {
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    district?: string;
    address: string;
  };
  items: OrderLineItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  shippingCost?: number;
  paymentMethod: string;
  carrier?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderBody;
    const { customer, items, subtotal, paymentMethod } = body;

    if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      return NextResponse.json({ error: "Müşteri bilgileri eksik" }, { status: 400 });
    }

    if (!customer.city?.trim() || !customer.address?.trim()) {
      return NextResponse.json({ error: "Teslimat adresi eksik" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Ödeme yöntemi seçilmedi" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const discount = body.discount ?? 0;
    const shippingCost = body.shippingCost ?? calcShipping(subtotal);
    const amount = calcGrandTotal(subtotal, discount, shippingCost);

    const order = await createOrder({
      customerName: customer.name.trim(),
      customerEmail: customer.email.trim().toLowerCase(),
      customerPhone: customer.phone.trim(),
      shippingCity: customer.city.trim(),
      shippingDistrict: customer.district?.trim(),
      shippingAddress: customer.address.trim(),
      productName: summarizeProductName(items),
      amount,
      subtotal,
      shippingCost,
      discount,
      couponCode: body.couponCode,
      items,
      paymentMethod,
      carrier: body.carrier,
      notes: body.notes?.trim(),
      userId: session?.user?.id,
      status: paymentMethod === "kapida" || paymentMethod === "havale" ? "pending" : "pending",
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}
