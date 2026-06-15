import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  getSpinWheelConfig,
  getSpinStats,
  getSpinWinners,
  updateSpinWheelConfig,
} from "@/lib/spin-wheel-store";
import type { SpinWheelConfig } from "@/types/spin-wheel";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const [config, stats, winners] = await Promise.all([
    getSpinWheelConfig(),
    getSpinStats(),
    getSpinWinners(100),
  ]);

  return NextResponse.json({ config, stats, winners });
}

export async function PUT(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as Partial<SpinWheelConfig>;
    const config = await updateSpinWheelConfig(body);
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}
