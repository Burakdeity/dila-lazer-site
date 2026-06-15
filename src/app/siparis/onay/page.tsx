"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Banknote,
  Truck,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, PAYMENT_PROVIDER_LABELS } from "@/types/admin";
import type { PaymentProvider } from "@/types/admin";

type OrderView = {
  orderNo: string;
  status: string;
  amount: number;
  productName: string;
  paymentMethod?: string;
  carrier?: string;
  customerName: string;
  shippingCity?: string;
  createdAt: string;
};

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("order");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderNo) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${encodeURIComponent(orderNo)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [orderNo]);

  const copyOrderNo = () => {
    if (!orderNo) return;
    navigator.clipboard.writeText(orderNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Container className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </Container>
    );
  }

  if (!orderNo || !order) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 mb-4">Sipariş bulunamadı.</p>
        <Link href="/urunler">
          <Button>Alışverişe Dön</Button>
        </Link>
      </Container>
    );
  }

  const isHavale = order.paymentMethod === "havale";
  const isKapida = order.paymentMethod === "kapida";
  const paymentLabel =
    order.paymentMethod && order.paymentMethod in PAYMENT_PROVIDER_LABELS
      ? PAYMENT_PROVIDER_LABELS[order.paymentMethod as PaymentProvider]
      : order.paymentMethod;

  return (
    <Container size="narrow" className="py-8">
      <div className="text-center mb-8">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-brand-black mb-2">Siparişiniz Alındı!</h1>
        <p className="text-gray-500">
          Teşekkürler {order.customerName.split(" ")[0]}, siparişiniz kaydedildi.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Sipariş No</p>
            <p className="font-mono text-lg font-bold text-brand-black">{order.orderNo}</p>
          </div>
          <button
            type="button"
            onClick={copyOrderNo}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-red transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
          <div>
            <p className="text-gray-400 mb-0.5">Ürün</p>
            <p className="text-brand-black font-medium">{order.productName}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Toplam</p>
            <p className="text-brand-black font-bold">{formatPrice(order.amount)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Ödeme</p>
            <p className="text-brand-black">{paymentLabel}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-0.5">Durum</p>
            <p className="text-brand-black">
              {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
            </p>
          </div>
          {order.carrier && (
            <div className="col-span-2">
              <p className="text-gray-400 mb-0.5">Kargo</p>
              <p className="text-brand-black flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-gray-400" />
                {order.carrier}
              </p>
            </div>
          )}
        </div>
      </div>

      {isHavale && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mb-6 text-sm">
          <div className="flex items-center gap-2 font-semibold text-brand-black mb-2">
            <Banknote className="h-5 w-5 text-amber-600" />
            Havale / EFT Talimatları
          </div>
          <p className="text-gray-600 mb-2">
            Ödemenizi açıklama kısmına <strong>{order.orderNo}</strong> yazarak yapın.
            Ödeme onaylandıktan sonra üretim süreci başlar.
          </p>
          <p className="text-gray-500 text-xs">
            Havale bilgileri için ödeme sayfasındaki banka detaylarına bakın veya bizimle iletişime geçin.
          </p>
        </div>
      )}

      {isKapida && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-semibold text-brand-black mb-2">
            <Package className="h-5 w-5 text-blue-600" />
            Kapıda Ödeme
          </div>
          Teslimat sırasında nakit veya kart ile ödeme yapabilirsiniz. Siparişiniz hazırlanınca bilgilendirileceksiniz.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/siparis-takip">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Sipariş Takip
          </Button>
        </Link>
        <Link href="/hesabim/siparisler">
          <Button size="lg" className="w-full sm:w-auto">
            Siparişlerim
          </Button>
        </Link>
      </div>
    </Container>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-gray-50 min-h-screen">
      <Container>
        <CheckoutSteps current={3} />
      </Container>
      <Suspense
        fallback={
          <Container className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </Container>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
}
