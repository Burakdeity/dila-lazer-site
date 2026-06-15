"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/store/cart";
import type { AppliedCoupon } from "@/store/cart";

type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  appliedCoupon?: AppliedCoupon | null;
  showItems?: boolean;
  className?: string;
};

export function OrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  grandTotal,
  appliedCoupon,
  showItems = true,
  className = "",
}: OrderSummaryProps) {
  return (
    <div className={`glass-card p-5 sm:p-6 space-y-4 ${className}`}>
      <h2 className="text-lg font-semibold text-brand-black">Sipariş Özeti</h2>

      {showItems && (
        <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-black line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="text-sm font-semibold text-brand-black shrink-0">
                {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ara Toplam</span>
          <span className="text-brand-black">{formatPrice(subtotal)}</span>
        </div>
        {appliedCoupon && discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {appliedCoupon.code}
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Kargo</span>
          <span className={shipping === 0 ? "text-emerald-600 font-medium" : "text-brand-black"}>
            {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium text-brand-black">Toplam</span>
          <span className="text-xl font-bold text-brand-black">{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Shield className="h-3.5 w-3.5 shrink-0" />
        Güvenli ödeme · 256-bit SSL
      </div>

      <Link href="/sepet" className="text-xs text-brand-red hover:underline block text-center">
        Sepete dön
      </Link>
    </div>
  );
}
