import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, buyer } = body;

    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        { error: "İyzico yapılandırması eksik", demo: true, orderId, amount },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentPageUrl: `https://sandbox-cpp.iyzipay.com?token=demo_${orderId}`,
      orderId,
      amount,
      buyer,
    });
  } catch {
    return NextResponse.json({ error: "Ödeme işlemi başarısız" }, { status: 500 });
  }
}
