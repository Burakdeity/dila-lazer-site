import type { BlogPostPreview } from "@/types/catalog";

export interface BlogPost extends BlogPostPreview {
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "sakarya-neon-tabela-rehberi",
    title: "Sakarya'da Neon Tabela Seçim Rehberi",
    excerpt: "Adapazarı ve Sakarya'da işletmeniz için doğru neon tabelayı nasıl seçersiniz?",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    category: "Sakarya",
    date: "10 Haziran 2025",
    author: "Editör",
    content: [
      "Sakarya'da neon tabela yaptırmadan önce kullanım alanınızı netleştirin: iç mekan cafe, vitrin veya dış cephe uygulamaları farklı malzeme ve IP koruma sınıfı gerektirir.",
      "Adapazarı ve çevre ilçelerde yerel bir atölye ile çalışmak ölçü kontrolü, montaj ve satış sonrası destek açısından avantaj sağlar. Atölyeyi ziyaret ederek LED kalitesini ve malzeme detaylarını yerinde inceleyebilirsiniz.",
      "Renk, font ve ölçü seçiminde marka kimliğinizi yansıtan tasarımlar tercih edin. Kendin Tasarla stüdyomuzda duvarınızda canlı önizleme yaparak sipariş öncesi karar verebilirsiniz.",
    ],
  },
  {
    slug: "neon-tabela-secim-rehberi-2025",
    title: "2025 Neon Tabela Seçim Rehberi",
    excerpt: "İşletmeniz için doğru neon tabelayı nasıl seçersiniz?",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    category: "Rehber",
    date: "15 Mayıs 2025",
    author: "Editör",
    content: [
      "Neon tabela seçerken önce kullanım alanını belirleyin: iç mekan, vitrin veya dış cephe. Her ortam için farklı IP koruma sınıfı ve malzeme gerekir.",
      "Renk ve font seçimi marka kimliğinizi yansıtmalıdır. Kendin Tasarla stüdyomuzda canlı önizleme ile karar vermeden önce duvarınızda nasıl görüneceğini test edebilirsiniz.",
      "Ölçü ve montaj yüksekliği, okunabilirlik açısından kritiktir. Uzun metinlerde ince fontlar yerine kalın ve kontrastlı stiller tercih edilmelidir.",
    ],
  },
  {
    slug: "mdf-dekorasyon-trendleri",
    title: "MDF Dekorasyon Trendleri",
    excerpt: "Ev ve ofis dekorasyonunda MDF ürünlerin yükselişi.",
    cover: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    category: "Trendler",
    date: "10 Mayıs 2025",
    author: "Editör",
    content: [
      "MDF ürünler ev ve ofis dekorasyonunda doğal doku ve sıcaklık sunar. Lazer kesim detaylar ile kişiselleştirme kolaylaşmıştır.",
      "Mat ve parlak yüzey seçenekleri mekânın aydınlatmasına göre değerlendirilmelidir. Açık renkli duvarlarda koyu MDF kontrast oluşturur.",
      "Nemli ortamlar için su bazlı koruyucu vernik uygulaması önerilir.",
    ],
  },
  {
    slug: "led-serit-kurulum-rehberi",
    title: "LED Şerit Kurulum Rehberi",
    excerpt: "Adım adım LED şerit montajı ve bağlantı şeması.",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    category: "Teknik",
    date: "5 Mayıs 2025",
    author: "Teknik Ekip",
    content: [
      "LED şerit montajından önce yüzeyin temiz ve kuru olduğundan emin olun. 3M bantlı modeller düz yüzeylerde ideal sonuç verir.",
      "Güç kaynağı voltajı şerit tipiyle uyumlu olmalıdır; uzun hatlarda voltaj düşümünü önlemek için paralel besleme kullanın.",
      "Köşe geçişlerinde özel bağlantı aparatları kullanarak ışık sürekliliğini koruyun.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
