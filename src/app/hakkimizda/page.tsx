import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${brand.name} — neon tabela, lazer kesim ve kurumsal tabela çözümleri.`,
};

export default function AboutPage() {
  return (
    <InfoPage title="Hakkımızda" subtitle={brand.tagline}>
      <p>
        <strong>{brand.name}</strong>, neon LED tabela, MDF ve pleksi dekorasyon, 3D kutu harf ve lazer kesim
        alanlarında Türkiye geneline hizmet veren bir üretim ve e-ticaret markasıdır.
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
