import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
};

export default function PrivacyPage() {
  return (
    <InfoPage title="Gizlilik Politikası">
      <p>
        {brand.name} olarak kişisel verilerinizi 6698 sayılı KVKK kapsamında işleriz. Sipariş, hesap ve
        iletişim süreçlerinde toplanan ad, e-posta, telefon ve adres bilgileri yalnızca hizmet sunumu
        amacıyla kullanılır.
      </p>
      <p>
        Ödeme bilgileriniz PCI-DSS uyumlu ödeme sağlayıcıları (PayTR, İyzico, Stripe) üzerinden işlenir;
        kart bilgileriniz sunucularımızda saklanmaz.
      </p>
      <p>
        Verilerinize erişim, düzeltme veya silme talepleriniz için {brand.contact.email} adresine
        yazabilirsiniz.
      </p>
    </InfoPage>
  );
}
