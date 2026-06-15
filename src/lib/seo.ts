import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const siteDescription =
  "Sakarya Adapazarı merkezli neon LED tabela, pleksi, 3D kutu harf ve lazer kesim atölyesi. Kendin Tasarla stüdyosu, ücretsiz teklif, 81 ile teslimat ve 2 yıl garanti.";

export const siteKeywords = [
  "sakarya neon tabela",
  "sakarya led tabela",
  "adapazarı tabela",
  "sakarya lazer kesim",
  "sakarya reklam tabela",
  "sakarya 3d kutu harf",
  "sakarya pleksi tabela",
  "neon tabela",
  "led tabela",
  "özel neon yazı",
  "kendin tasarla neon",
  "mdf dekor",
  "3d kutu harf",
  "lazer kesim tabela",
  "cafe tabela",
  "dükkan tabelası",
] as const;

export const sakaryaGeo = {
  latitude: 40.7831,
  longitude: 30.4032,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.contact.mapsQuery)}`,
} as const;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl().replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getDefaultOgImage(): string {
  return absoluteUrl("/logo.png");
}

export function buildPageMetadata({
  title,
  description = siteDescription,
  keywords = [...siteKeywords],
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const ogImage = image || getDefaultOgImage();
  const url = path ? absoluteUrl(path) : undefined;

  return {
    title,
    description,
    keywords,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: brand.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
