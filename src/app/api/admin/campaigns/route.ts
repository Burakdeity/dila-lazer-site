import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  createCampaignInStore,
  getAllCampaignsFromStore,
  type CampaignInput,
} from "@/lib/campaign-store";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();
  return NextResponse.json(await getAllCampaignsFromStore());
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const body = (await request.json()) as CampaignInput;
    if (!body.title?.trim() || !body.image?.trim()) {
      return NextResponse.json({ error: "Başlık ve görsel zorunludur" }, { status: 400 });
    }
    const campaign = await createCampaignInStore(body);
    return NextResponse.json(campaign, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kampanya kaydedilemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
