"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Package, Loader2, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_PROVIDER_LABELS } from "@/types/admin";
import type { Order, OrderStatus, PaymentProvider } from "@/types/admin";
import { AccountEmptyState } from "@/components/hesabim/account-empty-state";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  production: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    fetch("/api/orders/my")
      .then((r) => (r.ok ? r.json() : []))
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <AccountEmptyState
        icon={Package}
        title="Siparişlerim"
        description="Henüz siparişiniz bulunmuyor. Premium neon çözümlerimizi keşfedin."
        action={
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-brand-red text-white text-sm font-semibold hover:bg-brand-red/90 transition-colors"
          >
            Ürünleri İncele
          </Link>
        }
      />
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-brand-black">Siparişlerim</h1>
        <p className="text-sm text-gray-500">{orders.length} sipariş</p>
      </div>

      <ul className="divide-y divide-gray-100">
        {orders.map((order) => {
          const paymentLabel =
            order.paymentMethod && order.paymentMethod in PAYMENT_PROVIDER_LABELS
              ? PAYMENT_PROVIDER_LABELS[order.paymentMethod as PaymentProvider]
              : order.paymentMethod;

          return (
            <li key={order.id} className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-brand-black">{order.orderNo}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`inline-flex self-start px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <p className="text-brand-black font-medium mb-1">{order.productName}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
                <span>{formatPrice(order.amount)}</span>
                {paymentLabel && <span>{paymentLabel}</span>}
                {order.shippingCity && <span>{order.shippingCity}</span>}
              </div>

              <Link
                href={`/siparis-takip?order=${encodeURIComponent(order.orderNo)}&email=${encodeURIComponent(order.customerEmail)}`}
                className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline"
              >
                Siparişi takip et
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
