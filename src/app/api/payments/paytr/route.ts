import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, email } = body;

    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantId || !merchantKey || !merchantSalt) {
      return NextResponse.json(
        { error: "PayTR yapılandırması eksik", demo: true, orderId, amount },
        { status: 200 }
      );
    }

    // PayTR token oluşturma — production'da gerçek API çağrısı yapılır
    return NextResponse.json({
      success: true,
      token: "paytr_demo_token",
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${orderId}`,
      orderId,
      amount,
      email,
    });
  } catch {
    return NextResponse.json({ error: "Ödeme işlemi başarısız" }, { status: 500 });
  }
}
