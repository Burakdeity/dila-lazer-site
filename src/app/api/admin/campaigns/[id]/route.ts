import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  deleteCampaignInStore,
  getCampaignByIdFromStore,
  updateCampaignInStore,
  type CampaignInput,
} from "@/lib/campaign-store";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const { id } = await params;
  const campaign = await getCampaignByIdFromStore(id);
  if (!campaign) return NextResponse.json({ error: "Kampanya bulunamadı" }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PUT(request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { id } = await params;
    const body = (await request.json()) as CampaignInput;
    const campaign = await updateCampaignInStore(id, body);
    return NextResponse.json(campaign);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kampanya güncellenemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const { id } = await params;
    await deleteCampaignInStore(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kampanya silinemedi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
