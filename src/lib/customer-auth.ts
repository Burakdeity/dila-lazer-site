import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function getCustomerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session;
}

export function customerUnauthorized() {
  return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
}
