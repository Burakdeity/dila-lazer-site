export const products = [
  {
    id: "1",
    name: "Premium 3D Neon Logo",
    slug: "premium-3d-neon-logo-tabela",
    shortDesc: "Markanızı öne çıkaran 3D neon logo neon",
    description:
      "CNC kesim, LED montaj ve premium pleksi malzeme ile üretilen 3D neon logo neonnız. İç ve dış mekan kullanımına uygun, 2 yıl garanti.",
    basePrice: 4500,
    categorySlug: "3d-neon-tabelalar",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90",
    ],
    videos: [],
    isFeatured: true,
    stock: 50,
    deliveryDays: 7,
    rating: 4.9,
    reviewCount: 127,
    sizes: ["40x20 cm", "60x30 cm", "80x40 cm", "100x50 cm", "Özel Ölçü"],
    materials: ["pleksi", "neon", "3d"],
    colors: ["beyaz", "kirmizi", "mavi", "rgb", "altin"],
    installation: "Duvar montajı dahil. Montaj kılavuzu ve tüm aksesuarlar paket içindedir.",
  },
  {
    id: "2",
    name: "LED Kutu Harf",
    slug: "led-kutu-harf-tabela",
    shortDesc: "Kurumsal LED kutu harf neon sistemi",
    description:
      "Alüminyum gövde, opal akrilik yüzey ve enerji tasarruflu LED modüller ile üretilen profesyonel kutu harf neon.",
    basePrice: 3200,
    categorySlug: "kutu-harf-tabelalar",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=90",
    ],
    videos: [],
    isFeatured: true,
    stock: 80,
    deliveryDays: 10,
    rating: 4.8,
    reviewCount: 89,
    sizes: ["Harf başına", "Kelime seti", "Özel ölçü"],
    materials: ["kutu-harf", "led"],
    colors: ["beyaz", "kirmizi", "mavi", "yesil"],
    installation: "Profesyonel montaj hizmeti opsiyonel olarak sunulmaktadır.",
  },
  {
    id: "3",
    name: "Cafe Neon Yazı",
    slug: "cafe-neon-yazi-tabela",
    shortDesc: "Sıcak atmosfer için cafe neon yazı",
    description:
      "El yapımı neon flex teknolojisi ile üretilen, cafe ve restoranlar için özel tasarım neon yazı ürünler.",
    basePrice: 2800,
    categorySlug: "cafe-tabelalari",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=90",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90",
    ],
    videos: [],
    isFeatured: true,
    stock: 120,
    deliveryDays: 5,
    rating: 5.0,
    reviewCount: 203,
    sizes: ["30x15 cm", "50x25 cm", "70x35 cm"],
    materials: ["neon", "pleksi"],
    colors: ["kirmizi", "pembe", "mavi", "yesil", "rgb"],
    installation: "Kolay montaj — 15 dakikada kurulum.",
  },
  {
    id: "4",
    name: "Kurumsal Pleksi Ürün",
    slug: "kurumsal-pleksi-tabela",
    shortDesc: "Şık ve profesyonel pleksi ürün",
    description:
      "UV baskılı, LED aydınlatmalı pleksi ürün. Ofis, mağaza ve kurumsal alanlar için ideal.",
    basePrice: 1800,
    categorySlug: "pleksi-tabelalar",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=90",
    ],
    videos: [],
    isFeatured: false,
    stock: 200,
    deliveryDays: 4,
    rating: 4.7,
    reviewCount: 56,
    sizes: ["30x20 cm", "50x30 cm", "70x40 cm"],
    materials: ["pleksi", "led"],
    colors: ["beyaz", "kirmizi", "siyah"],
    installation: "Çift taraflı bant veya vida montajı.",
  },
] as const;

export type Product = (typeof products)[number];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return products.slice(0, limit);
  return products.filter((p) => p.slug !== slug && p.categorySlug === product.categorySlug).slice(0, limit);
}
