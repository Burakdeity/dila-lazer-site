import type { Campaign } from "@/types/catalog";

export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Neon Sezonu",
    subtitle: "Tüm neon ürünlerde %20 indirim",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    link: "/kategori/neon-led-tabelalar",
    discount: 20,
    endsAt: "2025-06-30",
  },
  {
    id: "2",
    title: "MDF Koleksiyonu",
    subtitle: "3 al 2 öde kampanyası",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    link: "/kategori/mdf-urunler",
  },
  {
    id: "3",
    title: "Elektronik Fırsatları",
    subtitle: "LED şerit ve aksesuarlarda ücretsiz kargo",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    link: "/kategori/elektronik-urunler",
  },
];
