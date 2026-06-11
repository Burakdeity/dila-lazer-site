"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Package, Heart, MapPin, CreditCard, Gift, Star,
  FileText, Bell, User, Receipt, Download, Palette, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/hesabim", label: "Genel Bakış", icon: User },
  { href: "/hesabim/siparisler", label: "Siparişlerim", icon: Package },
  { href: "/hesabim/favoriler", label: "Favorilerim", icon: Heart },
  { href: "/hesabim/tasarimlar", label: "Tasarımlarım", icon: Palette },
  { href: "/hesabim/teklifler", label: "Tekliflerim", icon: FileText },
  { href: "/hesabim/adresler", label: "Adreslerim", icon: MapPin },
  { href: "/hesabim/kuponlar", label: "Kuponlarım", icon: Gift },
  { href: "/hesabim/yorumlar", label: "Yorumlarım", icon: Star },
  { href: "/hesabim/faturalar", label: "Faturalarım", icon: Receipt },
  { href: "/hesabim/bildirimler", label: "Bildirimlerim", icon: Bell },
  { href: "/hesabim/odeme", label: "Ödeme Yöntemlerim", icon: CreditCard },
  { href: "/hesabim/belgeler", label: "İndirilebilir Belgeler", icon: Download },
];

const tierLabels: Record<string, string> = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
};

export function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const name = session?.user?.name || "Kullanıcı";
  const email = session?.user?.email || "";
  const tier = tierLabels[session?.user?.loyaltyTier || "BRONZE"] || "Bronze";
  const points = session?.user?.points ?? 0;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sticky top-4">
      <div className="flex items-center gap-3 p-3 mb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white font-bold text-lg">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-brand-black font-medium truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {tier} · {points} puan
          </span>
        </div>
      </div>

      <nav className="space-y-0.5 max-h-[50vh] overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-brand-red/10 text-brand-red font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-brand-black"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 pt-4"
      >
        <LogOut className="h-4 w-4" />
        Çıkış Yap
      </button>
    </div>
  );
}
