"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";
import type { WalletCouponView } from "@/lib/user-coupon-store";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function UserCouponsList() {
  const [coupons, setCoupons] = useState<WalletCouponView[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const setAppliedCoupon = useCartStore((s) => s.setAppliedCoupon);

  useEffect(() => {
    fetch("/api/user/coupons")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCoupons(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const useCoupon = (coupon: WalletCouponView) => {
    setCoupon(coupon.code);
    setAppliedCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">Yükleniyor…</div>;
  }

  const active = coupons.filter((c) => c.isValid);
  const past = coupons.filter((c) => !c.isValid);

  if (!coupons.length) {
    return (
      <AccountEmptyState
        icon={Gift}
        title="Kuponlarım"
        description="Henüz kuponunuz yok. Şans çarkını çevirerek indirim kazanın!"
        action={
          <Link href="/sans-carki">
            <Button>Şans Çarkına Git</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black mb-1">Kuponlarım</h1>
        <p className="text-sm text-gray-500">{active.length} aktif kupon</p>
      </div>

      {active.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Aktif Kuponlar</h2>
          {active.map((coupon) => (
            <div
              key={coupon.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50"
            >
              <div>
                <p className="font-mono text-xl font-bold text-brand-black">{coupon.code}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {coupon.discountType === "percent"
                    ? `%${coupon.discountValue} indirim`
                    : `${formatPrice(coupon.discountValue)} indirim`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Son: {new Date(coupon.expiresAt).toLocaleDateString("tr-TR")}
                  {coupon.source === "spin_wheel" && " · Şans Çarkı"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyCode(coupon.code)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-white"
                >
                  {copied === coupon.code ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  Kopyala
                </button>
                <Link href="/sepet" onClick={() => useCoupon(coupon)}>
                  <Button size="sm">Sepette Kullan</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Geçmiş</h2>
          {past.map((coupon) => (
            <div key={coupon.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 opacity-60">
              <p className="font-mono font-semibold text-gray-500 line-through">{coupon.code}</p>
              <p className="text-xs text-gray-400 mt-1">
                {coupon.usedAt ? "Kullanıldı" : "Süresi doldu"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
