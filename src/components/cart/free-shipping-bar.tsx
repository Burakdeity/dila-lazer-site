"use client";

import { Truck, PartyPopper } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const FREE_SHIPPING_THRESHOLD = 500;

interface FreeShippingBarProps {
  subtotal: number;
  className?: string;
}

export function FreeShippingBar({ subtotal, className = "" }: FreeShippingBarProps) {
  const qualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`rounded-xl border p-4 ${
        qualified
          ? "bg-emerald-50 border-emerald-200"
          : "bg-gray-50 border-gray-200"
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            qualified ? "bg-emerald-100 text-emerald-600" : "bg-brand-red/10 text-brand-red"
          }`}
        >
          {qualified ? <PartyPopper className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          {qualified ? (
            <p className="text-sm font-medium text-emerald-800">
              Tebrikler! Ücretsiz kargo kazandınız.
            </p>
          ) : (
            <>
              <p className="text-sm text-brand-black">
                <span className="font-semibold text-brand-red">{formatPrice(remaining)}</span> daha ekleyin,{" "}
                <span className="font-medium">ücretsiz kargo</span> kazanın!
              </p>
              <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-red transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {formatPrice(subtotal)} / {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
