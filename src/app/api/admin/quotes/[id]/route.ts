import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { updateQuoteStatus } from "@/lib/quote-store";
import type { QuoteStatus } from "@/types/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await context.params;
  const { status } = (await request.json()) as { status: QuoteStatus };

  const quote = await updateQuoteStatus(id, status);
  if (!quote) return NextResponse.json({ error: "Teklif bulunamadı" }, { status: 404 });
  return NextResponse.json(quote);
}
