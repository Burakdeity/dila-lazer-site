import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";

export const metadata: Metadata = {
  title: "Kargo & Teslimat",
};

export default function ShippingPage() {
  return (
    <InfoPage title="Kargo & Teslimat">
      <p>
        Türkiye&apos;nin 81 iline anlaşmalı kargo firmalarıyla teslimat yapıyoruz. Standart üretim süresi
        ürüne göre 3–10 iş günüdür; özel tasarım siparişlerde süre teklif aşamasında netleştirilir.
      </p>
      <p>
        500₺ ve üzeri siparişlerde kargo ücretsizdir. Teslimat sonrası montaj desteği ve kurulum kılavuzu
        ürünle birlikte gönderilir.
      </p>
      <p>
        Siparişinizi <strong>Sipariş Takip</strong> sayfasından takip edebilirsiniz.
      </p>
    </InfoPage>
  );
}
