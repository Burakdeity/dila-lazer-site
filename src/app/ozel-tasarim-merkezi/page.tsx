import type { Metadata } from "next";
import { DesignStudio } from "@/components/studio/design-studio";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kendin Tasarla — Ücretsiz Neon Tabela Tasarım Aracı",
  description:
    "Canlı duvar önizlemesi, 40+ font, gece/gündüz modu ile neon tabelanızı tasarlayın. Anında fiyat hesaplama ve online sipariş.",
  path: "/ozel-tasarim-merkezi",
});

export default function DesignCenterPage() {
  return <DesignStudio />;
}
