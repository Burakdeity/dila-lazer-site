import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const siteDescription =
  "Neon LED tabela, MDF, pleksi, 3D kutu harf ve lazer kesim ürünler. Kendin Tasarla stüdyosu ile canlı önizleme, 81 ile teslimat, 2 yıl garanti.";

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
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const ogImage = image || getDefaultOgImage();
  const url = path ? absoluteUrl(path) : undefined;

  return {
    title,
    description,
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
