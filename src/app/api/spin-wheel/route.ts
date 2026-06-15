import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { getSpinWheelStatus } from "@/lib/spin-wheel-store";

export async function GET() {
  try {
    const session = await getCustomerSession();
    const status = await getSpinWheelStatus(session?.user?.id);
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ error: "Çark bilgisi alınamadı" }, { status: 500 });
  }
}
