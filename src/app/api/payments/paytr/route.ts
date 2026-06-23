import { NextResponse } from "next/server";
import { getOrderByOrderNo } from "@/lib/order-store";
import {
  buildPaytrToken,
  buildUserBasket,
  getAppUrl,
  getClientIp,
  getPaytrConfig,
  normalizeBasketForPaytr,
  tlToKurus,
} from "@/lib/paytr";

export const runtime = "nodejs";

type BasketItem = { name: string; unitPrice: number; quantity: number };

type PaytrRequestBody = {
  orderNo: string;
  amount: number;
  email?: string;
  buyer?: {
    email?: string;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  items?: BasketItem[];
  shipping?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaytrRequestBody;
    const { orderNo, amount, buyer, items = [], shipping = 0 } = body;
    const email = (body.email || buyer?.email || "").trim().toLowerCase();

    if (!orderNo) {
      return NextResponse.json({ error: "Sipariş numarası gerekli" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Geçersiz tutar" }, { status: 400 });
    }

    const existingOrder = await getOrderByOrderNo(orderNo);
    if (!existingOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    const config = getPaytrConfig();
    if (!config) {
      return NextResponse.json(
        {
          error:
            "PayTR yapılandırması eksik. Vercel ortam değişkenlerine PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT ekleyin.",
        },
        { status: 503 }
      );
    }

    const merchantOid = orderNo;
    const userIp = getClientIp(request);
    const paymentAmount = tlToKurus(amount);

    const rawItems: BasketItem[] =
      items.length > 0
        ? items
        : existingOrder.items?.map((i) => ({
            name: i.name,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
          })) ?? [{ name: "Siparis", unitPrice: amount - shipping, quantity: 1 }];

    const basketItems = normalizeBasketForPaytr(rawItems, shipping, amount);

    const userBasket = buildUserBasket(
      basketItems.map((item) => ({
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
      }))
    );

    const testMode = process.env.PAYTR_TEST_MODE === "1" ? 1 : 0;
    const debugOn = process.env.PAYTR_DEBUG_ON === "1" ? 1 : 0;
    const appUrl = getAppUrl();

    const userName = (buyer?.name || existingOrder.customerName || "Müşteri").slice(0, 60);
    const userPhone = (buyer?.phone || existingOrder.customerPhone || "05000000000")
      .replace(/\D/g, "")
      .slice(0, 20);
    const userAddress =
      [buyer?.address || existingOrder.shippingAddress, buyer?.city || existingOrder.shippingCity]
        .filter(Boolean)
        .join(", ")
        .slice(0, 400) || "Türkiye";

    const paytrToken = buildPaytrToken({
      merchantId: config.merchantId,
      merchantKey: config.merchantKey,
      merchantSalt: config.merchantSalt,
      userIp,
      merchantOid,
      email,
      paymentAmount,
      userBasket,
      testMode,
    });

    const formData = new URLSearchParams({
      merchant_id: config.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: String(paymentAmount),
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: String(debugOn),
      no_installment: "0",
      max_installment: "0",
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone || "05000000000",
      merchant_ok_url: `${appUrl}/odeme/basarili?order=${merchantOid}`,
      merchant_fail_url: `${appUrl}/odeme/hata?order=${merchantOid}`,
      timeout_limit: "30",
      currency: "TL",
      test_mode: String(testMode),
      lang: "tr",
    });

    const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const result = (await paytrRes.json()) as { status: string; token?: string; reason?: string };

    if (result.status !== "success" || !result.token) {
      console.error("[PayTR] Token failed:", result.reason, { orderNo, userIp, paymentAmount });
      return NextResponse.json(
        { error: result.reason || "PayTR token alınamadı" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      orderId: merchantOid,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
    });
  } catch (err) {
    console.error("[PayTR]", err);
    return NextResponse.json({ error: "Ödeme işlemi başarısız" }, { status: 500 });
  }
}
