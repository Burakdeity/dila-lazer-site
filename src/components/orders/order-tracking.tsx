"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search, Package, CheckCircle2, Factory, Truck, XCircle,
  Loader2, MapPin, Calendar, CreditCard,
} from "lucide-react";
import type { OrderStatus } from "@/types/admin";
import { ORDER_STATUS_LABELS } from "@/types/admin";
import { formatPrice } from "@/lib/utils";

interface TrackedOrder {
  orderNo: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  shippingCity?: string;
  customerName: string;
}

const TRACKING_STEPS: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: "pending", label: "Sipariş Alındı", icon: Package },
  { key: "confirmed", label: "Onaylandı", icon: CheckCircle2 },
  { key: "production", label: "Üretimde", icon: Factory },
  { key: "shipped", label: "Kargoda", icon: Truck },
  { key: "delivered", label: "Teslim Edildi", icon: CheckCircle2 },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  production: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

export function OrderTracking() {
  const searchParams = useSearchParams();
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  useEffect(() => {
    const qOrder = searchParams.get("order");
    const qEmail = searchParams.get("email");
    if (qOrder) setOrderNo(qOrder);
    if (qEmail) setEmail(qEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    const res = await fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo, email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Sipariş bulunamadı");
      return;
    }

    setOrder(data as TrackedOrder);
  };

  const currentStep = order ? STATUS_INDEX[order.status] : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
            <Search className="h-6 w-6 text-brand-red" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-black">Sipariş Sorgula</h2>
            <p className="text-sm text-gray-500">Sipariş numaranız ve e-posta ile takip edin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sipariş Numarası</label>
            <input
              type="text"
              required
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value.toUpperCase())}
              placeholder="DL1234567890"
              className="form-input w-full h-11 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta Adresi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="form-input w-full h-11"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-brand-red text-white font-semibold hover:bg-brand-red/90 disabled:opacity-50 shadow-sm hover:shadow-md transition-shadow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Siparişi Sorgula
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Demo: <span className="font-mono">SIP-2025-001</span> + <span className="font-mono">ahmet@email.com</span>
        </p>
      </form>

      {order && (
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Sipariş No</p>
                <p className="text-2xl font-bold text-brand-black font-mono mt-1">{order.orderNo}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  isCancelled
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : order.status === "delivered"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-brand-red/10 text-brand-red border border-brand-red/20"
                }`}
              >
                {isCancelled ? <XCircle className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-semibold text-brand-black mb-6">Sipariş Durumu</h3>

            {isCancelled ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <XCircle className="h-8 w-8 text-red-500 shrink-0" />
                <div>
                  <p className="font-medium text-red-700">Sipariş İptal Edildi</p>
                  <p className="text-sm text-red-600/80 mt-0.5">Detaylı bilgi için müşteri hizmetleriyle iletişime geçin.</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 hidden sm:block" />
                <div className="space-y-6">
                  {TRACKING_STEPS.map((step, index) => {
                    const done = index <= currentStep;
                    const active = index === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            done
                              ? "bg-brand-red border-brand-red text-white"
                              : "bg-white border-gray-200 text-gray-300"
                          } ${active ? "ring-4 ring-brand-red/20" : ""}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-medium ${done ? "text-brand-black" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {active && order.status !== "delivered" && (
                            <p className="text-sm text-brand-red mt-0.5">Şu an bu aşamada</p>
                          )}
                          {active && order.status === "delivered" && (
                            <p className="text-sm text-emerald-600 mt-0.5">Siparişiniz teslim edildi</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-brand-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ürün</p>
                  <p className="text-sm font-medium text-brand-black">{order.productName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-brand-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Tutar</p>
                  <p className="text-sm font-medium text-brand-black">{formatPrice(order.amount)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-brand-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Sipariş Tarihi</p>
                  <p className="text-sm font-medium text-brand-black">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {order.shippingCity && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-red mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Teslimat Şehri</p>
                    <p className="text-sm font-medium text-brand-black">{order.shippingCity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
