import { NextResponse } from "next/server";
import { getActivePaymentMethods } from "@/lib/payment-methods";

export const dynamic = "force-dynamic";

export async function GET() {
  const methods = await getActivePaymentMethods();
  return NextResponse.json(methods);
}
