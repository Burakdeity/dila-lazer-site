import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, currency = "try" } = body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe yapılandırması eksik", demo: true, orderId, amount },
        { status: 200 }
      );
    }

    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Sipariş ${orderId}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/hesabim/siparisler?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sepet?cancelled=true`,
      metadata: { orderId },
    });

    return NextResponse.json({ success: true, sessionId: session.id, url: session.url });
  } catch {
    return NextResponse.json({ error: "Stripe ödeme başarısız" }, { status: 500 });
  }
}
