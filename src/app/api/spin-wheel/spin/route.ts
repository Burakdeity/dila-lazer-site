import { NextResponse } from "next/server";
import { getCustomerSession, customerUnauthorized } from "@/lib/customer-auth";
import { executeSpin } from "@/lib/spin-wheel-store";

export async function POST() {
  const session = await getCustomerSession();
  if (!session?.user?.id) return customerUnauthorized();

  try {
    const result = await executeSpin(session.user.id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Çark çevrilemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
