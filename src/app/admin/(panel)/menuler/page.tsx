import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getMainCategories } from "@/lib/catalog";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";

const footerLinks = [
  { label: "Hakkımızda", href: "/iletisim" },
  { label: "Projeler & Referanslar", href: "/portfolyo" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Kendin Tasarla", href: "/ozel-tasarim-merkezi" },
  { label: "Teklif Al", href: "/teklif-al" },
];

export default function AdminMenusPage() {
  const categories = getMainCategories();

  return (
    <div>
      <AdminPageHeader title="Menüler" description="Site navigasyon yapısı" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Ana Menü — Kategoriler">
          <div className="p-5 space-y-2">
            {categories.map((c) => (
              <div key={c.slug} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                <div>
                  <p className="text-white text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.subcategories.length} alt kategori</p>
                </div>
                <Link href={`/kategori/${c.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
              <p className="text-white text-sm font-medium">Kendin Tasarla</p>
              <Link href="/ozel-tasarim-merkezi" target="_blank" className="p-1.5 text-gray-400 hover:text-white">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
              <p className="text-white text-sm font-medium">Teklif Al</p>
              <Link href="/teklif-al" target="_blank" className="p-1.5 text-gray-400 hover:text-white">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Footer Menüsü">
          <div className="p-5 space-y-2">
            {footerLinks.map((link) => (
              <div key={link.href + link.label} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
                <p className="text-white text-sm">{link.label}</p>
                <Link href={link.href} target="_blank" className="p-1.5 text-gray-400 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
