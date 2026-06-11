import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import { getSettings, updateSettings } from "@/lib/settings-store";
import type { SiteSettings } from "@/types/admin";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();
  return NextResponse.json(await getSettings());
}

export async function PUT(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const settings = await updateSettings(body);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}
