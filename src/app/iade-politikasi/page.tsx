import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "İade Politikası",
};

export default function ReturnPolicyPage() {
  return (
    <InfoPage title="İade Politikası">
      <p>
        Kişiye özel üretilen neon tabela, MDF ve pleksi ürünlerde standart iade uygulanmaz. Üretim hatası
        veya hasarlı teslimat durumunda 7 gün içinde destek ekibimize ulaşın; ücretsiz yeniden üretim veya
        onarım sağlanır.
      </p>
      <p>
        Stok ürünlerde, kullanılmamış ve orijinal ambalajında olan ürünler 14 gün içinde iade edilebilir.
        İade kargo ücreti müşteriye aittir.
      </p>
    </InfoPage>
  );
}
