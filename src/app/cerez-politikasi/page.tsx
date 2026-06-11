import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Çerez Politikası",
};

export default function CookiePolicyPage() {
  return (
    <InfoPage title="Çerez Politikası">
      <p>
        {brand.name} web sitesi; oturum yönetimi, sepet işlemleri, güvenlik ve site performansı için zorunlu
        çerezler kullanır.
      </p>
      <p>
        Analitik ve pazarlama çerezleri yalnızca onayınız halinde etkinleştirilir. Tarayıcı ayarlarınızdan
        çerezleri yönetebilir veya silebilirsiniz.
      </p>
    </InfoPage>
  );
}
