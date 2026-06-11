"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users,
  FileText, Ticket, Megaphone, Newspaper, Image, Menu,
  Search, Truck, Boxes, Calculator, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSignOut } from "@/components/admin/admin-sign-out";

const adminMenu = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart },
  { href: "/admin/musteriler", label: "Müşteriler", icon: Users },
  { href: "/admin/teklifler", label: "Teklifler", icon: FileText },
  { href: "/admin/kuponlar", label: "Kuponlar", icon: Ticket },
  { href: "/admin/kampanyalar", label: "Kampanyalar", icon: Megaphone },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/bannerlar", label: "Bannerlar", icon: Image },
  { href: "/admin/menuler", label: "Menüler", icon: Menu },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/kargo", label: "Kargo", icon: Truck },
  { href: "/admin/stok", label: "Stok", icon: Boxes },
  { href: "/admin/muhasebe", label: "Muhasebe", icon: Calculator },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1 overflow-y-auto flex-1">
      {adminMenu.map((item) => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              active ? "bg-brand-red/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <AdminSignOut />
    </nav>
  );
}
