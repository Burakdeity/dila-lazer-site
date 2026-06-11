"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, Gift, Star, TrendingUp, RotateCcw } from "lucide-react";
import { products } from "@/data/catalog/products";

export default function AccountDashboard() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(" ")[0] || "Kullanıcı";

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-black">Hoş geldiniz, {name}!</h1>
        <p className="text-gray-500 mt-1">{session?.user?.email}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Aktif Sipariş", value: "0" },
          { icon: Star, label: "Puanlarım", value: String(session?.user?.points ?? 0) },
          { icon: Gift, label: "Kuponlarım", value: "0" },
          { icon: TrendingUp, label: "Üyelik", value: session?.user?.loyaltyTier || "BRONZE" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <stat.icon className="h-5 w-5 text-brand-red mb-2" />
            <p className="text-2xl font-bold text-brand-black">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-black mb-4">Size Özel Öneriler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.slice(0, 3).map((p) => (
            <Link key={p.id} href={`/urun/${p.slug}`} className="p-4 rounded-lg border border-gray-100 hover:border-brand-red/30 transition-colors">
              <p className="text-brand-black font-medium text-sm">{p.name}</p>
              <p className="text-brand-red text-sm mt-1">{p.basePrice.toLocaleString("tr-TR")} ?&apos;den</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/urunler" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-red/90">
          <RotateCcw className="h-4 w-4" />
          Alışverişe Başla
        </Link>
        <Link href="/teklif-al" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 text-brand-black text-sm hover:bg-gray-200">
          Yeni Teklif Al
        </Link>
      </div>
    </div>
  );
}
