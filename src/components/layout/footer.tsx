import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { brand } from "@/lib/brand";
import { mainCategories } from "@/data/catalog/categories";
import { Container } from "@/components/ui/container";
import { Shield, Truck, Award, Headphones } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "SSL Güvenli Ödeme" },
  { icon: Truck, label: "81 İle Teslimat" },
  { icon: Award, label: "2 Yıl Garanti" },
  { icon: Headphones, label: "7/24 Destek" },
];

const footerLinks = {
  destek: [
    { label: "İletişim", href: "/iletisim" },
    { label: "SSS", href: "/sss" },
    { label: "Kargo & Teslimat", href: "/kargo-teslimat" },
    { label: "İade Politikası", href: "/iade-politikasi" },
  ],
  kurumsal: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Portfolyo", href: "/portfolyo" },
    { label: "Blog", href: "/blog" },
    { label: "Kampanyalar", href: "/kampanyalar" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="border-b border-gray-200 bg-white">
        <Container className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Icon className="h-5 w-5 text-brand-red" />
                </div>
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <BrandLogo size="md" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
              {brand.tagline}. Premium kalite, özel tasarım ve profesyonel hizmet.
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>{brand.contact.phone}</p>
              <p>{brand.contact.email}</p>
            </div>
          </div>

          <div>
            <h4 className="text-brand-black font-medium mb-4">Kategoriler</h4>
            <ul className="space-y-2">
              {mainCategories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/kategori/${cat.slug}`} className="text-sm text-gray-500 hover:text-brand-red transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h4 className="text-brand-black font-medium mb-4 capitalize">
                {key === "destek" ? "Destek" : "Kurumsal"}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-brand-red transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-brand-black font-medium mb-4">Kendin Tasarla</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ozel-tasarim-merkezi" className="text-sm text-brand-red hover:underline">
                  Tasarım Merkezi
                </Link>
              </li>
              <li>
                <Link href="/teklif-al" className="text-sm text-gray-500 hover:text-brand-red transition-colors">
                  Ücretsiz Teklif
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-gray-200 bg-white">
        <Container className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              <Link href="/gizlilik" className="hover:text-gray-600">Gizlilik</Link>
              <Link href="/kvkk" className="hover:text-gray-600">KVKK</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
