import Link from "next/link";
import { brand } from "@/lib/brand";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import type { MainCategory } from "@/types/catalog";
import type { SiteMenus } from "@/types/admin";

interface StoreFooterProps {
  categories: MainCategory[];
  menus: SiteMenus;
}

export function StoreFooter({ categories, menus }: StoreFooterProps) {
  const corporateLinks = menus.footerCorporateLinks.filter((l) => l.isActive);
  const serviceLinks = menus.footerServiceLinks.filter((l) => l.isActive);

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-brand-black">Kampanya ve yeniliklerden haberdar olun</h3>
              <p className="text-sm text-gray-500 mt-1">Özel indirimler ve yeni ürünler e-posta kutunuza gelsin.</p>
            </div>
            <form className="flex w-full lg:w-auto gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 lg:w-72 h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
              />
              <button
                type="submit"
                className="h-11 px-6 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red/90 transition-colors whitespace-nowrap"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <BrandLogo size="md" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{brand.tagline}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-red shrink-0" />
                <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand-red transition-colors">
                  {brand.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-red shrink-0" />
                <a href={`mailto:${brand.contact.email}`} className="hover:text-brand-red transition-colors">
                  {brand.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-red shrink-0" />
                {brand.contact.address}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-black mb-4 text-sm uppercase tracking-wide">Kategoriler</h4>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/kategori/${c.slug}`} className="text-sm text-gray-500 hover:text-brand-red transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-black mb-4 text-sm uppercase tracking-wide">Kurumsal</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {corporateLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="hover:text-brand-red transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-black mb-4 text-sm uppercase tracking-wide">Müşteri Hizmetleri</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {serviceLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="hover:text-brand-red transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-brand-black text-gray-400 text-xs py-4">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="/kvkk" className="hover:text-white transition-colors">KVKK</Link>
            <Link href="/cerez-politikasi" className="hover:text-white transition-colors">Çerezler</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
