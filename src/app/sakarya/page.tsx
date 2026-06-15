import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { ContactMap } from "@/components/contact/contact-map";
import { Container } from "@/components/ui/container";
import { JsonLd, sakaryaPageSchemas } from "@/components/seo/json-ld";
import { brand } from "@/lib/brand";
import { buildPageMetadata } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

const sakaryaFaqs = [
  {
    question: "Sakarya'da neon tabela yaptırabilir miyim?",
    answer:
      "Evet. Adapazarı atölyemizde özel üretim neon ve LED tabela hizmeti veriyoruz. Mağaza, cafe, ofis ve ev dekorasyonu için tasarımdan montaja kadar destek sağlıyoruz.",
  },
  {
    question: "Sakarya dışına teslimat yapıyor musunuz?",
    answer:
      "Evet. Sakarya ve çevre ilçelere hızlı teslimat yapıyoruz; ayrıca Türkiye'nin 81 iline sigortalı kargo ile gönderim sağlıyoruz.",
  },
  {
    question: "Neon tabela fiyatları Sakarya için nasıl hesaplanır?",
    answer:
      "Fiyat; yazı uzunluğu, ölçü, renk, iç/dış mekan kullanımı ve montaj ihtiyacına göre değişir. Ücretsiz teklif formu veya WhatsApp üzerinden ölçü paylaşarak anında fiyat alabilirsiniz.",
  },
  {
    question: "Atölyenize gelip ürünü görebilir miyim?",
    answer:
      `Evet. ${brand.contact.address} adresindeki atölyemizi ziyaret edebilir, örnek ürünleri inceleyebilir ve tasarım ekibimizle yüz yüze görüşebilirsiniz.`,
  },
];

const services = [
  {
    title: "Neon & LED Tabela",
    desc: "Cafe, restoran, mağaza ve vitrin için özel neon yazılar. IP korumalı dış mekan seçenekleri.",
    href: "/kategori/neon-led-tabelalar",
  },
  {
    title: "3D Kutu Harf",
    desc: "Kurumsal cephe ve iç mekan için pleksi, alüminyum ve LED aydınlatmalı kutu harf sistemleri.",
    href: "/kategori/pleksi-urunler/pleksi-kutu-harfler",
  },
  {
    title: "Lazer Kesim",
    desc: "MDF, pleksi ve ahşap malzemelerde hassas lazer kesim ile dekor ve tabela üretimi.",
    href: "/urunler",
  },
  {
    title: "Kendin Tasarla",
    desc: "Canlı önizleme ile kendi neon yazınızı tasarlayın, anında fiyat görün ve sipariş verin.",
    href: "/ozel-tasarim-merkezi",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Sakarya Neon Tabela | LED Tabela & Lazer Kesim — Adapazarı",
  description:
    "Sakarya Adapazarı'nda neon tabela, LED tabela, 3D kutu harf ve lazer kesim. Ücretsiz teklif, atölye ziyareti, montaj desteği ve 2 yıl garanti. Dila Lazer.",
  path: "/sakarya",
});

export default function SakaryaPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <JsonLd data={sakaryaPageSchemas(sakaryaFaqs)} />

      <section className="bg-brand-black text-white py-14 sm:py-20">
        <Container>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            Sakarya · Adapazarı
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            Sakarya&apos;nın <span className="text-brand-red neon-text">Neon Tabela</span> ve Lazer Kesim Atölyesi
          </h1>
          <p className="mt-5 text-white/75 text-base sm:text-lg max-w-2xl leading-relaxed">
            {brand.name}, Sakarya Adapazarı merkezli atölyesinde neon LED tabela, pleksi tabela, 3D kutu harf
            ve lazer kesim üretimi yapar. İşletmenizi öne çıkaran özel tasarımlar için ücretsiz teklif alın.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/teklif-al"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red/90 transition-colors"
            >
              Ücretsiz Teklif Al
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={getWhatsAppUrl("Merhaba, Sakarya neon tabela hakkında bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/15 transition-colors"
            >
              WhatsApp ile Yazın
            </a>
          </div>
        </Container>
      </section>

      <section className="py-12 border-b border-gray-100 bg-white">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, label: "Özel Üretim", text: "Her proje atölyemizde tek tek üretilir" },
              { icon: Truck, label: "Sakarya Teslimat", text: "İl geneli ve 81 ile kargo" },
              { icon: ShieldCheck, label: "2 Yıl Garanti", text: "Tüm özel üretimlerde garanti" },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50">
                <Icon className="h-8 w-8 text-brand-red shrink-0" />
                <div>
                  <p className="font-semibold text-brand-black">{label}</p>
                  <p className="text-sm text-gray-500 mt-1">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-3">
            Sakarya&apos;da Sunduğumuz Hizmetler
          </h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Adapazarı ve Sakarya genelinde işletmeler, ev dekorasyonu ve kurumsal projeler için uçtan uca tabela çözümleri.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-brand-red/30 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-brand-black group-hover:text-brand-red transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{service.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-brand-red font-medium mt-4">
                  İncele <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16 bg-white border-y border-gray-100">
        <Container size="narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">
            Neden Sakarya&apos;da {brand.name}?
          </h2>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
            <p>
              Sakarya&apos;da neon tabela arayan işletmeler için yerel bir atölye ile çalışmak; hızlı iletişim,
              ölçü kontrolü, montaj desteği ve satış sonrası servis açısından büyük avantaj sağlar.
              {brand.name} olarak Adapazarı&apos;daki üretim tesisimizde tasarımdan paketlemeye kadar tüm süreci
              kendi ekibimizle yönetiyoruz.
            </p>
            <p>
              Serdivan, Erenler, Arifiye ve çevre ilçelerden gelen müşterilerimiz atölyemizi ziyaret ederek
              malzeme kalitesini yerinde görebilir. Online sipariş veren müşterilerimiz için ise Türkiye geneline
              sigortalı kargo ve detaylı kurulum kılavuzu sunuyoruz.
            </p>
            <p>
              Cafe, restoran, kuaför, eczane, oto galeri ve ofis gibi farklı sektörlerde yüzlerce proje
              tamamladık. Kendin Tasarla stüdyomuz sayesinde neon yazınızı sipariş vermeden önce duvarınızda
              nasıl görüneceğini canlı olarak test edebilirsiniz.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container size="narrow">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {sakaryaFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white border border-gray-200 rounded-xl p-5 open:shadow-sm"
              >
                <summary className="font-semibold text-brand-black cursor-pointer list-none flex justify-between gap-4">
                  {faq.question}
                  <span className="text-brand-red text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16 bg-white border-t border-gray-100">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">Atölyemizi Ziyaret Edin</h2>
          <ul className="space-y-3 text-gray-600 mb-8">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
              <span>{brand.contact.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-red shrink-0 mt-0.5" />
              <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand-red">
                {brand.contact.phone}
              </a>
            </li>
          </ul>
          <ContactMap />
        </Container>
      </section>
    </div>
  );
}
