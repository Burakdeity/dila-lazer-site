import { randomUUID } from "crypto";
import type { Campaign } from "@/types/catalog";
import { campaigns as seedCampaigns } from "@/data/catalog/campaigns";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "campaigns";

async function ensureCampaigns(): Promise<Campaign[]> {
  const campaigns = await loadJsonStore<Campaign[]>(STORE_KEY, [...seedCampaigns]);
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
    await saveJsonStore(STORE_KEY, seedCampaigns);
    return [...seedCampaigns];
  }
  return campaigns;
}

export async function getAllCampaignsFromStore(): Promise<Campaign[]> {
  return ensureCampaigns();
}

export async function getCampaignByIdFromStore(id: string): Promise<Campaign | null> {
  const campaigns = await ensureCampaigns();
  return campaigns.find((c) => c.id === id) ?? null;
}

export type CampaignInput = {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  discount?: number | null;
  endsAt?: string | null;
};

function normalizeCampaign(input: CampaignInput, existing?: Campaign): Campaign {
  return {
    id: existing?.id ?? randomUUID(),
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    image: input.image.trim(),
    link: input.link.trim(),
    discount: input.discount ? Number(input.discount) : undefined,
    endsAt: input.endsAt?.trim() || undefined,
  };
}

export async function createCampaignInStore(input: CampaignInput): Promise<Campaign> {
  const campaigns = await ensureCampaigns();
  const campaign = normalizeCampaign(input);
  campaigns.push(campaign);
  await saveJsonStore(STORE_KEY, campaigns);
  return campaign;
}

export async function updateCampaignInStore(id: string, input: CampaignInput): Promise<Campaign> {
  const campaigns = await ensureCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Kampanya bulunamadı");
  campaigns[index] = normalizeCampaign(input, campaigns[index]);
  await saveJsonStore(STORE_KEY, campaigns);
  return campaigns[index];
}

export async function deleteCampaignInStore(id: string): Promise<void> {
  const campaigns = await ensureCampaigns();
  const next = campaigns.filter((c) => c.id !== id);
  if (next.length === campaigns.length) throw new Error("Kampanya bulunamadı");
  await saveJsonStore(STORE_KEY, next);
}
