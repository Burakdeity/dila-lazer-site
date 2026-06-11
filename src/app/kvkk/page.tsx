import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
};

export default function KvkkPage() {
  return (
    <InfoPage title="KVKK Aydınlatma Metni">
      <p>
        Veri sorumlusu: <strong>{brand.name}</strong>. İletişim: {brand.contact.email}
      </p>
      <p>
        Kişisel verileriniz; sipariş süreçleri, müşteri hizmetleri, yasal yükümlülükler ve (açık rızanız
        halinde) kampanya bildirimleri için işlenmektedir.
      </p>
      <p>
        KVKK&apos;nın 11. maddesi kapsamındaki haklarınızı kullanmak için {brand.contact.email} adresine
        başvurabilirsiniz.
      </p>
    </InfoPage>
  );
}
