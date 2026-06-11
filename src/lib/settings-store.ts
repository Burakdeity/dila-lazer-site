import type { SiteSettings } from "@/types/admin";
import { campaigns } from "@/data/catalog/campaigns";
import { loadJsonStore, saveJsonStore } from "@/lib/app-data";

const STORE_KEY = "settings";

const defaultSettings: SiteSettings = {
  seo: {
    title: "Dila Lazer | Neon, Tabela & Lazer Kesim",
    description:
      "Neon LED tabela, MDF, pleksi, 3D dekorasyon ve elektronik ürünler. Premium kalite, özel tasarım, 81 ile teslimat.",
    keywords: "neon tabela, led tabela, mdf dekor, pleksi, lazer kesim, özel tasarım",
  },
  shipping: {
    freeShippingMin: 1500,
    defaultDeliveryDays: 5,
    carriers: ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo"],
  },
  contact: {
    phone: "+90 552 543 52 54",
    email: "dilalazer54@gmail.com",
    address: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı/Sakarya",
    mapsQuery: "Papuççular, Bostancı Sk. No:60, 54100 Adapazarı, Sakarya",
    whatsapp: "905525435254",
  },
  banners: campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    image: c.image,
    link: c.link,
    isActive: true,
  })),
};

async function ensureSettings(): Promise<SiteSettings> {
  const parsed = await loadJsonStore<Partial<SiteSettings>>(STORE_KEY, defaultSettings);
  return {
    seo: { ...defaultSettings.seo, ...parsed.seo },
    shipping: { ...defaultSettings.shipping, ...parsed.shipping },
    contact: { ...defaultSettings.contact, ...parsed.contact },
    banners: parsed.banners ?? defaultSettings.banners,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  return ensureSettings();
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await ensureSettings();
  const updated: SiteSettings = {
    seo: { ...current.seo, ...partial.seo },
    shipping: { ...current.shipping, ...partial.shipping },
    contact: { ...current.contact, ...partial.contact },
    banners: partial.banners ?? current.banners,
  };
  await saveJsonStore(STORE_KEY, updated);
  return updated;
}
