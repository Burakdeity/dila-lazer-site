import type { Metadata } from "next";
import { DesignStudio } from "@/components/studio/design-studio";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kendin Tasarla — Ücretsiz Neon LED Tasarım Aracı",
  description:
    "Canlı duvar önizlemesi, 40+ font, gece/gündüz modu ile neonunuzu tasarlayın. Anında fiyat hesaplama ve online sipariş.",
  path: "/ozel-tasarim-merkezi",
});

export default function DesignCenterPage() {
  return <DesignStudio />;
}
