import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";

export const metadata: Metadata = {
  title: "Portfolyo",
  description: "Tamamlanan premium neon ve 3D tabela projelerimizi inceleyin. Öncesi/sonrası karşılaştırmaları.",
};

export default function PortfolioPage() {
  return <PortfolioGallery />;
}
