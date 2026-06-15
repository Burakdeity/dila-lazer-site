import { getOrderByOrderNo, updateOrderStatusByOrderNo } from "@/lib/order-store";
import { getPaytrConfig, verifyPaytrCallback } from "@/lib/paytr";

export async function POST(request: Request) {
  try {
    const config = getPaytrConfig();
    if (!config) {
      return new Response("PAYTR not configured", { status: 500 });
    }

    const formData = await request.formData();
    const merchantOid = String(formData.get("merchant_oid") || "");
    const status = String(formData.get("status") || "");
    const totalAmount = String(formData.get("total_amount") || "");
    const hash = String(formData.get("hash") || "");

    if (!merchantOid || !status || !hash) {
      return new Response("Missing fields", { status: 400 });
    }

    const valid = verifyPaytrCallback(config.merchantKey, config.merchantSalt, {
      merchant_oid: merchantOid,
      status,
      total_amount: totalAmount,
      hash,
    });

    if (!valid) {
      console.error("[PayTR callback] Invalid hash for order:", merchantOid);
      return new Response("PAYTR notification failed: bad hash", { status: 400 });
    }

    const order = await getOrderByOrderNo(merchantOid);
    if (!order) {
      console.error("[PayTR callback] Order not found:", merchantOid);
      return new Response("OK", { status: 200 });
    }

    if (status === "success") {
      if (order.status !== "confirmed" && order.status !== "production" && order.status !== "shipped" && order.status !== "delivered") {
        await updateOrderStatusByOrderNo(merchantOid, "confirmed");
      }
    } else if (order.status === "pending") {
      await updateOrderStatusByOrderNo(merchantOid, "cancelled");
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("[PayTR callback]", err);
    return new Response("Error", { status: 500 });
  }
}
