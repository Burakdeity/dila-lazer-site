import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Hakkımızda — Sakarya Neon Atölyesi",
  description: `${brand.name}, Sakarya Adapazarı merkezli neon LED, lazer kesim ve kurumsal neon üreticisi. 2 yıl garanti, ücretsiz teklif.`,
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <InfoPage title="Hakkımızda" subtitle={brand.tagline}>
      <p>
        <strong>{brand.name}</strong>, Sakarya Adapazarı&apos;nda faaliyet gösteren; neon LED, MDF ve pleksi
        dekorasyon, 3D kutu harf ve lazer kesim alanlarında Türkiye geneline hizmet veren bir üretim ve e-ticaret
        markasıdır.
      </p>
      <p>
        Adapazarı atölyemizde her ürün özenle üretilir. Sakarya ve çevre ilçelerden gelen müşterilerimiz
        tasarım sürecini yüz yüze takip edebilir; Türkiye&apos;nin her yerine ise sigortalı kargo ile teslimat yapıyoruz.
      </p>
      <p>
        Kendin Tasarla stüdyomuz ile müşterilerimiz canlı önizleme yaparak kişiye özel ürünlerini
        dakikalar içinde tasarlayabilir; uzman ekibimiz üretim ve montaj sürecinde yanlarında olur.
      </p>
      <p>
        Kalite, hızlı teslimat ve müşteri memnuniyeti odaklı çalışıyor; tüm özel üretimlerimizde
        <strong> 2 yıl garanti</strong> sunuyoruz.
      </p>
    </InfoPage>
  );
}
