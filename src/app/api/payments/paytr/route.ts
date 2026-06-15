import { NextResponse } from "next/server";
import { createOrder } from "@/lib/order-store";
import {
  buildPaytrToken,
  buildUserBasket,
  generateMerchantOid,
  getAppUrl,
  getClientIp,
  getPaytrConfig,
  tlToKurus,
} from "@/lib/paytr";

type BasketItem = { name: string; unitPrice: number; quantity: number };

type PaytrRequestBody = {
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
    const { amount, buyer, items = [], shipping = 0 } = body;
    const email = (body.email || buyer?.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Geçersiz tutar" }, { status: 400 });
    }

    const config = getPaytrConfig();
    if (!config) {
      return NextResponse.json(
        { error: "PayTR yapılandırması eksik", demo: true },
        { status: 200 }
      );
    }

    const merchantOid = generateMerchantOid();
    const userIp = getClientIp(request);
    const paymentAmount = tlToKurus(amount);

    const basketItems: BasketItem[] =
      items.length > 0
        ? items
        : [{ name: "Sipariş", unitPrice: amount - shipping, quantity: 1 }];

    if (shipping > 0) {
      basketItems.push({ name: "Kargo", unitPrice: shipping, quantity: 1 });
    }

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

    const userName = (buyer?.name || "Müşteri").slice(0, 60);
    const userPhone = (buyer?.phone || "05000000000").replace(/\D/g, "").slice(0, 20);
    const userAddress = [buyer?.address, buyer?.city].filter(Boolean).join(", ").slice(0, 400) || "Türkiye";

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
      return NextResponse.json(
        { error: result.reason || "PayTR token alınamadı" },
        { status: 502 }
      );
    }

    const productSummary =
      items.length === 1
        ? items[0].name
        : items.length > 1
          ? `${items[0].name} +${items.length - 1} ürün`
          : "Online sipariş";

    await createOrder(
      {
        customerName: userName,
        customerEmail: email,
        customerPhone: buyer?.phone,
        productName: productSummary,
        amount,
        status: "pending",
        shippingCity: buyer?.city,
      },
      { orderNo: merchantOid }
    );

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
