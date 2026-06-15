import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactMap } from "@/components/contact/contact-map";
import { InfoPage } from "@/components/pages/info-page";
import { brand } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "İletişim — Sakarya Adapazarı Atölye",
  description: `${brand.name} Sakarya Adapazarı atölye adresi, telefon ve WhatsApp. Neon tabela için ücretsiz teklif alın.`,
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <InfoPage title="İletişim" subtitle="Sakarya Adapazarı atölyemize ulaşın">
      <ul className="space-y-4 not-prose">
        <li className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-brand-black">Telefon</p>
            <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand-red">
              {brand.contact.phone}
            </a>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-brand-black">E-posta</p>
            <a href={`mailto:${brand.contact.email}`} className="hover:text-brand-red">
              {brand.contact.email}
            </a>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-brand-black">Adres</p>
            <p>{brand.contact.address}</p>
          </div>
        </li>
      </ul>
      <p className="mt-6">
        Hızlı destek için{" "}
        <a
          href={getWhatsAppUrl("Merhaba, bilgi almak istiyorum.")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-red font-medium hover:underline"
        >
          WhatsApp
        </a>{" "}
        üzerinden yazabilir veya{" "}
        <Link href="/teklif-al" className="text-brand-red font-medium hover:underline">
          teklif formu
        </Link>{" "}
        doldurabilirsiniz.
      </p>
      <ContactMap />
    </InfoPage>
  );
}
